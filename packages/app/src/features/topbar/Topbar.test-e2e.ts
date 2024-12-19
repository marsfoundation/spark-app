import { MyPortfolioPageObject } from '@/pages/MyPortfolio.PageObject'
import { overrideAirdropInfoRoute } from '@/test/e2e/airdropInfo'
import { DEFAULT_BLOCK_NUMBER } from '@/test/e2e/constants'
import { setup } from '@/test/e2e/setup'
import { test } from '@playwright/test'
import { mainnet } from 'viem/chains'
import { TopbarPageObject } from './Topbar.PageObject'

test.describe('Topbar', () => {
  test.describe('Airdrop counter', () => {
    test('Disconnected', async ({ page }) => {
      const testContext = await setup(page, {
        blockchain: { blockNumber: DEFAULT_BLOCK_NUMBER, chainId: mainnet.id },
        initialPage: 'easyBorrow',
        account: {
          type: 'not-connected',
        },
      })

      const topbar = new TopbarPageObject(testContext)
      await topbar.expectAirdropCompactValue('0')
      await topbar.openAirdropDropdown()
      await topbar.expectAirdropPreciseValue('0.00 SPK')
    })

    test('Connected', async ({ page }) => {
      const testContext = await setup(page, {
        blockchain: { blockNumber: DEFAULT_BLOCK_NUMBER, chainId: mainnet.id },
        initialPage: 'easyBorrow',
        account: {
          type: 'connected-random',
        },
      })

      await overrideAirdropInfoRoute(page, { account: testContext.account })

      const topbar = new TopbarPageObject(testContext)
      await topbar.expectAirdropCompactValue('8.227M')
      await topbar.openAirdropDropdown()
      await topbar.expectAirdropPreciseValue('8,227,011.154')
    })

    test('Api error', async ({ page }) => {
      const testContext = await setup(page, {
        blockchain: { blockNumber: DEFAULT_BLOCK_NUMBER, chainId: mainnet.id },
        initialPage: 'easyBorrow',
        account: {
          type: 'connected-random',
        },
      })

      await overrideAirdropInfoRoute(page, { account: testContext.account, shouldFail: true })

      const topbar = new TopbarPageObject(testContext)
      await topbar.expectAirdropBadgeNotVisible()
    })

    test('Wallet with no airdrop', async ({ page }) => {
      const testContext = await setup(page, {
        blockchain: { blockNumber: DEFAULT_BLOCK_NUMBER, chainId: mainnet.id },
        initialPage: 'easyBorrow',
        account: {
          type: 'connected-random',
        },
      })

      await overrideAirdropInfoRoute(page, { account: testContext.account, noAirdrop: true })

      const topbar = new TopbarPageObject(testContext)
      await topbar.expectAirdropCompactValue('0')
      await topbar.openAirdropDropdown()
      await topbar.expectAirdropPreciseValue('0.00 SPK')
    })
  })

  test.describe('Rewards badge', () => {
    test('Displays total rewards in badge', async ({ page }) => {
      const testContext = await setup(page, {
        blockchain: {
          blockNumber: DEFAULT_BLOCK_NUMBER,
          chainId: mainnet.id,
        },
        initialPage: 'easyBorrow',
        account: {
          type: 'connected-address',
          address: '0xf8de75c7b95edb6f1e639751318f117663021cf0',
        },
      })

      const topbar = new TopbarPageObject(testContext)
      await topbar.expectClaimableRewardsValue('$29.72K')
    })

    test('Displays details in dropdown', async ({ page }) => {
      const testContext = await setup(page, {
        blockchain: {
          blockNumber: DEFAULT_BLOCK_NUMBER,
          chainId: mainnet.id,
        },
        initialPage: 'easyBorrow',
        account: {
          type: 'connected-address',
          address: '0xf8de75c7b95edb6f1e639751318f117663021cf0',
        },
      })

      const topbar = new TopbarPageObject(testContext)
      await topbar.openRewardsDropdown()

      await topbar.expectRewards([
        {
          tokenSymbol: 'wstETH',
          amount: '6.3697',
          amountUSD: '$29,717.60',
        },
      ])
    })

    test('Does not display badge when no rewards', async ({ page }) => {
      const testContext = await setup(page, {
        blockchain: {
          blockNumber: DEFAULT_BLOCK_NUMBER,
          chainId: mainnet.id,
        },
        initialPage: 'myPortfolio',
        account: {
          type: 'connected-random',
        },
      })

      const topbar = new TopbarPageObject(testContext)
      const myPortfolioPage = new MyPortfolioPageObject(testContext)

      await myPortfolioPage.expectPositionToBeEmpty() // waiting for reserves to load
      await topbar.expectRewardsBadgeNotVisible() // asserting that after reserves are loaded, rewards badge is not visible
    })
  })

  test.describe('Malformed localStorage', () => {
    test('Sandbox info in wagmi.store but not in zustand-app-store', async ({ page }) => {
      const testContext = await setup(page, {
        blockchain: { blockNumber: DEFAULT_BLOCK_NUMBER, chainId: mainnet.id },
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

      const topbar = new TopbarPageObject(testContext)
      await topbar.expectSavingsLinkVisible()
    })
  })
})
