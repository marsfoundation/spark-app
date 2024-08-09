import { poolAbi } from '@/config/abis/poolAbi'
import { InterestRate, NATIVE_ASSET_MOCK_ADDRESS } from '@/config/consts'
import { lendingPoolConfig, wethGatewayConfig } from '@/config/contracts-generated'
import { getContractAddress } from '@/domain/hooks/useContractAddress'
import { ensureConfigTypes } from '@/domain/hooks/useWrite'
import { aaveDataLayerQueryKey } from '@/domain/market-info/aave-data-layer/query'
import { allowanceQueryKey } from '@/domain/market-operations/allowance/query'
import { getBalancesQueryKeyPrefix } from '@/domain/wallet/getBalancesQueryKeyPrefix'
import { toBigInt } from '@/utils/bigNumber'
import { ActionConfig, ActionContext } from '../../../logic/types'
import { BorrowAction } from '../types'

export function createBorrowActionConfig(action: BorrowAction, context: ActionContext): ActionConfig {
  const { account, chainId } = context
  const wethGatewayAddress = getContractAddress(wethGatewayConfig.address, chainId)
  const lendingPoolAddress = getContractAddress(lendingPoolConfig.address, chainId)
  const borrowTokenAddress = action.token.address

  return {
    getWriteConfig: () => {
      const borrowAmount = toBigInt(action.token.toBaseUnit(action.value))
      const interestRateMode = BigInt(InterestRate.Variable)
      const referralCode = 0

      if (borrowTokenAddress === NATIVE_ASSET_MOCK_ADDRESS) {
        return ensureConfigTypes({
          abi: wethGatewayConfig.abi,
          address: wethGatewayAddress,
          functionName: 'borrowETH',
          args: [lendingPoolAddress, borrowAmount, interestRateMode, referralCode],
        })
      }

      return ensureConfigTypes({
        abi: poolAbi,
        address: lendingPoolAddress,
        functionName: 'borrow',
        args: [borrowTokenAddress, borrowAmount, interestRateMode, referralCode, account],
      })
    },

    invalidates: () => [
      allowanceQueryKey({ token: borrowTokenAddress, spender: lendingPoolAddress, account, chainId }),
      getBalancesQueryKeyPrefix({ chainId, account }),
      aaveDataLayerQueryKey({ chainId, account }),
    ],
  }
}
