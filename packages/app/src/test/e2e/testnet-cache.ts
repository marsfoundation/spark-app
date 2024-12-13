import { randomHexId } from "@/utils/random"
import { TenderlyTestnetFactory, TestnetClient } from "@marsfoundation/common-testnets"
import { getEnv } from "@marsfoundation/common-nodejs/env"
import test from "@playwright/test"

interface TestnetContext {
  client: TestnetClient
  initialSnapshotId: string
  cleanup: () => Promise<void>
}

const testnetCache = new Map<string, TestnetContext>()

test.afterAll(async () => {
  await Promise.all(Array.from(testnetCache.values()).map(({ cleanup }) => cleanup()))
})

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

