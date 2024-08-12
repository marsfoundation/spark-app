import { migrationActionsAbi } from '@/config/abis/migrationActionsAbi'
import { MIGRATE_ACTIONS_ADDRESS } from '@/config/consts'
import { psmActionsConfig, savingsXDaiAdapterAbi, savingsXDaiAdapterAddress } from '@/config/contracts-generated'
import { getContractAddress } from '@/domain/hooks/useContractAddress'
import { ensureConfigTypes } from '@/domain/hooks/useWrite'
import { allowanceQueryKey } from '@/domain/market-operations/allowance/query'
import { getBalancesQueryKeyPrefix } from '@/domain/wallet/getBalancesQueryKeyPrefix'
import { ActionConfig, ActionContext } from '@/features/actions/logic/types'
import {
  calculateGemConversionFactor,
  isSexyDaiOperation,
  isUsdcPsmActionsOperation,
  isVaultOperation,
} from '@/features/actions/utils/savings'
import { raise } from '@/utils/assert'
import { toBigInt } from '@/utils/bigNumber'
import { erc4626Abi } from 'viem'
import { gnosis } from 'viem/chains'
import { DepositToSavingsAction } from '../types'
import { isDaiToSNstMigration } from './common'

export function createDepositToSavingsActionConfig(
  action: DepositToSavingsAction,
  context: ActionContext,
): ActionConfig {
  const { account, chainId } = context
  const tokensInfo = context.tokensInfo ?? raise('Tokens info is required for deposit to savings action')

  return {
    getWriteConfig: () => {
      const { token, savingsToken } = action
      const assetsAmount = toBigInt(token.toBaseUnit(action.value))

      if (isVaultOperation({ token, savingsToken, tokensInfo, chainId })) {
        return ensureConfigTypes({
          address: savingsToken.address,
          abi: erc4626Abi,
          functionName: 'deposit',
          args: [assetsAmount, account],
        })
      }

      if (isSexyDaiOperation({ token, savingsToken, tokensInfo, chainId })) {
        return ensureConfigTypes({
          address: savingsXDaiAdapterAddress[gnosis.id],
          abi: savingsXDaiAdapterAbi,
          functionName: 'depositXDAI',
          args: [account],
          value: assetsAmount,
        })
      }

      if (isUsdcPsmActionsOperation({ token, savingsToken, tokensInfo })) {
        const gemConversionFactor = calculateGemConversionFactor({
          gemDecimals: token.decimals,
          assetsTokenDecimals: savingsToken.decimals,
        })
        const assetsMinAmountOut = toBigInt(token.toBaseUnit(action.value).multipliedBy(gemConversionFactor))
        const psmActions = getContractAddress(psmActionsConfig.address, chainId)

        return ensureConfigTypes({
          address: psmActions,
          abi: psmActionsConfig.abi,
          functionName: 'swapAndDeposit',
          args: [account, assetsAmount, assetsMinAmountOut],
        })
      }

      if (isDaiToSNstMigration({ token, savingsToken, tokensInfo })) {
        return ensureConfigTypes({
          address: MIGRATE_ACTIONS_ADDRESS,
          abi: migrationActionsAbi,
          functionName: 'migrateDAIToSNST',
          args: [account, assetsAmount],
        })
      }

      throw new Error('Not implemented kind of deposit to savings action')
    },

    invalidates: () => {
      const { token, savingsToken } = action

      if (isSexyDaiOperation({ token, savingsToken, tokensInfo, chainId })) {
        return [getBalancesQueryKeyPrefix({ chainId, account })]
      }

      const allowanceSpender = (() => {
        if (isUsdcPsmActionsOperation({ token, savingsToken, tokensInfo })) {
          return getContractAddress(psmActionsConfig.address, chainId)
        }

        if (isDaiToSNstMigration({ token, savingsToken, tokensInfo })) {
          return MIGRATE_ACTIONS_ADDRESS
        }

        return action.savingsToken.address
      })()

      return [
        allowanceQueryKey({ token: action.token.address, spender: allowanceSpender, account, chainId }),
        getBalancesQueryKeyPrefix({ chainId, account }),
      ]
    },
  }
}
