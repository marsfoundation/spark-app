import { DEFAULT_BLOCK_NUMBER } from '@/test/e2e/constants'
import { overrideInfoSkyRouteWithHAR } from '@/test/e2e/info-sky'
import { setup } from '@/test/e2e/setup'
import { test } from '@playwright/test'
import { mainnet } from 'viem/chains'
import { FarmsPageObject } from './Farms.PageObject'

test.describe('Farms', () => {
  let farmsPage: FarmsPageObject

  test.beforeEach(async ({ page }) => {
    const testContext = await setup(page, {
      blockchain: {
        blockNumber: DEFAULT_BLOCK_NUMBER,
        chainId: mainnet.id,
      },
      initialPage: 'farms',
      account: {
        type: 'not-connected',
      },
    })
    await overrideInfoSkyRouteWithHAR({ page, key: '1-sky-farm-with-8_51-apy' })

    farmsPage = new FarmsPageObject(testContext)
  })

  test('farms list', async () => {
    await farmsPage.expectInactiveFarms([
      { apy: '8.51%', staked: '0', rewardText: 'Earn SKY', stakeText: 'Deposit Stablecoins' },
      { staked: '0', rewardText: 'Earn Chronicle points', stakeText: 'Deposit Stablecoins' },
    ])

    await farmsPage.expectActiveFarmsListToBeEmpty()
  })
})
