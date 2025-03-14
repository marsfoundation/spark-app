import { borrowValidationIssueToMessage } from '@/domain/market-validators/validateBorrow'
import { BorrowPageObject } from '@/pages/Borrow.PageObject'
import { MyPortfolioPageObject } from '@/pages/MyPortfolio.PageObject'
import { DEFAULT_BLOCK_NUMBER, USDS_RESERVE_ACTIVE_BLOCK_NUMBER } from '@/test/e2e/constants'
import { setup } from '@/test/e2e/setup'
import { test } from '@playwright/test'
import { mainnet } from 'viem/chains'
import { CollateralDialogPageObject } from '../collateral/CollateralDialog.PageObject'
import { DialogPageObject } from '../common/Dialog.PageObject'

const header = /Borrow */

test.describe('Borrow dialog', () => {
  const initialBalances = {
    rETH: 100,
    wstETH: 100,
  }

  test.describe('Position with deposit and borrow', () => {
    const initialDeposits = {
      rETH: 2,
      wstETH: 2,
    }
    const daiToBorrow = 1500
    const expectedInitialHealthFactor = '9.68'
    const expectedHealthFactor = '2.46'

    let myPortfolioPage: MyPortfolioPageObject
    let borrowDialog: DialogPageObject

    test.beforeEach(async ({ page }) => {
      const testContext = await setup(page, {
        blockchain: {
          blockNumber: DEFAULT_BLOCK_NUMBER,
          chain: mainnet,
        },
        initialPage: 'easyBorrow',
        account: {
          type: 'connected-random',
          assetBalances: { ...initialBalances },
        },
      })

      const borrowPage = new BorrowPageObject(testContext)
      myPortfolioPage = new MyPortfolioPageObject(testContext)
      borrowDialog = new DialogPageObject({ testContext, header })

      await borrowPage.depositAssetsActions({ assetsToDeposit: initialDeposits, daiToBorrow })
      await borrowPage.viewInMyPortfolioAction()

      // wait for all transactions to be executed
      await myPortfolioPage.expectHealthFactor(expectedInitialHealthFactor)
    })

    test('opens dialog with selected asset', async () => {
      await myPortfolioPage.clickBorrowButtonAction('rETH')

      await borrowDialog.expectSelectedAsset('rETH')
      await borrowDialog.expectDialogHeader('Borrow rETH')
      await borrowDialog.expectHealthFactorBeforeVisible()
    })

    test('calculates health factor changes correctly', async () => {
      await myPortfolioPage.clickBorrowButtonAction('rETH')

      await borrowDialog.fillAmountAction(1)
      await borrowDialog.expectRiskLevelBefore('Healthy')
      await borrowDialog.expectHealthFactorBefore(expectedInitialHealthFactor)
      await borrowDialog.expectRiskLevelAfter('Moderate')
      await borrowDialog.expectHealthFactorAfter(expectedHealthFactor)
    })

    test('after borrow, health factor matches myPortfolio', async () => {
      await myPortfolioPage.clickBorrowButtonAction('rETH')

      await borrowDialog.fillAmountAction(1)
      await borrowDialog.actionsContainer.acceptAllActionsAction(1)
      await borrowDialog.viewInMyPortfolioAction()

      await myPortfolioPage.expectHealthFactor(expectedHealthFactor)
    })

    test('has correct action plan for erc-20', async () => {
      await myPortfolioPage.clickBorrowButtonAction('rETH')

      await borrowDialog.fillAmountAction(1)
      await borrowDialog.actionsContainer.expectActions([{ type: 'borrow', asset: 'rETH' }])
    })

    test('can borrow erc-20', async () => {
      const borrow = {
        asset: 'rETH',
        amount: 1,
      }

      await myPortfolioPage.clickBorrowButtonAction(borrow.asset)

      await borrowDialog.fillAmountAction(borrow.amount)
      await borrowDialog.actionsContainer.acceptAllActionsAction(1)
      await borrowDialog.expectSuccessPage({
        tokenWithValue: [{ asset: 'rETH', amount: '1.00', usdValue: '$4,413.26' }],
      })
      await borrowDialog.viewInMyPortfolioAction()

      await myPortfolioPage.expectBorrowTable({
        [borrow.asset]: borrow.amount,
      })
    })

    test('has correct action plan for native asset', async () => {
      await myPortfolioPage.clickBorrowButtonAction('WETH')

      await borrowDialog.selectAssetAction('ETH')
      await borrowDialog.fillAmountAction(1)
      await borrowDialog.expectHealthFactorVisible()
      await borrowDialog.actionsContainer.expectActions([
        { type: 'approveDelegation', asset: 'ETH' },
        { type: 'borrow', asset: 'ETH' },
      ])
    })

    test('can borrow native asset', async () => {
      const borrow = {
        asset: 'ETH',
        amount: 1,
      }

      await myPortfolioPage.clickBorrowButtonAction('WETH')

      await borrowDialog.selectAssetAction(borrow.asset)
      await borrowDialog.fillAmountAction(1)
      await borrowDialog.actionsContainer.acceptAllActionsAction(2)
      await borrowDialog.expectSuccessPage({
        tokenWithValue: [{ asset: 'ETH', amount: '1.00', usdValue: '$3,928.31' }],
      })
      await borrowDialog.viewInMyPortfolioAction()

      await myPortfolioPage.expectBorrowTable({
        WETH: borrow.amount,
      })
    })

    test('can borrow same asset again', async () => {
      const borrow = {
        asset: 'DAI',
        amount: 1500,
      }

      await myPortfolioPage.clickBorrowButtonAction(borrow.asset)

      await borrowDialog.fillAmountAction(borrow.amount)
      await borrowDialog.actionsContainer.acceptAllActionsAction(1)
      await borrowDialog.expectSuccessPage({
        tokenWithValue: [{ asset: 'DAI', amount: '1,500.00', usdValue: '$1,500.00' }],
      })
      await borrowDialog.viewInMyPortfolioAction()

      await myPortfolioPage.expectBorrowTable({
        [borrow.asset]: borrow.amount + daiToBorrow,
      })
    })

    test("can't borrow more than allowed", async () => {
      const borrowAsset = 'wstETH'
      await myPortfolioPage.clickBorrowButtonAction(borrowAsset)

      await borrowDialog.fillAmountAction(initialDeposits[borrowAsset] * 10)
      await borrowDialog.expectAssetInputError(borrowValidationIssueToMessage['insufficient-collateral'])
    })
  })

  test.describe('Position with only deposit', () => {
    const initialDeposits = {
      wstETH: 2,
      rETH: 2,
    }

    let myPortfolioPage: MyPortfolioPageObject
    let borrowDialog: DialogPageObject

    test.beforeEach(async ({ page }) => {
      const testContext = await setup(page, {
        blockchain: {
          blockNumber: DEFAULT_BLOCK_NUMBER,
          chain: mainnet,
        },
        initialPage: 'easyBorrow',
        account: {
          type: 'connected-random',
          assetBalances: { ...initialBalances },
        },
      })

      const borrowPage = new BorrowPageObject(testContext)
      myPortfolioPage = new MyPortfolioPageObject(testContext)
      borrowDialog = new DialogPageObject({ testContext, header })
      await borrowPage.depositWithoutBorrowActions({
        assetsToDeposit: { ...initialDeposits },
      })

      await myPortfolioPage.goToMyPortfolioAction()
      await myPortfolioPage.expectDepositedAssets('$18.16K')
    })

    test('can borrow erc-20', async () => {
      const borrow = {
        asset: 'wstETH',
        amount: 1,
      }

      await myPortfolioPage.clickBorrowButtonAction(borrow.asset)

      await borrowDialog.fillAmountAction(borrow.amount)
      await borrowDialog.actionsContainer.acceptAllActionsAction(1)
      await borrowDialog.expectSuccessPage({
        tokenWithValue: [{ asset: 'wstETH', amount: '1.00', usdValue: '$4,665.46' }],
      })
      await borrowDialog.viewInMyPortfolioAction()

      await myPortfolioPage.expectBorrowTable({
        [borrow.asset]: borrow.amount,
      })
    })

    test('can borrow USDC', async () => {
      const borrow = {
        asset: 'USDC',
        amount: 100,
      }

      await myPortfolioPage.clickBorrowButtonAction(borrow.asset)

      await borrowDialog.fillAmountAction(borrow.amount)
      await borrowDialog.actionsContainer.acceptAllActionsAction(1)
      await borrowDialog.expectSuccessPage({
        tokenWithValue: [{ asset: 'USDC', amount: '100.00', usdValue: '$100.00' }],
      })
      await borrowDialog.viewInMyPortfolioAction()

      await myPortfolioPage.expectBorrowTable({
        [borrow.asset]: borrow.amount,
      })
    })

    test('displays health factor', async () => {
      await myPortfolioPage.clickBorrowButtonAction('rETH')

      await borrowDialog.fillAmountAction(1)
      await borrowDialog.expectHealthFactorAfterVisible()
    })

    test('clicking MAX sets input to 99% of possible borrow', async () => {
      await myPortfolioPage.clickBorrowButtonAction('DAI')

      await borrowDialog.clickMaxAmountAction()
      await borrowDialog.expectInputValue('14200.947199')
      await borrowDialog.expectMaxButtonDisabled()
      await borrowDialog.expectLiquidationRiskWarning(
        'Borrowing this amount puts you at risk of quick liquidation. You may lose part of your collateral.',
      )
      await borrowDialog.clickAcknowledgeRisk()
      await borrowDialog.actionsContainer.expectActions([{ type: 'borrow', asset: 'DAI' }])
      await borrowDialog.actionsContainer.expectEnabledActionAtIndex(0)
    })
  })

  test.describe('Position in isolation mode', () => {
    const initialDeposits = {
      weETH: 200,
    }

    let myPortfolioPage: MyPortfolioPageObject
    let borrowDialog: DialogPageObject

    test.beforeEach(async ({ page }) => {
      const testContext = await setup(page, {
        blockchain: {
          blockNumber: 20230000n,
          chain: mainnet,
        },
        initialPage: 'myPortfolio',
        account: {
          type: 'connected-random',
          assetBalances: { ...initialDeposits },
        },
      })

      const depositDialog = new DialogPageObject({ testContext, header: /Deposit weETH/ })
      const collateralDialog = new CollateralDialogPageObject(testContext)
      myPortfolioPage = new MyPortfolioPageObject(testContext)
      borrowDialog = new DialogPageObject({ testContext, header })

      await myPortfolioPage.clickDepositButtonAction('weETH')

      await depositDialog.fillAmountAction(initialDeposits.weETH)
      await depositDialog.actionsContainer.acceptAllActionsAction(2)
      await depositDialog.viewInMyPortfolioAction()

      await myPortfolioPage.clickCollateralSwitchAction('weETH')

      await collateralDialog.setUseAsCollateralAction({ assetName: 'weETH', setting: 'enabled' })
      await collateralDialog.viewInMyPortfolioAction()

      await myPortfolioPage.expectDepositedAssets('$671.9K')
    })

    test('MAX borrow accounts for isolation debt ceiling', async () => {
      await myPortfolioPage.clickBorrowButtonAction('DAI')

      await borrowDialog.clickMaxAmountAction()
      await borrowDialog.expectInputValue('110616.31')
      await borrowDialog.expectMaxButtonDisabled()
      await borrowDialog.actionsContainer.expectActions([{ type: 'borrow', asset: 'DAI' }])
      await borrowDialog.actionsContainer.expectEnabledActionAtIndex(0)
    })
  })

  test.describe('Position with large deposit', () => {
    const initialDeposits = {
      WETH: 100_000,
    }

    let myPortfolioPage: MyPortfolioPageObject
    let borrowDialog: DialogPageObject

    test.beforeEach(async ({ page }) => {
      const testContext = await setup(page, {
        blockchain: {
          blockNumber: DEFAULT_BLOCK_NUMBER,
          chain: mainnet,
        },
        initialPage: 'myPortfolio',
        account: {
          type: 'connected-random',
          assetBalances: { ...initialDeposits },
        },
      })

      const depositDialog = new DialogPageObject({ testContext, header: /Deposit WETH/ })
      myPortfolioPage = new MyPortfolioPageObject(testContext)
      borrowDialog = new DialogPageObject({ testContext, header })

      await myPortfolioPage.clickDepositButtonAction('WETH')

      await depositDialog.fillAmountAction(initialDeposits.WETH)
      await depositDialog.actionsContainer.acceptAllActionsAction(2)
      await depositDialog.viewInMyPortfolioAction()

      await myPortfolioPage.expectDepositedAssets('$392.8M')
    })

    test('MAX borrow accounts for borrow cap', async () => {
      await myPortfolioPage.clickBorrowButtonAction('wstETH')

      await borrowDialog.clickMaxAmountAction()
      await borrowDialog.expectInputValue('5064.577659')
      await borrowDialog.expectMaxButtonDisabled()
      await borrowDialog.actionsContainer.expectActions([{ type: 'borrow', asset: 'wstETH' }])
      await borrowDialog.actionsContainer.expectEnabledActionAtIndex(0)
    })

    test('MAX borrow accounts for available liquidity', async () => {
      await myPortfolioPage.clickBorrowButtonAction('USDC')

      await borrowDialog.clickMaxAmountAction()
      await borrowDialog.expectInputValue('67115.418673')
      await borrowDialog.expectMaxButtonDisabled()
      await borrowDialog.actionsContainer.expectActions([{ type: 'borrow', asset: 'USDC' }])
      await borrowDialog.actionsContainer.expectEnabledActionAtIndex(0)
    })
  })

  test.describe('Liquidation risk warning', () => {
    let borrowDialog: DialogPageObject
    let myPortfolioPage: MyPortfolioPageObject

    test.beforeEach(async ({ page }) => {
      const testContext = await setup(page, {
        blockchain: {
          blockNumber: DEFAULT_BLOCK_NUMBER,
          chain: mainnet,
        },
        initialPage: 'easyBorrow',
        account: {
          type: 'connected-random',
          assetBalances: { ETH: 1, rETH: 100, wstETH: 100 },
        },
      })

      const borrowPage = new BorrowPageObject(testContext)
      borrowDialog = new DialogPageObject({ testContext, header })
      myPortfolioPage = new MyPortfolioPageObject(testContext)

      await borrowPage.depositWithoutBorrowActions({ assetsToDeposit: { rETH: 2, wstETH: 10 } })
      await myPortfolioPage.goToMyPortfolioAction()
    })

    test('shows risk warning', async () => {
      await myPortfolioPage.clickBorrowButtonAction('WETH')

      await borrowDialog.fillAmountAction(8)
      await borrowDialog.expectLiquidationRiskWarning(
        'Borrowing this amount puts you at risk of quick liquidation. You may lose part of your collateral.',
      )
    })

    test('actions stay disabled until risk warning is acknowledged', async () => {
      await myPortfolioPage.clickBorrowButtonAction('WETH')

      await borrowDialog.fillAmountAction(8)
      await borrowDialog.actionsContainer.expectDisabledActionAtIndex(0)
      await borrowDialog.clickAcknowledgeRisk()
      await borrowDialog.actionsContainer.expectEnabledActionAtIndex(0)
    })

    test('hf above danger zone threshold; risk warning is not shown', async () => {
      await myPortfolioPage.clickBorrowButtonAction('WETH')

      await borrowDialog.fillAmountAction(0.1)
      await borrowDialog.actionsContainer.expectEnabledActionAtIndex(0)
      await borrowDialog.expectLiquidationRiskWarningNotVisible()
    })

    test('input validation error; risk warning is not shown', async () => {
      await myPortfolioPage.clickBorrowButtonAction('WETH')

      await borrowDialog.fillAmountAction(0)
      await borrowDialog.expectAssetInputError(borrowValidationIssueToMessage['value-not-positive'])
      await borrowDialog.expectLiquidationRiskWarningNotVisible()
    })
  })

  test('borrows usds', async ({ page }) => {
    const testContext = await setup(page, {
      blockchain: {
        blockNumber: USDS_RESERVE_ACTIVE_BLOCK_NUMBER,
        chain: mainnet,
      },
      initialPage: 'easyBorrow',
      account: {
        type: 'connected-random',
        assetBalances: { ...initialBalances },
      },
    })

    const borrowPage = new BorrowPageObject(testContext)
    const myPortfolioPage = new MyPortfolioPageObject(testContext)
    const borrowDialog = new DialogPageObject({ testContext, header })

    await borrowPage.depositWithoutBorrowActions({
      assetsToDeposit: { rETH: 2 },
    })
    await myPortfolioPage.goToMyPortfolioAction()
    await myPortfolioPage.expectDepositedAssets('$4,282')
    await myPortfolioPage.clickBorrowButtonAction('USDS')

    await borrowDialog.fillAmountAction(100)
    await borrowDialog.actionsContainer.acceptAllActionsAction(1)
    await borrowDialog.expectSuccessPage({
      tokenWithValue: [{ asset: 'USDS', amount: '100.00', usdValue: '$100.00' }],
    })
    await borrowDialog.viewInMyPortfolioAction()

    await myPortfolioPage.expectBorrowTable({
      USDS: 100,
    })
  })
})
