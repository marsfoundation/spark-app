import { toBigInt } from '@/utils/bigNumber'
import { useQueryClient } from '@tanstack/react-query'
import { erc4626Abi } from 'viem'
import { useAccount, useChainId } from 'wagmi'
import { ensureConfigTypes, useWrite } from '../hooks/useWrite'
import { CheckedAddress } from '../types/CheckedAddress'
import { BaseUnitNumber } from '../types/NumericValues'
import { balancesQueryKey } from '../wallet/balances'

interface UseVaultWithdrawArgs {
  vault: CheckedAddress
  assetsAmount: BaseUnitNumber
  onTransactionSettled?: () => void
  enabled?: boolean
}

// @note: 'withdraw' vault function allows user to withdraw a specified amount
// of the underlying asset from the vault by burning the corresponding shares.
// Example: Withdraw X DAI by burning Y sDAI (useful is one want to withdraw exact number of DAI)
export function useVaultWithdraw({
  vault,
  assetsAmount,
  onTransactionSettled,
  enabled = true,
}: UseVaultWithdrawArgs): ReturnType<typeof useWrite> {
  const client = useQueryClient()
  const chainId = useChainId()

  const { address: receiver } = useAccount()

  const config = ensureConfigTypes({
    address: vault,
    abi: erc4626Abi,
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
          queryKey: balancesQueryKey({ chainId, account: receiver }),
        })

        onTransactionSettled?.()
      },
    },
  )
}
