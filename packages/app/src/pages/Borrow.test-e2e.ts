import { borrowValidationIssueToMessage } from '@/domain/market-validators/validateBorrow'
import { ActionsPageObject } from '@/features/actions/ActionsContainer.PageObject'
import { CollateralDialogPageObject } from '@/features/dialogs/collateral/CollateralDialog.PageObject'
import { DEFAULT_BLOCK_NUMBER, USDS_ACTIVATED_BLOCK_NUMBER } from '@/test/e2e/constants'
import { TestContext, buildUrl, setup } from '@/test/e2e/setup'
import { screenshot } from '@/test/e2e/utils'
import { test } from '@playwright/test'
import { mainnet } from 'viem/chains'
import { BorrowPageObject } from './Borrow.PageObject'
import { MyPortfolioPageObject } from './MyPortfolio.PageObject'
import { SavingsPageObject } from './Savings.PageObject'

test.describe('Borrow page', () => {
  test.describe('deposit ETH, borrow DAI', () => {
    let borrowPage: BorrowPageObject
    let actionsContainer: ActionsPageObject
    let testContext: TestContext<'connected-random'>

    const deposit = {
      asset: 'ETH',
      amount: 1,
    }
    const borrow = {
      asset: 'DAI',
      amount: 1000,
    }
    const expectedLtv = '44.07%'
    const expectedHealthFactor = '1.87'

    test.beforeEach(async ({ page }) => {
      testContext = await setup(page, {
        blockchain: {
          chainId: mainnet.id,
          blockNumber: DEFAULT_BLOCK_NUMBER,
        },
        initialPage: 'easyBorrow',
        account: {
          type: 'connected-random',
          assetBalances: {
            ETH: 10,
          },
        },
      })

      borrowPage = new BorrowPageObject(testContext)
      actionsContainer = new ActionsPageObject(testContext)
    })

    test('calculates LTV correctly', async () => {
      await borrowPage.fillDepositAssetAction(0, deposit.asset, deposit.amount)
      await borrowPage.fillBorrowAssetAction(borrow.amount)

      await borrowPage.submitAction()

      await borrowPage.expectLtv(expectedLtv)
      await borrowPage.expectHealthFactor(expectedHealthFactor)
    })

    test('builds action plan', async ({ page }) => {
      await borrowPage.fillDepositAssetAction(0, deposit.asset, deposit.amount)
      await borrowPage.fillBorrowAssetAction(borrow.amount)

      await borrowPage.submitAction()

      await actionsContainer.expectExtendedActions([
        { type: 'deposit', asset: 'ETH', amount: '1.00' },
        { type: 'borrow', asset: 'DAI', amount: '1,000.00' },
      ])
      await screenshot(page, 'deposit-eth-actions-plan')
    })

    test('successfully builds position', async ({ page }) => {
      await borrowPage.fillDepositAssetAction(0, deposit.asset, deposit.amount)
      await borrowPage.fillBorrowAssetAction(borrow.amount)

      await borrowPage.submitAction()

      await actionsContainer.acceptAllActionsAction(2)

      await borrowPage.expectSuccessPage({
        deposited: [deposit],
        borrowed: borrow,
        testnetClient: testContext.testnetController.client,
      })
      await screenshot(page, 'deposit-eth-success')
    })

    test('HF matches after position is created', async () => {
      await borrowPage.fillDepositAssetAction(0, deposit.asset, deposit.amount)
      await borrowPage.fillBorrowAssetAction(borrow.amount)

      await borrowPage.submitAction()
      await actionsContainer.acceptAllActionsAction(2)

      await expectHFOnMyPortfolio(testContext, borrowPage, expectedHealthFactor)
    })
  })

  test.describe('deposit wstETH and rETH, borrow DAI', () => {
    let borrowPage: BorrowPageObject
    let actionsContainer: ActionsPageObject
    let testContext: TestContext<'connected-random'>

    const wstETHdeposit = {
      asset: 'wstETH',
      amount: 1,
    }
    const rETHdeposit = {
      asset: 'rETH',
      amount: 1,
    }
    const borrow = {
      asset: 'DAI',
      amount: 1000,
    }
    const expectedLTV = '19.57%'
    const expectedHealthFactor = '4.06'

    test.beforeEach(async ({ page }) => {
      testContext = await setup(page, {
        blockchain: {
          chainId: mainnet.id,
          blockNumber: DEFAULT_BLOCK_NUMBER,
        },
        initialPage: 'easyBorrow',
        account: {
          type: 'connected-random',
          assetBalances: {
            wstETH: 10,
            rETH: 10,
          },
        },
      })

      borrowPage = new BorrowPageObject(testContext)
      actionsContainer = new ActionsPageObject(testContext)
    })

    test('calculates LTV correctly', async () => {
      await borrowPage.addNewDepositAssetAction()
      await borrowPage.fillDepositAssetAction(0, wstETHdeposit.asset, wstETHdeposit.amount)
      await borrowPage.fillDepositAssetAction(1, rETHdeposit.asset, rETHdeposit.amount)
      await borrowPage.fillBorrowAssetAction(borrow.amount)

      await borrowPage.submitAction()

      await borrowPage.expectLtv(expectedLTV)
      await borrowPage.expectHealthFactor(expectedHealthFactor)
    })

    test('uses permits in action plan for assets with permit support', async ({ page }) => {
      await borrowPage.fillDepositAssetAction(0, wstETHdeposit.asset, wstETHdeposit.amount)
      await borrowPage.fillBorrowAssetAction(borrow.amount)

      await borrowPage.submitAction()

      await actionsContainer.expectExtendedActions([
        { type: 'permit', asset: 'wstETH', amount: '1.00' },
        { type: 'deposit', asset: 'wstETH', amount: '1.00' },
        { type: 'borrow', asset: 'DAI', amount: '1,000.00' },
      ])
      await screenshot(page, 'deposit-wsteth-permit-actions-plan')
    })

    test('uses approve in action plan for assets with no permit support', async ({ page }) => {
      await borrowPage.fillDepositAssetAction(0, rETHdeposit.asset, rETHdeposit.amount)
      await borrowPage.fillBorrowAssetAction(borrow.amount)

      await borrowPage.submitAction()

      await actionsContainer.expectExtendedActions([
        { type: 'approve', asset: 'rETH', amount: '1.00' },
        { type: 'deposit', asset: 'rETH', amount: '1.00' },
        { type: 'borrow', asset: 'DAI', amount: '1,000.00' },
      ])
      await screenshot(page, 'deposit-reth-approve-actions-plan')
    })

    test('can switch to approves in action plan', async ({ page }) => {
      await borrowPage.fillDepositAssetAction(0, wstETHdeposit.asset, wstETHdeposit.amount)
      await borrowPage.fillBorrowAssetAction(borrow.amount)

      await borrowPage.submitAction()

      await actionsContainer.switchPreferPermitsAction()
      await actionsContainer.expectExtendedActions([
        { type: 'approve', asset: 'wstETH', amount: '1.00' },
        { type: 'deposit', asset: 'wstETH', amount: '1.00' },
        { type: 'borrow', asset: 'DAI', amount: '1,000.00' },
      ])
      await screenshot(page, 'deposit-wsteth-approve-actions-plan')
    })

    test('builds action plan for 2 assets', async ({ page }) => {
      await borrowPage.addNewDepositAssetAction()
      await borrowPage.fillDepositAssetAction(0, wstETHdeposit.asset, wstETHdeposit.amount)
      await borrowPage.fillDepositAssetAction(1, rETHdeposit.asset, rETHdeposit.amount)
      await borrowPage.fillBorrowAssetAction(borrow.amount)

      await borrowPage.submitAction()

      await actionsContainer.expectExtendedActions([
        { type: 'permit', asset: 'wstETH', amount: '1.00' },
        { type: 'deposit', asset: 'wstETH', amount: '1.00' },
        { type: 'approve', asset: 'rETH', amount: '1.00' },
        { type: 'deposit', asset: 'rETH', amount: '1.00' },
        { type: 'borrow', asset: 'DAI', amount: '1,000.00' },
      ])
      await screenshot(page, 'deposit-wsteth-reth-actions-plan')
    })

    test('successfully builds position', async ({ page }) => {
      await borrowPage.addNewDepositAssetAction()
      await borrowPage.fillDepositAssetAction(0, wstETHdeposit.asset, wstETHdeposit.amount)
      await borrowPage.fillDepositAssetAction(1, rETHdeposit.asset, rETHdeposit.amount)
      await borrowPage.fillBorrowAssetAction(borrow.amount)

      await borrowPage.submitAction()

      await actionsContainer.acceptAllActionsAction(5)

      await borrowPage.expectSuccessPage({
        deposited: [wstETHdeposit, rETHdeposit],
        borrowed: borrow,
        testnetClient: testContext.testnetController.client,
      })
      await screenshot(page, 'deposit-wsteth-reth-success')
    })

    test('successfully builds position using only approves', async ({ page }) => {
      await borrowPage.addNewDepositAssetAction()
      await borrowPage.fillDepositAssetAction(0, wstETHdeposit.asset, wstETHdeposit.amount)
      await borrowPage.fillDepositAssetAction(1, rETHdeposit.asset, rETHdeposit.amount)
      await borrowPage.fillBorrowAssetAction(borrow.amount)

      await borrowPage.submitAction()

      await actionsContainer.switchPreferPermitsAction()
      await actionsContainer.acceptAllActionsAction(5)

      await borrowPage.expectSuccessPage({
        deposited: [wstETHdeposit, rETHdeposit],
        borrowed: borrow,
        testnetClient: testContext.testnetController.client,
      })
      await screenshot(page, 'deposit-wsteth-reth-success')
    })

    test('HF matches after position is created', async () => {
      await borrowPage.addNewDepositAssetAction()
      await borrowPage.fillDepositAssetAction(0, wstETHdeposit.asset, wstETHdeposit.amount)
      await borrowPage.fillDepositAssetAction(1, rETHdeposit.asset, rETHdeposit.amount)
      await borrowPage.fillBorrowAssetAction(borrow.amount)

      await borrowPage.submitAction()
      await actionsContainer.acceptAllActionsAction(5)

      await expectHFOnMyPortfolio(testContext, borrowPage, expectedHealthFactor)
    })
  })

  test.describe('no new deposit, existing position, borrow DAI', () => {
    let borrowPage: BorrowPageObject
    let actionsContainer: ActionsPageObject
    let testContext: TestContext<'connected-random'>

    const borrow = {
      asset: 'DAI',
      amount: 1000,
    }
    const expectedLTV = '16.08%'
    const expectedHealthFactor = '4.95'

    test.beforeEach(async ({ page }) => {
      testContext = await setup(page, {
        blockchain: {
          chainId: mainnet.id,
          blockNumber: DEFAULT_BLOCK_NUMBER,
        },
        initialPage: 'easyBorrow',
        account: {
          type: 'connected-random',
          assetBalances: {
            ETH: 10,
            rETH: 10,
          },
        },
      })

      borrowPage = new BorrowPageObject(testContext)
      actionsContainer = new ActionsPageObject(testContext)
      await borrowPage.depositAssetsActions({ assetsToDeposit: { rETH: 5 }, daiToBorrow: 1000 })
      await page.reload()
    })

    test('calculates LTV correctly', async () => {
      await borrowPage.fillBorrowAssetAction(borrow.amount)

      await borrowPage.submitAction()

      await borrowPage.expectLtv(expectedLTV)
      await borrowPage.expectHealthFactor(expectedHealthFactor)
    })

    test('builds action plan', async ({ page }) => {
      await borrowPage.fillBorrowAssetAction(borrow.amount)

      await borrowPage.submitAction()

      await actionsContainer.expectExtendedActions([{ type: 'borrow', asset: 'DAI', amount: '1,000.00' }])
      await screenshot(page, 'borrow-with-no-deposit-actions-plan')
    })

    test('successfully borrows', async ({ page }) => {
      await borrowPage.fillBorrowAssetAction(borrow.amount)

      await borrowPage.submitAction()

      await actionsContainer.acceptAllActionsAction(1)

      await borrowPage.expectSuccessPage({
        deposited: [],
        borrowed: borrow,
        testnetClient: testContext.testnetController.client,
      })
      await screenshot(page, 'borrow-with-no-deposit-success')
    })

    test('HF matches after position is created', async () => {
      await borrowPage.fillBorrowAssetAction(borrow.amount)

      await borrowPage.submitAction()
      await actionsContainer.acceptAllActionsAction(1)

      await expectHFOnMyPortfolio(testContext, borrowPage, expectedHealthFactor)
    })
  })

  test.describe('no wallet connected', () => {
    let borrowPage: BorrowPageObject
    const deposit = {
      asset: 'rETH',
      amount: 1,
    }
    const borrow = {
      asset: 'DAI',
      amount: 1000,
    }

    test.beforeEach(async ({ page }) => {
      const testContext = await setup(page, {
        blockchain: {
          chainId: mainnet.id,
          blockNumber: DEFAULT_BLOCK_NUMBER,
        },
        initialPage: 'easyBorrow',
        account: {
          type: 'not-connected',
        },
      })

      borrowPage = new BorrowPageObject(testContext)
    })

    test('shows borrow rate correctly', async ({ page }) => {
      await borrowPage.fillDepositAssetAction(0, deposit.asset, deposit.amount)
      await borrowPage.fillBorrowAssetAction(borrow.amount)
      await borrowPage.expectLtv('40.19%')
      await screenshot(page, 'borrow-form-not-connected-correct-ltv')
    })

    test('form is interactive', async ({ page }) => {
      await borrowPage.fillDepositAssetAction(0, deposit.asset, deposit.amount)
      await borrowPage.fillBorrowAssetAction(borrow.amount)
      await screenshot(page, 'borrow-form-not-connected-interactive')
    })
  })

  test.describe('form validation', () => {
    let borrowPage: BorrowPageObject

    test.beforeEach(async ({ page }) => {
      const testContext = await setup(page, {
        blockchain: {
          chainId: mainnet.id,
          blockNumber: DEFAULT_BLOCK_NUMBER,
        },
        initialPage: 'easyBorrow',
        account: {
          type: 'connected-random',
          assetBalances: {
            ETH: 10,
            rETH: 10,
            WBTC: 10_000,
          },
        },
      })

      borrowPage = new BorrowPageObject(testContext)
    })

    test('is invalid when depositing more than available', async ({ page }) => {
      const deposit = {
        asset: 'ETH',
        amount: 100,
      }
      await borrowPage.fillDepositAssetAction(0, deposit.asset, deposit.amount)
      await borrowPage.expectAssetInputInvalid('Exceeds your balance')
      await screenshot(page, 'borrow-form-deposit-more-than-available')
    })

    test('is invalid when borrowing more than collateral', async ({ page }) => {
      const deposit = {
        asset: 'ETH',
        amount: 1,
      }
      const borrow = {
        asset: 'DAI',
        amount: 10_000,
      }
      await borrowPage.fillDepositAssetAction(0, deposit.asset, deposit.amount)
      await borrowPage.fillBorrowAssetAction(borrow.amount)
      await borrowPage.expectAssetInputInvalid(borrowValidationIssueToMessage['insufficient-collateral'])
      await screenshot(page, 'borrow-form-borrow-more-than-available')
    })

    test('is invalid when borrowing more than available', async ({ page }) => {
      const deposit = {
        asset: 'ETH',
        amount: 1,
      }
      const borrow = {
        asset: 'DAI',
        amount: 100_000_000,
      }
      await borrowPage.fillDepositAssetAction(0, deposit.asset, deposit.amount)
      await borrowPage.fillBorrowAssetAction(borrow.amount)
      await borrowPage.expectAssetInputInvalid(borrowValidationIssueToMessage['exceeds-liquidity'])
      await screenshot(page, 'borrow-form-borrow-more-than-available')
    })

    test('is valid when not depositing anything but having existing position', async ({ page }) => {
      await borrowPage.depositAssetsActions({ assetsToDeposit: { rETH: 5 }, daiToBorrow: 1000 })
      await page.reload()

      await borrowPage.fillBorrowAssetAction(1000)
      await borrowPage.expectBorrowButtonActive()
      await screenshot(page, 'borrow-form-has-position')
    })

    test('is invalid when breaching supply cap', async () => {
      await borrowPage.fillDepositAssetAction(0, 'WBTC', 10_000)
      await borrowPage.expectAssetInputInvalid('Deposit cap reached')
    })
  })

  test.describe('depositable assets', () => {
    let testContext: TestContext<'connected-random'>
    test.beforeEach(async ({ page }) => {
      testContext = await setup(page, {
        blockchain: {
          chainId: mainnet.id,
          blockNumber: DEFAULT_BLOCK_NUMBER,
        },
        initialPage: 'easyBorrow',
        account: {
          type: 'connected-random',
          assetBalances: { wstETH: 10 },
        },
      })
    })

    test('deposit asset, turn off usage as collateral, try to deposit again', async () => {
      const collateral = 'wstETH'

      // Only depositing asset
      const borrowPage = new BorrowPageObject(testContext)
      await borrowPage.depositWithoutBorrowActions({ assetsToDeposit: { [collateral]: 5 } })
      const myPortfolioPage = new MyPortfolioPageObject(testContext)
      await myPortfolioPage.goToMyPortfolioAction()

      // Turning off usage as collateral at myPortfolio
      await myPortfolioPage.expectCollateralSwitch(collateral, true)
      await myPortfolioPage.clickCollateralSwitchAction(collateral)
      const collateralDialog = new CollateralDialogPageObject(testContext)
      await collateralDialog.expectDialogHeader('Collateral')
      await collateralDialog.expectHealthFactorNotVisible()
      await collateralDialog.actionsContainer.acceptAllActionsAction(1)
      await collateralDialog.expectSetUseAsCollateralSuccessPage(collateral, 'disabled')

      // Expecting asset not listed in deposit selector after turning off usage as collateral
      await borrowPage.goToEasyBorrowAction()
      await borrowPage.expectAssetNotListedInDepositSelector(collateral)
    })
  })

  test.describe('Liquidation risk warning', () => {
    let borrowPage: BorrowPageObject

    test.describe('In danger zone', () => {
      test.beforeEach(async ({ page }) => {
        const testContext = await setup(page, {
          blockchain: {
            chainId: mainnet.id,
            blockNumber: DEFAULT_BLOCK_NUMBER,
          },
          initialPage: 'easyBorrow',
          account: {
            type: 'connected-random',
            assetBalances: { ETH: 1, rETH: 100 },
          },
        })

        borrowPage = new BorrowPageObject(testContext)
        await borrowPage.fillDepositAssetAction(0, 'rETH', 1)
        await borrowPage.fillBorrowAssetAction(1500)
        await borrowPage.submitAction()
      })

      test('shows risk warning', async () => {
        await borrowPage.expectLiquidationRiskWarning(
          'Borrowing this amount puts you at risk of quick liquidation. You may lose part of your collateral.',
        )
      })

      test('actions stay disabled until risk warning is acknowledged', async () => {
        await borrowPage.actionsContainer.expectDisabledActionAtIndex(0)
        await borrowPage.clickAcknowledgeRisk()
        await borrowPage.actionsContainer.expectEnabledActionAtIndex(0)
      })
    })

    test('hf above danger zone threshold; risk warning is not shown', async ({ page }) => {
      const testContext = await setup(page, {
        blockchain: {
          chainId: mainnet.id,
          blockNumber: DEFAULT_BLOCK_NUMBER,
        },
        initialPage: 'easyBorrow',
        account: {
          type: 'connected-random',
          assetBalances: { ETH: 1, rETH: 100 },
        },
      })

      const borrowPage = new BorrowPageObject(testContext)
      await borrowPage.fillDepositAssetAction(0, 'rETH', 1)
      await borrowPage.fillBorrowAssetAction(1000)
      await borrowPage.submitAction()

      await borrowPage.expectLiquidationRiskWarningNotVisible()
    })
  })
})

