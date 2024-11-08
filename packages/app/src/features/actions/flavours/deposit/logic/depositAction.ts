import { poolAbi } from '@/config/abis/poolAbi'
import { NATIVE_ASSET_MOCK_ADDRESS, LAST_UI_REFERRAL_CODE } from '@/config/consts'
import { lendingPoolAddress, wethGatewayConfig } from '@/config/contracts-generated'
import { getContractAddress } from '@/domain/hooks/useContractAddress'
import { ensureConfigTypes } from '@/domain/hooks/useWrite'
import { aaveDataLayerQueryKey } from '@/domain/market-info/aave-data-layer/query'
import { getBalancesQueryKeyPrefix } from '@/domain/wallet/getBalancesQueryKeyPrefix'
import { allowanceQueryKey } from '@/features/actions/flavours/approve/logic/query'
import { ActionConfig, ActionContext } from '@/features/actions/logic/types'
import { toBigInt } from '@/utils/bigNumber'
import { getTimestampInSeconds } from '@/utils/time'
import { DepositAction } from '../types'

export function createDepositActionConfig(action: DepositAction, context: ActionContext): ActionConfig {
  const { account, chainId } = context
  const lendingPool = getContractAddress(lendingPoolAddress, chainId)
  const wethGateway = getContractAddress(wethGatewayConfig.address, chainId)
  const permitStore = context.permitStore

  return {
    getWriteConfig: () => {
      const value = toBigInt(action.token.toBaseUnit(action.value))
      const token = action.token.address
      const permit = permitStore?.find(action.token)

      if (token === NATIVE_ASSET_MOCK_ADDRESS) {
        return ensureConfigTypes({
          abi: wethGatewayConfig.abi,
          address: wethGateway,
          functionName: 'depositETH',
          value,
          args: [lendingPool, context.account, LAST_UI_REFERRAL_CODE],
        })
      }

      if (permit) {
        return ensureConfigTypes({
          address: lendingPool,
          abi: poolAbi,
          functionName: 'supplyWithPermit',
          args: [
            token,
            value,
            context.account,
            LAST_UI_REFERRAL_CODE,
            toBigInt(getTimestampInSeconds(permit.deadline)),
            Number(permit.signature.v),
            permit.signature.r,
            permit.signature.s,
          ],
        })
      }

      return ensureConfigTypes({
        address: lendingPool,
        abi: poolAbi,
        functionName: 'supply',
        args: [token, value, context.account, LAST_UI_REFERRAL_CODE],
      })
    },

    invalidates: () => [
      allowanceQueryKey({ token: action.token.address, spender: lendingPool, account, chainId }),
      getBalancesQueryKeyPrefix({ chainId, account }),
      aaveDataLayerQueryKey({ chainId, account }),
    ],
  }
}
