import { savingsDaiConfig } from '@/config/contracts-generated'
import { toBigInt } from '@/utils/bigNumber'
import { useQueryClient } from '@tanstack/react-query'
import { useAccount, useChainId, useConfig } from 'wagmi'
import { useContractAddress } from '../hooks/useContractAddress'
import { ensureConfigTypes, useWrite } from '../hooks/useWrite'
import { aaveDataLayer } from '../market-info/aave-data-layer/query'
import { allowance } from '../market-operations/allowance/query'
import { CheckedAddress } from '../types/CheckedAddress'
import { BaseUnitNumber } from '../types/NumericValues'
import { balances } from '../wallet/balances'

export interface UseVaultDepositArgs {
  token: CheckedAddress
  assets: BaseUnitNumber
  onTransactionSettled?: () => void
  enabled?: boolean
}

export function useVaultDeposit({
  token,
  assets: _assets,
  onTransactionSettled,
  enabled = true,
}: UseVaultDepositArgs): ReturnType<typeof useWrite> {
  const client = useQueryClient()

  const { address: receiver } = useAccount()
  const chainId = useChainId()

  const assets = toBigInt(_assets)
  const vault = useContractAddress(savingsDaiConfig.address)
  const wagmiConfig = useConfig()

  const config = ensureConfigTypes({
    address: vault,
    abi: savingsDaiConfig.abi,
    functionName: 'deposit',
    args: [assets, receiver!],
  })

  return useWrite(
    {
      ...config,
      enabled: !!receiver && assets > 0n && enabled,
    },
    {
      onTransactionSettled: async () => {
        void client.invalidateQueries({
          queryKey: aaveDataLayer({ wagmiConfig, chainId, account: receiver }).queryKey,
        })
        void client.invalidateQueries({
          queryKey: balances({ wagmiConfig, chainId, account: receiver }).queryKey,
        })
        void client.invalidateQueries({
          queryKey: allowance({ wagmiConfig, chainId, token, account: receiver!, spender: vault }).queryKey,
        })

        onTransactionSettled?.()
      },
    },
  )
}
