import { psmActionsConfig } from '@/config/contracts-generated'
import { Mode } from '@/features/dialogs/savings/withdraw/types'
import { toBigInt } from '@/utils/bigNumber'
import { useQueryClient } from '@tanstack/react-query'
import { useAccount, useChainId } from 'wagmi'
import { useContractAddress } from '../hooks/useContractAddress'
import { useWrite } from '../hooks/useWrite'
import { allowanceQueryKey } from '../market-operations/allowance/query'
import { assertNativeWithdraw } from '../savings/assertNativeWithdraw'
import { CheckedAddress } from '../types/CheckedAddress'
import { BaseUnitNumber } from '../types/NumericValues'
import { Token } from '../types/Token'
import { getBalancesQueryKeyPrefix } from '../wallet/getBalancesQueryKeyPrefix'
import { calculateGemConversionFactor } from './utils/calculateGemConversionFactor'

export interface UseWithdrawAndSwapArgs {
  gem: Token
  assetsToken: Token
  gemAmountOut: BaseUnitNumber
  receiver?: CheckedAddress
  mode: Mode
  reserveAddresses?: CheckedAddress[]
  onTransactionSettled?: () => void
  enabled?: boolean
}

// @note: Withdraw a specified amount of output `gem` with a maximum limit of `savingsToken` (in DAI units).
// Without optional receiver, shares owner will be used as receiver.
// Providing receiver will allow to withdraw, swap, and send gem tokens to a target address in one transaction.
// Use this if you want an exact amount of `gem` tokens out. IE pay someone 10k exactly.
// @note: Assumes PSM swap rate between `dai` and `gem` is 1:1.
export function useWithdrawAndSwap({
  gem,
  assetsToken,
  gemAmountOut: _gemAmountOut,
  receiver: _receiver,
  mode,
  reserveAddresses,
  onTransactionSettled,
  enabled = true,
}: UseWithdrawAndSwapArgs): ReturnType<typeof useWrite> {
  const client = useQueryClient()
  const chainId = useChainId()
  const { address: owner } = useAccount()

  const psmActions = useContractAddress(psmActionsConfig.address)

  const receiver = _receiver || owner

  const gemAmountOut = toBigInt(_gemAmountOut)
  const gemConversionFactor = calculateGemConversionFactor({
    gemDecimals: gem.decimals,
    assetsTokenDecimals: assetsToken.decimals,
  })
  const assetsMaxAmountIn = toBigInt(_gemAmountOut.multipliedBy(gemConversionFactor))

  return useWrite(
    {
      address: psmActions,
      abi: psmActionsConfig.abi,
      functionName: 'withdrawAndSwap',
      args: [receiver!, gemAmountOut, assetsMaxAmountIn],
      enabled: enabled && _gemAmountOut.gt(0) && !!receiver,
    },
    {
      onBeforeWrite: () => {
        assertNativeWithdraw({ mode, receiver: _receiver, owner: owner!, reserveAddresses })
      },
      onTransactionSettled: async () => {
        void client.invalidateQueries({
          queryKey: getBalancesQueryKeyPrefix({ chainId, account: owner }),
        })
        void client.invalidateQueries({
          queryKey: allowanceQueryKey({ token: assetsToken.address, spender: psmActions, account: owner!, chainId }),
        })

        onTransactionSettled?.()
      },
    },
  )
}
