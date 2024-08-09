import { poolAbi } from '@/config/abis/poolAbi'
import { lendingPoolConfig } from '@/config/contracts-generated'
import { getContractAddress } from '@/domain/hooks/useContractAddress'
import { ensureConfigTypes } from '@/domain/hooks/useWrite'
import { aaveDataLayerQueryKey } from '@/domain/market-info/aave-data-layer/query'
import { ActionConfig, ActionContext } from '../../../logic/types'
import { SetUserEModeAction } from './types'

export function createSetUserEModeActionConfig(action: SetUserEModeAction, context: ActionContext): ActionConfig {
  const { account, chainId } = context
  const lendingPoolAddress = getContractAddress(lendingPoolConfig.address, chainId)

  return {
    getWriteConfig: () => {
      return ensureConfigTypes({
        abi: poolAbi,
        address: lendingPoolAddress,
        functionName: 'setUserEMode',
        args: [action.eModeCategoryId],
      })
    },

    invalidates: () => [aaveDataLayerQueryKey({ chainId, account })],
  }
}
