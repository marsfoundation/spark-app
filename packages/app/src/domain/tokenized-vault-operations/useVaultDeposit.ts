import { toBigInt } from '@/utils/bigNumber'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { erc4626Abi } from 'viem'
import { useAccount, useChainId, useConfig } from 'wagmi'
import { ensureConfigTypes, useWrite } from '../hooks/useWrite'
import { allowance } from '../market-operations/allowance/query'
import { CheckedAddress } from '../types/CheckedAddress'
import { BaseUnitNumber } from '../types/NumericValues'
import { balances } from '../wallet/balances'
import { vaultAssetQueryOptions } from './vaultAssetQuery'

export interface UseVaultDepositArgs {
  vault: CheckedAddress
  assetsAmount: BaseUnitNumber
  onTransactionSettled?: () => void
  enabled?: boolean
}

export function useVaultDeposit({
  vault,
  assetsAmount,
  onTransactionSettled,
  enabled: _enabled = true,
}: UseVaultDepositArgs): ReturnType<typeof useWrite> {
  const client = useQueryClient()
  const wagmiConfig = useConfig()
  const chainId = useChainId()

  const { address: receiver } = useAccount()
  const { data: vaultAsset } = useQuery(vaultAssetQueryOptions({ vault, chainId, config: wagmiConfig }))

  const config = ensureConfigTypes({
    address: vault,
    abi: erc4626Abi,
    functionName: 'deposit',
    args: [toBigInt(assetsAmount), receiver!],
  })
  const enabled = _enabled && assetsAmount.gt(0) && !!vaultAsset && !!receiver

  return useWrite(
    {
      ...config,
      enabled,
    },
    {
      onTransactionSettled: async () => {
        void client.invalidateQueries({
          queryKey: balances({ wagmiConfig, chainId, account: receiver }).queryKey,
        })
        void client.invalidateQueries({
          queryKey: allowance({ wagmiConfig, chainId, token: vaultAsset!, account: receiver!, spender: vault })
            .queryKey,
        })

        onTransactionSettled?.()
      },
    },
  )
}
