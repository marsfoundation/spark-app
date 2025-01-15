import { trackEvent } from '@/domain/analytics/mixpanel'
import { sanityCheckTx } from '@/domain/hooks/sanityChecks'
import { useOriginChainId } from '@/domain/hooks/useOriginChainId'
import { JSONStringifyRich } from '@/utils/object'
import { useOnDepsChange } from '@/utils/useOnDepsChange'
import { WalletCallReceipt } from 'viem'
import { WriteContractsParameters } from 'viem/experimental'
import { useWriteContracts } from 'wagmi/experimental'
import { useBatchStatus } from './useBatchStatus'

export type BatchWriteStatus =
  | { kind: 'disabled' }
  | { kind: 'ready' }
  | { kind: 'calls-sending' }
  | { kind: 'calls-confirming' }
  | { kind: 'success' }
  | { kind: 'error'; errorKind: 'batch-submission' | 'batch-confirmation'; error: Error }
  | { kind: 'error'; errorKind: 'batch-item-tx-reverted'; revertedTxIndex: number; error: Error }

export interface UseBatchWriteResult {
  write: () => void
  reset: () => void
  status: BatchWriteStatus
}

export interface UseBatchWriteCallbacks {
  onTransactionSettled?: (txReceipt: WalletCallReceipt<bigint, 'success' | 'reverted'>[]) => void
}

export interface UseBatchWriteParams {
  contracts: WriteContractsParameters['contracts']
  enabled?: boolean
  callbacks?: UseBatchWriteCallbacks
}

export function useBatchWrite({ contracts, enabled = true, callbacks = {} }: UseBatchWriteParams): UseBatchWriteResult {
  const chainId = useOriginChainId()

  const {
    writeContracts,
    data: writeContractsId,
    isSuccess: wasTxSent,
    status: writeContractsStatus,
    error: writeContractsError,
    reset,
  } = useWriteContracts()

  const {
    data: batchStatusData,
    status: batchStatusStatus,
    error: batchStatusError,
    isLoading: isBatchStatusLoading,
  } = useBatchStatus({ batchId: writeContractsId })

  useOnDepsChange(() => {
    if (batchStatusData?.status === 'CONFIRMED') {
      callbacks.onTransactionSettled?.(batchStatusData.receipts)
    }
  }, [batchStatusData?.status])

  const status = ((): BatchWriteStatus => {
    if (!enabled) {
      return { kind: 'disabled' }
    }

    if (writeContractsStatus === 'pending') {
      return { kind: 'calls-sending' }
    }

    if (writeContractsError) {
      return { kind: 'error', errorKind: 'batch-submission', error: writeContractsError }
    }

    if (wasTxSent && (isBatchStatusLoading || batchStatusData?.status === 'PENDING')) {
      return { kind: 'calls-confirming' }
    }

    if (wasTxSent && batchStatusError) {
      return { kind: 'error', errorKind: 'batch-confirmation', error: batchStatusError }
    }

    if (wasTxSent && batchStatusStatus === 'success') {
      if (batchStatusData.status === 'REVERTED') {
        return {
          kind: 'error',
          errorKind: 'batch-item-tx-reverted',
          revertedTxIndex: batchStatusData.revertedTxIndex,
          error: batchStatusData.error,
        }
      }

      return { kind: 'success' }
    }

    return { kind: 'ready' }
  })()

  const finalWrite = enabled
    ? () => {
        for (const contract of contracts) {
          sanityCheckTx({ address: contract.address, value: contract.value }, chainId)
        }

        trackEvent('tx-sent', {
          walletType: 'smart-wallet',
          args: JSONStringifyRich(contracts),
          chainId,
        })

        writeContracts({ contracts })
      }
    : () => {}

  return {
    reset,
    write: finalWrite,
    status,
  }
}
