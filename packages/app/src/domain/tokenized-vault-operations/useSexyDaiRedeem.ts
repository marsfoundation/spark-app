import { savingsXDaiAdapterAbi, savingsXDaiAdapterAddress } from '@/config/contracts-generated'
import { toBigInt } from '@/utils/bigNumber'
import { useQueryClient } from '@tanstack/react-query'
import { gnosis } from 'viem/chains'
import { useAccount, useConfig } from 'wagmi'
import { ensureConfigTypes, useWrite } from '../hooks/useWrite'
import { allowance } from '../market-operations/allowance/query'
import { CheckedAddress } from '../types/CheckedAddress'
import { BaseUnitNumber } from '../types/NumericValues'
import { balancesQueryKey } from '../wallet/balances'

export interface UseSexyDaiRedeemArgs {
  sDai: CheckedAddress
  sharesAmount: BaseUnitNumber
  onTransactionSettled?: () => void
  enabled?: boolean
}

// @note: 'redeemXDAI' vault function allows user to redeem a specified amount of sDAI in exchange for the xDAI.
// Example: Redeem X sDAI to get Y xDAI (useful if one wants to withdraw all xDAI)
export function useSexyDaiRedeem({
  sDai,
  sharesAmount,
  onTransactionSettled,
  enabled: _enabled = true,
}: UseSexyDaiRedeemArgs): ReturnType<typeof useWrite> {
  const client = useQueryClient()
  const wagmiConfig = useConfig()

  const { address: receiver } = useAccount()

  const config = ensureConfigTypes({
    address: savingsXDaiAdapterAddress[gnosis.id],
    abi: savingsXDaiAdapterAbi,
    functionName: 'redeemXDAI',
    args: [toBigInt(sharesAmount), receiver!],
  })
  const enabled = _enabled && sharesAmount.gt(0) && !!receiver

  return useWrite(
    {
      ...config,
      enabled,
    },
    {
      onTransactionSettled: async () => {
        void client.invalidateQueries({
          queryKey: balancesQueryKey({ chainId: gnosis.id, account: receiver }),
        })
        void client.invalidateQueries({
          queryKey: allowance({
            wagmiConfig,
            chainId: gnosis.id,
            token: sDai,
            account: receiver!,
            spender: savingsXDaiAdapterAddress[gnosis.id],
          }).queryKey,
        })

        onTransactionSettled?.()
      },
    },
  )
}
