import { test } from '@playwright/test'
import { mainnet } from 'viem/chains'

import { DEFAULT_BLOCK_NUMBER } from '@/test/e2e/constants'
import { setupFork } from '@/test/e2e/forking/setupFork'
import { setup } from '@/test/e2e/setup'
import { calculateAssetsWorth, screenshot } from '@/test/e2e/utils'

import { BorrowPageObject } from './Borrow.PageObject'
import { MyPortfolioPageObject } from './MyPortfolio.PageObject'

test.describe('MyPortfolio', () => {
  const fork = setupFork({ blockNumber: DEFAULT_BLOCK_NUMBER, chainId: mainnet.id })

  test.skip('guest state', async ({ page }) => {
    await setup(page, fork, {
      account: {
        type: 'not-connected',
      },
      initialPage: 'myPortfolio',
    })
    const myPortfolioPage = new MyPortfolioPageObject(page)

    await myPortfolioPage.expectGuestScreen()

    await screenshot(page, 'myPortfolio-guest')
  })

  test('empty account', async ({ page }) => {
    await setup(page, fork, {
      initialPage: 'myPortfolio',
      account: {
        type: 'connected-random',
      },
    })
    const myPortfolioPage = new MyPortfolioPageObject(page)

    await myPortfolioPage.expectPositionToBeEmpty()

    await screenshot(page, 'myPortfolio-empty-account')
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
      initialPage: 'myPortfolio',
      account: {
        type: 'connected-random',
        assetBalances,
      },
    })
    const myPortfolioPage = new MyPortfolioPageObject(page)

    await myPortfolioPage.expectPositionToBeEmpty()
    await myPortfolioPage.expectWalletTable(assetBalances)

    await screenshot(page, 'myPortfolio-no-position')
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
    await borrowPage.viewInMyPortfolioAction()

    const myPortfolioPage = new MyPortfolioPageObject(page)
    await myPortfolioPage.expectHealthFactor('5.42')
    await myPortfolioPage.expectDepositedAssets((await calculateAssetsWorth(fork.forkUrl, assetsToDeposit)).total)
    await myPortfolioPage.expectBorrowedAssets((await calculateAssetsWorth(fork.forkUrl, { DAI: daiToBorrow })).total)

    await myPortfolioPage.expectDepositTable(assetsToDeposit)
    await myPortfolioPage.expectWalletTable({
      ...assetsToDeposit,
      DAI: daiToBorrow,
    })

    await screenshot(page, 'myPortfolio-open-position')
  })
})
