import { useQueryClient } from '@tanstack/react-query'
import { Address } from 'viem'
import { useConfig } from 'wagmi'

import { NATIVE_ASSET_MOCK_ADDRESS } from '@/config/consts'
import { UseWriteCallbacks, useWrite } from '@/domain/hooks/useWrite'

import { toBigInt } from '../../utils/bigNumber'
import { BaseUnitNumber } from '../types/NumericValues'
import { useConnectedAddress } from '../wallet/useConnectedAddress'
import { allowance } from './allowance/query'
import { normalizeErc20AbiForToken } from './normalizeErc20Abi'

export interface UseApproveArgs {
  token: Address
  spender: Address
  value: BaseUnitNumber
  enabled?: boolean
}

export function useApprove(
  { token, spender, value: _value, enabled = true }: UseApproveArgs,
  callbacks: UseWriteCallbacks = {},
): ReturnType<typeof useWrite> {
  const client = useQueryClient()
  const value = toBigInt(_value)
  const { account, chainId } = useConnectedAddress()
  const wagmiConfig = useConfig()

  return useWrite(
    {
      address: token,
      abi: normalizeErc20AbiForToken(chainId, token),
      functionName: 'approve',
      args: [spender, value],
      enabled: value > 0n && token !== NATIVE_ASSET_MOCK_ADDRESS && enabled,
    },
    {
      ...callbacks,
      onTransactionSettled: () => {
        void client.invalidateQueries({
          queryKey: allowance({ wagmiConfig, token, spender, account, chainId }).queryKey,
        })

        callbacks.onTransactionSettled?.()
      },
    },
  )
}
