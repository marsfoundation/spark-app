import { migrationActionsAbi } from '@/config/abis/migrationActionsAbi'
import { MIGRATE_ACTIONS_ADDRESS } from '@/config/consts'
import { ensureConfigTypes } from '@/domain/hooks/useWrite'
import { getBalancesQueryKeyPrefix } from '@/domain/wallet/getBalancesQueryKeyPrefix'
import { allowanceQueryKey } from '@/features/actions/flavours/approve/logic/query'
import { ActionConfig, ActionContext } from '@/features/actions/logic/types'
import { raise } from '@/utils/assert'
import { toBigInt } from '@/utils/bigNumber'
import { UpgradeAction } from '../types'

export function createUpgradeActionConfig(action: UpgradeAction, context: ActionContext): ActionConfig {
  const { account, chainId } = context
  const tokensInfo = context.tokensInfo ?? raise('Tokens info is required for upgrade action')
  const upgradeAmount = toBigInt(action.fromToken.toBaseUnit(action.amount))

  return {
    getWriteConfig: () => {
      const { fromToken, toToken } = action

      if (fromToken.symbol === tokensInfo.DAI?.symbol && toToken.symbol === tokensInfo.USDS?.symbol) {
        return ensureConfigTypes({
          address: MIGRATE_ACTIONS_ADDRESS,
          abi: migrationActionsAbi,
          functionName: 'migrateDAIToUSDS',
          args: [account, upgradeAmount],
        })
      }

      if (fromToken.symbol === tokensInfo.sDAI?.symbol && toToken.symbol === tokensInfo.sUSDS?.symbol) {
        return ensureConfigTypes({
          address: MIGRATE_ACTIONS_ADDRESS,
          abi: migrationActionsAbi,
          functionName: 'migrateSDAISharesToSUSDS',
          args: [account, upgradeAmount],
        })
      }

      throw new Error('Not implemented kind of upgrade action')
    },

    invalidates: () => {
      return [
        allowanceQueryKey({ token: action.fromToken.address, spender: MIGRATE_ACTIONS_ADDRESS, account, chainId }),
        getBalancesQueryKeyPrefix({ chainId, account }),
      ]
    },
  }
}
