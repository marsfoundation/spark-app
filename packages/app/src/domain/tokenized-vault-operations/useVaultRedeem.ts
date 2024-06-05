import { toBigInt } from '@/utils/bigNumber'
import { useQueryClient } from '@tanstack/react-query'
import { useAccount, useChainId, useConfig } from 'wagmi'
import { ensureConfigTypes, useWrite } from '../hooks/useWrite'
import { BaseUnitNumber } from '../types/NumericValues'
import { balances } from '../wallet/balances'
import { Vault } from './types'

interface UseVaultRedeemArgs {
  sharesAmount: BaseUnitNumber
  vault: Vault
  onTransactionSettled?: () => void
  enabled?: boolean
}

// @note: 'redeem' vault function allows user to redeem a specified
// amount of shares in exchange for the underlying asset.
// Example: Redeem X sDAI to get Y DAI (useful if one want to withdraw all DAI)
export function useVaultRedeem({
  sharesAmount,
  vault,
  onTransactionSettled,
  enabled = true,
}: UseVaultRedeemArgs): ReturnType<typeof useWrite> {
  const client = useQueryClient()
  const wagmiConfig = useConfig()
  const chainId = useChainId()

  const { address: receiver } = useAccount()

  const config = ensureConfigTypes({
    address: vault.address,
    abi: vault.abi,
    functionName: 'redeem',
    args: [toBigInt(sharesAmount), receiver!, receiver!],
  })

  return useWrite(
    {
      ...config,
      enabled: enabled && sharesAmount.gt(0) && !!receiver,
    },
    {
      onTransactionSettled: async () => {
        void client.invalidateQueries({
          queryKey: balances({ wagmiConfig, chainId, account: receiver }).queryKey,
        })

        onTransactionSettled?.()
      },
    },
  )
}
