import { usdsPsmWrapperConfig } from '@/config/contracts-generated'
import { getContractAddress } from '@/domain/hooks/useContractAddress'
import { ensureConfigTypes } from '@/domain/hooks/useWrite'
import { getBalancesQueryKeyPrefix } from '@/domain/wallet/getBalancesQueryKeyPrefix'
import { ActionConfig, ActionContext } from '@/features/actions/logic/types'
import { toBigInt } from '@/utils/bigNumber'
import { allowanceQueryKey } from '../../approve/logic/query'
import { UsdsPsmWrapAction } from '../types'

export function createUsdsPsmWrapActionConfig(action: UsdsPsmWrapAction, context: ActionContext): ActionConfig {
  const { account, chainId } = context

  return {
    getWriteConfig: () => {
      const amount = toBigInt(action.usdc.toBaseUnit(action.usdcAmount))

      return ensureConfigTypes({
        address: getContractAddress(usdsPsmWrapperConfig.address, chainId),
        abi: usdsPsmWrapperConfig.abi,
        functionName: 'sellGem',
        args: [account, amount],
      })
    },

    invalidates: () => {
      return [
        allowanceQueryKey({
          token: action.usdc.address,
          spender: getContractAddress(usdsPsmWrapperConfig.address, chainId),
          account,
          chainId,
        }),
        getBalancesQueryKeyPrefix({ account, chainId }),
      ]
    },
  }
}
