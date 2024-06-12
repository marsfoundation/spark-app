import { test } from '@playwright/test'
import { mainnet } from 'viem/chains'

import { overrideAirdropInfoRoute } from '@/test/e2e/airdropInfo'
import { DEFAULT_BLOCK_NUMBER } from '@/test/e2e/constants'
import { setup } from '@/test/e2e/setup'
import { setupFork } from '@/test/e2e/setupFork'

import { NavbarPageObject } from './Navbar.PageObject'

test.describe('Navbar', () => {
  const fork = setupFork({ blockNumber: DEFAULT_BLOCK_NUMBER, chainId: mainnet.id })

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

      await overrideAirdropInfoRoute(page, { account })

      const navbar = new NavbarPageObject(page)
      await navbar.expectAirdropCompactValue('7.841M')
      await navbar.hoverOverAirdropBadge()
      await navbar.expectAirdropPreciseValue('7,840,591')
    })

    test('Api error', async ({ page }) => {
      const { account } = await setup(page, fork, {
        initialPage: 'easyBorrow',
        account: {
          type: 'connected',
        },
      })

      await overrideAirdropInfoRoute(page, { account, shouldFail: true })

      const navbar = new NavbarPageObject(page)
      await navbar.expectAirdropBadgeNotVisible()
    })

    test('Wallet with no airdrop', async ({ page }) => {
      const { account } = await setup(page, fork, {
        initialPage: 'easyBorrow',
        account: {
          type: 'connected',
        },
      })

      await overrideAirdropInfoRoute(page, { account, noAirdrop: true })

      const navbar = new NavbarPageObject(page)
      await navbar.expectAirdropCompactValue('0')
      await navbar.hoverOverAirdropBadge()
      await navbar.expectAirdropPreciseValue('0.00 SPK')
    })
  })

  test.describe('Malformed localStorage', () => {
    test('Sandbox info in wagmi.store but not in zustand-app-store', async ({ page }) => {
      await setup(page, fork, {
        initialPage: 'easyBorrow',
        account: {
          type: 'not-connected',
        },
        skipInjectingNetwork: true,
      })
      await page.evaluate(() => {
        localStorage.setItem('wagmi.recentConnectorId', 'mock')
        localStorage.setItem('wagmi.io.metamask.disconnected', 'true')
        localStorage.setItem('wagmi.io.rabby.disconnected', 'true')
        localStorage.setItem('zustand-app-store', JSON.stringify({ state: {}, sandbox: {} }))
        localStorage.setItem('actionSettings', JSON.stringify({ preferPermits: true, exchangeMaxSlippage: '0.001' }))
        localStorage.setItem('compliance', JSON.stringify({ agreedToSAdresses: [] }))
        localStorage.setItem(
          'wagmi.store',
          JSON.stringify({
            state: { connections: { _type: 'Map', value: [] }, chainId: '30301713953503', current: null },
            version: 2,
          }),
        )
      })

      await page.reload()

      const navbar = new NavbarPageObject(page)
      await navbar.expectSavingsLinkVisible()
    })
  })
})
