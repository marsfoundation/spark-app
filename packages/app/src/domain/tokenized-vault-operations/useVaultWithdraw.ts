import { toBigInt } from '@/utils/bigNumber'
import { useQueryClient } from '@tanstack/react-query'
import { useAccount, useChainId, useConfig } from 'wagmi'
import { ensureConfigTypes, useWrite } from '../hooks/useWrite'
import { BaseUnitNumber } from '../types/NumericValues'
import { balances } from '../wallet/balances'
import { Vault } from './types'

interface UseVaultWithdrawArgs {
  assetsAmount: BaseUnitNumber
  vault: Vault
  onTransactionSettled?: () => void
  enabled?: boolean
}

// @note: 'withdraw' vault function allows user to withdraw a specified amount
// of the underlying asset from the vault by burning the corresponding shares.
// Example: Withdraw X DAI by burning Y sDAI (useful is one want to withdraw exact number of DAI)
export function useVaultWithdraw({
  assetsAmount,
  vault,
  onTransactionSettled,
  enabled = true,
}: UseVaultWithdrawArgs): ReturnType<typeof useWrite> {
  const client = useQueryClient()
  const wagmiConfig = useConfig()
  const chainId = useChainId()

  const { address: receiver } = useAccount()

  const config = ensureConfigTypes({
    address: vault.address,
    abi: vault.abi,
    functionName: 'withdraw',
    args: [toBigInt(assetsAmount), receiver!, receiver!],
  })

  return useWrite(
    {
      ...config,
      enabled: enabled && assetsAmount.gt(0) && !!receiver,
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
