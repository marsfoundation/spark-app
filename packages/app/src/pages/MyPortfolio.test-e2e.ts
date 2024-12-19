import { DEFAULT_BLOCK_NUMBER } from '@/test/e2e/constants'
import { setup } from '@/test/e2e/setup'
import { test } from '@playwright/test'
import { mainnet } from 'viem/chains'
import { BorrowPageObject } from './Borrow.PageObject'
import { MyPortfolioPageObject } from './MyPortfolio.PageObject'

test.describe('MyPortfolio', () => {
  test('guest state', async ({ page }) => {
    const testContext = await setup(page, {
      blockchain: {
        blockNumber: DEFAULT_BLOCK_NUMBER,
        chainId: mainnet.id,
      },
      account: {
        type: 'not-connected',
      },
      initialPage: 'myPortfolio',
    })
    const myPortfolioPage = new MyPortfolioPageObject(testContext)

    await myPortfolioPage.expectGuestScreen()
  })

  test('empty account', async ({ page }) => {
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
    const myPortfolioPage = new MyPortfolioPageObject(testContext)

    await myPortfolioPage.expectPositionToBeEmpty()
  })

  test('no position', async ({ page }) => {
    const assetBalances = {
      ETH: 1,
      DAI: 200,
      sDAI: 300,
      USDC: 400,
      WETH: 1,
    }
    const testContext = await setup(page, {
      blockchain: {
        blockNumber: DEFAULT_BLOCK_NUMBER,
        chainId: mainnet.id,
      },
      initialPage: 'myPortfolio',
      account: {
        type: 'connected-random',
        assetBalances,
      },
    })
    const myPortfolioPage = new MyPortfolioPageObject(testContext)

    await myPortfolioPage.expectPositionToBeEmpty()
    await myPortfolioPage.expectBalancesInDepositTable({
      WETH: 2,
      DAI: 200,
      sDAI: 300,
      USDC: 400,
    })
  })

  test('with open position', async ({ page }) => {
    const assetsToDeposit = {
      wstETH: 2,
      rETH: 2,
    }
    const daiToBorrow = 1500
    const testContext = await setup(page, {
      blockchain: {
        blockNumber: DEFAULT_BLOCK_NUMBER,
        chainId: mainnet.id,
      },
      initialPage: 'easyBorrow',
      account: {
        type: 'connected-random',
        assetBalances: { ...assetsToDeposit, ETH: 0.1 },
      },
    })

    const borrowPage = new BorrowPageObject(testContext)
    await borrowPage.depositAssetsActions({ assetsToDeposit, daiToBorrow })
    await borrowPage.viewInMyPortfolioAction()

    const myPortfolioPage = new MyPortfolioPageObject(testContext)
    await myPortfolioPage.expectHealthFactor('9.68')
    await myPortfolioPage.expectDepositedAssets('$18.16K')
    await myPortfolioPage.expectBorrowedAssets('$1,500')

    await myPortfolioPage.expectDepositTable(assetsToDeposit)
    await myPortfolioPage.expectBalancesInDepositTable({
      DAI: daiToBorrow,
    })
  })
})
