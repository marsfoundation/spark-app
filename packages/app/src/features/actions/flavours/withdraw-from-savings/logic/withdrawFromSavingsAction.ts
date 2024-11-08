import { basePsm3Abi, basePsm3Address } from '@/config/abis/basePsm3Abi'
import { LAST_UI_REFERRAL_CODE_BIGINT } from '@/config/consts'
import {
  migrationActionsConfig,
  psmActionsConfig,
  savingsXDaiAdapterAbi,
  savingsXDaiAdapterAddress,
  usdsPsmActionsConfig,
} from '@/config/contracts-generated'
import { getContractAddress } from '@/domain/hooks/useContractAddress'
import { ensureConfigTypes } from '@/domain/hooks/useWrite'
import { SavingsInfo } from '@/domain/savings-info/types'
import { assertWithdraw } from '@/domain/savings/assertWithdraw'
import { CheckedAddress } from '@/domain/types/CheckedAddress'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'
import { getBalancesQueryKeyPrefix } from '@/domain/wallet/getBalancesQueryKeyPrefix'
import { allowanceQueryKey } from '@/features/actions/flavours/approve/logic/query'
import { ActionConfig, ActionContext, GetWriteConfigResult } from '@/features/actions/logic/types'
import { calculateGemConversionFactor } from '@/features/actions/utils/savings'
import { assert, raise } from '@/utils/assert'
import { assertNever } from '@/utils/assertNever'
import { toBigInt } from '@/utils/bigNumber'
import { QueryKey } from '@tanstack/react-query'
import { Address, erc4626Abi } from 'viem'
import { gnosis } from 'viem/chains'
import { WithdrawFromSavingsAction } from '../types'
import { calculateGemMinAmountOut } from './calculateGemMinAmountOut'
import { getSavingsWithdrawActionPath } from './getSavingsWithdrawActionPath'

