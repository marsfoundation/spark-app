import { savingsXDaiAdapterAbi, savingsXDaiAdapterAddress } from '@/config/contracts-generated'
import { toBigInt } from '@/utils/bigNumber'
import { useQueryClient } from '@tanstack/react-query'
import { gnosis } from 'viem/chains'
import { useAccount } from 'wagmi'
import { useWrite } from '../hooks/useWrite'
import { BaseUnitNumber } from '../types/NumericValues'
import { getBalancesQueryKeyPrefix } from '../wallet/getBalancesQueryKeyPrefix'

export interface UseSexyDaiDepositArgs {
  value: BaseUnitNumber
  onTransactionSettled?: () => void
  enabled?: boolean
}

export function useSexyDaiDeposit({
  value: _value,
  onTransactionSettled,
  enabled: _enabled = true,
}: UseSexyDaiDepositArgs): ReturnType<typeof useWrite> {
  const client = useQueryClient()

  const { address: receiver } = useAccount()
  const value = toBigInt(_value)

  const enabled = _enabled && value > 0 && !!receiver

  return useWrite(
    {
      address: savingsXDaiAdapterAddress[gnosis.id],
      abi: savingsXDaiAdapterAbi,
      functionName: 'depositXDAI',
      args: [receiver!],
      value,
      enabled,
    },
    {
      onTransactionSettled: async () => {
        void client.invalidateQueries({
          queryKey: getBalancesQueryKeyPrefix({ chainId: gnosis.id, account: receiver }),
        })

        onTransactionSettled?.()
      },
    },
  )
}
