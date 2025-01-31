import { test } from '@playwright/test'
import { mainnet } from 'viem/chains'

import { BorrowPageObject } from '@/pages/Borrow.PageObject'
import { MyPortfolioPageObject } from '@/pages/MyPortfolio.PageObject'
import { DEFAULT_BLOCK_NUMBER } from '@/test/e2e/constants'
import { setup } from '@/test/e2e/setup'

import { TestTokenWithValue } from '@/test/e2e/assertions'
import { DialogPageObject } from '../common/Dialog.PageObject'

const headerRegExp = /Deposit */

test.describe('Deposit dialog', () => {
  const initialBalances = {
    wstETH: 100,
    rETH: 100,
    ETH: 100,
  }

  test.describe('Position with deposit and borrow', () => {
    const initialDeposits = {
      wstETH: 1,
      rETH: 2,
    }
    const daiToBorrow = 1500
    const expectedInitialHealthFactor = '7.2'
    const expectedHealthFactor = '9.55'

    let myPortfolioPage: MyPortfolioPageObject
    let depositDialog: DialogPageObject

    test.beforeEach(async ({ page }) => {
      const testContext = await setup(page, {
        blockchain: {
          chain: mainnet,
          blockNumber: DEFAULT_BLOCK_NUMBER,
        },
        initialPage: 'easyBorrow',
        account: {
          type: 'connected-random',
          assetBalances: { ...initialBalances },
        },
      })

      const borrowPage = new BorrowPageObject(testContext)
      await borrowPage.depositAssetsActions({ assetsToDeposit: initialDeposits, daiToBorrow })
      await borrowPage.viewInMyPortfolioAction()

      myPortfolioPage = new MyPortfolioPageObject(testContext)
      // @todo This waits for the refetch of the data after successful borrow transaction to happen.
      // This is no ideal, probably we need to refactor expectDepositTable so it takes advantage from
      // playwright's timeouts instead of parsing it's current state. Then we would be able to
      // easily wait for the table to be updated.
      await myPortfolioPage.expectAssetToBeInDepositTable('DAI')
      await myPortfolioPage.expectDepositTable(initialDeposits)

      depositDialog = new DialogPageObject({
        testContext,
        header: headerRegExp,
      })
    })

    test('opens dialog with selected asset', async () => {
      await myPortfolioPage.clickDepositButtonAction('rETH')

      await depositDialog.expectSelectedAsset('rETH')
      await depositDialog.expectDialogHeader('Deposit rETH')
      await depositDialog.expectHealthFactorBeforeVisible()
    })

    test('calculates health factor changes correctly', async () => {
      await myPortfolioPage.clickDepositButtonAction('rETH')
      await depositDialog.fillAmountAction(1)

      await depositDialog.expectRiskLevelBefore('Healthy')
      await depositDialog.expectHealthFactorBefore(expectedInitialHealthFactor)
      await depositDialog.expectRiskLevelAfter('Healthy')
      await depositDialog.expectHealthFactorAfter(expectedHealthFactor)
    })

    test('after deposit, health factor matches myPortfolio', async () => {
      await myPortfolioPage.clickDepositButtonAction('rETH')
      await depositDialog.fillAmountAction(1)
      await depositDialog.actionsContainer.acceptAllActionsAction(2)

      await depositDialog.viewInMyPortfolioAction()
      await myPortfolioPage.expectHealthFactor(expectedHealthFactor)
    })

    test('has correct action plan for erc-20 with permit support', async () => {
      await myPortfolioPage.clickDepositButtonAction('wstETH')
      await depositDialog.fillAmountAction(1)

      await depositDialog.actionsContainer.expectActions([
        { type: 'permit', asset: 'wstETH' },
        { type: 'deposit', asset: 'wstETH' },
      ])
    })

    test('can switch to approves in action plan', async () => {
      await myPortfolioPage.clickDepositButtonAction('wstETH')
      await depositDialog.fillAmountAction(1)

      await depositDialog.actionsContainer.expectEnabledActionAtIndex(0)
      await depositDialog.actionsContainer.expectActions([
        { type: 'permit', asset: 'wstETH' },
        { type: 'deposit', asset: 'wstETH' },
      ])

      await depositDialog.actionsContainer.switchPreferPermitsAction()

      await depositDialog.actionsContainer.expectEnabledActionAtIndex(0)
      await depositDialog.actionsContainer.expectActions([
        { type: 'approve', asset: 'wstETH' },
        { type: 'deposit', asset: 'wstETH' },
      ])
    })

    test('has correct action plan for erc-20 with no permit support', async () => {
      await myPortfolioPage.clickDepositButtonAction('rETH')

      await depositDialog.fillAmountAction(1)
      await depositDialog.actionsContainer.expectActions([
        { type: 'approve', asset: 'rETH' },
        { type: 'deposit', asset: 'rETH' },
      ])
    })

    test('can deposit erc-20 using permits', async () => {
      const deposit: TestTokenWithValue = {
        asset: 'wstETH',
        amount: '1.00',
        usdValue: '$4,665.46',
      }

      await myPortfolioPage.clickDepositButtonAction(deposit.asset)
      await depositDialog.fillAmountAction(Number(deposit.amount))
      await depositDialog.actionsContainer.acceptAllActionsAction(2)
      await depositDialog.expectSuccessPage({ tokenWithValue: [deposit] })

      await depositDialog.viewInMyPortfolioAction()

      await myPortfolioPage.expectDepositTable({
        ...initialDeposits,
        wstETH: initialDeposits.wstETH + 1,
      })
    })

    test('can deposit erc-20 using approves', async () => {
      const deposit: TestTokenWithValue = {
        asset: 'rETH',
        amount: '1.00',
        usdValue: '$4,413.26',
      }

      await myPortfolioPage.clickDepositButtonAction(deposit.asset)
      await depositDialog.fillAmountAction(Number(deposit.amount))
      await depositDialog.actionsContainer.acceptAllActionsAction(2)
      await depositDialog.expectSuccessPage({ tokenWithValue: [deposit] })

      await depositDialog.viewInMyPortfolioAction()

      await myPortfolioPage.expectDepositTable({
        ...initialDeposits,
        rETH: initialDeposits.rETH + 1,
      })
    })

    test('has correct action plan for native asset', async () => {
      await myPortfolioPage.clickDepositButtonAction('WETH')
      await depositDialog.selectAssetAction('ETH')
      await depositDialog.fillAmountAction(1)
      await depositDialog.expectHealthFactorVisible()
      await depositDialog.actionsContainer.expectActions([{ type: 'deposit', asset: 'ETH' }])
    })

    test('can deposit native asset', async () => {
      const deposit: TestTokenWithValue = {
        asset: 'WETH',
        amount: '1.00',
        usdValue: '$3,928.31',
      }

      await myPortfolioPage.clickDepositButtonAction(deposit.asset)

      await depositDialog.selectAssetAction('ETH')
      await depositDialog.fillAmountAction(Number(deposit.amount))
      await depositDialog.actionsContainer.acceptAllActionsAction(1)
      await depositDialog.expectSuccessPage({
        tokenWithValue: [
          {
            asset: 'ETH',
            amount: deposit.amount,
            usdValue: deposit.usdValue,
          },
        ],
      })

      await depositDialog.viewInMyPortfolioAction()

      await myPortfolioPage.expectDepositTable({
        ...initialDeposits,
        // @todo Figure out how WETH and ETH conversion should work
        WETH: 1,
      })
    })

    test("can't deposit more than wallet balance", async () => {
      const depositAsset = 'rETH'
      await myPortfolioPage.clickDepositButtonAction(depositAsset)

      await depositDialog.fillAmountAction(initialBalances[depositAsset] - initialDeposits[depositAsset] + 1)

      await depositDialog.expectAssetInputError('Exceeds your balance')
      await depositDialog.expectHealthFactorBeforeVisible()
    })

    test('requires new approve when the input value is increased', async () => {
      const depositAsset = 'rETH'
      await myPortfolioPage.clickDepositButtonAction(depositAsset)
      await depositDialog.fillAmountAction(1)

      await depositDialog.actionsContainer.acceptActionAtIndex(0)
      await depositDialog.actionsContainer.expectEnabledActionAtIndex(1, { type: 'deposit', asset: depositAsset })

      await depositDialog.fillAmountAction(2)

      await depositDialog.actionsContainer.expectEnabledActionAtIndex(0, { type: 'approve', asset: depositAsset })
    })

    test('requires new permit when the input value is changed', async () => {
      const depositAsset = 'wstETH'
      await myPortfolioPage.clickDepositButtonAction(depositAsset)

      await depositDialog.fillAmountAction(2)

      await depositDialog.actionsContainer.acceptActionAtIndex(0)
      await depositDialog.actionsContainer.expectEnabledActionAtIndex(1, { type: 'deposit', asset: depositAsset })

      await depositDialog.fillAmountAction(1)

      await depositDialog.actionsContainer.expectEnabledActionAtIndex(0, { type: 'permit', asset: depositAsset })
    })
  })

  test.describe('Position with only deposit', () => {
    const initialDeposits = {
      wstETH: 10,
      rETH: 2,
    }

    let myPortfolioPage: MyPortfolioPageObject
    let depositDialog: DialogPageObject

    test.beforeEach(async ({ page }) => {
      const testContext = await setup(page, {
        blockchain: {
          chain: mainnet,
          blockNumber: DEFAULT_BLOCK_NUMBER,
        },
        initialPage: 'easyBorrow',
        account: {
          type: 'connected-random',
          assetBalances: { ...initialBalances },
        },
      })

      const borrowPage = new BorrowPageObject(testContext)
      // to simulate a position with only deposits, we go through the easy borrow flow
      // but interrupt it before the borrow action, going directly to the myPortfolio
      // this way we have deposit transactions executed, but no borrow transaction
      // resulting in a position with only deposits
      await borrowPage.fillDepositAssetAction(0, 'wstETH', initialDeposits.wstETH)
      await borrowPage.addNewDepositAssetAction()
      await borrowPage.fillBorrowAssetAction(1) // doesn't matter, we're not borrowing anything
      await borrowPage.fillDepositAssetAction(1, 'rETH', initialDeposits.rETH)
      await borrowPage.submitAction()

      for (let i = 0; i < 4; i++) {
        await borrowPage.actionsContainer.acceptActionAtIndex(i)
      }
      await borrowPage.actionsContainer.expectEnabledActionAtIndex(4)

      myPortfolioPage = new MyPortfolioPageObject(testContext)
      await myPortfolioPage.goToMyPortfolioAction()

      depositDialog = new DialogPageObject({
        testContext,
        header: headerRegExp,
      })
    })

    test('does not display health factor', async () => {
      await myPortfolioPage.clickDepositButtonAction('rETH')
      await depositDialog.fillAmountAction(1)

      await depositDialog.expectHealthFactorNotVisible()
    })
  })

  test.describe('No position', () => {
    test('can deposit up to max cap', async ({ page }) => {
      const initialBalances = {
        ETH: 1,
        cbBTC: 52,
      }

      const testContext = await setup(page, {
        blockchain: {
          chain: mainnet,
          blockNumber: DEFAULT_BLOCK_NUMBER,
        },
        initialPage: 'myPortfolio',
        account: {
          type: 'connected-random',
          assetBalances: { ...initialBalances },
        },
      })

      const myPortfolioPage = new MyPortfolioPageObject(testContext)
      await myPortfolioPage.clickDepositButtonAction('cbBTC')

      const depositDialog = new DialogPageObject({
        testContext,
        header: headerRegExp,
      })
      await depositDialog.clickMaxAmountAction()
      await testContext.testnetController.progressSimulationAndMine(5 * 60)

      await depositDialog.actionsContainer.acceptAllActionsAction(2)
      await depositDialog.expectSuccessPage({
        tokenWithValue: [
          {
            asset: 'cbBTC',
            amount: '50.0464443',
            usdValue: '$5,088,872.59',
          },
        ],
      })

      await depositDialog.viewInMyPortfolioAction()
      await myPortfolioPage.expectDepositTable({
        cbBTC: 50.0464443,
      })
    })

    test('can deposit asset that cannot be used as collateral', async ({ page }) => {
      const initialBalances = {
        ETH: 1,
        USDT: 10000,
      }

      const testContext = await setup(page, {
        blockchain: {
          chain: mainnet,
          blockNumber: DEFAULT_BLOCK_NUMBER,
        },
        initialPage: 'myPortfolio',
        account: {
          type: 'connected-random',
          assetBalances: { ...initialBalances },
        },
      })

      const myPortfolioPage = new MyPortfolioPageObject(testContext)
      await myPortfolioPage.clickDepositButtonAction('USDT')

      const depositDialog = new DialogPageObject({
        testContext,
        header: headerRegExp,
      })
      await depositDialog.fillAmountAction(initialBalances.USDT)

      await depositDialog.actionsContainer.acceptAllActionsAction(2)
      await depositDialog.expectSuccessPage({
        tokenWithValue: [
          {
            asset: 'USDT',
            amount: '10,000.00',
            usdValue: '$10,000.00',
          },
        ],
      })

      await depositDialog.viewInMyPortfolioAction()
      await myPortfolioPage.expectDepositTable({
        USDT: initialBalances.USDT,
      })
    })

    test('retains some native asset when depositing max', async ({ page }) => {
      const testContext = await setup(page, {
        blockchain: {
          chain: mainnet,
          blockNumber: DEFAULT_BLOCK_NUMBER,
        },
        initialPage: 'myPortfolio',
        account: {
          type: 'connected-random',
          assetBalances: { ETH: 1 },
        },
      })

      const myPortfolioPage = new MyPortfolioPageObject(testContext)
      await myPortfolioPage.clickDepositButtonAction('WETH')
      const depositDialog = new DialogPageObject({
        testContext,
        header: headerRegExp,
      })
      await depositDialog.selectAssetAction('ETH')
      await depositDialog.clickMaxAmountAction()

      await depositDialog.expectInputValue('0.999')
      await depositDialog.expectMaxButtonDisabled()
      await depositDialog.actionsContainer.expectEnabledActionAtIndex(0)
      await depositDialog.actionsContainer.expectActions([{ type: 'deposit', asset: 'ETH' }])
    })
  })
})
