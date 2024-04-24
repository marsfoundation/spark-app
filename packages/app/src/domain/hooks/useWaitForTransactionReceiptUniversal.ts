import {
  useWaitForTransactionReceipt,
  UseWaitForTransactionReceiptParameters,
  UseWaitForTransactionReceiptReturnType,
} from 'wagmi'

import { useWaitForTransactionReceiptGnosisSafe } from './useWaitForTransactionReceiptGnosisSafe'
import { useWalletType } from './useWalletType'

/**
 * This will watch for tx receipt for both "normal" tx hashes and Gnosis Safe "subtransaction" hashes.
 * @note: Gnosis Safe tx can be sent as a subtx (just signed and later executed) or as a standalone tx
 * (signed and executed in one go). We have no way of knowing so we watch for both.
 */
export function useWaitForTransactionReceiptUniversal(
  args: UseWaitForTransactionReceiptParameters = {},
): UseWaitForTransactionReceiptReturnType & {
  txHash: `0x${string}` | undefined
} {
  const walletType = useWalletType()

  const gnosisTxReceipt = useWaitForTransactionReceiptGnosisSafe({
    ...args,
    hash: args.hash,
    query: {
      enabled: walletType === 'gnosis-safe',
    },
  })
  const receipt = useWaitForTransactionReceipt({
    ...args,
    hash: args.hash,
    query: {
      enabled: gnosisTxReceipt.data === undefined,
    },
  })

  if (gnosisTxReceipt.data) {
    return gnosisTxReceipt
  }

  return { ...receipt, txHash: args.hash }
}
