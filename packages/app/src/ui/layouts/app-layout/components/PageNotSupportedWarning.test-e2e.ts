import { test } from '@playwright/test'
import { gnosis } from 'viem/chains'

import { GNOSIS_DEFAULT_BLOCK_NUMBER } from '@/test/e2e/constants'
import { buildUrl, setup } from '@/test/e2e/setup'
import { PageNotSupportedWarningPageObject } from './PageNotSupportedWarning.PageObject'

test.describe('PageNotSupportedWarning', () => {
  test('Displays not supported warning on unsupported page', async ({ page }) => {
    const testContext = await setup(page, {
      blockchain: {
        blockNumber: GNOSIS_DEFAULT_BLOCK_NUMBER,
        chainId: gnosis.id,
      },
      initialPage: 'farms',
      account: {
        type: 'connected-random',
      },
    })

    const warning = new PageNotSupportedWarningPageObject(testContext)

    await warning.expectSwitchNetworkVisible()
  })

  test('Displays not supported warning on entering the unsupported page', async ({ page }) => {
    const testContext = await setup(page, {
      blockchain: {
        blockNumber: GNOSIS_DEFAULT_BLOCK_NUMBER,
        chainId: gnosis.id,
      },
      initialPage: 'savings',
      account: {
        type: 'connected-random',
      },
    })

    const warning = new PageNotSupportedWarningPageObject(testContext)

    await warning.expectSwitchNetworkNotVisible()

    await page.goto(buildUrl('farms'))

    await warning.expectSwitchNetworkVisible()
  })
})
