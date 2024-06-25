import { psmActionsConfig } from '@/config/contracts-generated'
import { toBigInt } from '@/utils/bigNumber'
import { useQueryClient } from '@tanstack/react-query'
import { useAccount, useChainId, useConfig } from 'wagmi'
import { useContractAddress } from '../hooks/useContractAddress'
import { ensureConfigTypes, useWrite } from '../hooks/useWrite'
import { allowance } from '../market-operations/allowance/query'
import { BaseUnitNumber } from '../types/NumericValues'
import { Token } from '../types/Token'
import { balancesQueryKey } from '../wallet/balances'
import { calculateGemConversionFactor } from './utils/calculateGemConversionFactor'

export interface UseSwapAndDepositArgs {
  gem: Token
  assetsToken: Token
  gemAmount: BaseUnitNumber
  onTransactionSettled?: () => void
  enabled?: boolean
}

// @note: Swap `gem` for `assetsToken` in the PSM and deposit in the `vault`.
// @note: Assumes PSM swap rate between `assetsToken` and `gem` is 1:1 (No PSM fee).
export function useSwapAndDeposit({
  gem,
  assetsToken,
  gemAmount: _gemAmount,
  onTransactionSettled,
  enabled: _enabled = true,
}: UseSwapAndDepositArgs): ReturnType<typeof useWrite> {
  const client = useQueryClient()
  const wagmiConfig = useConfig()
  const chainId = useChainId()

  const psmActions = useContractAddress(psmActionsConfig.address)

  const { address: receiver } = useAccount()
  const gemAmount = toBigInt(_gemAmount)
  const gemConversionFactor = calculateGemConversionFactor({
    gemDecimals: gem.decimals,
    assetsTokenDecimals: assetsToken.decimals,
  })
  const assetsMinAmountOut = toBigInt(_gemAmount.multipliedBy(gemConversionFactor))

  const config = ensureConfigTypes({
    address: psmActions,
    abi: psmActionsConfig.abi,
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
          queryKey: balancesQueryKey({ chainId, account: receiver }),
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
