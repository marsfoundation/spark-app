import { savingsXDaiAdapterAbi, savingsXDaiAdapterAddress } from '@/config/contracts-generated'
import { Mode } from '@/features/dialogs/savings/withdraw/types'
import { toBigInt } from '@/utils/bigNumber'
import { useQueryClient } from '@tanstack/react-query'
import { gnosis } from 'viem/chains'
import { useAccount, useConfig } from 'wagmi'
import { useWrite } from '../hooks/useWrite'
import { allowance } from '../market-operations/allowance/query'
import { assertWithdraw } from '../savings/assertWithdraw'
import { CheckedAddress } from '../types/CheckedAddress'
import { BaseUnitNumber } from '../types/NumericValues'
import { getBalancesQueryKeyPrefix } from '../wallet/getBalancesQueryKeyPrefix'

export interface UseSexyDaiRedeemArgs {
  sDai: CheckedAddress
  sharesAmount: BaseUnitNumber
  receiver?: CheckedAddress
  reserveAddresses?: CheckedAddress[]
  mode: Mode
  onTransactionSettled?: () => void
  enabled?: boolean
}

// @note: 'redeemXDAI' vault function allows user to redeem a specified amount of sDAI in exchange for the xDAI.
// Without optional receiver, shares owner will be used as receiver.
// Providing receiver will allow to redeem sDAI and send xDAI to a target address in one transaction.
// Example: Redeem X sDAI to get Y xDAI (useful if one wants to withdraw all xDAI)
export function useSexyDaiRedeem({
  sDai,
  sharesAmount,
  receiver: _receiver,
  reserveAddresses,
  mode,
  onTransactionSettled,
  enabled = true,
}: UseSexyDaiRedeemArgs): ReturnType<typeof useWrite> {
  const client = useQueryClient()
  const wagmiConfig = useConfig()
  const { address: owner } = useAccount()

  const receiver = _receiver || owner

  return useWrite(
    {
      address: savingsXDaiAdapterAddress[gnosis.id],
      abi: savingsXDaiAdapterAbi,
      functionName: 'redeemXDAI',
      args: [toBigInt(sharesAmount), receiver!],
      enabled: enabled && sharesAmount.gt(0) && !!receiver,
    },
    {
      onBeforeWrite: () => {
        assertWithdraw({ mode, receiver: _receiver, owner: owner!, tokenAddresses: reserveAddresses })
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
