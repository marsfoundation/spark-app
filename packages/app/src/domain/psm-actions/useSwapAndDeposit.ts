import { psmActionsAbi } from '@/config/abis/psmActionsAbi'
import { toBigInt } from '@/utils/bigNumber'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useAccount, useChainId, useConfig } from 'wagmi'
import { ensureConfigTypes, useWrite } from '../hooks/useWrite'
import { allowance } from '../market-operations/allowance/query'
import { CheckedAddress } from '../types/CheckedAddress'
import { BaseUnitNumber } from '../types/NumericValues'
import { balances } from '../wallet/balances'
import { gemQueryOptions } from './gemQuery'

export interface UseSwapAndDepositArgs {
  psmActions: CheckedAddress
  gemAmount: BaseUnitNumber
  onTransactionSettled?: () => void
  enabled?: boolean
}

// @note: Swap `gem` for `dai` in the PSM and deposit in the `savingsToken`.
export function useSwapAndDeposit({
  psmActions,
  gemAmount: _gemAmount,
  onTransactionSettled,
  enabled: _enabled = true,
}: UseSwapAndDepositArgs): ReturnType<typeof useWrite> {
  const client = useQueryClient()
  const wagmiConfig = useConfig()
  const chainId = useChainId()

  const { address: receiver } = useAccount()
  const gemAmount = toBigInt(_gemAmount)
  const { data: gem } = useQuery(gemQueryOptions({ psmActions, chainId, config: wagmiConfig }))

  const config = ensureConfigTypes({
    address: psmActions,
    abi: psmActionsAbi,
    functionName: 'swapAndDeposit',
    args: [receiver!, gemAmount, gemAmount],
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
          queryKey: allowance({ wagmiConfig, chainId, token: gem!, account: receiver!, spender: psmActions }).queryKey,
        })

        onTransactionSettled?.()
      },
    },
  )
}
