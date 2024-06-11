import { psmActionsAbi } from '@/config/abis/psmActionsAbi'
import { toBigInt } from '@/utils/bigNumber'
import { useQueryClient } from '@tanstack/react-query'
import { useAccount, useChainId, useConfig } from 'wagmi'
import { ensureConfigTypes, useWrite } from '../hooks/useWrite'
import { CheckedAddress } from '../types/CheckedAddress'
import { BaseUnitNumber } from '../types/NumericValues'
import { Token } from '../types/Token'
import { balances } from '../wallet/balances'
import { calculateGemConversionFactor } from './utils/calculateGemConversionFactor'

export interface UseWithdrawAndSwapArgs {
  gem: Token
  assetsToken: Token
  psmActions: CheckedAddress
  gemAmountOut: BaseUnitNumber
  onTransactionSettled?: () => void
  enabled?: boolean
}

// @note: Withdraw a specified amount of output `gem` with a maximum limit of `savingsToken` (in DAI units).
// Use this if you want an exact amount of `gem` tokens out. IE pay someone 10k exactly.
// @note: Assumes PSM swap rate between `dai` and `gem` is 1:1.
export function UseWithdrawAndSwap({
  gem,
  assetsToken,
  psmActions,
  gemAmountOut: _gemAmountOut,
  onTransactionSettled,
  enabled: _enabled = true,
}: UseWithdrawAndSwapArgs): ReturnType<typeof useWrite> {
  const gemConversionFactor = calculateGemConversionFactor({ gem, assetsToken })

  const client = useQueryClient()
  const wagmiConfig = useConfig()
  const chainId = useChainId()

  const { address: receiver } = useAccount()
  const gemAmountOut = toBigInt(_gemAmountOut)
  const assetsMaxAmountIn = toBigInt(_gemAmountOut.multipliedBy(gemConversionFactor))

  const config = ensureConfigTypes({
    address: psmActions,
    abi: psmActionsAbi,
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
          queryKey: balances({ wagmiConfig, chainId, account: receiver }).queryKey,
        })

        onTransactionSettled?.()
      },
    },
  )
}
