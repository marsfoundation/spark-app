import { migrationActionsAbi } from '@/config/abis/migrationActionsAbi'
import { MIGRATE_ACTIONS_ADDRESS } from '@/config/consts'
import { toBigInt } from '@/utils/bigNumber'
import { useQueryClient } from '@tanstack/react-query'
import { useAccount, useChainId } from 'wagmi'
import { useWrite } from '../hooks/useWrite'
import { allowanceQueryKey } from '../market-operations/allowance/query'
import { CheckedAddress } from '../types/CheckedAddress'
import { BaseUnitNumber } from '../types/NumericValues'
import { getBalancesQueryKeyPrefix } from '../wallet/getBalancesQueryKeyPrefix'

export interface useMigrateSDAISharesToSNSTArgs {
  sDai: CheckedAddress
  sDaiAmount: BaseUnitNumber
  onTransactionSettled?: () => void
  enabled?: boolean
}

// @note: Migrates (redeems) specified amount of sDai into NST. Use this if you want to migrate everything.
export function useMigrateSDAISharesToSNST({
  sDai,
  sDaiAmount,
  onTransactionSettled,
  enabled = true,
}: useMigrateSDAISharesToSNSTArgs): ReturnType<typeof useWrite> {
  const client = useQueryClient()
  const chainId = useChainId()
  const { address: owner } = useAccount()

  return useWrite(
    {
      address: MIGRATE_ACTIONS_ADDRESS,
      abi: migrationActionsAbi,
      functionName: 'migrateSDAISharesToSNST',
      args: [owner!, toBigInt(sDaiAmount)],
      enabled: enabled && sDaiAmount.gt(0) && !!owner,
    },
    {
      onTransactionSettled: async () => {
        void client.invalidateQueries({
          queryKey: getBalancesQueryKeyPrefix({ chainId, account: owner }),
        })
        void client.invalidateQueries({
          queryKey: allowanceQueryKey({
            token: sDai,
            spender: MIGRATE_ACTIONS_ADDRESS,
            account: owner!,
            chainId,
          }),
        })

        onTransactionSettled?.()
      },
    },
  )
}
