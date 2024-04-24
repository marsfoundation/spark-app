import { test } from '@playwright/test'

import { DEFAULT_BLOCK_NUMBER } from '@/test/e2e/constants'
import { setup } from '@/test/e2e/setup'
import { setupFork } from '@/test/e2e/setupFork'

import { SavingsPageObject } from './Savings.PageObject'

test.describe('Savings', () => {
  const fork = setupFork(DEFAULT_BLOCK_NUMBER)

  test('guest state', async ({ page }) => {
    await setup(page, fork, {
      initialPage: 'savings',
      account: {
        type: 'not-connected',
      },
    })

    const savingsPage = new SavingsPageObject(page)

    await savingsPage.expectDSR('5%')
    await savingsPage.expectConnectWalletCTA()
  })

  test('calculates current value', async ({ page }) => {
    await setup(page, fork, {
      initialPage: 'savings',
      account: {
        type: 'connected',
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
        type: 'connected',
        assetBalances: {
          sDAI: 100,
        },
      },
    })

    const savingsPage = new SavingsPageObject(page)

    await savingsPage.expectCurrentProjection('$0.43', '30-day')
    await savingsPage.expectCurrentProjection('$5.36', '1-year')
  })

  test('calculates opportunity projections', async ({ page }) => {
    await setup(page, fork, {
      initialPage: 'savings',
      account: {
        type: 'connected',
        assetBalances: {
          DAI: 100,
          USDC: 100,
        },
      },
    })

    const savingsPage = new SavingsPageObject(page)

    await savingsPage.expectPotentialProjection('$0.80', '30-day')
    await savingsPage.expectPotentialProjection('$10.00', '1-year')
  })
})
