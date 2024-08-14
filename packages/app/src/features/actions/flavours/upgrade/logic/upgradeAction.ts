import { migrationActionsAbi } from '@/config/abis/migrationActionsAbi'
import { MIGRATE_ACTIONS_ADDRESS } from '@/config/consts'
import { ensureConfigTypes } from '@/domain/hooks/useWrite'
import { getBalancesQueryKeyPrefix } from '@/domain/wallet/getBalancesQueryKeyPrefix'
import { allowanceQueryKey } from '@/features/actions/flavours/approve/logic/query'
import { ActionConfig, ActionContext } from '@/features/actions/logic/types'
import { toBigInt } from '@/utils/bigNumber'
import { UpgradeAction } from '../types'

export function createUpgradeActionConfig(action: UpgradeAction, context: ActionContext): ActionConfig {
  const { account, chainId } = context

  return {
    getWriteConfig: () => {
      const daiAmount = toBigInt(action.fromToken.toBaseUnit(action.amount))

      return ensureConfigTypes({
        address: MIGRATE_ACTIONS_ADDRESS,
        abi: migrationActionsAbi,
        functionName: 'migrateDAIToNST',
        args: [account, daiAmount],
      })
    },

    invalidates: () => {
      return [
        allowanceQueryKey({ token: action.fromToken.address, spender: MIGRATE_ACTIONS_ADDRESS, account, chainId }),
        getBalancesQueryKeyPrefix({ chainId, account }),
      ]
    },
  }
}
