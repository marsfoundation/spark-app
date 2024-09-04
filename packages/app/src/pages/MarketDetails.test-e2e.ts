import { expect, test } from '@playwright/test'
import { mainnet } from 'viem/chains'

import { DialogPageObject } from '@/features/dialogs/common/Dialog.PageObject'
import { CAP_AUTOMATOR_BLOCK_NUMBER } from '@/test/e2e/constants'
import { setupFork } from '@/test/e2e/forking/setupFork'
import { buildUrl, setup } from '@/test/e2e/setup'
import { screenshot } from '@/test/e2e/utils'

import { BorrowPageObject } from './Borrow.PageObject'
import { MarketDetailsPageObject } from './MarketDetails.PageObject'

const DAI = '0x6B175474E89094C44Da98b954EedeAC495271d0F'
const WETH = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'
const WEETH = '0xcd5fe23c85820f7b72d0926fc9b05b43e359b7ee'
const USDC = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'
const WBTC = '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599'

test.describe('Market details', () => {
  const fork = setupFork({
    blockNumber: CAP_AUTOMATOR_BLOCK_NUMBER,
    chainId: mainnet.id,
    simulationDateOverride: new Date(1724846808220),
  })

  test.describe('Market overview', () => {
    test('DAI', async ({ page }) => {
      await setup(page, fork, {
        initialPage: 'marketDetails',
        initialPageParams: { asset: DAI, chainId: fork.chainId.toString() },
        account: {
          type: 'not-connected',
        },
      })

      const marketDetailsPage = new MarketDetailsPageObject(page)
      await marketDetailsPage.expectMarketOverviewValue('Borrowed', '$909.6M')
      await marketDetailsPage.expectMarketOverviewValue('Market size', '$2.539B')
      await marketDetailsPage.expectMarketOverviewValue('Total available', '$1.63B')
      await marketDetailsPage.expectMarketOverviewValue('Utilization rate', '35.82%')
      await marketDetailsPage.expectMarketOverviewValue('Instantly available', '$44.01M')
      await marketDetailsPage.expectMarketOverviewValue('MakerDAO capacity', '$1.586B')

      await screenshot(page, 'market-details-dai')
    })

    test('WETH', async ({ page }) => {
      await setup(page, fork, {
        initialPage: 'marketDetails',
        initialPageParams: { asset: WETH, chainId: fork.chainId.toString() },
        account: {
          type: 'not-connected',
        },
      })

      const marketDetailsPage = new MarketDetailsPageObject(page)
      await marketDetailsPage.expectMarketOverviewValue('Market size', '$696.2M')
      await marketDetailsPage.expectMarketOverviewValue('Utilization rate', '81.98%')
      await marketDetailsPage.expectMarketOverviewValue('Borrowed', '$570.8M')
      await marketDetailsPage.expectMarketOverviewValue('Available', '$125.4M')

      await screenshot(page, 'market-details-weth')
    })
  })

  test.describe('Dialogs', () => {
    const initialDeposits = {
      wstETH: 10,
    }

    test('guest state', async ({ page }) => {
      await setup(page, fork, {
        initialPage: 'marketDetails',
        initialPageParams: { asset: DAI, chainId: fork.chainId.toString() },
        account: {
          type: 'not-connected',
        },
      })

      const marketDetailsPage = new MarketDetailsPageObject(page)

      await marketDetailsPage.expectToBeLoaded()

      await marketDetailsPage.expectConnectWalletButton()
      await marketDetailsPage.expectDialogButtonToBeInvisible('Lend')
      await marketDetailsPage.expectDialogButtonToBeInvisible('Deposit')
      await marketDetailsPage.expectDialogButtonToBeInvisible('Borrow')
    })

    test("can't deposit if not enough balance", async ({ page }) => {
      await setup(page, fork, {
        initialPage: 'marketDetails',
        initialPageParams: { asset: WETH, chainId: fork.chainId.toString() },
        account: {
          type: 'connected-random',
        },
      })

      const marketDetailsPage = new MarketDetailsPageObject(page)

      await marketDetailsPage.expectToBeLoaded()

      await marketDetailsPage.expectDialogButtonToBeInactive('Deposit')
    })

    test("can't lend if not enough balance", async ({ page }) => {
      await setup(page, fork, {
        initialPage: 'marketDetails',
        initialPageParams: { asset: DAI, chainId: fork.chainId.toString() },
        account: {
          type: 'connected-random',
        },
      })

      const marketDetailsPage = new MarketDetailsPageObject(page)

      await marketDetailsPage.expectToBeLoaded()

      await marketDetailsPage.expectDialogButtonToBeInactive('Lend')
    })

    test("can't borrow if not enough balance", async ({ page }) => {
      await setup(page, fork, {
        initialPage: 'marketDetails',
        initialPageParams: { asset: DAI, chainId: fork.chainId.toString() },
        account: {
          type: 'connected-random',
        },
      })

      const marketDetailsPage = new MarketDetailsPageObject(page)

      await marketDetailsPage.expectToBeLoaded()

      await marketDetailsPage.expectBorrowNotAvailableDisclaimer()
      await marketDetailsPage.expectDialogButtonToBeInvisible('Borrow')
    })

    test('opens dialogs for DAI', async ({ page }) => {
      await setup(page, fork, {
        initialPage: 'easyBorrow',
        account: {
          type: 'connected-random',
          assetBalances: {
            ...initialDeposits,
            DAI: 1000,
            sDAI: 1000,
          },
        },
      })

      const borrowPage = new BorrowPageObject(page)
      await borrowPage.depositWithoutBorrowActions({ ...initialDeposits })

      await page.goto(buildUrl('marketDetails', { asset: DAI, chainId: fork.chainId.toString() }))

      const marketDetailsPage = new MarketDetailsPageObject(page)

      await marketDetailsPage.openDialogAction('Lend')
      const lendDialog = new DialogPageObject(page, /Deposit/i)
      await lendDialog.expectDialogHeader('Deposit DAI')
      await lendDialog.closeDialog()

      await marketDetailsPage.openDialogAction('Deposit')
      const depositDialog = new DialogPageObject(page, /Deposit/i)
      await depositDialog.expectDialogHeader('Deposit sDAI')
      await depositDialog.closeDialog()

      await marketDetailsPage.openDialogAction('Borrow')
      const borrowDialog = new DialogPageObject(page, /Borrow/i)
      await borrowDialog.expectDialogHeader('Borrow DAI')
      await borrowDialog.closeDialog()
    })

    test('opens dialogs for WETH', async ({ page }) => {
      await setup(page, fork, {
        initialPage: 'easyBorrow',
        account: {
          type: 'connected-random',
          assetBalances: {
            ...initialDeposits,
            WETH: 10,
          },
        },
      })

      const borrowPage = new BorrowPageObject(page)
      await borrowPage.depositWithoutBorrowActions({ ...initialDeposits })

      await page.goto(buildUrl('marketDetails', { asset: WETH, chainId: fork.chainId.toString() }))

      const marketDetailsPage = new MarketDetailsPageObject(page)

      await marketDetailsPage.openDialogAction('Deposit')
      const lendDialog = new DialogPageObject(page, /Deposit/i)
      await lendDialog.expectDialogHeader('Deposit WETH')
      await lendDialog.closeDialog()

      await marketDetailsPage.openDialogAction('Borrow')
      const borrowDialog = new DialogPageObject(page, /Borrow/i)
      await borrowDialog.expectDialogHeader('Borrow WETH')
      await borrowDialog.closeDialog()
    })

    // @todo: this scenario is inaccurate, because user has only ETH - in future dialog should open on ETH tab
    test('opens dialogs for WETH when having only ETH', async ({ page }) => {
      await setup(page, fork, {
        initialPage: 'easyBorrow',
        account: {
          type: 'connected-random',
          assetBalances: {
            ...initialDeposits,
            ETH: 5,
          },
        },
      })

      const borrowPage = new BorrowPageObject(page)
      await borrowPage.depositWithoutBorrowActions({ ...initialDeposits })

      await page.goto(buildUrl('marketDetails', { asset: WETH, chainId: fork.chainId.toString() }))

      const marketDetailsPage = new MarketDetailsPageObject(page)

      await marketDetailsPage.expectWalletBalance('5.00 WETH')

      await marketDetailsPage.openDialogAction('Deposit')
      const lendDialog = new DialogPageObject(page, /Deposit/i)
      await lendDialog.expectDialogHeader('Deposit WETH')
      await lendDialog.closeDialog()

      await marketDetailsPage.openDialogAction('Borrow')
      const borrowDialog = new DialogPageObject(page, /Borrow/i)
      await borrowDialog.expectDialogHeader('Borrow WETH')
      await borrowDialog.closeDialog()
    })

    test('wallet displays sum of WETH and ETH', async ({ page }) => {
      await setup(page, fork, {
        initialPage: 'marketDetails',
        initialPageParams: {
          asset: WETH,
          chainId: fork.chainId.toString(),
        },
        account: {
          type: 'connected-random',
          assetBalances: {
            ...initialDeposits,
            ETH: 5,
            WETH: 10,
          },
        },
      })

      const marketDetailsPage = new MarketDetailsPageObject(page)

      await marketDetailsPage.expectWalletBalance('15.00 WETH')
    })
  })

  test.describe('Isolated assets', () => {
    const BLOCK_NUMBER_WITH_WEETH = 20118125n
    const fork = setupFork({ blockNumber: BLOCK_NUMBER_WITH_WEETH, chainId: mainnet.id })

    test('Correctly displays debt ceiling', async ({ page }) => {
      await setup(page, fork, {
        initialPage: 'marketDetails',
        initialPageParams: { asset: WEETH, chainId: fork.chainId.toString() },
        account: {
          type: 'not-connected',
        },
      })

      const marketDetailsPage = new MarketDetailsPageObject(page)
      await marketDetailsPage.expectDebt('$3.17M')
      await marketDetailsPage.expectDebtCeiling('$50M')
    })
  })

  test.describe('Errors', () => {
    const NOT_A_RESERVE = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'

    test('displays 404 page for unknown chain', async ({ page }) => {
      await setup(page, fork, {
        initialPage: 'marketDetails',
        initialPageParams: { asset: DAI, chainId: '12345' },
        account: {
          type: 'not-connected',
        },
      })

      const marketDetailsPage = new MarketDetailsPageObject(page)
      await marketDetailsPage.expect404()
    })

    test('displays 404 page for unknown asset', async ({ page }) => {
      await setup(page, fork, {
        initialPage: 'marketDetails',
        initialPageParams: { asset: NOT_A_RESERVE, chainId: fork.chainId.toString() },
        account: {
          type: 'not-connected',
        },
      })

      const marketDetailsPage = new MarketDetailsPageObject(page)
      await marketDetailsPage.expect404()
    })
  })

  test.describe('Cap automator', () => {
    test('WETH', async ({ page }) => {
      await setup(page, fork, {
        initialPage: 'marketDetails',
        initialPageParams: { asset: WETH, chainId: fork.chainId.toString() },
        account: {
          type: 'not-connected',
        },
      })

      const marketDetailsPage = new MarketDetailsPageObject(page)

      const supplyPanelLocator = marketDetailsPage.locateSupplyStatusPanel()
      await marketDetailsPage.expectPanelCap(supplyPanelLocator, '403.2K WETH')
      await marketDetailsPage.expectPanelMaxCap(supplyPanelLocator, '2M WETH')
      await marketDetailsPage.expectCooldownTimer(supplyPanelLocator, '0h 00m 00s')

      const borrowPanelLocator = marketDetailsPage.locateBorrowStatusPanel()
      await marketDetailsPage.expectPanelCap(borrowPanelLocator, '256K WETH')
      await marketDetailsPage.expectPanelMaxCap(borrowPanelLocator, '1M WETH')
      await marketDetailsPage.expectCooldownTimer(borrowPanelLocator, '0h 00m 00s')
    })

    test('DAI', async ({ page }) => {
      await setup(page, fork, {
        initialPage: 'marketDetails',
        initialPageParams: { asset: DAI, chainId: fork.chainId.toString() },
        account: {
          type: 'not-connected',
        },
      })

      const marketDetailsPage = new MarketDetailsPageObject(page)
      await expect(marketDetailsPage.locateSupplyStatusPanel()).not.toBeVisible()

      const borrowPanelLocator = marketDetailsPage.locateBorrowStatusPanel()
      await expect(borrowPanelLocator).toBeVisible()
      await expect(marketDetailsPage.locatePanelAutomatorCap(borrowPanelLocator)).not.toBeVisible()
      await expect(marketDetailsPage.locatePanelAutomatorMaxCap(borrowPanelLocator)).not.toBeVisible()

      const collateralPanelLocator = marketDetailsPage.locateCollateralStatusPanel()
      await marketDetailsPage.expectPanelCap(collateralPanelLocator, '57.24M sDAI')
      await marketDetailsPage.expectPanelMaxCap(collateralPanelLocator, '1B sDAI')
      await marketDetailsPage.expectCooldownTimer(collateralPanelLocator, '0h 00m 00s')
    })

    test('USDC', async ({ page }) => {
      await setup(page, fork, {
        initialPage: 'marketDetails',
        initialPageParams: { asset: USDC, chainId: fork.chainId.toString() },
        account: {
          type: 'not-connected',
        },
      })

      const marketDetailsPage = new MarketDetailsPageObject(page)
      await expect(marketDetailsPage.locateSupplyStatusPanel()).not.toBeVisible()

      const supplyPanelLocator = marketDetailsPage.locateSupplyStatusPanel()
      await expect(supplyPanelLocator).toBeVisible()
      await expect(marketDetailsPage.locatePanelAutomatorCap(supplyPanelLocator)).toBeVisible()
      await expect(marketDetailsPage.locatePanelAutomatorMaxCap(supplyPanelLocator)).not.toBeVisible()
      await expect(marketDetailsPage.locatePanelAutomatorCooldownTimer(supplyPanelLocator)).not.toBeVisible()

      const borrowPanelLocator = marketDetailsPage.locateBorrowStatusPanel()
      await marketDetailsPage.expectPanelCap(borrowPanelLocator, '7.678M USDC')
      await marketDetailsPage.expectPanelMaxCap(borrowPanelLocator, '57M USDC')
      await marketDetailsPage.expectCooldownTimer(borrowPanelLocator, '0h 00m 00s')
    })

    test('WBTC', async ({ page }) => {
      await setup(page, fork, {
        initialPage: 'marketDetails',
        initialPageParams: { asset: WBTC, chainId: fork.chainId.toString() },
        account: {
          type: 'not-connected',
        },
      })

      const marketDetailsPage = new MarketDetailsPageObject(page)

      const supplyPanelLocator = marketDetailsPage.locateSupplyStatusPanel()
      await marketDetailsPage.expectPanelCap(supplyPanelLocator, '4,780 WBTC')
      await marketDetailsPage.expectPanelMaxCap(supplyPanelLocator, '10K WBTC')
      await marketDetailsPage.expectCooldownTimer(supplyPanelLocator, '0h 00m 00s')

      await expect(marketDetailsPage.locateBorrowStatusPanel()).not.toBeVisible()
    })
  })
})
