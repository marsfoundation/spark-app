import { psmActionsConfig } from '@/config/contracts-generated'
import { useContractAddress } from '@/domain/hooks/useContractAddress'
import { assertNativeWithdraw } from '@/domain/savings/assertNativeWithdraw'
import { CheckedAddress } from '@/domain/types/CheckedAddress'
import { Mode } from '@/features/dialogs/savings/withdraw/types'
import { toBigInt } from '@/utils/bigNumber'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useAccount, useChainId, useConfig } from 'wagmi'
import { ensureConfigTypes, useWrite } from '../../hooks/useWrite'
import { BaseUnitNumber } from '../../types/NumericValues'
import { Token } from '../../types/Token'
import { balancesQueryKey } from '../../wallet/balances'
import { gemMinAmountOutQueryOptions } from './gemMinAmountOutQuery'

export interface UseRedeemAndSwapArgs {
  gem: Token
  assetsToken: Token
  sharesAmount: BaseUnitNumber
  receiver?: CheckedAddress
  reserveAddresses?: CheckedAddress[]
  mode: Mode
  onTransactionSettled?: () => void
  enabled?: boolean
}

// @note: Redeem a specified amount of `savingsToken` from the `savingsToken`
// for `dai` and swap for `gem` in the PSM. Use this if you want to withdraw everything.
// Without optional receiver, shares owner will be used as receiver.
// Providing receiver will allow to redeem shares, swap, and send gem tokens to a target address in one transaction.
// @note: Assumes PSM swap rate between `dai` and `gem` is 1:1.
export function useRedeemAndSwap({
  gem,
  assetsToken,
  sharesAmount: _sharesAmount,
  receiver: _receiver,
  reserveAddresses,
  mode,
  onTransactionSettled,
  enabled = true,
}: UseRedeemAndSwapArgs): ReturnType<typeof useWrite> {
  const client = useQueryClient()
  const wagmiConfig = useConfig()
  const chainId = useChainId()
  const { address: owner } = useAccount()

  assertNativeWithdraw({ mode, receiver: _receiver, owner, reserveAddresses })

  const psmActions = useContractAddress(psmActionsConfig.address)

  const receiver = _receiver || owner

  const sharesAmount = toBigInt(_sharesAmount)
  const { data: gemMinAmountOut } = useQuery(
    gemMinAmountOutQueryOptions({
      gemDecimals: gem.decimals,
      assetsTokenDecimals: assetsToken.decimals,
      psmActions,
      sharesAmount: _sharesAmount,
      chainId,
      config: wagmiConfig,
    }),
  )

  const config = ensureConfigTypes({
    address: psmActions,
    abi: psmActionsConfig.abi,
    functionName: 'redeemAndSwap',
    args: [receiver!, sharesAmount, gemMinAmountOut!],
  })

  return useWrite(
    {
      ...config,
      enabled: enabled && _sharesAmount.gt(0) && !!receiver && !!gemMinAmountOut,
    },
    {
      onTransactionSettled: async () => {
        void client.invalidateQueries({
          queryKey: balancesQueryKey({ chainId, account: owner }),
        })

        onTransactionSettled?.()
      },
    },
  )
}
