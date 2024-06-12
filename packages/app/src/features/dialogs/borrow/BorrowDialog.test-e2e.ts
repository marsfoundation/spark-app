import { test } from '@playwright/test'
import { mainnet } from 'viem/chains'

import { borrowValidationIssueToMessage } from '@/domain/market-validators/validateBorrow'
import { ActionsPageObject } from '@/features/actions/ActionsContainer.PageObject'
import { BorrowPageObject } from '@/pages/Borrow.PageObject'
import { DashboardPageObject } from '@/pages/Dashboard.PageObject'
import { DEFAULT_BLOCK_NUMBER } from '@/test/e2e/constants'
import { setup } from '@/test/e2e/setup'
import { setupFork } from '@/test/e2e/setupFork'
import { screenshot } from '@/test/e2e/utils'

import { DialogPageObject } from '../common/Dialog.PageObject'

const headerRegExp = /Borrow */

test.describe('Borrow dialog', () => {
  const fork = setupFork({ blockNumber: DEFAULT_BLOCK_NUMBER, chainId: mainnet.id })
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
    const expectedInitialHealthFactor = '5.42'
    const expectedHealthFactor = '2.04'

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
      await dashboardPage.clickBorrowButtonAction('rETH')

      const borrowDialog = new DialogPageObject(page, headerRegExp)
      await borrowDialog.expectSelectedAsset('rETH')
      await borrowDialog.expectDialogHeader('Borrow rETH')
      await borrowDialog.expectHealthFactorBeforeVisible()

      await screenshot(borrowDialog.getDialog(), 'borrow-dialog-default-view')
    })

    test('calculates health factor changes correctly', async ({ page }) => {
      const dashboardPage = new DashboardPageObject(page)
      await dashboardPage.clickBorrowButtonAction('rETH')

      const borrowDialog = new DialogPageObject(page, headerRegExp)
      await borrowDialog.fillAmountAction(1)

      await borrowDialog.expectRiskLevelBefore('Healthy')
      await borrowDialog.expectHealthFactorBefore(expectedInitialHealthFactor)
      await borrowDialog.expectRiskLevelAfter('Moderate')
      await borrowDialog.expectHealthFactorAfter(expectedHealthFactor)

      // @note this is needed for deterministic screenshots
      const actionsContainer = new ActionsPageObject(borrowDialog.locatePanelByHeader('Actions'))
      await actionsContainer.expectNextActionEnabled()

      await screenshot(borrowDialog.getDialog(), 'borrow-dialog-health-factor')
    })

    test('after borrow, health factor matches dashboard', async ({ page }) => {
      const dashboardPage = new DashboardPageObject(page)
      await dashboardPage.clickBorrowButtonAction('rETH')

      const borrowDialog = new DialogPageObject(page, headerRegExp)
      await borrowDialog.fillAmountAction(1)
      const actionsContainer = new ActionsPageObject(borrowDialog.locatePanelByHeader('Actions'))
      await actionsContainer.acceptAllActionsAction(1)

      await borrowDialog.viewInDashboardAction()
      await dashboardPage.expectHealthFactor(expectedHealthFactor)
    })

    test('has correct action plan for erc-20', async ({ page }) => {
      const dashboardPage = new DashboardPageObject(page)

      await dashboardPage.clickBorrowButtonAction('rETH')

      const borrowDialog = new DialogPageObject(page, headerRegExp)
      await borrowDialog.fillAmountAction(1)
      const actionsContainer = new ActionsPageObject(borrowDialog.locatePanelByHeader('Actions'))
      await actionsContainer.expectActions(
        [
          {
            type: 'borrow',
            asset: 'rETH',
            amount: 1,
          },
        ],
        true,
      )
    })

    test('can borrow erc-20', async ({ page }) => {
      const borrow = {
        asset: 'rETH',
        amount: 1,
      }

      const dashboardPage = new DashboardPageObject(page)

      await dashboardPage.clickBorrowButtonAction(borrow.asset)

      const borrowDialog = new DialogPageObject(page, headerRegExp)
      await borrowDialog.fillAmountAction(borrow.amount)
      const actionsContainer = new ActionsPageObject(borrowDialog.locatePanelByHeader('Actions'))
      await actionsContainer.acceptAllActionsAction(1)
      await borrowDialog.expectSuccessPage([borrow], fork)

      await screenshot(borrowDialog.getDialog(), 'borrow-dialog-erc-20-success')

      await borrowDialog.viewInDashboardAction()

      await dashboardPage.expectBorrowTable({
        [borrow.asset]: borrow.amount,
      })
    })

    test('has correct action plan for native asset', async ({ page }) => {
      const borrowAmount = 1

      const dashboardPage = new DashboardPageObject(page)

      await dashboardPage.clickBorrowButtonAction('WETH')

      const borrowDialog = new DialogPageObject(page, headerRegExp)
      await borrowDialog.selectAssetAction('ETH')
      await borrowDialog.fillAmountAction(1)

      await borrowDialog.expectHealthFactorVisible()

      const actionsContainer = new ActionsPageObject(borrowDialog.locatePanelByHeader('Actions'))
      await actionsContainer.expectActions(
        [
          {
            type: 'approveDelegation',
            asset: 'ETH',
            amount: borrowAmount,
          },
          {
            type: 'borrow',
            asset: 'ETH',
            amount: borrowAmount,
          },
        ],
        true,
      )

      await screenshot(borrowDialog.getDialog(), 'borrow-dialog-eth-action-plan')
    })

    test('can borrow native asset', async ({ page }) => {
      const borrow = {
        asset: 'ETH',
        amount: 1,
      }

      const dashboardPage = new DashboardPageObject(page)

      await dashboardPage.clickBorrowButtonAction('WETH')

      const borrowDialog = new DialogPageObject(page, headerRegExp)
      await borrowDialog.selectAssetAction(borrow.asset)
      await borrowDialog.fillAmountAction(1)
      const actionsContainer = new ActionsPageObject(borrowDialog.locatePanelByHeader('Actions'))
      await actionsContainer.acceptAllActionsAction(2)
      await borrowDialog.expectSuccessPage([borrow], fork)
      await screenshot(borrowDialog.getDialog(), 'borrow-dialog-eth-success')

      await borrowDialog.viewInDashboardAction()

      await dashboardPage.expectBorrowTable({
        WETH: borrow.amount,
      })
    })

    test('can borrow same asset again', async ({ page }) => {
      const borrow = {
        asset: 'DAI',
        amount: 1500,
      }

      const dashboardPage = new DashboardPageObject(page)

      await dashboardPage.clickBorrowButtonAction(borrow.asset)

      const borrowDialog = new DialogPageObject(page, headerRegExp)
      await borrowDialog.fillAmountAction(borrow.amount)
      const actionsContainer = new ActionsPageObject(borrowDialog.locatePanelByHeader('Actions'))
      await actionsContainer.acceptAllActionsAction(1)
      await borrowDialog.expectSuccessPage([borrow], fork)

      await screenshot(borrowDialog.getDialog(), 'borrow-dialog-borrow-twice-success')

      await borrowDialog.viewInDashboardAction()

      await dashboardPage.expectBorrowTable({
        [borrow.asset]: borrow.amount + daiToBorrow,
      })
    })

    test("can't borrow more than allowed", async ({ page }) => {
      const borrowAsset = 'wstETH'
      const dashboardPage = new DashboardPageObject(page)
      await dashboardPage.clickBorrowButtonAction(borrowAsset)

      const borrowDialog = new DialogPageObject(page, headerRegExp)
      await borrowDialog.fillAmountAction(initialDeposits[borrowAsset] * 10)

      await borrowDialog.expectAssetInputError(borrowValidationIssueToMessage['insufficient-collateral'])
      await borrowDialog.expectHealthFactorBeforeVisible()
      await screenshot(borrowDialog.getDialog(), 'borrow-dialog-exceeds-max-amount')
    })
  })

  test.describe('Position with only deposit', () => {
    const initialDeposits = {
      wstETH: 2,
      rETH: 2,
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
      // to simulate a position with only deposits, we go through the easy borrow flow
      // but interrupt it before the borrow action, going directly to the dashboard
      // this way we have deposit transactions executed, but no borrow transaction
      // resulting in a position with only deposits
      await borrowPage.fillDepositAssetAction(0, 'wstETH', initialDeposits.wstETH)
      await borrowPage.addNewDepositAssetAction()
      await borrowPage.fillBorrowAssetAction(1) // doesn't matter, we're not borrowing anything
      await borrowPage.fillDepositAssetAction(1, 'rETH', initialDeposits.rETH)
      await borrowPage.submitAction()

      const actionsContainer = new ActionsPageObject(page)
      for (let i = 0; i < 4; i++) {
        await actionsContainer.acceptNextActionAction()
      }
      await actionsContainer.expectNextActionEnabled()

      const dashboardPage = new DashboardPageObject(page)
      await dashboardPage.goToDashboardAction()
    })

    test('can borrow erc-20', async ({ page }) => {
      const borrow = {
        asset: 'wstETH',
        amount: 1,
      }

      const dashboardPage = new DashboardPageObject(page)
      await dashboardPage.clickBorrowButtonAction(borrow.asset)

      const borrowDialog = new DialogPageObject(page, headerRegExp)
      await borrowDialog.fillAmountAction(borrow.amount)
      const actionsContainer = new ActionsPageObject(borrowDialog.locatePanelByHeader('Actions'))
      await actionsContainer.acceptAllActionsAction(1)
      await borrowDialog.expectSuccessPage([borrow], fork)

      await screenshot(borrowDialog.getDialog(), 'borrow-dialog-only-deposit-erc-20-success')

      await borrowDialog.viewInDashboardAction()

      await dashboardPage.expectBorrowTable({
        [borrow.asset]: borrow.amount,
      })
    })

    test('can borrow USDC', async ({ page }) => {
      const borrow = {
        asset: 'USDC',
        amount: 100,
      }

      const dashboardPage = new DashboardPageObject(page)

      await dashboardPage.clickBorrowButtonAction(borrow.asset)

      const borrowDialog = new DialogPageObject(page, headerRegExp)
      await borrowDialog.fillAmountAction(borrow.amount)
      const actionsContainer = new ActionsPageObject(borrowDialog.locatePanelByHeader('Actions'))
      await actionsContainer.acceptAllActionsAction(1)
      await borrowDialog.expectSuccessPage([borrow], fork)

      await screenshot(borrowDialog.getDialog(), 'borrow-dialog-USDC-success')

      await borrowDialog.viewInDashboardAction()

      await dashboardPage.expectBorrowTable({
        [borrow.asset]: borrow.amount,
      })
    })

    test('displays health factor', async ({ page }) => {
      const dashboardPage = new DashboardPageObject(page)
      await dashboardPage.clickBorrowButtonAction('rETH')

      const borrowDialog = new DialogPageObject(page, headerRegExp)
      await borrowDialog.fillAmountAction(1)
      await borrowDialog.expectHealthFactorAfterVisible()

      // @note this is needed for deterministic screenshots
      const actionsContainer = new ActionsPageObject(borrowDialog.locatePanelByHeader('Actions'))
      await actionsContainer.expectNextActionEnabled()

      await screenshot(borrowDialog.getDialog(), 'borrow-dialog-only-deposit-health-factor')
    })
  })
})
