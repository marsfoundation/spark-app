import {
  migrationActionsConfig,
  psmActionsConfig,
  savingsXDaiAdapterAbi,
  savingsXDaiAdapterAddress,
  usdsPsmActionsConfig,
} from '@/config/contracts-generated'
import { getContractAddress } from '@/domain/hooks/useContractAddress'
import { ensureConfigTypes } from '@/domain/hooks/useWrite'
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
        case 'usdc-to-sdai': {
          const gemConversionFactor = calculateGemConversionFactor({
            gemDecimals: token.decimals,
            assetsTokenDecimals: savingsToken.decimals,
          })
          const assetsMinAmountOut = toBigInt(token.toBaseUnit(action.value).multipliedBy(gemConversionFactor))

          const sdaiSymbol = tokensInfo.sDAI?.symbol ?? raise('sDAI token is required for savings deposit action')
          const address =
            savingsToken.symbol === sdaiSymbol
              ? getContractAddress(psmActionsConfig.address, chainId)
              : getContractAddress(usdsPsmActionsConfig.address, chainId)

          return ensureConfigTypes({
            address,
            abi: psmActionsConfig.abi,
            functionName: 'swapAndDeposit',
            args: [account, assetsAmount, assetsMinAmountOut],
          })
        }

        case 'sexy-dai-to-sdai':
          return ensureConfigTypes({
            address: savingsXDaiAdapterAddress[gnosis.id],
            abi: savingsXDaiAdapterAbi,
            functionName: 'depositXDAI',
            args: [account],
            value: assetsAmount,
          })

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
        default:
          assertNever(actionPath)
      }
    },
  }
}
