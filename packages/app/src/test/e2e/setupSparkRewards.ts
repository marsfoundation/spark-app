import { setSparkRewards } from '@/domain/spark-rewards/setSparkRewards'
import { CheckedAddress, NormalizedUnitNumber, raise } from '@marsfoundation/common-universal'
import { mainnet } from 'viem/chains'
import { TOKENS_ON_FORK } from './constants'
import { TestContext } from './setup'

export interface SetupSparkRewardsParams {
  testContext: TestContext
  account: CheckedAddress
  rewardsConfig: {
    rewardTokenSymbol: keyof (typeof TOKENS_ON_FORK)[typeof mainnet.id]
    cumulativeAmount: NormalizedUnitNumber
    rewardTokenPrice?: NormalizedUnitNumber
  }[]
}

export async function setupSparkRewards({
  testContext,
  account,
  rewardsConfig,
}: SetupSparkRewardsParams): Promise<void> {
  const epoch = 1
  const rewards = rewardsConfig.map(({ rewardTokenSymbol, rewardTokenPrice, cumulativeAmount }) => {
    const tokenConfig = TOKENS_ON_FORK[mainnet.id][rewardTokenSymbol]

    return {
      tokenSymbol: rewardTokenSymbol,
      tokenAddress: CheckedAddress(tokenConfig.address),
      rewardTokenPrice,
      cumulativeAmount,
      cumulativeAmountBaseUnit: NormalizedUnitNumber.toBaseUnit(cumulativeAmount, tokenConfig.decimals),
    }
  })

  const { testnetController, page } = testContext

  const { merkleRoot, proofs } = await setSparkRewards({
    testnetClient: testnetController.client,
    account,
    rewards: rewards.map(({ tokenAddress, cumulativeAmountBaseUnit }) => ({
      token: tokenAddress,
      cumulativeAmount: cumulativeAmountBaseUnit,
    })),
    afterTx: async () => {
      await testnetController.progressSimulation(5)
    },
  })

  await page.route(
    `https://spark2-api.blockanalitica.com/api/v1/rewards/roots/${merkleRoot}/${account}/`,
    async (route) => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify(
          rewards.map(
            ({ tokenAddress, tokenSymbol, rewardTokenPrice, cumulativeAmount, cumulativeAmountBaseUnit }) => ({
              root_hash: merkleRoot,
              epoch,
              wallet_address: account,
              token_address: tokenAddress,
              token_price: rewardTokenPrice?.toFixed() ?? null,
              pending_amount: '0',
              pending_amount_normalized: '0',
              cumulative_amount: cumulativeAmountBaseUnit.toFixed(),
              cumulative_amount_normalized: cumulativeAmount,
              proof:
                proofs.find(({ token }) => token === tokenAddress)?.proof ??
                raise(`Proof for token ${tokenSymbol} not found`),
              restricted_country_codes: [],
            }),
          ),
        ),
      })
    },
  )
}
