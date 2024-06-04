import { skipToken, useQuery } from '@tanstack/react-query'
import invariant from 'tiny-invariant'
import { parseAbiItem } from 'viem'
import { getLogs, getTransactionReceipt, watchBlockNumber } from 'viem/actions'
import {
  UseWaitForTransactionReceiptParameters,
  UseWaitForTransactionReceiptReturnType,
  useAccount,
  useChainId,
  useClient,
} from 'wagmi'
import { waitForTransactionReceiptQueryKey } from 'wagmi/query'

const executionSuccessEvent = parseAbiItem('event ExecutionSuccess(bytes32 txHash, uint256 payment)')

/**
 * Like `useWaitForTransactionReceipt`, but works with Gnosis Safe "subtransaction" hashes.
 * It will watch events emitted by the sender (Gnosis Safe contract) and look for 'ExecutionSuccess' event with matching subtransaction hash.
 */
export function useWaitForTransactionReceiptGnosisSafe(
  args: UseWaitForTransactionReceiptParameters = {},
): UseWaitForTransactionReceiptReturnType {
  const { address } = useAccount()
  const client = useClient()
  const chainId = useChainId()

  const subTxHash = args.hash
  const enabled = Boolean(subTxHash && (args.query?.enabled ?? true))

  return useQuery({
    queryKey: [
      'gnosis-safe',
      ...waitForTransactionReceiptQueryKey({
        ...args,
        chainId: args.chainId ?? chainId,
      }),
    ],
    queryFn:
      !subTxHash || !client
        ? skipToken
        : async ({ signal }) => {
            const gnosisTxHash = await new Promise<`0x${string}`>((resolve, reject) => {
              const unwatch = watchBlockNumber(client, {
                emitOnBegin: true,
                async onBlockNumber(blockNumber) {
                  try {
                    const logs = await getLogs(client, {
                      address,
                      event: executionSuccessEvent,
                      fromBlock: blockNumber - 10n,
                      toBlock: blockNumber,
                    })

                    for (const log of logs) {
                      if (log.args.txHash === subTxHash) {
                        invariant(log.transactionHash, 'Transaction hash not found')

                        unwatch()
                        resolve(log.transactionHash)
                        return
                      }
                    }
                  } catch (error) {
                    unwatch()
                    reject(error)
                  }
                },
                async onError(error) {
                  unwatch()
                  reject(error)
                },
              })

              signal?.addEventListener('abort', () => {
                unwatch()
              })
            })

            return getTransactionReceipt(client, { ...args, hash: gnosisTxHash })
          },
    ...(args.query as any),
    enabled,
  }) as UseWaitForTransactionReceiptReturnType
}
