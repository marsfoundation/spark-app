import { usdsPsmWrapperConfig } from '@/config/contracts-generated'
import { getContractAddress } from '@/domain/hooks/useContractAddress'
import { ensureConfigTypes } from '@/domain/hooks/useWrite'
import { getBalancesQueryKeyPrefix } from '@/domain/wallet/getBalancesQueryKeyPrefix'
import { ActionConfig, ActionContext } from '@/features/actions/logic/types'
import { toBigInt } from '@/utils/bigNumber'
import { allowanceQueryKey } from '../../approve/logic/query'
import { UsdsPsmConvertAction } from '../types'

export function createUsdsPsmConvertActionConfig(action: UsdsPsmConvertAction, context: ActionContext): ActionConfig {
  const { account, chainId } = context

  return {
    getWriteConfig: () => {
      const amount = toBigInt(action.usdc.toBaseUnit(action.usdcAmount))

      return ensureConfigTypes({
        address: getContractAddress(usdsPsmWrapperConfig.address, chainId),
        abi: usdsPsmWrapperConfig.abi,
        functionName: action.outToken === 'usdc' ? 'buyGem' : 'sellGem',
        args: [account, amount],
      })
    },

    invalidates: () => {
      return [
        allowanceQueryKey({
          token: action.outToken === 'usdc' ? action.usds.address : action.usdc.address,
          spender: getContractAddress(usdsPsmWrapperConfig.address, chainId),
          account,
          chainId,
        }),
        getBalancesQueryKeyPrefix({ account, chainId }),
      ]
    },
  }
}
