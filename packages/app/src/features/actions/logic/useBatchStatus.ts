import { UseQueryResult, queryOptions, skipToken, useQuery } from '@tanstack/react-query'
import { WalletCallReceipt } from 'viem'
import { Config, useConfig } from 'wagmi'
import { getCallsStatus } from 'wagmi/actions/experimental'

const BATCH_STATUS_REFETCH_INTERVAL = 1000

export interface UseBatchWriteParams {
  batchId: string | undefined
}

export type BatchStatusData =
  | {
      status: 'PENDING'
    }
  | {
      status: 'CONFIRMED'
      receipts: WalletCallReceipt<bigint, 'success'>[]
    }
  | {
      status: 'REVERTED'
      error: Error
    }

export function useBatchStatus({ batchId }: UseBatchWriteParams): UseQueryResult<BatchStatusData, Error> {
  const config = useConfig()
  return useQuery(batchStatusQueryOptions({ batchId, config }))
}

export interface BatchQueryOptionsParams extends UseBatchWriteParams {
  config: Config
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function batchStatusQueryOptions({ batchId, config }: BatchQueryOptionsParams) {
  return queryOptions({
    queryKey: batchStatusQueryKey(batchId),
    refetchInterval: (data) => (data.state.data?.status === 'CONFIRMED' ? false : BATCH_STATUS_REFETCH_INTERVAL),
    queryFn: batchId
      ? async () => {
          const callsStatus = await getCallsStatus(config, { id: batchId })

          if (callsStatus.status === 'PENDING') {
            return {
              status: 'PENDING',
            } as const
          }

          if (callsStatus.receipts?.some((receipt) => receipt.status === 'reverted')) {
            return {
              status: 'REVERTED',
              error: new Error('One of the batch transactions reverted'),
            } as const
          }

          return {
            status: 'CONFIRMED',
            receipts: callsStatus.receipts as WalletCallReceipt<bigint, 'success'>[],
          } as const
        }
      : skipToken,
  })
}

export function batchStatusQueryKey(batchId: string | undefined): unknown[] {
  return ['batch-status', batchId]
}
