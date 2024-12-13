import { randomHexId } from "@/utils/random"
import { TenderlyTestnetFactory, TestnetClient } from "@marsfoundation/common-testnets"
import { getEnv } from "@marsfoundation/common-nodejs/env"

interface TestnetContext {
  client: TestnetClient
  initialSnapshotId: string
  cleanup: () => Promise<void>
}

const testnetCache = new Map<string, TestnetContext>()

;([`exit`, `SIGINT`, `SIGUSR1`, `SIGUSR2`, `uncaughtException`, `SIGTERM`].forEach((eventType) => {
  process.on(eventType, () => {
    const keys = Array.from(testnetCache.keys())
    keys.forEach(key => {
      const context = testnetCache.get(key)!
      testnetCache.delete(key)
      context.cleanup()
    })
  });
}))

export async function getTestnetContext({ chainId, blockNumber }: { chainId: number, blockNumber: bigint }) {
  const key = `${chainId}-${blockNumber.toString()}`
  if (testnetCache.has(key)) {
    return testnetCache.get(key)!
  }

  const env = getEnv()
  const factory = new TenderlyTestnetFactory({
    account: env.string('TENDERLY_ACCOUNT'),
    project: env.string('TENDERLY_PROJECT'),
    apiKey: env.string('TENDERLY_API_KEY'),
  })

  const testnetId = randomHexId()
  const { client, cleanup } = await factory.create({
    id: `test-e2e-${testnetId}`,
    displayName: `Spark E2E Testnet ${testnetId}`,
    forkChainId: chainId,
    originChainId: chainId,
    blockNumber,
  })

  const initialSnapshotId = await client.snapshot()

  const context: TestnetContext = {
    client,
    initialSnapshotId,
    cleanup,
  }

  testnetCache.set(key, context)

  return context
}

