import {
  ARBITRUM_DEFAULT_BLOCK_NUMBER,
  BASE_DEFAULT_BLOCK_NUMBER,
  DEFAULT_BLOCK_NUMBER,
  GNOSIS_DEFAULT_BLOCK_NUMBER,
  MOCK_SUSDC_ACTIVE_BLOCK_NUMBER,
} from '@/test/e2e/constants'
import { setup } from '@/test/e2e/setup'
import { test } from '@playwright/test'
import { arbitrum, base, gnosis, mainnet } from 'viem/chains'

import { SavingsPageObject } from './Savings.PageObject'

test.describe('Savings Mainnet', () => {
  test('guest state', async ({ page }) => {
    const testContext = await setup(page, {
      blockchain: { blockNumber: DEFAULT_BLOCK_NUMBER, chain: mainnet },
      initialPage: 'savings',
      account: {
        type: 'not-connected',
      },
    })

    const savingsPage = new SavingsPageObject(testContext)
    await savingsPage.clickSavingsNavigationItemAction('USDS')

    await savingsPage.expectDepositCtaPanelApy('12.5%')
    await savingsPage.expectConnectWalletCTA()
    await savingsPage.expectConvertStablesButtonToBeDisabled()
  })

  test('calculates current value', async ({ page }) => {
    const testContext = await setup(page, {
      blockchain: { blockNumber: DEFAULT_BLOCK_NUMBER, chain: mainnet },
      initialPage: 'savings',
      account: {
        type: 'connected-random',
        assetBalances: {
          sUSDS: 100,
        },
      },
    })

    const savingsPage = new SavingsPageObject(testContext)
    await savingsPage.clickSavingsNavigationItemAction('USDS')

    await savingsPage.expectSavingsAccountBalance({
      balance: '100.00',
      estimatedValue: '101.72587405',
    })
  })

  test('shows correct apy and projection', async ({ page }) => {
    const testContext = await setup(page, {
      blockchain: { blockNumber: DEFAULT_BLOCK_NUMBER, chain: mainnet },
      initialPage: 'savings',
      account: {
        type: 'connected-random',
        assetBalances: {
          sUSDS: 100,
        },
      },
    })

    const savingsPage = new SavingsPageObject(testContext)
    await savingsPage.clickSavingsNavigationItemAction('USDS')

    await savingsPage.expectAccountMainPanelApy('12.5%')
    await savingsPage.expectOneYearProjection('+12.72')
  })

  test('can switch between accounts', async ({ page }) => {
    const testContext = await setup(page, {
      blockchain: {
        chain: mainnet,
        blockNumber: MOCK_SUSDC_ACTIVE_BLOCK_NUMBER,
      },
      initialPage: 'savings',
      account: {
        type: 'connected-random',
        assetBalances: {
          ETH: 1,
          sUSDC: 10_000,
          sUSDS: 10_000,
          sDAI: 0,
        },
      },
    })

    const savingsPage = new SavingsPageObject(testContext)

    await savingsPage.clickSavingsNavigationItemAction('USDS')
    await savingsPage.expectNavigationItemBalance('USDS', '$10.34K')
    await savingsPage.expectSavingsAccountBalance({
      balance: '10,000.00',
      estimatedValue: '10,344.638455',
    })

    await savingsPage.clickSavingsNavigationItemAction('USDC')
    await savingsPage.expectNavigationItemBalance('USDC', '$10.34K')
    await savingsPage.expectSavingsAccountBalance({
      balance: '10,000.00',
      estimatedValue: '10,344.638455',
    })

    await savingsPage.clickSavingsNavigationItemAction('DAI')
    await savingsPage.expectNavigationItemBalanceToBeInvisible('DAI')
    await savingsPage.expectDepositCtaPanelApy('11.25%')
  })

  test('shows enabled convert stables button', async ({ page }) => {
    const testContext = await setup(page, {
      blockchain: { blockNumber: DEFAULT_BLOCK_NUMBER, chain: mainnet },
      initialPage: 'savings',
      account: {
        type: 'connected-random',
        assetBalances: {
          sUSDS: 100,
        },
      },
    })

    const savingsPage = new SavingsPageObject(testContext)
    await savingsPage.expectConvertStablesButtonToBeEnabled()
  })
})

