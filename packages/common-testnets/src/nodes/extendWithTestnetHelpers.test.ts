import { CheckedAddress } from '@marsfoundation/common-universal'
import { expect } from 'earl'
import { erc20Abi, parseEther } from 'viem'
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts'
import { TestnetClient } from '../TestnetClient.js'
import { createTestnetFactoriesForE2ETests } from '../test-utils/index.js'
import { extendWithTestnetHelpers } from './extendWithTestnetHelpers.js'

describe(extendWithTestnetHelpers.name, () => {
  const factories = createTestnetFactoriesForE2ETests()

  for (const factory of factories.slice(0, 1)) {
    describe(factory.constructor.name, () => {
      let testnetClient: TestnetClient
      let cleanup: () => Promise<void>

      before(async () => {
        ;({ client: testnetClient, cleanup } = await factory.create({
          id: 'test',
          originChainId: 1,
          forkChainId: 1,
          blockNumber: 21439277n,
        }))
        await testnetClient.baselineSnapshot()
      })
      after(async () => {
        await cleanup()
      })
      beforeEach(async () => {
        await testnetClient.revertToBaseline()
      })

      it('asserts that transaction was mined successfully', async () => {
        const usds = CheckedAddress('0xdc035d45d973e3ec169d2276ddab16f1e407384f')
        const account = privateKeyToAccount(generatePrivateKey())

        await testnetClient.setBalance(account.address, parseEther('1'))

        await expect(() =>
          testnetClient.assertWriteContract({
            address: usds,
            abi: erc20Abi,
            functionName: 'transfer',
            args: [CheckedAddress.random('alice'), 100n],
            account,
            gas: 100_000n,
          }),
        ).toBeRejectedWith('Transaction failed: transfer')
      })
    })
  }
})
