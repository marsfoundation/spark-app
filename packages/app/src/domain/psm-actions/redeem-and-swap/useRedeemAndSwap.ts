import { psmActionsConfig } from '@/config/contracts-generated'
import { useContractAddress } from '@/domain/hooks/useContractAddress'
import { toBigInt } from '@/utils/bigNumber'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useAccount, useChainId, useConfig } from 'wagmi'
import { ensureConfigTypes, useWrite } from '../../hooks/useWrite'
import { BaseUnitNumber } from '../../types/NumericValues'
import { Token } from '../../types/Token'
import { balances } from '../../wallet/balances'
import { gemMinAmountOutQueryOptions } from './gemMinAmountOutQuery'

export interface UseRedeemAndSwapArgs {
  gem: Token
  assetsToken: Token
  sharesAmount: BaseUnitNumber
  onTransactionSettled?: () => void
  enabled?: boolean
}

// @note: Redeem a specified amount of `savingsToken` from the `savingsToken`
// for `dai` and swap for `gem` in the PSM. Use this if you want to withdraw everything.
// @note: Assumes PSM swap rate between `dai` and `gem` is 1:1.
export function UseRedeemAndSwap({
  gem,
  assetsToken,
  sharesAmount: _sharesAmount,
  onTransactionSettled,
  enabled: _enabled = true,
}: UseRedeemAndSwapArgs): ReturnType<typeof useWrite> {
  const client = useQueryClient()
  const wagmiConfig = useConfig()
  const chainId = useChainId()

  const psmActions = useContractAddress(psmActionsConfig.address)

  const { address: receiver } = useAccount()
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
  const enabled = _enabled && _sharesAmount.gt(0) && !!receiver && !!gemMinAmountOut

  return useWrite(
    {
      ...config,
      enabled,
    },
    {
      onTransactionSettled: async () => {
        void client.invalidateQueries({
          queryKey: balances({ wagmiConfig, chainId, account: receiver }).queryKey,
        })

        onTransactionSettled?.()
      },
    },
  )
}
