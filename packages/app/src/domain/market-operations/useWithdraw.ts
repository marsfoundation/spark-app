import { useQueryClient } from '@tanstack/react-query'
import { Address } from 'viem'
import { useAccount, useChainId, useConfig } from 'wagmi'

import { poolAbi } from '@/config/abis/poolAbi'
import { NATIVE_ASSET_MOCK_ADDRESS } from '@/config/consts'
import { lendingPoolAddress, wethGatewayConfig } from '@/config/contracts-generated'
import { toBigInt } from '@/utils/bigNumber'

import { useContractAddress } from '../hooks/useContractAddress'
import { ensureConfigTypes, useWrite } from '../hooks/useWrite'
import { aaveDataLayerQueryKey } from '../market-info/aave-data-layer/query'
import { BaseUnitNumber } from '../types/NumericValues'
import { getBalancesQueryKeyPrefix } from '../wallet/getBalancesQueryKeyPrefix'
import { allowance } from './allowance/query'

export type UseWithdrawArgs = {
  asset: Address
  value: BaseUnitNumber
  onTransactionSettled?: () => void
  enabled?: boolean
}

export function useWithdraw({
  asset,
  value: _value,
  onTransactionSettled,
  enabled = true,
}: UseWithdrawArgs): ReturnType<typeof useWrite> {
  const client = useQueryClient()

  const { address: userAddress } = useAccount()
  const chainId = useChainId()

  const value = toBigInt(_value)
  const lendingPool = useContractAddress(lendingPoolAddress)
  const wethGateway = useContractAddress(wethGatewayConfig.address)
  const wagmiConfig = useConfig()

  const config =
    asset === NATIVE_ASSET_MOCK_ADDRESS
      ? ensureConfigTypes({
          address: wethGateway,
          abi: wethGatewayConfig.abi,
          functionName: 'withdrawETH',
          args: [lendingPool, value, userAddress!],
        })
      : ensureConfigTypes({
          abi: poolAbi,
          address: lendingPool,
          functionName: 'withdraw',
          args: [asset, value, userAddress!],
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
        void client.invalidateQueries({
          queryKey: allowance({ wagmiConfig, chainId, token: asset, account: userAddress!, spender: lendingPool })
            .queryKey,
        })

        onTransactionSettled?.()
      },
    },
  )
}
