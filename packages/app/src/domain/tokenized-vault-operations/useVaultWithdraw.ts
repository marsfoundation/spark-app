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

interface UseVaultWithdrawArgs {
  vault: CheckedAddress
  assetsAmount: BaseUnitNumber
  receiver?: CheckedAddress
  mode: Mode
  reserveAddresses?: CheckedAddress[]
  onTransactionSettled?: () => void
  enabled?: boolean
}

// @note: 'withdraw' vault function allows user to withdraw a specified amount
// of the underlying asset from the vault by burning the corresponding shares.
// Without optional receiver, shares owner will be used as receiver.
// Providing receiver will allow to withdraw and send assets to a target address in one transaction.
// Example: Withdraw X DAI by burning Y sDAI (useful is one want to withdraw exact number of DAI)
export function useVaultWithdraw({
  vault,
  assetsAmount,
  receiver: _receiver,
  mode,
  reserveAddresses,
  onTransactionSettled,
  enabled = true,
}: UseVaultWithdrawArgs): ReturnType<typeof useWrite> {
  const client = useQueryClient()
  const chainId = useChainId()
  const { address: owner } = useAccount()

  const receiver = _receiver || owner

  return useWrite(
    {
      address: vault,
      abi: erc4626Abi,
      functionName: 'withdraw',
      args: [toBigInt(assetsAmount), receiver!, owner!],
      enabled: enabled && assetsAmount.gt(0) && !!receiver && !!owner,
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
