import { savingsDaiConfig } from '@/config/contracts-generated'
import { toBigInt } from '@/utils/bigNumber'
import { useQueryClient } from '@tanstack/react-query'
import { useAccount, useChainId, useConfig } from 'wagmi'
import { useContractAddress } from '../hooks/useContractAddress'
import { ensureConfigTypes, useWrite } from '../hooks/useWrite'
import { aaveDataLayer } from '../market-info/aave-data-layer/query'
import { BaseUnitNumber } from '../types/NumericValues'
import { balances } from '../wallet/balances'

interface UseVaultRedeemArgs {
  shares: BaseUnitNumber
  onTransactionSettled?: () => void
  enabled?: boolean
}

export function useVaultRedeem({
  shares: _shares,
  onTransactionSettled,
  enabled = true,
}: UseVaultRedeemArgs): ReturnType<typeof useWrite> {
  const client = useQueryClient()
  const wagmiConfig = useConfig()
  const chainId = useChainId()

  const { address: receiver } = useAccount()
  const shares = toBigInt(_shares)
  const vault = useContractAddress(savingsDaiConfig.address)

  const config = ensureConfigTypes({
    address: vault,
    abi: savingsDaiConfig.abi,
    functionName: 'redeem',
    args: [toBigInt(_shares), receiver!, receiver!],
  })

  return useWrite(
    {
      ...config,
      enabled: enabled && shares > 0 && !!receiver,
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
