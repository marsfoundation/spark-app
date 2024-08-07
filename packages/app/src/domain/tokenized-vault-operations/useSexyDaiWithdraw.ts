import { savingsXDaiAdapterAbi, savingsXDaiAdapterAddress } from '@/config/contracts-generated'
import { Mode } from '@/features/dialogs/savings/withdraw/types'
import { toBigInt } from '@/utils/bigNumber'
import { useQueryClient } from '@tanstack/react-query'
import { gnosis } from 'viem/chains'
import { useAccount, useConfig } from 'wagmi'
import { useWrite } from '../hooks/useWrite'
import { allowance } from '../market-operations/allowance/query'
import { assertNativeWithdraw } from '../savings/assertNativeWithdraw'
import { CheckedAddress } from '../types/CheckedAddress'
import { BaseUnitNumber } from '../types/NumericValues'
import { getBalancesQueryKeyPrefix } from '../wallet/getBalancesQueryKeyPrefix'

interface UseSexyDaiWithdrawArgs {
  sDai: CheckedAddress
  assetsAmount: BaseUnitNumber
  receiver?: CheckedAddress
  reserveAddresses?: CheckedAddress[]
  mode: Mode
  onTransactionSettled?: () => void
  enabled?: boolean
}

// @note: 'withdrawXDAI' function allows user to withdraw a specified amount
// of xDAI from the vault by burning the corresponding sDAI amount.
// Without optional receiver, shares owner will be used as receiver.
// Providing receiver will allow to withdraw and send assets to a target address in one transaction.
// Example: Withdraw X xDAI by burning Y sDAI (useful is one wants to withdraw exact number of xDAI)
export function useSexyDaiWithdraw({
  sDai,
  assetsAmount,
  receiver: _receiver,
  reserveAddresses,
  mode,
  onTransactionSettled,
  enabled = true,
}: UseSexyDaiWithdrawArgs): ReturnType<typeof useWrite> {
  const client = useQueryClient()
  const wagmiConfig = useConfig()
  const { address: owner } = useAccount()

  const receiver = _receiver || owner

  return useWrite(
    {
      address: savingsXDaiAdapterAddress[gnosis.id],
      abi: savingsXDaiAdapterAbi,
      functionName: 'withdrawXDAI',
      args: [toBigInt(assetsAmount), receiver!],
      enabled: enabled && assetsAmount.gt(0) && !!receiver,
    },
    {
      onBeforeWrite: () => {
        assertNativeWithdraw({ mode, receiver: _receiver, owner: owner!, reserveAddresses })
      },
      onTransactionSettled: async () => {
        void client.invalidateQueries({
          queryKey: getBalancesQueryKeyPrefix({ chainId: gnosis.id, account: owner }),
        })
        void client.invalidateQueries({
          queryKey: allowance({
            wagmiConfig,
            chainId: gnosis.id,
            token: sDai,
            account: owner!,
            spender: savingsXDaiAdapterAddress[gnosis.id],
          }).queryKey,
        })

        onTransactionSettled?.()
      },
    },
  )
}