test.describe('Borrow page (usds deployed)', () => {
  let borrowPage: BorrowPageObject
  let actionsContainer: ActionsPageObject
  let testContext: TestContext<'connected-random'>

  test.beforeEach(async ({ page }) => {
    testContext = await setup(page, {
      blockchain: {
        chainId: mainnet.id,
        blockNumber: USDS_ACTIVATED_BLOCK_NUMBER,
      },
      initialPage: 'easyBorrow',
      account: {
        type: 'connected-random',
        assetBalances: {
          wstETH: 10,
        },
      },
    })

    borrowPage = new BorrowPageObject(testContext)
    actionsContainer = new ActionsPageObject(testContext)
  })

  test('borrows usds', async ({ page }) => {
    await borrowPage.fillDepositAssetAction(0, 'wstETH', 10)
    await borrowPage.selectBorrowAction('USDS')
    await borrowPage.fillBorrowAssetAction(10_000)
    await borrowPage.submitAction()

    await borrowPage.expectUsdsBorrowAlert()
    await actionsContainer.acceptAllActionsAction(5)
    await borrowPage.expectSuccessPage({
      deposited: [
        {
          asset: 'wstETH',
          amount: 10,
        },
      ],
      borrowed: {
        asset: 'USDS',
        amount: 10_000,
      },
      testnetClient: testContext.testnetController.client,
      assetsWorthOverride: {
        wstETH: 27_843.94,
        USDS: 10_000,
      },
    })

    await expectHFOnMyPortfolio(testContext, borrowPage, '2.23')

    await page.goto(buildUrl('savings'))
    const savingsPage = new SavingsPageObject(testContext)
    await savingsPage.expectStablecoinsInWalletAssetBalance('USDS', '10,000')
  })
})

async function expectHFOnMyPortfolio(
  testContext: TestContext<any>,
  borrowPage: BorrowPageObject,
  expectedHealthFactor: string,
): Promise<void> {
  await borrowPage.viewInMyPortfolioAction()
  const myPortfolioPage = new MyPortfolioPageObject(testContext)

  await myPortfolioPage.expectHealthFactor(expectedHealthFactor)
}