export function createWithdrawFromSavingsActionConfig(
  action: WithdrawFromSavingsAction,
  context: ActionContext,
): ActionConfig {
  const { account, chainId } = context
  const tokensInfo = context.tokensInfo ?? raise('Tokens info is required for deposit to savings action')
  const actionPath = getSavingsWithdrawActionPath({
    token: action.token,
    savingsToken: action.savingsToken,
    tokensInfo,
    chainId,
  })

  return {
    getWriteConfig: () => {
      const { token, savingsToken, isRedeem, mode, receiver: _receiver } = action
      const receiver = mode === 'send' ? _receiver! : account

      const argsAmount = isRedeem
        ? toBigInt(savingsToken.toBaseUnit(action.amount))
        : toBigInt(token.toBaseUnit(action.amount))

      switch (actionPath) {
        case 'susds-to-usds':
        case 'sdai-to-dai':
          return ensureConfigTypes({
            address: savingsToken.address,
            abi: erc4626Abi,
            functionName: isRedeem ? 'redeem' : 'withdraw',
            args: [argsAmount, receiver, account],
          })

        case 'sdai-to-sexy-dai':
          return ensureConfigTypes({
            address: savingsXDaiAdapterAddress[gnosis.id],
            abi: savingsXDaiAdapterAbi,
            functionName: isRedeem ? 'redeemXDAI' : 'withdrawXDAI',
            args: [argsAmount, receiver],
          })

        case 'sdai-to-usds':
          return ensureConfigTypes({
            address: getContractAddress(migrationActionsConfig.address, chainId),
            abi: migrationActionsConfig.abi,
            functionName: isRedeem ? 'migrateSDAISharesToUSDS' : 'migrateSDAIAssetsToUSDS',
            args: [receiver, argsAmount],
          })

        case 'sdai-to-usdc': {
          return getUsdcWithdrawConfig({
            psmActionsAddress: getContractAddress(psmActionsConfig.address, chainId),
            savingsInfo: context.savingsDaiInfo ?? raise('Savings dai info is required to withdraw from sdai to usdc'),
            isRedeem,
            actionAmount: action.amount,
            token,
            savingsToken,
            receiver,
            argsAmount,
          })
        }
        case 'susds-to-usdc': {
          return getUsdcWithdrawConfig({
            psmActionsAddress: getContractAddress(usdsPsmActionsConfig.address, chainId),
            savingsInfo:
              context.savingsUsdsInfo ?? raise('Savings usds info is required to withdraw from susds to usdc'),
            isRedeem,
            actionAmount: action.amount,
            token,
            savingsToken,
            receiver,
            argsAmount,
          })
        }

        case 'base-susds-to-usds':
        case 'base-susds-to-usdc': {
          assert(context.savingsUsdsInfo, 'Savings info is required for usdc psm withdraw from savings action')

          // @note We don't need to use savings prediction here, because
          // the savings token value increases with time.

          if (isRedeem) {
            const minAssetsAmount = context.savingsUsdsInfo.convertToAssets({ shares: action.amount })

            const minAmountOut = calculateGemMinAmountOut({
              gemDecimals: token.decimals,
              assetsTokenDecimals: savingsToken.decimals,
              assetsAmount: toBigInt(savingsToken.toBaseUnit(minAssetsAmount)),
            })

            return ensureConfigTypes({
              address: getContractAddress(basePsm3Address, chainId),
              abi: basePsm3Abi,
              functionName: 'swapExactIn',
              args: [
                savingsToken.address,
                token.address,
                argsAmount,
                minAmountOut,
                receiver,
                LAST_UI_REFERRAL_CODE_BIGINT,
              ],
            })
          }

          const maxSharesAmount = context.savingsUsdsInfo.convertToShares({
            assets: action.amount,
          })
          const maxAmountIn = toBigInt(savingsToken.toBaseUnit(maxSharesAmount))

          return ensureConfigTypes({
            address: getContractAddress(basePsm3Address, chainId),
            abi: basePsm3Abi,
            functionName: 'swapExactOut',
            args: [
              savingsToken.address,
              token.address,
              argsAmount,
              maxAmountIn,
              receiver,
              LAST_UI_REFERRAL_CODE_BIGINT,
            ],
          })
        }

        default:
          assertNever(actionPath)
      }
    },

    invalidates: () => {
      const balancesQueryKeyPrefix = getBalancesQueryKeyPrefix({ chainId, account })
      function getAllowanceQueryKey(spender: CheckedAddress): QueryKey {
        return allowanceQueryKey({
          token: action.savingsToken.address,
          spender,
          account,
          chainId,
        })
      }

      switch (actionPath) {
        case 'sdai-to-dai':
        case 'susds-to-usds':
          return [balancesQueryKeyPrefix]
        case 'sdai-to-sexy-dai':
          return [balancesQueryKeyPrefix, getAllowanceQueryKey(CheckedAddress(savingsXDaiAdapterAddress[gnosis.id]))]
        case 'sdai-to-usds':
          return [
            balancesQueryKeyPrefix,
            getAllowanceQueryKey(getContractAddress(migrationActionsConfig.address, chainId)),
          ]
        case 'sdai-to-usdc':
          return [balancesQueryKeyPrefix, getAllowanceQueryKey(getContractAddress(psmActionsConfig.address, chainId))]
        case 'susds-to-usdc':
          return [
            balancesQueryKeyPrefix,
            getAllowanceQueryKey(getContractAddress(usdsPsmActionsConfig.address, chainId)),
          ]

        case 'base-susds-to-usdc':
        case 'base-susds-to-usds':
          return [balancesQueryKeyPrefix, getAllowanceQueryKey(getContractAddress(basePsm3Address, chainId))]
        default:
          assertNever(actionPath)
      }
    },

    beforeWriteCheck: () => {
      const reserveAddresses = tokensInfo.all().map(({ token }) => token.address)
      assertWithdraw({
        mode: action.mode,
        receiver: action.receiver,
        owner: account,
        tokenAddresses: reserveAddresses,
      })
    },
  }
}

interface GetUsdcWithdrawConfigParams {
  psmActionsAddress: CheckedAddress
  savingsInfo: SavingsInfo
  isRedeem: boolean
  actionAmount: NormalizedUnitNumber
  token: Token
  savingsToken: Token
  receiver: Address
  argsAmount: bigint
}

function getUsdcWithdrawConfig({
  psmActionsAddress,
  savingsInfo,
  isRedeem,
  actionAmount,
  token,
  savingsToken,
  receiver,
  argsAmount,
}: GetUsdcWithdrawConfigParams): GetWriteConfigResult {
  if (isRedeem) {
    const assetsAmount = savingsInfo.convertToAssets({ shares: actionAmount })
    const gemMinAmountOut = calculateGemMinAmountOut({
      gemDecimals: token.decimals,
      assetsTokenDecimals: savingsToken.decimals,
      assetsAmount: toBigInt(savingsToken.toBaseUnit(assetsAmount)),
    })

    return ensureConfigTypes({
      address: psmActionsAddress,
      abi: psmActionsConfig.abi,
      functionName: 'redeemAndSwap',
      args: [receiver, argsAmount, gemMinAmountOut],
    })
  }

  const gemConversionFactor = calculateGemConversionFactor({
    gemDecimals: token.decimals,
    assetsTokenDecimals: savingsToken.decimals,
  })
  const assetsMaxAmountIn = toBigInt(token.toBaseUnit(actionAmount).multipliedBy(gemConversionFactor))

  return ensureConfigTypes({
    address: psmActionsAddress,
    abi: psmActionsConfig.abi,
    functionName: 'withdrawAndSwap',
    args: [receiver, argsAmount, assetsMaxAmountIn],
  })
}
