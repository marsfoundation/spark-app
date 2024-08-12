import { migrationActionsAbi } from '@/config/abis/migrationActionsAbi'
import { MIGRATE_ACTIONS_ADDRESS } from '@/config/consts'
import { Mode } from '@/features/dialogs/savings/withdraw/types'
import { toBigInt } from '@/utils/bigNumber'
import { useQueryClient } from '@tanstack/react-query'
import { useAccount, useChainId } from 'wagmi'
import { useWrite } from '../hooks/useWrite'
import { allowanceQueryKey } from '../market-operations/allowance/query'
import { assertWithdraw } from '../savings/assertWithdraw'
import { CheckedAddress } from '../types/CheckedAddress'
import { BaseUnitNumber } from '../types/NumericValues'
import { getBalancesQueryKeyPrefix } from '../wallet/getBalancesQueryKeyPrefix'

export interface UseMigrateSDAIAssetsToNSTArgs {
  sDai: CheckedAddress
  nstAmount: BaseUnitNumber
  receiver?: CheckedAddress
  reserveAddresses?: CheckedAddress[]
  mode: Mode
  onTransactionSettled?: () => void
  enabled?: boolean
}

// @note: Migrates (withdraws) from sDai to a specified amount of NST.
export function useMigrateSDAIAssetsToNST({
  sDai,
  nstAmount,
  receiver: _receiver,
  reserveAddresses,
  mode,
  onTransactionSettled,
  enabled = true,
}: UseMigrateSDAIAssetsToNSTArgs): ReturnType<typeof useWrite> {
  const client = useQueryClient()
  const chainId = useChainId()
  const { address: owner } = useAccount()
  const receiver = _receiver || owner

  return useWrite(
    {
      address: MIGRATE_ACTIONS_ADDRESS,
      abi: migrationActionsAbi,
      functionName: 'migrateSDAIAssetsToNST',
      args: [receiver!, toBigInt(nstAmount)],
      enabled: enabled && nstAmount.gt(0) && !!receiver,
    },
    {
      onBeforeWrite: () => {
        assertWithdraw({ mode, receiver: _receiver, owner: owner!, tokenAddresses: reserveAddresses })
      },
      onTransactionSettled: async () => {
        void client.invalidateQueries({
          queryKey: getBalancesQueryKeyPrefix({ chainId, account: receiver }),
        })
        void client.invalidateQueries({
          queryKey: allowanceQueryKey({
            token: sDai,
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
