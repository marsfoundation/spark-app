import { psmActionsConfig } from '@/config/contracts-generated'
import { toBigInt } from '@/utils/bigNumber'
import { useQueryClient } from '@tanstack/react-query'
import { useAccount, useChainId } from 'wagmi'
import { useContractAddress } from '../hooks/useContractAddress'
import { ensureConfigTypes, useWrite } from '../hooks/useWrite'
import { BaseUnitNumber } from '../types/NumericValues'
import { Token } from '../types/Token'
import { balancesQueryKey } from '../wallet/balances'
import { calculateGemConversionFactor } from './utils/calculateGemConversionFactor'

export interface UseWithdrawAndSwapArgs {
  gem: Token
  assetsToken: Token
  gemAmountOut: BaseUnitNumber
  onTransactionSettled?: () => void
  enabled?: boolean
}

// @note: Withdraw a specified amount of output `gem` with a maximum limit of `savingsToken` (in DAI units).
// Use this if you want an exact amount of `gem` tokens out. IE pay someone 10k exactly.
// @note: Assumes PSM swap rate between `dai` and `gem` is 1:1.
export function useWithdrawAndSwap({
  gem,
  assetsToken,
  gemAmountOut: _gemAmountOut,
  onTransactionSettled,
  enabled: _enabled = true,
}: UseWithdrawAndSwapArgs): ReturnType<typeof useWrite> {
  const client = useQueryClient()
  const chainId = useChainId()

  const psmActions = useContractAddress(psmActionsConfig.address)

  const { address: receiver } = useAccount()
  const gemAmountOut = toBigInt(_gemAmountOut)
  const gemConversionFactor = calculateGemConversionFactor({
    gemDecimals: gem.decimals,
    assetsTokenDecimals: assetsToken.decimals,
  })
  const assetsMaxAmountIn = toBigInt(_gemAmountOut.multipliedBy(gemConversionFactor))

  const config = ensureConfigTypes({
    address: psmActions,
    abi: psmActionsConfig.abi,
    functionName: 'withdrawAndSwap',
    args: [receiver!, gemAmountOut, assetsMaxAmountIn],
  })
  const enabled = _enabled && _gemAmountOut.gt(0) && !!receiver

  return useWrite(
    {
      ...config,
      enabled,
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
