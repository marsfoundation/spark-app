import { migrationActionsAbi } from '@/config/abis/migrationActionsAbi'
import { toBigInt } from '@/utils/bigNumber'
import { useQueryClient } from '@tanstack/react-query'
import { Address } from 'viem'
import { useAccount, useChainId } from 'wagmi'
import { ensureConfigTypes, useWrite } from '../hooks/useWrite'
import { allowanceQueryKey } from '../market-operations/allowance/query'
import { BaseUnitNumber } from '../types/NumericValues'
import { getBalancesQueryKeyPrefix } from '../wallet/getBalancesQueryKeyPrefix'
import { MIGRATE_ACTIONS_ADDRESS } from './constants'

export interface UseMigrateDAIToSNSTArgs {
  dai: Address
  daiAmount: BaseUnitNumber
  onTransactionSettled?: () => void
  enabled?: boolean
}

// @note: Migrates (deposits) a specified amount of dai into a new savings token (sNST).
export function useMigrateDAIToSNST({
  dai,
  daiAmount,
  onTransactionSettled,
  enabled = true,
}: UseMigrateDAIToSNSTArgs): ReturnType<typeof useWrite> {
  const client = useQueryClient()
  const chainId = useChainId()
  const { address: receiver } = useAccount()

  const config = ensureConfigTypes({
    address: MIGRATE_ACTIONS_ADDRESS,
    abi: migrationActionsAbi,
    functionName: 'migrateDAIToSNST',
    args: [receiver!, toBigInt(daiAmount)],
  })

  return useWrite(
    {
      ...config,
      enabled: enabled && daiAmount.gt(0) && !!receiver,
    },
    {
      onTransactionSettled: async () => {
        void client.invalidateQueries({
          queryKey: getBalancesQueryKeyPrefix({ chainId, account: receiver }),
        })
        void client.invalidateQueries({
          queryKey: allowanceQueryKey({
            token: dai,
            spender: MIGRATE_ACTIONS_ADDRESS,
            account: receiver!,
            chainId,
          }),
        })

        onTransactionSettled?.()
      },
    },
  )
}
