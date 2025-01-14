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
  | { kind: 'tx-sending' }
  | { kind: 'tx-confirming' }
  | { kind: 'success' }
  | { kind: 'error'; errorKind: BatchedWriteErrorKind; error: Error }
export type BatchedWriteErrorKind = 'tx-submission' | 'tx-confirmation' | 'tx-reverted'

export interface UseBatchedWriteResult {
  write: () => void
  reset: () => void
  status: BatchedWriteStatus
}

export interface UseBatchedWriteCallbacks {
  onTransactionSettled?: (txReceipt: WalletCallReceipt<bigint, 'success' | 'reverted'>[]) => void
}

export function useBatchedWrite(
  args: WriteContractsParameters & { enabled?: boolean },
  callbacks: UseBatchedWriteCallbacks = {},
): UseBatchedWriteResult {
  const chainId = useOriginChainId()
  const enabled = args.enabled ?? true

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
      return { kind: 'tx-sending' }
    }

    if (writeContractsError) {
      return { kind: 'error', errorKind: 'tx-submission', error: writeContractsError }
    }

    if (wasTxSent && (callsStatusStatus === 'pending' || callsStatusData?.status === 'PENDING')) {
      return { kind: 'tx-confirming' }
    }

    if (wasTxSent && callsStatusError) {
      return { kind: 'error', errorKind: 'tx-confirmation', error: callsStatusError }
    }

    if (wasTxSent && callsStatusStatus === 'success') {
      const receipts = callsStatusData?.receipts
      const revertedTxReceipt = receipts?.find((receipt) => receipt.status === 'reverted')
      if (revertedTxReceipt) {
        // @todo: Consider more fine-grained error handling if safe ui is not enough for displaying detailed error
        return { kind: 'error', errorKind: 'tx-reverted', error: new Error('Transaction reverted') }
      }

      return { kind: 'success' }
    }

    return { kind: 'ready' }
  })()

  const finalWrite = enabled
    ? () => {
        for (const contract of args.contracts) {
          sanityCheckTx({ address: contract.address, value: contract.value }, chainId)
        }

        trackEvent('tx-sent', {
          walletType: 'smart-wallet',
          args: JSONStringifyRich(args.contracts),
          chainId,
        })

        writeContracts(args)
      }
    : () => {}

  return {
    reset,
    write: finalWrite,
    status,
  }
}
