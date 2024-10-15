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
import { getBalancesQueryKeyPrefix } from '@/domain/wallet/getBalancesQueryKeyPrefix'
import { allowanceQueryKey } from '@/features/actions/flavours/approve/logic/query'
import { ActionConfig, ActionContext } from '@/features/actions/logic/types'
import { calculateGemConversionFactor } from '@/features/actions/utils/savings'
import { raise } from '@/utils/assert'
import { assertNever } from '@/utils/assertNever'
import { toBigInt } from '@/utils/bigNumber'
import { QueryKey } from '@tanstack/react-query'
import { erc4626Abi } from 'viem'
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

      function getUsdcWithdrawActionConfig(psmActionsAddress: CheckedAddress, savingsInfo: SavingsInfo) {
        if (isRedeem) {
          const assetsAmount = savingsInfo.convertToAssets({ shares: action.amount })
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
        const assetsMaxAmountIn = toBigInt(token.toBaseUnit(action.amount).multipliedBy(gemConversionFactor))

        return ensureConfigTypes({
          address: psmActionsAddress,
          abi: psmActionsConfig.abi,
          functionName: 'withdrawAndSwap',
          args: [receiver, argsAmount, assetsMaxAmountIn],
        })
      }

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
          return getUsdcWithdrawActionConfig(
            getContractAddress(psmActionsConfig.address, chainId),
            context.savingsDaiInfo ?? raise('Savings dai info is required to withdraw from sdai to usdc'),
          )
        }
        case 'susds-to-usdc': {
          return getUsdcWithdrawActionConfig(
            getContractAddress(usdsPsmActionsConfig.address, chainId),
            context.savingsUsdsInfo ?? raise('Savings usds info is required to withdraw from susds to usdc'),
          )
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