test.describe('Savings Gnosis', () => {
  test('guest state', async ({ page }) => {
    const testContext = await setup(page, {
      blockchain: { blockNumber: GNOSIS_DEFAULT_BLOCK_NUMBER, chain: gnosis },
      initialPage: 'savings',
      account: {
        type: 'not-connected',
      },
    })

    const savingsPage = new SavingsPageObject(testContext)

    await savingsPage.expectDepositCtaPanelApy('10.6%')
    await savingsPage.expectConnectWalletCTA()
    await savingsPage.expectConvertStablesPanelToBeHidden()
  })

  test('calculates current value', async ({ page }) => {
    const testContext = await setup(page, {
      blockchain: { blockNumber: GNOSIS_DEFAULT_BLOCK_NUMBER, chain: gnosis },
      initialPage: 'savings',
      account: {
        type: 'connected-random',
        assetBalances: {
          sDAI: 100,
        },
      },
    })

    const savingsPage = new SavingsPageObject(testContext)

    await savingsPage.expectSavingsAccountBalance({
      balance: '100.00',
      estimatedValue: '108.780942',
    })
  })

  test('shows correct apy and projection', async ({ page }) => {
    const testContext = await setup(page, {
      blockchain: { blockNumber: GNOSIS_DEFAULT_BLOCK_NUMBER, chain: gnosis },
      initialPage: 'savings',
      account: {
        type: 'connected-random',
        assetBalances: {
          sDAI: 100,
        },
      },
    })

    const savingsPage = new SavingsPageObject(testContext)

    await savingsPage.expectAccountMainPanelApy('10.6%')
    await savingsPage.expectOneYearProjection('+11.53')
  })

  test('hides navigation when single account', async ({ page }) => {
    const testContext = await setup(page, {
      blockchain: { blockNumber: GNOSIS_DEFAULT_BLOCK_NUMBER, chain: gnosis },
      initialPage: 'savings',
      account: {
        type: 'connected-random',
        assetBalances: {
          sDAI: 100,
        },
      },
    })

    const savingsPage = new SavingsPageObject(testContext)
    await savingsPage.expectNavigationToBeInvisible()
  })
})

test.describe('Savings Base', () => {
  test('guest state', async ({ page }) => {
    const testContext = await setup(page, {
      blockchain: { blockNumber: BASE_DEFAULT_BLOCK_NUMBER, chain: base },
      initialPage: 'savings',
      account: {
        type: 'not-connected',
      },
    })

    const savingsPage = new SavingsPageObject(testContext)

    await savingsPage.expectDepositCtaPanelApy('8.5%')
    await savingsPage.expectConnectWalletCTA()
  })

  test('calculates current value', async ({ page }) => {
    const testContext = await setup(page, {
      blockchain: { blockNumber: BASE_DEFAULT_BLOCK_NUMBER, chain: base },
      initialPage: 'savings',
      account: {
        type: 'connected-random',
        assetBalances: {
          sUSDS: 100,
        },
      },
    })

    const savingsPage = new SavingsPageObject(testContext)

    await savingsPage.expectSavingsAccountBalance({
      balance: '100.00',
      estimatedValue: '101.28654604',
    })
  })

  test('shows correct apy and projection', async ({ page }) => {
    const testContext = await setup(page, {
      blockchain: { blockNumber: BASE_DEFAULT_BLOCK_NUMBER, chain: base },
      initialPage: 'savings',
      account: {
        type: 'connected-random',
        assetBalances: {
          sUSDS: 100,
        },
      },
    })

    const savingsPage = new SavingsPageObject(testContext)

    await savingsPage.expectAccountMainPanelApy('8.5%')
    await savingsPage.expectOneYearProjection('+8.61')
  })

  test('shows enabled convert stables button', async ({ page }) => {
    const testContext = await setup(page, {
      blockchain: { blockNumber: BASE_DEFAULT_BLOCK_NUMBER, chain: base },
      initialPage: 'savings',
      account: {
        type: 'connected-random',
        assetBalances: {
          sUSDS: 100,
        },
      },
    })

    const savingsPage = new SavingsPageObject(testContext)
    await savingsPage.expectConvertStablesButtonToBeEnabled()
  })
})

test.describe('Savings Arbitrum', () => {
  test('guest state', async ({ page }) => {
    const testContext = await setup(page, {
      blockchain: { blockNumber: ARBITRUM_DEFAULT_BLOCK_NUMBER, chain: arbitrum },
      initialPage: 'savings',
      account: {
        type: 'not-connected',
      },
    })

    const savingsPage = new SavingsPageObject(testContext)

    await savingsPage.expectDepositCtaPanelApy('8.75%')
    await savingsPage.expectConnectWalletCTA()
  })

  test('calculates current value', async ({ page }) => {
    const testContext = await setup(page, {
      blockchain: { blockNumber: ARBITRUM_DEFAULT_BLOCK_NUMBER, chain: arbitrum },
      initialPage: 'savings',
      account: {
        type: 'connected-random',
        assetBalances: {
          sUSDS: 100,
        },
      },
    })

    const savingsPage = new SavingsPageObject(testContext)

    await savingsPage.expectSavingsAccountBalance({
      balance: '100.00',
      estimatedValue: '103.69444434',
    })
  })

  test('shows correct apy and projection', async ({ page }) => {
    const testContext = await setup(page, {
      blockchain: { blockNumber: ARBITRUM_DEFAULT_BLOCK_NUMBER, chain: arbitrum },
      initialPage: 'savings',
      account: {
        type: 'connected-random',
        assetBalances: {
          sUSDS: 100,
        },
      },
    })

    const savingsPage = new SavingsPageObject(testContext)

    await savingsPage.expectAccountMainPanelApy('8.75%')
    await savingsPage.expectOneYearProjection('+9.07')
  })

  test('shows enabled convert stables button', async ({ page }) => {
    const testContext = await setup(page, {
      blockchain: { blockNumber: ARBITRUM_DEFAULT_BLOCK_NUMBER, chain: arbitrum },
      initialPage: 'savings',
      account: {
        type: 'connected-random',
        assetBalances: {
          sUSDS: 100,
        },
      },
    })

    const savingsPage = new SavingsPageObject(testContext)
    await savingsPage.expectConvertStablesButtonToBeEnabled()
  })
})
