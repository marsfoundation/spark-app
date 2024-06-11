import { psmActionsAbi } from '@/config/abis/psmActionsAbi'
import { toBigInt } from '@/utils/bigNumber'
import { useQueryClient } from '@tanstack/react-query'
import { useAccount, useChainId, useConfig } from 'wagmi'
import { ensureConfigTypes, useWrite } from '../hooks/useWrite'
import { allowance } from '../market-operations/allowance/query'
import { CheckedAddress } from '../types/CheckedAddress'
import { BaseUnitNumber } from '../types/NumericValues'
import { Token } from '../types/Token'
import { balances } from '../wallet/balances'
import { calculateGemConversionFactor } from './utils/calculateGemConversionFactor'

export interface UseSwapAndDepositArgs {
  gem: Token
  assetsToken: Token
  psmActions: CheckedAddress
  gemAmount: BaseUnitNumber
  onTransactionSettled?: () => void
  enabled?: boolean
}

// @note: Swap `gem` for `assetsToken` in the PSM and deposit in the `vault`.
// @note: Assumes PSM swap rate between `assetsToken` and `gem` is 1:1 (No PSM fee).
export function useSwapAndDeposit({
  gem,
  assetsToken,
  psmActions,
  gemAmount: _gemAmount,
  onTransactionSettled,
  enabled: _enabled = true,
}: UseSwapAndDepositArgs): ReturnType<typeof useWrite> {
  const gemConversionFactor = calculateGemConversionFactor({
    gemDecimals: gem.decimals,
    assetsTokenDecimals: assetsToken.decimals,
  })
  const client = useQueryClient()
  const wagmiConfig = useConfig()
  const chainId = useChainId()

  const { address: receiver } = useAccount()
  const gemAmount = toBigInt(_gemAmount)
  const assetsMinAmountOut = toBigInt(_gemAmount.multipliedBy(gemConversionFactor))

  const config = ensureConfigTypes({
    address: psmActions,
    abi: psmActionsAbi,
    functionName: 'swapAndDeposit',
    args: [receiver!, gemAmount, assetsMinAmountOut],
  })
  const enabled = _enabled && _gemAmount.gt(0) && !!receiver

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
        void client.invalidateQueries({
          queryKey: allowance({ wagmiConfig, chainId, token: gem.address, account: receiver!, spender: psmActions })
            .queryKey,
        })

        onTransactionSettled?.()
      },
    },
  )
}
