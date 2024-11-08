import { basePsm3Abi, basePsm3Address } from '@/config/abis/basePsm3Abi'
import { susdsAbi } from '@/config/abis/susdsAbi'
import { LAST_UI_REFERRAL_CODE, LAST_UI_REFERRAL_CODE_BIGINT } from '@/config/consts'
import {
  migrationActionsConfig,
  psmActionsConfig,
  savingsXDaiAdapterAbi,
  savingsXDaiAdapterAddress,
  usdsPsmActionsConfig,
} from '@/config/contracts-generated'
import { getContractAddress } from '@/domain/hooks/useContractAddress'
import { ensureConfigTypes } from '@/domain/hooks/useWrite'
import { EPOCH_LENGTH } from '@/domain/market-info/consts'
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
import { base, gnosis } from 'viem/chains'
import { DepositToSavingsAction } from '../types'
import { getSavingsDepositActionPath } from './getSavingsDepositActionPath'

export function createDepositToSavingsActionConfig(
  action: DepositToSavingsAction,
  context: ActionContext,
): ActionConfig {
  const { account, chainId } = context
  const tokensInfo = context.tokensInfo ?? raise('Tokens info is required for deposit to savings action')
  const actionPath = getSavingsDepositActionPath({
    token: action.token,
    savingsToken: action.savingsToken,
    tokensInfo,
    chainId,
  })

  return {
    getWriteConfig: () => {
      const { token, savingsToken } = action
      const assetsAmount = toBigInt(token.toBaseUnit(action.value))

      switch (actionPath) {
        case 'usds-to-susds':
          return ensureConfigTypes({
            address: savingsToken.address,
            abi: susdsAbi,
            functionName: 'deposit',
            args: [assetsAmount, account, LAST_UI_REFERRAL_CODE],
          })
        case 'dai-to-sdai':
          return ensureConfigTypes({
            address: savingsToken.address,
            abi: erc4626Abi,
            functionName: 'deposit',
            args: [assetsAmount, account],
          })

        case 'dai-to-susds':
          return ensureConfigTypes({
            address: getContractAddress(migrationActionsConfig.address, chainId),
            abi: migrationActionsConfig.abi,
            functionName: 'migrateDAIToSUSDS',
            args: [account, assetsAmount],
          })

        case 'usdc-to-susds':
          return getUsdcDepositConfig({
            psmActionsAddress: getContractAddress(usdsPsmActionsConfig.address, chainId),
            token,
            savingsToken,
            actionValue: action.value,
            account,
            assetsAmount,
          })

        case 'usdc-to-sdai':
          return getUsdcDepositConfig({
            psmActionsAddress: getContractAddress(psmActionsConfig.address, chainId),
            token,
            savingsToken,
            actionValue: action.value,
            account,
            assetsAmount,
          })

        case 'sexy-dai-to-sdai':
          return ensureConfigTypes({
            address: savingsXDaiAdapterAddress[gnosis.id],
            abi: savingsXDaiAdapterAbi,
            functionName: 'depositXDAI',
            args: [account],
            value: assetsAmount,
          })

        case 'base-usds-to-susds':
        case 'base-usdc-to-susds': {
          assert(context.savingsUsdsInfo, 'Savings info is required for usdc psm withdraw from savings action')

          const currentTimestamp = context.savingsUsdsInfo.currentTimestamp
          // We don't know when the block with transaction will be mined so
          // we calculate the minimal amount of sUSDS to receive as the amount
          // the user would receive in 1 epoch (30 minutes)
          const minimalSharesAmount = context.savingsUsdsInfo.predictSharesAmount({
            assets: action.value, // we pass NormalizedUnitNumber, so 1 USDC = 1 USDS
            timestamp: currentTimestamp + EPOCH_LENGTH,
          })

          const minAmountOut = toBigInt(savingsToken.toBaseUnit(minimalSharesAmount))

          return ensureConfigTypes({
            address: basePsm3Address[base.id],
            abi: basePsm3Abi,
            functionName: 'swapExactIn',
            args: [
              token.address,
              savingsToken.address,
              assetsAmount,
              minAmountOut,
              account,
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
        return allowanceQueryKey({ token: action.token.address, spender, account, chainId })
      }

      switch (actionPath) {
        case 'sexy-dai-to-sdai':
          return [balancesQueryKeyPrefix]
        case 'usdc-to-sdai':
          return [balancesQueryKeyPrefix, getAllowanceQueryKey(getContractAddress(psmActionsConfig.address, chainId))]
        case 'usdc-to-susds':
          return [
            balancesQueryKeyPrefix,
            getAllowanceQueryKey(getContractAddress(usdsPsmActionsConfig.address, chainId)),
          ]
        case 'dai-to-susds':
          return [
            balancesQueryKeyPrefix,
            getAllowanceQueryKey(getContractAddress(migrationActionsConfig.address, chainId)),
          ]
        case 'dai-to-sdai':
        case 'usds-to-susds':
          return [balancesQueryKeyPrefix, getAllowanceQueryKey(action.savingsToken.address)]

        case 'base-usds-to-susds':
        case 'base-usdc-to-susds':
          return [balancesQueryKeyPrefix, getAllowanceQueryKey(getContractAddress(basePsm3Address, chainId))]

        default:
          assertNever(actionPath)
      }
    },
  }
}

interface GetUsdcDepositConfigParams {
  psmActionsAddress: CheckedAddress
  token: Token
  savingsToken: Token
  actionValue: NormalizedUnitNumber
  account: Address
  assetsAmount: bigint
}

function getUsdcDepositConfig({
  psmActionsAddress,
  token,
  savingsToken,
  actionValue,
  account,
  assetsAmount,
}: GetUsdcDepositConfigParams): GetWriteConfigResult {
  const gemConversionFactor = calculateGemConversionFactor({
    gemDecimals: token.decimals,
    assetsTokenDecimals: savingsToken.decimals,
  })
  const assetsMinAmountOut = toBigInt(token.toBaseUnit(actionValue).multipliedBy(gemConversionFactor))

  return ensureConfigTypes({
    address: psmActionsAddress,
    abi: psmActionsConfig.abi,
    functionName: 'swapAndDeposit',
    args: [account, assetsAmount, assetsMinAmountOut],
  })
}
