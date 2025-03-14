import { borrowValidationIssueToMessage } from '@/domain/market-validators/validateBorrow'
import { ActionsPageObject } from '@/features/actions/ActionsContainer.PageObject'
import { CollateralDialogPageObject } from '@/features/dialogs/collateral/CollateralDialog.PageObject'
import { DEFAULT_BLOCK_NUMBER, USDS_RESERVE_ACTIVE_BLOCK_NUMBER } from '@/test/e2e/constants'
import { TestContext, setup } from '@/test/e2e/setup'
import { test } from '@playwright/test'
import { mainnet } from 'viem/chains'
import { BorrowPageObject } from './Borrow.PageObject'
import { MyPortfolioPageObject } from './MyPortfolio.PageObject'

test.describe('Borrow page', () => {
  test.describe('deposit ETH, borrow DAI', () => {
    let borrowPage: BorrowPageObject
    let actionsContainer: ActionsPageObject
    let testContext: TestContext

    const deposit = {
      asset: 'ETH',
      amount: 1,
    }
    const borrow = {
      asset: 'DAI',
      amount: 1000,
    }
    const expectedLtv = '25.46%'
    const expectedHealthFactor = '3.26'

    test.beforeEach(async ({ page }) => {
      testContext = await setup(page, {
        blockchain: {
          chain: mainnet,
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

    test('builds action plan', async () => {
      await borrowPage.fillDepositAssetAction(0, deposit.asset, deposit.amount)
      await borrowPage.fillBorrowAssetAction(borrow.amount)

      await borrowPage.submitAction()

      await actionsContainer.expectExtendedActions([
        { type: 'deposit', asset: 'ETH', amount: '1.00' },
        { type: 'borrow', asset: 'DAI', amount: '1,000.00' },
      ])
    })

    test('successfully builds position', async () => {
      await borrowPage.fillDepositAssetAction(0, deposit.asset, deposit.amount)
      await borrowPage.fillBorrowAssetAction(borrow.amount)

      await borrowPage.submitAction()

      await actionsContainer.acceptAllActionsAction(2)

      await borrowPage.expectSuccessPage({
        deposited: [{ asset: 'ETH', amount: '1.00', usdValue: '$3,928.31' }],
        borrowed: { asset: 'DAI', amount: '1,000.00', usdValue: '$1,000.00' },
      })
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
    const expectedLTV = '11.01%'
    const expectedHealthFactor = '7.26'

    test.beforeEach(async ({ page }) => {
      testContext = await setup(page, {
        blockchain: {
          chain: mainnet,
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

    test('uses permits in action plan for assets with permit support', async () => {
      await borrowPage.fillDepositAssetAction(0, wstETHdeposit.asset, wstETHdeposit.amount)
      await borrowPage.fillBorrowAssetAction(borrow.amount)

      await borrowPage.submitAction()

      await actionsContainer.expectExtendedActions([
        { type: 'permit', asset: 'wstETH', amount: '1.00' },
        { type: 'deposit', asset: 'wstETH', amount: '1.00' },
        { type: 'borrow', asset: 'DAI', amount: '1,000.00' },
      ])
    })

    test('uses approve in action plan for assets with no permit support', async () => {
      await borrowPage.fillDepositAssetAction(0, rETHdeposit.asset, rETHdeposit.amount)
      await borrowPage.fillBorrowAssetAction(borrow.amount)

      await borrowPage.submitAction()

      await actionsContainer.expectExtendedActions([
        { type: 'approve', asset: 'rETH', amount: '1.00' },
        { type: 'deposit', asset: 'rETH', amount: '1.00' },
        { type: 'borrow', asset: 'DAI', amount: '1,000.00' },
      ])
    })

    test('can switch to approves in action plan', async () => {
      await borrowPage.fillDepositAssetAction(0, wstETHdeposit.asset, wstETHdeposit.amount)
      await borrowPage.fillBorrowAssetAction(borrow.amount)

      await borrowPage.submitAction()

      await actionsContainer.switchPreferPermitsAction()
      await actionsContainer.expectExtendedActions([
        { type: 'approve', asset: 'wstETH', amount: '1.00' },
        { type: 'deposit', asset: 'wstETH', amount: '1.00' },
        { type: 'borrow', asset: 'DAI', amount: '1,000.00' },
      ])
    })

    test('builds action plan for 2 assets', async () => {
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
    })

    test('successfully builds position', async () => {
      await borrowPage.addNewDepositAssetAction()
      await borrowPage.fillDepositAssetAction(0, wstETHdeposit.asset, wstETHdeposit.amount)
      await borrowPage.fillDepositAssetAction(1, rETHdeposit.asset, rETHdeposit.amount)
      await borrowPage.fillBorrowAssetAction(borrow.amount)

      await borrowPage.submitAction()

      await actionsContainer.acceptAllActionsAction(5)

      await borrowPage.expectSuccessPage({
        deposited: [
          { asset: 'wstETH', amount: '1.00', usdValue: '$4,665.46' },
          { asset: 'rETH', amount: '1.00', usdValue: '$4,413.26' },
        ],
        borrowed: { asset: 'DAI', amount: '1,000.00', usdValue: '$1,000.00' },
      })
    })

    test('successfully builds position using only approves', async () => {
      await borrowPage.addNewDepositAssetAction()
      await borrowPage.fillDepositAssetAction(0, wstETHdeposit.asset, wstETHdeposit.amount)
      await borrowPage.fillDepositAssetAction(1, rETHdeposit.asset, rETHdeposit.amount)
      await borrowPage.fillBorrowAssetAction(borrow.amount)

      await borrowPage.submitAction()

      await actionsContainer.switchPreferPermitsAction()
      await actionsContainer.acceptAllActionsAction(5)

      await borrowPage.expectSuccessPage({
        deposited: [
          { asset: 'wstETH', amount: '1.00', usdValue: '$4,665.46' },
          { asset: 'rETH', amount: '1.00', usdValue: '$4,413.26' },
        ],
        borrowed: { asset: 'DAI', amount: '1,000.00', usdValue: '$1,000.00' },
      })
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
    const expectedLTV = '9.06%'
    const expectedHealthFactor = '8.83'

    test.beforeEach(async ({ page }) => {
      testContext = await setup(page, {
        blockchain: {
          chain: mainnet,
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

    test('builds action plan', async () => {
      await borrowPage.fillBorrowAssetAction(borrow.amount)

      await borrowPage.submitAction()

      await actionsContainer.expectExtendedActions([{ type: 'borrow', asset: 'DAI', amount: '1,000.00' }])
    })

    test('successfully borrows', async () => {
      await borrowPage.fillBorrowAssetAction(borrow.amount)

      await borrowPage.submitAction()

      await actionsContainer.acceptAllActionsAction(1)

      await borrowPage.expectSuccessPage({
        deposited: [],
        borrowed: { asset: 'DAI', amount: '1,000.00', usdValue: '$1,000.00' },
      })
    })

    test('HF matches after position is created', async () => {
      await borrowPage.fillBorrowAssetAction(borrow.amount)

      await borrowPage.submitAction()
      await actionsContainer.acceptAllActionsAction(1)

      await expectHFOnMyPortfolio(testContext, borrowPage, expectedHealthFactor)
    })
  })

  test('borrows usds', async ({ page }) => {
    const testContext = await setup(page, {
      blockchain: {
        chain: mainnet,
        blockNumber: USDS_RESERVE_ACTIVE_BLOCK_NUMBER,
      },
      initialPage: 'easyBorrow',
      account: {
        type: 'connected-random',
        assetBalances: {
          wstETH: 10,
        },
      },
    })

    const borrowPage = new BorrowPageObject(testContext)
    const actionsContainer = new ActionsPageObject(testContext)

    await borrowPage.fillDepositAssetAction(0, 'wstETH', 10)
    await borrowPage.selectBorrowAction('USDS')
    await borrowPage.fillBorrowAssetAction(10_000)
    await borrowPage.submitAction()

    await actionsContainer.acceptAllActionsAction(3)
    await borrowPage.expectSuccessPage({
      deposited: [
        {
          asset: 'wstETH',
          amount: '10.00',
          usdValue: '$22,648.67',
        },
      ],
      borrowed: {
        asset: 'USDS',
        amount: '10,000.00',
        usdValue: '$10,000.00',
      },
    })

    await expectHFOnMyPortfolio(testContext, borrowPage, '1.81')
  })

  test('borrows usdc', async ({ page }) => {
    const testContext = await setup(page, {
      blockchain: {
        chain: mainnet,
        blockNumber: USDS_RESERVE_ACTIVE_BLOCK_NUMBER,
      },
      initialPage: 'easyBorrow',
      account: {
        type: 'connected-random',
        assetBalances: {
          wstETH: 10,
        },
      },
    })

    const borrowPage = new BorrowPageObject(testContext)
    const actionsContainer = new ActionsPageObject(testContext)

    await borrowPage.fillDepositAssetAction(0, 'wstETH', 10)
    await borrowPage.selectBorrowAction('USDC')
    await borrowPage.fillBorrowAssetAction(10_000)
    await borrowPage.submitAction()

    await actionsContainer.acceptAllActionsAction(3)
    await borrowPage.expectSuccessPage({
      deposited: [
        {
          asset: 'wstETH',
          amount: '10.00',
          usdValue: '$22,648.67',
        },
      ],
      borrowed: {
        asset: 'USDC',
        amount: '10,000.00',
        usdValue: '$10,000.00',
      },
    })

    await expectHFOnMyPortfolio(testContext, borrowPage, '1.81')
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
          chain: mainnet,
          blockNumber: DEFAULT_BLOCK_NUMBER,
        },
        initialPage: 'easyBorrow',
        account: {
          type: 'not-connected',
        },
      })

      borrowPage = new BorrowPageObject(testContext)
    })

    test('shows borrow rate correctly', async () => {
      await borrowPage.fillDepositAssetAction(0, deposit.asset, deposit.amount)
      await borrowPage.fillBorrowAssetAction(borrow.amount)
      await borrowPage.expectLtv('22.66%')
    })

    test('form is interactive', async () => {
      await borrowPage.fillDepositAssetAction(0, deposit.asset, deposit.amount)
      await borrowPage.fillBorrowAssetAction(borrow.amount)
    })
  })

  test.describe('form validation', () => {
    let borrowPage: BorrowPageObject

    test.beforeEach(async ({ page }) => {
      const testContext = await setup(page, {
        blockchain: {
          chain: mainnet,
          blockNumber: DEFAULT_BLOCK_NUMBER,
        },
        initialPage: 'easyBorrow',
        account: {
          type: 'connected-random',
          assetBalances: {
            ETH: 10,
            rETH: 10,
            cbBTC: 100,
          },
        },
      })

      borrowPage = new BorrowPageObject(testContext)
    })

    test('is invalid when depositing more than available', async () => {
      const deposit = {
        asset: 'ETH',
        amount: 100,
      }
      await borrowPage.fillDepositAssetAction(0, deposit.asset, deposit.amount)
      await borrowPage.expectAssetInputInvalid('Exceeds your balance')
    })

    test('is invalid when borrowing more than collateral', async () => {
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
    })

    test('is invalid when borrowing more than available', async () => {
      const deposit = {
        asset: 'ETH',
        amount: 1,
      }
      const borrow = {
        asset: 'DAI',
        amount: 1_000_000_000,
      }
      await borrowPage.fillDepositAssetAction(0, deposit.asset, deposit.amount)
      await borrowPage.fillBorrowAssetAction(borrow.amount)
      await borrowPage.expectAssetInputInvalid(borrowValidationIssueToMessage['exceeds-liquidity'])
    })

    test('is valid when not depositing anything but having existing position', async ({ page }) => {
      await borrowPage.depositAssetsActions({ assetsToDeposit: { rETH: 5 }, daiToBorrow: 1000 })
      await page.reload()

      await borrowPage.fillBorrowAssetAction(1000)
      await borrowPage.expectBorrowButtonActive()
    })

    test('is invalid when breaching supply cap', async () => {
      await borrowPage.fillDepositAssetAction(0, 'cbBTC', 100)
      await borrowPage.expectAssetInputInvalid('Deposit cap reached')
    })
  })

  test.describe('depositable assets', () => {
    let testContext: TestContext<'connected-random'>
    test.beforeEach(async ({ page }) => {
      testContext = await setup(page, {
        blockchain: {
          chain: mainnet,
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
            chain: mainnet,
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
        await borrowPage.fillBorrowAssetAction(3400)
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
          chain: mainnet,
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

  test.describe('Batched actions', () => {
    test('can borrow DAI for ETH and cbBTC', async ({ page }) => {
      const testContext = await setup(page, {
        blockchain: {
          chain: mainnet,
          blockNumber: DEFAULT_BLOCK_NUMBER,
        },
        initialPage: 'easyBorrow',
        account: {
          type: 'connected-random',
          assetBalances: { ETH: 5, cbBTC: 0.1 },
          atomicBatchSupported: true,
        },
      })

      const borrowPage = new BorrowPageObject(testContext)
      await borrowPage.fillDepositAssetAction(0, 'ETH', 2)
      await borrowPage.addNewDepositAssetAction()
      await borrowPage.fillDepositAssetAction(1, 'cbBTC', 0.1)
      await borrowPage.fillBorrowAssetAction(6800)
      await borrowPage.submitAction()

      const actionsPage = new ActionsPageObject(testContext)

      await actionsPage.acceptBatchedActions()
      await borrowPage.expectSuccessPage({
        deposited: [
          { asset: 'ETH', amount: '2.00', usdValue: '$7,856.63' },
          { asset: 'cbBTC', amount: '0.10', usdValue: '$10,168.30' },
        ],
        borrowed: { asset: 'DAI', amount: '6,800.00', usdValue: '$6,800.00' },
      })

      await expectHFOnMyPortfolio(testContext, borrowPage, '2.08')
    })

    test('can borrow USDS for wstETH', async ({ page }) => {
      const testContext = await setup(page, {
        blockchain: {
          chain: mainnet,
          blockNumber: USDS_RESERVE_ACTIVE_BLOCK_NUMBER,
        },
        initialPage: 'easyBorrow',
        account: {
          type: 'connected-random',
          assetBalances: { ETH: 5, wstETH: 5 },
          atomicBatchSupported: true,
        },
      })

      const borrowPage = new BorrowPageObject(testContext)
      await borrowPage.fillDepositAssetAction(0, 'wstETH', 2)
      await borrowPage.selectBorrowAction('USDS')
      await borrowPage.fillBorrowAssetAction(1400)
      await borrowPage.submitAction()

      const actionsPage = new ActionsPageObject(testContext)

      await actionsPage.acceptBatchedActions()
      await borrowPage.expectSuccessPage({
        deposited: [{ asset: 'wstETH', amount: '2.00', usdValue: '$4,529.73' }],
        borrowed: { asset: 'USDS', amount: '1,400.00', usdValue: '$1,400.00' },
      })

      await expectHFOnMyPortfolio(testContext, borrowPage, '2.59')
    })
  })
})

async function expectHFOnMyPortfolio(
  testContext: TestContext,
  borrowPage: BorrowPageObject,
  expectedHealthFactor: string,
): Promise<void> {
  await borrowPage.viewInMyPortfolioAction()
  const myPortfolioPage = new MyPortfolioPageObject(testContext)

  await myPortfolioPage.expectHealthFactor(expectedHealthFactor)
}
