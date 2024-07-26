import { useQueryClient } from '@tanstack/react-query'
import { Address } from 'viem'
import { useAccount, useChainId } from 'wagmi'

import { poolAbi } from '@/config/abis/poolAbi'
import { InterestRate, NATIVE_ASSET_MOCK_ADDRESS } from '@/config/consts'
import { lendingPoolAddress, wethGatewayConfig } from '@/config/contracts-generated'
import { useContractAddress } from '@/domain/hooks/useContractAddress'
import { ensureConfigTypes, useWrite } from '@/domain/hooks/useWrite'
import { aaveDataLayerQueryKey } from '@/domain/market-info/aave-data-layer/query'
import { BaseUnitNumber } from '@/domain/types/NumericValues'
import { toBigInt } from '@/utils/bigNumber'
import { getBalancesQueryKeyPrefix } from '../wallet/getBalancesQueryKeyPrefix'

export interface UseBorrowArgs {
  asset: Address
  value: BaseUnitNumber
  enabled?: boolean
  onTransactionSettled?: () => void
}

export function useBorrow({
  value: _value,
  enabled = true,
  onTransactionSettled,
  asset,
}: UseBorrowArgs): ReturnType<typeof useWrite> {
  const lendingPool = useContractAddress(lendingPoolAddress)
  const wethGateway = useContractAddress(wethGatewayConfig.address)
  const referralCode = 0
  const client = useQueryClient()
  const { address: userAddress } = useAccount()
  const chainId = useChainId()
  const value = toBigInt(_value)
  const interestRateMode = BigInt(InterestRate.Variable)

  const config =
    asset === NATIVE_ASSET_MOCK_ADDRESS
      ? ensureConfigTypes({
          abi: wethGatewayConfig.abi,
          address: wethGateway,
          functionName: 'borrowETH',
          args: [lendingPool, value, interestRateMode, referralCode],
        })
      : ensureConfigTypes({
          abi: poolAbi,
          address: lendingPool,
          functionName: 'borrow',
          args: [asset, value, interestRateMode, referralCode, userAddress!],
        })

  return useWrite(
    {
      ...config,
      enabled: !!userAddress && value > 0n && enabled,
    },
    {
      onTransactionSettled: async () => {
        void client.invalidateQueries({
          queryKey: aaveDataLayerQueryKey({ chainId, account: userAddress }),
        })
        void client.invalidateQueries({
          queryKey: getBalancesQueryKeyPrefix({ chainId, account: userAddress }),
        })

        onTransactionSettled?.()
      },
    },
  )
}
