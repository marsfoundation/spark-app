import { test } from '@playwright/test'

import { overrideAirdropInfoRoute } from '@/test/e2e/airdropInfo'
import { DEFAULT_BLOCK_NUMBER } from '@/test/e2e/constants'
import { setup } from '@/test/e2e/setup'
import { setupFork } from '@/test/e2e/setupFork'

import { NavbarPageObject } from './Navbar.PageObject'

test.describe('Navbar', () => {
  const fork = setupFork(DEFAULT_BLOCK_NUMBER)

  test.describe('Airdrop counter', () => {
    test('Disconnected', async ({ page }) => {
      await setup(page, fork, {
        initialPage: 'easyBorrow',
        account: {
          type: 'not-connected',
        },
      })

      const navbar = new NavbarPageObject(page)
      await navbar.expectAirdropCompactValue('0')
      await navbar.hoverOverAirdropBadge()
      await navbar.expectAirdropPreciseValue('0.00 SPK')
    })

    test('Connected', async ({ page }) => {
      const { account } = await setup(page, fork, {
        initialPage: 'easyBorrow',
        account: {
          type: 'connected',
        },
      })

      await overrideAirdropInfoRoute(page, account)

      const navbar = new NavbarPageObject(page)
      await navbar.expectAirdropCompactValue('3.734M')
      await navbar.hoverOverAirdropBadge()
      await navbar.expectAirdropPreciseValue('3,733,867.039 SPK')
    })
  })
})
