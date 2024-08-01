import { Mode } from '@/features/dialogs/savings/withdraw/types'
import { toBigInt } from '@/utils/bigNumber'
import { useQueryClient } from '@tanstack/react-query'
import { erc4626Abi } from 'viem'
import { useAccount, useChainId } from 'wagmi'
import { useWrite } from '../hooks/useWrite'
import { assertNativeWithdraw } from '../savings/assertNativeWithdraw'
import { CheckedAddress } from '../types/CheckedAddress'
import { BaseUnitNumber } from '../types/NumericValues'
import { getBalancesQueryKeyPrefix } from '../wallet/getBalancesQueryKeyPrefix'

interface UseVaultRedeemArgs {
  vault: CheckedAddress
  sharesAmount: BaseUnitNumber
  receiver?: CheckedAddress
  mode: Mode
  reserveAddresses?: CheckedAddress[]
  onTransactionSettled?: () => void
  enabled?: boolean
}

// @note: 'redeem' vault function allows user to redeem a specified
// amount of shares in exchange for the underlying asset.
// Without optional receiver, shares owner will be used as receiver.
// Providing receiver will allow to redeem shares and send assets to a target address in one transaction.
// Example: Redeem X sDAI to get Y DAI (useful if one wants to withdraw all DAI)
export function useVaultRedeem({
  vault,
  sharesAmount,
  receiver: _receiver,
  mode,
  reserveAddresses,
  onTransactionSettled,
  enabled = true,
}: UseVaultRedeemArgs): ReturnType<typeof useWrite> {
  const client = useQueryClient()
  const chainId = useChainId()
  const { address: owner } = useAccount()

  const receiver = _receiver || owner

  return useWrite(
    {
      address: vault,
      abi: erc4626Abi,
      functionName: 'redeem',
      args: [toBigInt(sharesAmount), receiver!, owner!],
      enabled: enabled && sharesAmount.gt(0) && !!receiver && !!owner,
    },
    {
      onBeforeWrite: () => {
        assertNativeWithdraw({ mode, receiver: _receiver, owner: owner!, reserveAddresses })
      },
      onTransactionSettled: async () => {
        void client.invalidateQueries({
          queryKey: getBalancesQueryKeyPrefix({ chainId, account: owner }),
        })

        onTransactionSettled?.()
      },
    },
  )
}
