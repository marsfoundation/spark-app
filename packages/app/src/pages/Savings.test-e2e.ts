import { test } from '@playwright/test'
import { gnosis, mainnet } from 'viem/chains'

import { DEFAULT_BLOCK_NUMBER, GNOSIS_DEFAULT_BLOCK_NUMBER } from '@/test/e2e/constants'
import { setupFork } from '@/test/e2e/forking/setupFork'
import { setup } from '@/test/e2e/setup'

import { SavingsPageObject } from './Savings.PageObject'

test.describe('Savings Mainnet', () => {
  const fork = setupFork({ blockNumber: DEFAULT_BLOCK_NUMBER, chainId: mainnet.id })

  test('guest state', async ({ page }) => {
    await setup(page, fork, {
      initialPage: 'savings',
      account: {
        type: 'not-connected',
      },
    })

    const savingsPage = new SavingsPageObject(page)

    await savingsPage.expectAPY('5%')
    await savingsPage.expectConnectWalletCTA()
  })

  test('calculates current value', async ({ page }) => {
    await setup(page, fork, {
      initialPage: 'savings',
      account: {
        type: 'connected-random',
        assetBalances: {
          sDAI: 100,
        },
      },
    })

    const savingsPage = new SavingsPageObject(page)

    await savingsPage.expectCurrentWorth('107.1505')
  })

  test('calculates current projections', async ({ page }) => {
    await setup(page, fork, {
      initialPage: 'savings',
      account: {
        type: 'connected-random',
        assetBalances: {
          sDAI: 100,
        },
      },
    })

    const savingsPage = new SavingsPageObject(page)

    await savingsPage.expectCurrentProjection('$0.43', '30-day')
    await savingsPage.expectCurrentProjection('$5.36', '1-year')
  })

  test('displays the total value of stablecoins in the wallet', async ({ page }) => {
    await setup(page, fork, {
      initialPage: 'savings',
      account: {
        type: 'connected-random',
        assetBalances: {
          DAI: 100,
          USDC: 100,
        },
      },
    })

    const savingsPage = new SavingsPageObject(page)

    await savingsPage.expectOpportunityStablecoinsAmount('~$200.00')
  })
})

test.describe('Savings Gnosis', () => {
  const fork = setupFork({ blockNumber: GNOSIS_DEFAULT_BLOCK_NUMBER, chainId: gnosis.id, useTenderlyVnet: true })

  test('guest state', async ({ page }) => {
    await setup(page, fork, {
      initialPage: 'savings',
      account: {
        type: 'not-connected',
      },
    })

    const savingsPage = new SavingsPageObject(page)

    await savingsPage.expectAPY('10.6%')
    await savingsPage.expectConnectWalletCTA()
  })

  test('calculates current value', async ({ page }) => {
    await setup(page, fork, {
      initialPage: 'savings',
      account: {
        type: 'connected-random',
        assetBalances: {
          sDAI: 100,
        },
      },
    })

    const savingsPage = new SavingsPageObject(page)

    await savingsPage.expectCurrentWorth('108.780942')
  })

  test('calculates current projections', async ({ page }) => {
    await setup(page, fork, {
      initialPage: 'savings',
      account: {
        type: 'connected-random',
        assetBalances: {
          sDAI: 100,
        },
      },
    })

    const savingsPage = new SavingsPageObject(page)

    await savingsPage.expectCurrentProjection('$0.95', '30-day')
    await savingsPage.expectCurrentProjection('$11.53', '1-year')
  })

  test('displays the total value of stablecoins in the wallet', async ({ page }) => {
    await setup(page, fork, {
      initialPage: 'savings',
      account: {
        type: 'connected-random',
        assetBalances: {
          XDAI: 100,
        },
      },
    })

    const savingsPage = new SavingsPageObject(page)

    await savingsPage.expectOpportunityStablecoinsAmount('~$100.00')
  })
})
