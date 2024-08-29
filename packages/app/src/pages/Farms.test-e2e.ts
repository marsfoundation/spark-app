import { NST_DEV_CHAIN_ID } from '@/config/chain/constants'
import { setupFork } from '@/test/e2e/forking/setupFork'
import { overrideInfoSkyRouteWithHAR } from '@/test/e2e/info-sky'
import { setup } from '@/test/e2e/setup'
import { test } from '@playwright/test'
import { FarmsPageObject } from './Farms.PageObject'

test.describe('Farms', () => {
  const fork = setupFork({ chainId: NST_DEV_CHAIN_ID })
  let farmsPage: FarmsPageObject

  test.beforeEach(async ({ page }) => {
    await setup(page, fork, {
      initialPage: 'farms',
      account: {
        type: 'not-connected',
      },
    })
    await overrideInfoSkyRouteWithHAR({ page, key: '1-ngt-farm-with-0-apy' })

    farmsPage = new FarmsPageObject(page)
  })

  test('farms list', async () => {
    await farmsPage.expectInactiveFarms([
      { apy: '0%', staked: '0', rewardText: 'Earn NGT', stakeText: 'Deposit Stablecoins' },
    ])

    await farmsPage.expectActiveFarmsListToBeEmpty()
  })
})
