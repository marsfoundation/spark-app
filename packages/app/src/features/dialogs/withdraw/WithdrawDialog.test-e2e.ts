import { test } from '@playwright/test'
import { mainnet } from 'viem/chains'

import { withdrawalValidationIssueToMessage } from '@/domain/market-validators/validateWithdraw'
import { ActionsPageObject } from '@/features/actions/ActionsContainer.PageObject'
import { BorrowPageObject } from '@/pages/Borrow.PageObject'
import { DashboardPageObject } from '@/pages/Dashboard.PageObject'
import { DEFAULT_BLOCK_NUMBER } from '@/test/e2e/constants'
import { setup } from '@/test/e2e/setup'
import { setupFork } from '@/test/e2e/setupFork'
import { screenshot } from '@/test/e2e/utils'

import { DialogPageObject } from '../common/Dialog.PageObject'

const headerRegExp = /Withdr*/

test.describe('Withdraw dialog', () => {
  const fork = setupFork({ blockNumber: DEFAULT_BLOCK_NUMBER, chainId: mainnet.id })
  const initialBalances = {
    wstETH: 100,
    rETH: 100,
    ETH: 100,
  }

  test.describe('Position with deposit and borrow', () => {
    const initialDeposits = {
      wstETH: 2,
      rETH: 2,
    } as const
    const daiToBorrow = 3500

    test.beforeEach(async ({ page }) => {
      await setup(page, fork, {
        initialPage: 'easyBorrow',
        account: {
          type: 'connected-random',
          assetBalances: { ...initialBalances },
        },
      })

      const borrowPage = new BorrowPageObject(page)
      await borrowPage.depositAssetsActions(initialDeposits, daiToBorrow)
      await borrowPage.viewInDashboardAction()

      const dashboardPage = new DashboardPageObject(page)
      // @todo This waits for the refetch of the data after successful borrow transaction to happen.
      // This is no ideal, probably we need to refactor expectDepositTable so it takes advantage from
      // playwright's timeouts instead of parsing it's current state. Then we would be able to
      // easily wait for the table to be updated.
      await dashboardPage.expectAssetToBeInDepositTable('DAI')
    })

    test('opens dialog with selected asset', async ({ page }) => {
      const dashboardPage = new DashboardPageObject(page)
      await dashboardPage.clickWithdrawButtonAction('rETH')

      const withdrawDialog = new DialogPageObject(page, headerRegExp)
      await withdrawDialog.expectSelectedAsset('rETH')
      await withdrawDialog.expectDialogHeader('Withdraw rETH')
      await withdrawDialog.expectHealthFactorBeforeVisible()

      await screenshot(withdrawDialog.getDialog(), 'withdraw-dialog-default-view')
    })

    test('calculates health factor changes correctly', async ({ page }) => {
      const dashboardPage = new DashboardPageObject(page)
      await dashboardPage.clickWithdrawButtonAction('rETH')

      const withdrawDialog = new DialogPageObject(page, headerRegExp)
      await withdrawDialog.fillAmountAction(1)

      await withdrawDialog.expectRiskLevelBefore('Moderate')
      await withdrawDialog.expectHealthFactorBefore('2.32')
      await withdrawDialog.expectRiskLevelAfter('Risky')
      await withdrawDialog.expectHealthFactorAfter('1.76')

      // @note this is needed for deterministic screenshots
      const actionsContainer = new ActionsPageObject(withdrawDialog.locatePanelByHeader('Actions'))
      await actionsContainer.expectNextActionEnabled()

      await screenshot(withdrawDialog.getDialog(), 'withdraw-dialog-health-factor')
    })

    test('has correct action plan for erc-20', async ({ page }) => {
      const dashboardPage = new DashboardPageObject(page)

      await dashboardPage.clickWithdrawButtonAction('rETH')

      const withdrawDialog = new DialogPageObject(page, headerRegExp)
      await withdrawDialog.fillAmountAction(1)
      const actionsContainer = new ActionsPageObject(withdrawDialog.locatePanelByHeader('Actions'))
      await actionsContainer.expectActions(
        [
          {
            type: 'withdraw',
            asset: 'rETH',
            amount: 1,
          },
        ],
        true,
      )
    })

    test('can withdraw erc-20', async ({ page }) => {
      const withdraw = {
        asset: 'rETH',
        amount: 1,
      } as const

      const dashboardPage = new DashboardPageObject(page)

      await dashboardPage.clickWithdrawButtonAction(withdraw.asset)

      const withdrawDialog = new DialogPageObject(page, headerRegExp)
      await withdrawDialog.fillAmountAction(withdraw.amount)
      const actionsContainer = new ActionsPageObject(withdrawDialog.locatePanelByHeader('Actions'))
      await actionsContainer.acceptAllActionsAction(1)
      await withdrawDialog.expectSuccessPage([withdraw], fork)

      await screenshot(withdrawDialog.getDialog(), 'withdraw-dialog-erc-20-success')

      await withdrawDialog.viewInDashboardAction()

      await dashboardPage.expectDepositTable({
        ...initialDeposits,
        [withdraw.asset]: initialDeposits[withdraw.asset] - withdraw.amount,
      })
    })
  })

  test.describe('Form validation', () => {
    const initialDeposits = {
      wstETH: 5,
      rETH: 1,
    } as const
    const daiToBorrow = 4500

    test.beforeEach(async ({ page }) => {
      await setup(page, fork, {
        initialPage: 'easyBorrow',
        account: {
          type: 'connected-random',
          assetBalances: { ...initialBalances },
        },
      })

      const borrowPage = new BorrowPageObject(page)
      await borrowPage.depositAssetsActions(initialDeposits, daiToBorrow)
      await borrowPage.viewInDashboardAction()

      const dashboardPage = new DashboardPageObject(page)
      // @todo This waits for the refetch of the data after successful borrow transaction to happen.
      // This is no ideal, probably we need to refactor expectDepositTable so it takes advantage from
      // playwright's timeouts instead of parsing it's current state. Then we would be able to
      // easily wait for the table to be updated.
      await dashboardPage.expectAssetToBeInDepositTable('DAI')
    })

    test('cannot withdraw amount that will result in health factor under 1', async ({ page }) => {
      const withdrawAsset = 'wstETH'
      const dashboardPage = new DashboardPageObject(page)
      await dashboardPage.expectDepositTable(initialDeposits)
      await dashboardPage.clickWithdrawButtonAction(withdrawAsset)

      const withdrawDialog = new DialogPageObject(page, headerRegExp)
      await withdrawDialog.expectHealthFactorBefore('2.75')
      await withdrawDialog.fillAmountAction(initialDeposits[withdrawAsset])
      await withdrawDialog.expectAssetInputError('Remaining collateral cannot support the loan')

      await screenshot(withdrawDialog.getDialog(), 'withdraw-dialog-cannot-support-loan')
    })

    test('cannot withdraw more than deposited', async ({ page }) => {
      const withdrawAsset = 'rETH'
      const dashboardPage = new DashboardPageObject(page)
      await dashboardPage.expectDepositTable(initialDeposits)
      await dashboardPage.clickWithdrawButtonAction(withdrawAsset)

      const withdrawDialog = new DialogPageObject(page, headerRegExp)
      await withdrawDialog.expectHealthFactorBefore('2.75')
      await withdrawDialog.fillAmountAction(initialDeposits[withdrawAsset] + 1)
      await withdrawDialog.expectAssetInputError(withdrawalValidationIssueToMessage['exceeds-balance'])

      await screenshot(withdrawDialog.getDialog(), 'withdraw-dialog-more-than-deposited')
    })
  })

  test.describe('Position with native deposit and borrow', () => {
    const ETHdeposit = {
      asset: 'ETH',
      amount: 10,
    }
    const borrow = {
      asset: 'DAI',
      amount: 1000,
    }

    test.beforeEach(async ({ page }) => {
      await setup(page, fork, {
        initialPage: 'easyBorrow',
        account: {
          type: 'connected-random',
          assetBalances: { ...initialBalances },
        },
      })

      const borrowPage = new BorrowPageObject(page)
      const actionsContainer = new ActionsPageObject(page)
      await borrowPage.fillDepositAssetAction(0, ETHdeposit.asset, ETHdeposit.amount)
      await borrowPage.fillBorrowAssetAction(borrow.amount)

      await borrowPage.submitAction()

      await actionsContainer.acceptAllActionsAction(2)

      await borrowPage.expectSuccessPage([ETHdeposit], borrow, fork)

      const dashboardPage = new DashboardPageObject(page)
      await dashboardPage.goToDashboardAction()
    })

    // @note When ETH is deposited, deposit table shows WETH instead of ETH
    test('has correct action plan for native asset', async ({ page }) => {
      const dashboardPage = new DashboardPageObject(page)

      await dashboardPage.clickWithdrawButtonAction('WETH')

      const withdrawDialog = new DialogPageObject(page, headerRegExp)
      await withdrawDialog.selectAssetAction('ETH')
      await withdrawDialog.fillAmountAction(1)
      await withdrawDialog.expectHealthFactorVisible()
      const actionsContainer = new ActionsPageObject(withdrawDialog.locatePanelByHeader('Actions'))
      await actionsContainer.expectActions(
        [
          {
            type: 'approve',
            asset: 'aWETH',
            amount: 1,
          },
          {
            type: 'withdraw',
            asset: 'ETH',
            amount: 1,
          },
        ],
        true,
      )

      await screenshot(withdrawDialog.getDialog(), 'withdraw-dialog-eth-action-plan')
    })

    // @note When ETH is deposited, deposit table shows WETH instead of ETH
    test('can withdraw native asset', async ({ page }) => {
      const withdrawAmount = 1

      const dashboardPage = new DashboardPageObject(page)

      await dashboardPage.clickWithdrawButtonAction('WETH')

      const withdrawDialog = new DialogPageObject(page, headerRegExp)
      await withdrawDialog.selectAssetAction('ETH')
      await withdrawDialog.fillAmountAction(withdrawAmount)
      const actionsContainer = new ActionsPageObject(withdrawDialog.locatePanelByHeader('Actions'))
      await actionsContainer.acceptAllActionsAction(2)
      await withdrawDialog.expectSuccessPage(
        [
          {
            asset: 'ETH',
            amount: withdrawAmount,
          },
        ],
        fork,
      )
      await screenshot(withdrawDialog.getDialog(), 'withdraw-dialog-eth-success')

      await withdrawDialog.viewInDashboardAction()

      await dashboardPage.expectDepositTable({
        // @todo Figure out how WETH and ETH conversion should work
        WETH: ETHdeposit.amount - withdrawAmount,
      })
    })
  })

  test.describe('Position with only deposit', () => {
    const initialDeposits = {
      wstETH: 10,
      ETH: 2,
    } as const

    test.beforeEach(async ({ page }) => {
      await setup(page, fork, {
        initialPage: 'easyBorrow',
        account: {
          type: 'connected-random',
          assetBalances: { ...initialBalances },
        },
      })

      const borrowPage = new BorrowPageObject(page)
      // to simulate a position with only deposits, we go through the easy borrow flow
      // but interrupt it before the borrow action, going directly to the dashboard
      // this way we have deposit transactions executed, but no borrow transaction
      // resulting in a position with only deposits
      await borrowPage.fillDepositAssetAction(0, 'wstETH', initialDeposits.wstETH)
      await borrowPage.addNewDepositAssetAction()
      await borrowPage.fillBorrowAssetAction(1) // doesn't matter, we're not borrowing anything
      await borrowPage.fillDepositAssetAction(1, 'ETH', initialDeposits.ETH)
      await borrowPage.submitAction()

      const actionsContainer = new ActionsPageObject(page)
      await actionsContainer.acceptAllActionsAction(3)
      await actionsContainer.expectNextActionEnabled()

      const dashboardPage = new DashboardPageObject(page)
      await dashboardPage.goToDashboardAction()
    })

    test('can withdraw erc-20', async ({ page }) => {
      const withdraw = {
        asset: 'wstETH',
        amount: 1,
      } as const

      const dashboardPage = new DashboardPageObject(page)
      await dashboardPage.clickWithdrawButtonAction(withdraw.asset)

      const withdrawDialog = new DialogPageObject(page, headerRegExp)
      await withdrawDialog.fillAmountAction(withdraw.amount)
      const actionsContainer = new ActionsPageObject(withdrawDialog.locatePanelByHeader('Actions'))
      await actionsContainer.acceptAllActionsAction(1)
      await withdrawDialog.expectSuccessPage([withdraw], fork)

      await screenshot(withdrawDialog.getDialog(), 'withdraw-dialog-only-deposit-erc-20-success')

      await withdrawDialog.viewInDashboardAction()

      await dashboardPage.expectDepositTable({
        WETH: initialDeposits.ETH,
        [withdraw.asset]: initialDeposits[withdraw.asset] - withdraw.amount,
      })
    })

    test('can fully withdraw erc-20', async ({ page }) => {
      const withdraw = {
        asset: 'wstETH',
        amount: 10,
      } as const

      const dashboardPage = new DashboardPageObject(page)
      await dashboardPage.clickWithdrawButtonAction(withdraw.asset)

      const withdrawDialog = new DialogPageObject(page, headerRegExp)
      await withdrawDialog.clickMaxAmountAction()
      const actionsContainer = new ActionsPageObject(withdrawDialog.locatePanelByHeader('Actions'))
      await actionsContainer.acceptAllActionsAction(1)
      await withdrawDialog.expectSuccessPage([withdraw], fork)

      await screenshot(withdrawDialog.getDialog(), 'withdraw-dialog-only-deposit-erc-20-success')

      await withdrawDialog.viewInDashboardAction()

      await dashboardPage.expectDepositTable({
        WETH: initialDeposits.ETH,
        [withdraw.asset]: 0,
      })
    })

    test('does not display health factor', async ({ page }) => {
      const dashboardPage = new DashboardPageObject(page)
      await dashboardPage.clickWithdrawButtonAction('wstETH')

      const withdrawDialog = new DialogPageObject(page, headerRegExp)
      await withdrawDialog.fillAmountAction(1)

      await withdrawDialog.expectHealthFactorNotVisible()

      // @note this is needed for deterministic screenshots
      const actionsContainer = new ActionsPageObject(withdrawDialog.locatePanelByHeader('Actions'))
      await actionsContainer.expectNextActionEnabled()

      await screenshot(withdrawDialog.getDialog(), 'withdraw-dialog-only-deposit-health-factor')
    })

    test('can fully withdraw native asset', async ({ page }) => {
      const dashboardPage = new DashboardPageObject(page)
      await dashboardPage.clickWithdrawButtonAction('WETH')

      const withdrawDialog = new DialogPageObject(page, headerRegExp)
      await withdrawDialog.selectAssetAction('ETH')
      await withdrawDialog.clickMaxAmountAction()
      const actionsContainer = new ActionsPageObject(withdrawDialog.locatePanelByHeader('Actions'))
      await actionsContainer.acceptAllActionsAction(2)
      await withdrawDialog.expectSuccessPage(
        [
          {
            asset: 'ETH',
            amount: initialDeposits.ETH,
          },
        ],
        fork,
      )

      await withdrawDialog.viewInDashboardAction()

      await dashboardPage.expectDepositTable({
        WETH: 0,
        wstETH: initialDeposits.wstETH,
      })
    })
  })
})
