import { poolAbi } from '@/config/abis/poolAbi'
import { lendingPoolConfig } from '@/config/contracts-generated'
import { getContractAddress } from '@/domain/hooks/useContractAddress'
import { ensureConfigTypes } from '@/domain/hooks/useWrite'
import { aaveDataLayerQueryKey } from '@/domain/market-info/aave-data-layer/query'
import { ActionConfig, ActionContext } from '../../../logic/types'
import { SetUseAsCollateralAction } from '../types'

export function createSetUseAsCollateralActionConfig(
  action: SetUseAsCollateralAction,
  context: ActionContext,
): ActionConfig {
  const { account, chainId } = context
  const lendingPoolAddress = getContractAddress(lendingPoolConfig.address, chainId)

  return {
    getWriteConfig: () => {
      return ensureConfigTypes({
        abi: poolAbi,
        address: lendingPoolAddress,
        functionName: 'setUserUseReserveAsCollateral',
        args: [action.token.address, action.useAsCollateral],
      })
    },

    invalidates: () => [aaveDataLayerQueryKey({ chainId, account })],
  }
}
