import { trackEvent } from '@/domain/analytics/mixpanel'
import { sanityCheckTx } from '@/domain/hooks/sanityChecks'
import { useOriginChainId } from '@/domain/hooks/useOriginChainId'
import { JSONStringifyRich } from '@/utils/object'
import { useOnDepsChange } from '@/utils/useOnDepsChange'
import { WalletCallReceipt } from 'viem'
import { WriteContractsParameters } from 'viem/experimental'
import { useCallsStatus, useWriteContracts } from 'wagmi/experimental'

const CALLS_STATUS_REFETCH_INTERVAL = 1000

export type BatchedWriteStatus =
  | { kind: 'disabled' }
  | { kind: 'ready' }
  | { kind: 'calls-sending' }
  | { kind: 'calls-confirming' }
  | { kind: 'success' }
  | { kind: 'error'; errorKind: BatchedWriteErrorKind; error: Error }
export type BatchedWriteErrorKind = 'calls-submission' | 'calls-confirmation' | 'calls-member-tx-reverted'

export interface UseBatchedWriteResult {
  write: () => void
  reset: () => void
  status: BatchedWriteStatus
}

export interface UseBatchedWriteCallbacks {
  onTransactionSettled?: (txReceipt: WalletCallReceipt<bigint, 'success' | 'reverted'>[]) => void
}

export interface UseBatchedWriteParams {
  contracts: WriteContractsParameters['contracts']
  enabled?: boolean
  callbacks?: UseBatchedWriteCallbacks
}

export function useBatchedWrite({
  contracts,
  enabled = true,
  callbacks = {},
}: UseBatchedWriteParams): UseBatchedWriteResult {
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
    data: callsStatusData,
    status: callsStatusStatus,
    error: callsStatusError,
  } = useCallsStatus({
    id: writeContractsId as string,
    query: {
      enabled: writeContractsId !== undefined,
      refetchInterval: (data) => (data.state.data?.status === 'CONFIRMED' ? false : CALLS_STATUS_REFETCH_INTERVAL),
    },
  })

  useOnDepsChange(() => {
    if (callsStatusData?.receipts) {
      callbacks.onTransactionSettled?.(callsStatusData.receipts)
    }
  }, [callsStatusData?.receipts])

  const status = ((): BatchedWriteStatus => {
    if (!enabled) {
      return { kind: 'disabled' }
    }

    if (writeContractsStatus === 'pending') {
      return { kind: 'calls-sending' }
    }

    if (writeContractsError) {
      return { kind: 'error', errorKind: 'calls-submission', error: writeContractsError }
    }

    if (wasTxSent && (callsStatusStatus === 'pending' || callsStatusData?.status === 'PENDING')) {
      return { kind: 'calls-confirming' }
    }

    if (wasTxSent && callsStatusError) {
      return { kind: 'error', errorKind: 'calls-confirmation', error: callsStatusError }
    }

    if (wasTxSent && callsStatusStatus === 'success') {
      const receipts = callsStatusData?.receipts
      const revertedTxReceipt = receipts?.find((receipt) => receipt.status === 'reverted')
      if (revertedTxReceipt) {
        // @note: Consider more fine-grained error handling if safe ui is not enough for displaying detailed error
        return {
          kind: 'error',
          errorKind: 'calls-member-tx-reverted',
          error: new Error('One of the calls transaction reverted'),
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
