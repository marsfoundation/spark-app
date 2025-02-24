import { sparkRewardsConfig } from '@/config/contracts-generated'
import { TestnetClient } from '@marsfoundation/common-testnets'
import { assert, CheckedAddress, NormalizedUnitNumber } from '@marsfoundation/common-universal'
import { encodeAbiParameters, encodeFunctionData, erc20Abi, keccak256, parseUnits } from 'viem'
import { mainnet } from 'viem/chains'
import { TOKENS_ON_FORK } from './constants'
import { TestContext } from './setup'

export interface SetSparkRewardParams {
  testContext: TestContext
  account: CheckedAddress
  token: keyof (typeof TOKENS_ON_FORK)[1]
  cumulativeAmount: NormalizedUnitNumber
}

export async function setSparkReward({
  testContext,
  account,
  token,
  cumulativeAmount,
}: SetSparkRewardParams): Promise<void> {
  const epoch = 1
  const { address: tokenAddress, decimals: tokenDecimals } = TOKENS_ON_FORK[1][token]
  const cumulativeAmountBigInt = parseUnits(cumulativeAmount.toFixed(), tokenDecimals)

  const { testnetController, page } = testContext

  const merkleRoot = keccak256(
    keccak256(
      encodeAbiParameters(
        [
          { type: 'uint256' }, // epoch
          { type: 'address' }, // account
          { type: 'address' }, // token
          { type: 'uint256' }, // cumulativeAmount
        ],
        [BigInt(epoch), account, tokenAddress, cumulativeAmountBigInt],
      ),
    ),
  )

  await assertSendTransaction(testnetController.client, {
    account: '0x4b340357aadd38403e5c8e64368fd502ed38df6a',
    data: encodeFunctionData({
      abi: sparkRewardsConfig.abi,
      functionName: 'setMerkleRoot',
      args: [merkleRoot],
    }),
    to: sparkRewardsConfig.address[mainnet.id],
    chain: null,
  })
  await testnetController.progressSimulation(5)

  const wallet = await testnetController.client.readContract({
    address: sparkRewardsConfig.address[mainnet.id],
    abi: sparkRewardsConfig.abi,
    functionName: 'wallet',
  })

  await testnetController.client.setErc20Balance(tokenAddress, wallet, cumulativeAmountBigInt)
  await testnetController.progressSimulation(5)

  await assertSendTransaction(testnetController.client, {
    account: '0x4b340357aadd38403e5c8e64368fd502ed38df6a',
    data: encodeFunctionData({
      abi: erc20Abi,
      functionName: 'approve',
      args: [sparkRewardsConfig.address[mainnet.id], cumulativeAmountBigInt],
    }),
    to: tokenAddress,
    chain: null,
  })
  await testnetController.progressSimulation(5)

  await page.route(
    `https://spark2-api.blockanalitica.com/api/v1/rewards/roots/${merkleRoot}/${account}/`,
    async (route) => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify([
          {
            root_hash: merkleRoot,
            epoch,
            wallet_address: account,
            token_address: tokenAddress,
            token_price: null,
            pending_amount: '0',
            pending_amount_normalized: '0',
            cumulative_amount: cumulativeAmountBigInt.toString(),
            cumulative_amount_normalized: cumulativeAmount.toFixed(),
            proof: [],
            restricted_country_codes: [],
          },
        ]),
      })
    },
  )
}

async function assertSendTransaction(
  testnetClient: TestnetClient,
  params: Parameters<TestnetClient['sendTransaction']>[0],
): Promise<void> {
  const hash = await testnetClient.sendTransaction(params)
  const { status } = await testnetClient.waitForTransactionReceipt({
    hash,
  })
  assert(status === 'success', 'Transaction failed')
}
