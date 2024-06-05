import { savingsDaiConfig } from '@/config/contracts-generated'
import { toBigInt } from '@/utils/bigNumber'
import { useQueryClient } from '@tanstack/react-query'
import { useAccount, useChainId, useConfig } from 'wagmi'
import { useContractAddress } from '../hooks/useContractAddress'
import { ensureConfigTypes, useWrite } from '../hooks/useWrite'
import { aaveDataLayer } from '../market-info/aave-data-layer/query'
import { BaseUnitNumber } from '../types/NumericValues'
import { balances } from '../wallet/balances'

interface UseVaultWithdrawArgs {
  assets: BaseUnitNumber
  onTransactionSettled?: () => void
  enabled?: boolean
}

export function useVaultWithdraw({
  assets: _assets,
  onTransactionSettled,
  enabled = true,
}: UseVaultWithdrawArgs): ReturnType<typeof useWrite> {
  const client = useQueryClient()
  const wagmiConfig = useConfig()
  const chainId = useChainId()

  const { address: receiver } = useAccount()
  const assets = toBigInt(_assets)
  const vault = useContractAddress(savingsDaiConfig.address)

  const config = ensureConfigTypes({
    address: vault,
    abi: savingsDaiConfig.abi,
    functionName: 'withdraw',
    args: [toBigInt(_assets), receiver!, receiver!],
  })

  return useWrite(
    {
      ...config,
      enabled: enabled && assets > 0n && !!receiver,
    },
    {
      onTransactionSettled: async () => {
        void client.invalidateQueries({
          queryKey: aaveDataLayer({ wagmiConfig, chainId, account: receiver }).queryKey,
        })
        void client.invalidateQueries({
          queryKey: balances({ wagmiConfig, chainId, account: receiver }).queryKey,
        })

        onTransactionSettled?.()
      },
    },
  )
}
