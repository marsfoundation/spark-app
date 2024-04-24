import { useState } from 'react'
import invariant from 'tiny-invariant'
import { parseAbi } from 'viem'
import {
  useAccount,
  useWaitForTransactionReceipt,
  UseWaitForTransactionReceiptParameters,
  UseWaitForTransactionReceiptReturnType,
  useWatchContractEvent,
} from 'wagmi'

const gnosisAbi = parseAbi(['event ExecutionSuccess(bytes32 txHash, uint256 payment)'])

/**
 * Like `useWaitForTransactionReceipt`, but works with Gnosis Safe "subtransaction" hashes.
 * It will watch events emitted by the sender (Gnosis Safe contract) and look for 'ExecutionSuccess' event with matching subtransaction hash.
 */
export function useWaitForTransactionReceiptGnosisSafe(
  args: UseWaitForTransactionReceiptParameters = {},
): UseWaitForTransactionReceiptReturnType & {
  txHash: `0x${string}` | undefined
} {
  const { address } = useAccount()
  const enabled = args.query?.enabled ?? true
  const subTxHash = args.hash

  const [gnosisTxHash, setGnosisTxHash] = useState<`0x${string}` | undefined>()
  useWatchContractEvent({
    abi: gnosisAbi,
    address,
    eventName: 'ExecutionSuccess',
    enabled: enabled && !!address && !!subTxHash && gnosisTxHash === undefined,
    onLogs: (logs) => {
      if (gnosisTxHash) {
        return
      }

      for (const log of logs) {
        if (log.args.txHash === subTxHash) {
          invariant(log.transactionHash, 'Transaction hash not found')

          setGnosisTxHash(log.transactionHash)
          return
        }
      }
    },
  })

  const chainTx = useWaitForTransactionReceipt({
    ...args,
    hash: gnosisTxHash,
  })

  return {
    ...chainTx,
    txHash: gnosisTxHash,
  }
}
