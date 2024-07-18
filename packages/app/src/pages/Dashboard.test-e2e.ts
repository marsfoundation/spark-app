import { test } from '@playwright/test'
import { mainnet } from 'viem/chains'

import { DEFAULT_BLOCK_NUMBER } from '@/test/e2e/constants'
import { setupFork } from '@/test/e2e/forking/setupFork'
import { setup } from '@/test/e2e/setup'
import { calculateAssetsWorth, screenshot } from '@/test/e2e/utils'

import { BorrowPageObject } from './Borrow.PageObject'
import { DashboardPageObject } from './Dashboard.PageObject'

test.describe('Dashboard', () => {
  const fork = setupFork({ blockNumber: DEFAULT_BLOCK_NUMBER, chainId: mainnet.id })

  test.skip('guest state', async ({ page }) => {
    await setup(page, fork, {
      account: {
        type: 'not-connected',
      },
      initialPage: 'dashboard',
    })
    const dashboardPage = new DashboardPageObject(page)

    await dashboardPage.expectGuestScreen()

    await screenshot(page, 'dashboard-guest')
  })

  test('empty account', async ({ page }) => {
    await setup(page, fork, {
      initialPage: 'dashboard',
      account: {
        type: 'connected-random',
      },
    })
    const dashboardPage = new DashboardPageObject(page)

    await dashboardPage.expectPositionToBeEmpty()

    await screenshot(page, 'dashboard-empty-account')
  })

  test('no position', async ({ page }) => {
    const assetBalances = {
      ETH: 1,
      DAI: 200,
      sDAI: 300,
      USDC: 400,
      WETH: 1,
    }
    await setup(page, fork, {
      initialPage: 'dashboard',
      account: {
        type: 'connected-random',
        assetBalances,
      },
    })
    const dashboardPage = new DashboardPageObject(page)

    await dashboardPage.expectPositionToBeEmpty()
    await dashboardPage.expectWalletTable(assetBalances)

    await screenshot(page, 'dashboard-no-position')
  })

  test('with open position', async ({ page }) => {
    const assetsToDeposit = {
      wstETH: 2,
      rETH: 2,
    }
    const daiToBorrow = 1500
    await setup(page, fork, {
      initialPage: 'easyBorrow',
      account: {
        type: 'connected-random',
        assetBalances: { ...assetsToDeposit, ETH: 0.1 },
      },
    })

    const borrowPage = new BorrowPageObject(page)
    await borrowPage.depositAssetsActions(assetsToDeposit, daiToBorrow)
    await borrowPage.viewInDashboardAction()

    const dashboardPage = new DashboardPageObject(page)
    await dashboardPage.expectHealthFactor('5.42')
    await dashboardPage.expectDepositedAssets((await calculateAssetsWorth(fork.forkUrl, assetsToDeposit)).total)
    await dashboardPage.expectBorrowedAssets((await calculateAssetsWorth(fork.forkUrl, { DAI: daiToBorrow })).total)

    await dashboardPage.expectDepositTable(assetsToDeposit)
    await dashboardPage.expectWalletTable({
      ...assetsToDeposit,
      DAI: daiToBorrow,
    })

    await screenshot(page, 'dashboard-open-position')
  })
})
