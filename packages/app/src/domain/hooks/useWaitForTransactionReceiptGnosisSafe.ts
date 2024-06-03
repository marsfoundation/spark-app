import { useState } from 'react'
import invariant from 'tiny-invariant'
import { parseAbiItem } from 'viem'
import { getLogs } from 'viem/actions'
import {
  UseWaitForTransactionReceiptParameters,
  UseWaitForTransactionReceiptReturnType,
  useAccount,
  useClient,
  useWaitForTransactionReceipt,
  useWatchBlockNumber,
} from 'wagmi'

const executionSuccessEvent = parseAbiItem('event ExecutionSuccess(bytes32 txHash, uint256 payment)')

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

  const client = useClient()
  const [gnosisTxHash, setGnosisTxHash] = useState<`0x${string}` | undefined>()
  useWatchBlockNumber({
    emitOnBegin: true,
    enabled,
    async onBlockNumber(blockNumber) {
      if (!client) {
        return
      }

      const logs = await getLogs(client, {
        address,
        event: executionSuccessEvent,
        fromBlock: blockNumber - 10n,
        toBlock: blockNumber,
      })

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
