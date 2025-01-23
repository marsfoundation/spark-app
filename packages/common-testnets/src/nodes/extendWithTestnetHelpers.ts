import { assert } from '@marsfoundation/common-universal'
import { TestnetClient, TestnetClientHelperActions } from '../TestnetClient.js'

export function extendWithTestnetHelpers(
  c: Pick<TestnetClient, 'snapshot' | 'revert' | 'writeContract' | 'waitForTransactionReceipt'>,
): TestnetClientHelperActions {
  let baselineSnapshotId: string | undefined

  return {
    async baselineSnapshot() {
      assert(baselineSnapshotId === undefined, 'baseline snapshot already created')

      baselineSnapshotId = await c.snapshot()
    },
    async revertToBaseline() {
      assert(baselineSnapshotId !== undefined, 'baseline snapshot not created')

      baselineSnapshotId = await c.revert(baselineSnapshotId)
    },
    async assertWriteContract(args) {
      const txHash = await c.writeContract(args)

      const receipt = await c.waitForTransactionReceipt({
        hash: txHash,
      })

      const summaryText = args.functionName ? `${args.functionName} -- ${txHash}` : txHash

      assert(receipt.status === 'success', `Transaction failed: ${summaryText}`)

      return txHash
    },
  }
}
