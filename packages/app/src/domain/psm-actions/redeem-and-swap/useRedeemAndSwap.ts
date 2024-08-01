import { psmActionsConfig } from '@/config/contracts-generated'
import { useContractAddress } from '@/domain/hooks/useContractAddress'
import { allowanceQueryKey } from '@/domain/market-operations/allowance/query'
import { assertNativeWithdraw } from '@/domain/savings/assertNativeWithdraw'
import { CheckedAddress } from '@/domain/types/CheckedAddress'
import { getBalancesQueryKeyPrefix } from '@/domain/wallet/getBalancesQueryKeyPrefix'
import { Mode } from '@/features/dialogs/savings/withdraw/types'
import { toBigInt } from '@/utils/bigNumber'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useAccount, useChainId, useConfig } from 'wagmi'
import { useWrite } from '../../hooks/useWrite'
import { BaseUnitNumber } from '../../types/NumericValues'
import { Token } from '../../types/Token'
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

  return useWrite(
    {
      address: psmActions,
      abi: psmActionsConfig.abi,
      functionName: 'redeemAndSwap',
      args: [receiver!, sharesAmount, gemMinAmountOut!],
      enabled: enabled && _sharesAmount.gt(0) && !!receiver && !!gemMinAmountOut,
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
