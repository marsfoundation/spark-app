import { useQueryClient } from '@tanstack/react-query'
import { Address } from 'viem'
import { useConfig } from 'wagmi'

import { debtTokenAbi } from '@/config/abis/debtTokenAbi'
import { useWrite, UseWriteCallbacks } from '@/domain/hooks/useWrite'

import { toBigInt } from '../../utils/bigNumber'
import { BaseUnitNumber } from '../types/NumericValues'
import { useConnectedAddress } from '../wallet/useConnectedAddress'
import { borrowAllowance } from './borrow-allowance/query'

export interface UseApproveDelegationParams {
  debtTokenAddress: Address
  delegatee: Address
  value: BaseUnitNumber
  enabled?: boolean
}

export function useApproveDelegation(
  { debtTokenAddress, delegatee, value: _value, enabled = true }: UseApproveDelegationParams,
  callbacks: UseWriteCallbacks = {},
): ReturnType<typeof useWrite> {
  const client = useQueryClient()
  const value = toBigInt(_value)
  const { account, chainId } = useConnectedAddress()
  const wagmiConfig = useConfig()

  return useWrite(
    {
      address: debtTokenAddress,
      abi: debtTokenAbi,
      functionName: 'approveDelegation',
      args: [delegatee, value],
      enabled: value > 0n && enabled,
    },
    {
      ...callbacks,
      onTransactionSettled: () => {
        void client.invalidateQueries({
          queryKey: borrowAllowance({ wagmiConfig, fromUser: account, toUser: delegatee, debtTokenAddress, chainId })
            .queryKey,
        })

        callbacks.onTransactionSettled?.()
      },
    },
  )
}
