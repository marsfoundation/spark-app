import { savingsXDaiAdapterAbi, savingsXDaiAdapterAddress } from '@/config/contracts-generated'
import { toBigInt } from '@/utils/bigNumber'
import { useQueryClient } from '@tanstack/react-query'
import { gnosis } from 'viem/chains'
import { useAccount, useConfig } from 'wagmi'
import { ensureConfigTypes, useWrite } from '../hooks/useWrite'
import { BaseUnitNumber } from '../types/NumericValues'
import { balances } from '../wallet/balances'

interface UseSexyDaiWithdrawArgs {
  assetsAmount: BaseUnitNumber
  onTransactionSettled?: () => void
  enabled?: boolean
}

// @note: 'withdrawXDAI' function allows user to withdraw a specified amount
// of xDAI from the vault by burning the corresponding sDAI amount.
// Example: Withdraw X xDAI by burning Y sDAI (useful is one wants to withdraw exact number of xDAI)
export function useSexyDaiWithdraw({
  assetsAmount,
  onTransactionSettled,
  enabled = true,
}: UseSexyDaiWithdrawArgs): ReturnType<typeof useWrite> {
  const client = useQueryClient()
  const wagmiConfig = useConfig()

  const { address: receiver } = useAccount()

  const config = ensureConfigTypes({
    address: savingsXDaiAdapterAddress[gnosis.id],
    abi: savingsXDaiAdapterAbi,
    functionName: 'withdrawXDAI',
    args: [toBigInt(assetsAmount), receiver!],
  })

  return useWrite(
    {
      ...config,
      enabled: enabled && assetsAmount.gt(0) && !!receiver,
    },
    {
      onTransactionSettled: async () => {
        void client.invalidateQueries({
          queryKey: balances({ wagmiConfig, chainId: gnosis.id, account: receiver }).queryKey,
        })

        onTransactionSettled?.()
      },
    },
  )
}
