import { BASE_DEFAULT_BLOCK_NUMBER, DEFAULT_BLOCK_NUMBER, GNOSIS_DEFAULT_BLOCK_NUMBER } from '@/test/e2e/constants'
import { setup } from '@/test/e2e/setup'
import { test } from '@playwright/test'
import { base, gnosis, mainnet } from 'viem/chains'

import { SavingsPageObject } from './Savings.PageObject'

test.describe('Savings Mainnet', () => {
  test('guest state', async ({ page }) => {
    const testContext = await setup(page, {
      blockchain: { blockNumber: DEFAULT_BLOCK_NUMBER, chainId: mainnet.id },
      initialPage: 'savings',
      account: {
        type: 'not-connected',
      },
    })

    const savingsPage = new SavingsPageObject(testContext)

    await savingsPage.expectAPY('12.5%')
    await savingsPage.expectConnectWalletCTA()
  })

  test('calculates current value', async ({ page }) => {
    const testContext = await setup(page, {
      blockchain: { blockNumber: DEFAULT_BLOCK_NUMBER, chainId: mainnet.id },
      initialPage: 'savings',
      account: {
        type: 'connected-random',
        assetBalances: {
          sDAI: 100,
        },
      },
    })

    const savingsPage = new SavingsPageObject(testContext)

    await savingsPage.expectSavingsDaiBalance({
      sdaiBalance: '100.00',
      estimatedDaiValue: '112.55991',
    })
  })

  test('calculates current projections', async ({ page }) => {
    const testContext = await setup(page, {
      blockchain: { blockNumber: DEFAULT_BLOCK_NUMBER, chainId: mainnet.id },
      initialPage: 'savings',
      account: {
        type: 'connected-random',
        assetBalances: {
          sDAI: 100,
        },
      },
    })

    const savingsPage = new SavingsPageObject(testContext)

    await savingsPage.expectSavingDaiCurrentProjection('$1.01', '30-day')
    await savingsPage.expectSavingDaiCurrentProjection('$12.94', '1-year')
  })

  test('displays the total value of stablecoins in the wallet', async ({ page }) => {
    const testContext = await setup(page, {
      blockchain: { blockNumber: DEFAULT_BLOCK_NUMBER, chainId: mainnet.id },
      initialPage: 'savings',
      account: {
        type: 'connected-random',
        assetBalances: {
          DAI: 100,
          USDC: 100,
        },
      },
    })

    const savingsPage = new SavingsPageObject(testContext)

    await savingsPage.expectOpportunityStablecoinsAmount('~$200.00')
  })
})

test.describe('Savings Gnosis', () => {
  test('guest state', async ({ page }) => {
    const testContext = await setup(page, {
      blockchain: { blockNumber: GNOSIS_DEFAULT_BLOCK_NUMBER, chainId: gnosis.id },
      initialPage: 'savings',
      account: {
        type: 'not-connected',
      },
    })

    const savingsPage = new SavingsPageObject(testContext)

    await savingsPage.expectAPY('10.6%')
    await savingsPage.expectConnectWalletCTA()
  })

  test('calculates current value', async ({ page }) => {
    const testContext = await setup(page, {
      blockchain: { blockNumber: GNOSIS_DEFAULT_BLOCK_NUMBER, chainId: gnosis.id },
      initialPage: 'savings',
      account: {
        type: 'connected-random',
        assetBalances: {
          sDAI: 100,
        },
      },
    })

    const savingsPage = new SavingsPageObject(testContext)

    await savingsPage.expectSavingsDaiBalance({
      sdaiBalance: '100.00',
      estimatedDaiValue: '108.780942',
    })
  })

  test('calculates current projections', async ({ page }) => {
    const testContext = await setup(page, {
      blockchain: { blockNumber: GNOSIS_DEFAULT_BLOCK_NUMBER, chainId: gnosis.id },
      initialPage: 'savings',
      account: {
        type: 'connected-random',
        assetBalances: {
          sDAI: 100,
        },
      },
    })

    const savingsPage = new SavingsPageObject(testContext)

    await savingsPage.expectSavingDaiCurrentProjection('$0.95', '30-day')
    await savingsPage.expectSavingDaiCurrentProjection('$11.53', '1-year')
  })

  test('displays the total value of stablecoins in the wallet', async ({ page }) => {
    const testContext = await setup(page, {
      blockchain: { blockNumber: GNOSIS_DEFAULT_BLOCK_NUMBER, chainId: gnosis.id },
      initialPage: 'savings',
      account: {
        type: 'connected-random',
        assetBalances: {
          XDAI: 100,
        },
      },
    })

    const savingsPage = new SavingsPageObject(testContext)

    await savingsPage.expectOpportunityStablecoinsAmount('~$100.00')
  })
})

test.describe('Savings Base', () => {
  test('guest state', async ({ page }) => {
    const testContext = await setup(page, {
      blockchain: { blockNumber: BASE_DEFAULT_BLOCK_NUMBER, chainId: base.id },
      initialPage: 'savings',
      account: {
        type: 'not-connected',
      },
    })

    const savingsPage = new SavingsPageObject(testContext)

    await savingsPage.expectAPY('8.5%')
    await savingsPage.expectConnectWalletCTA()
  })

  test('calculates current value', async ({ page }) => {
    const testContext = await setup(page, {
      blockchain: { blockNumber: BASE_DEFAULT_BLOCK_NUMBER, chainId: base.id },
      initialPage: 'savings',
      account: {
        type: 'connected-random',
        assetBalances: {
          sUSDS: 100,
        },
      },
    })

    const savingsPage = new SavingsPageObject(testContext)

    await savingsPage.expectSavingsUsdsBalance({
      susdsBalance: '100.00',
      estimatedUsdsValue: '101.286547',
    })
  })

  test('calculates current projections', async ({ page }) => {
    const testContext = await setup(page, {
      blockchain: { blockNumber: BASE_DEFAULT_BLOCK_NUMBER, chainId: base.id },
      initialPage: 'savings',
      account: {
        type: 'connected-random',
        assetBalances: {
          sUSDS: 100,
        },
      },
    })

    const savingsPage = new SavingsPageObject(testContext)

    await savingsPage.expectSavingUsdsCurrentProjection('$0.68', '30-day')
    await savingsPage.expectSavingUsdsCurrentProjection('$8.61', '1-year')
  })

  test('displays the total value of stablecoins in the wallet', async ({ page }) => {
    const testContext = await setup(page, {
      blockchain: { blockNumber: BASE_DEFAULT_BLOCK_NUMBER, chainId: base.id },
      initialPage: 'savings',
      account: {
        type: 'connected-random',
        assetBalances: {
          USDC: 100,
          USDS: 100,
        },
      },
    })

    const savingsPage = new SavingsPageObject(testContext)

    await savingsPage.expectOpportunityStablecoinsAmount('~$200.00')
  })
})
