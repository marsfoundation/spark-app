import { test } from '@playwright/test'

import { setUseAsCollateralValidationIssueToMessage } from '@/domain/market-validators/validateSetUseAsCollateral'
import { ActionsPageObject } from '@/features/actions/ActionsContainer.PageObject'
import { BorrowPageObject } from '@/pages/Borrow.PageObject'
import { DashboardPageObject } from '@/pages/Dashboard.PageObject'
import { DEFAULT_BLOCK_NUMBER, GNO_ACTIVE_BLOCK_NUMBER } from '@/test/e2e/constants'
import { setup } from '@/test/e2e/setup'
import { setupFork } from '@/test/e2e/setupFork'

import { DialogPageObject } from '../common/Dialog.PageObject'
import { CollateralDialogPageObject } from './CollateralDialog.PageObject'

test.describe('Collateral dialog', () => {
  const fork = setupFork(DEFAULT_BLOCK_NUMBER)
  const initialBalances = {
    wstETH: 100,
    rETH: 100,
    DAI: 10000,
    GNO: 100,
  }

  test.describe('Deposited multiple assets, no borrow', () => {
    const initialDeposits = {
      wstETH: 1,
    }
    const dashboardDeposits = {
      DAI: 1000, // cannot be used as collateral
    }

    test.beforeEach(async ({ page }) => {
      await setup(page, fork, {
        initialPage: 'easyBorrow',
        account: {
          type: 'connected',
          assetBalances: { ...initialBalances },
        },
      })

      const borrowPage = new BorrowPageObject(page)
      await borrowPage.depositWithoutBorrowActions(initialDeposits)
      const dashboardPage = new DashboardPageObject(page)
      await dashboardPage.goToDashboardAction()

      // Depositing DAI in dashboard
      await dashboardPage.clickDepositButtonAction('DAI')
      const depositDialog = new DialogPageObject(page, /Deposit/)
      await depositDialog.fillAmountAction(dashboardDeposits.DAI)
      const actionsContainer = new ActionsPageObject(depositDialog.locatePanelByHeader('Actions'))
      await actionsContainer.acceptAllActionsAction(2)
      await depositDialog.viewInDashboardAction()

      await dashboardPage.expectDepositTable({
        wstETH: initialDeposits.wstETH,
        DAI: dashboardDeposits.DAI,
      })
    })

    test('disables collateral', async ({ page }) => {
      const collateral = 'wstETH'

      const dashboardPage = new DashboardPageObject(page)
      await dashboardPage.expectCollateralSwitch(collateral, true)
      await dashboardPage.clickCollateralSwitchAction(collateral)

      const collateralDialog = new CollateralDialogPageObject(page)
      await collateralDialog.expectDialogHeader('Collateral')
      await collateralDialog.expectHealthFactorNotVisible()
      const actionsContainer = new ActionsPageObject(collateralDialog.locatePanelByHeader('Actions'))
      await actionsContainer.acceptAllActionsAction(1)
      await collateralDialog.expectSetUseAsCollateralSuccessPage(collateral, 'disabled')

      await dashboardPage.goToDashboardAction()
      await dashboardPage.expectCollateralSwitch('wstETH', false)
    })

    test('enables collateral', async ({ page }) => {
      const collateral = 'wstETH'

      // disabling collateral
      const dashboardPage = new DashboardPageObject(page)
      await dashboardPage.clickCollateralSwitchAction(collateral)
      const collateralDialog = new CollateralDialogPageObject(page)
      await collateralDialog.setUseAsCollateralAction(collateral, 'disabled')
      await dashboardPage.goToDashboardAction()

      // enabling collateral
      await dashboardPage.expectCollateralSwitch(collateral, false)
      await dashboardPage.clickCollateralSwitchAction(collateral)
      await collateralDialog.expectDialogHeader('Collateral')
      await collateralDialog.expectHealthFactorNotVisible()
      const actionsContainer = new ActionsPageObject(collateralDialog.locatePanelByHeader('Actions'))
      await actionsContainer.acceptAllActionsAction(1)
      await collateralDialog.expectSetUseAsCollateralSuccessPage(collateral, 'enabled')

      await dashboardPage.goToDashboardAction()
      await dashboardPage.expectCollateralSwitch(collateral, true)
    })

    test('cannot enable collateral for asset that cannot be used as collateral', async ({ page }) => {
      const asset = 'DAI'

      const dashboardPage = new DashboardPageObject(page)
      await dashboardPage.expectCollateralSwitch(asset, false)
      await dashboardPage.clickCollateralSwitchAction(asset)

      const collateralDialog = new CollateralDialogPageObject(page)
      await collateralDialog.expectDialogHeader('Collateral')
      await collateralDialog.expectHealthFactorNotVisible()
      await collateralDialog.expectAlertMessage(setUseAsCollateralValidationIssueToMessage['zero-ltv-asset'])
      const actionsContainer = new ActionsPageObject(collateralDialog.locatePanelByHeader('Actions'))
      await actionsContainer.expectActionsDisabled()

      await dashboardPage.goToDashboardAction()
      await dashboardPage.expectCollateralSwitch(asset, false)
    })

    test('cannot enable collateral for not deposited asset', async ({ page }) => {
      const asset = 'WBTC'

      const dashboardPage = new DashboardPageObject(page)
      await dashboardPage.expectCollateralSwitch(asset, false)
      await dashboardPage.clickCollateralSwitchAction(asset)

      const collateralDialog = new CollateralDialogPageObject(page)
      await collateralDialog.expectDialogHeader('Collateral')
      await collateralDialog.expectHealthFactorNotVisible()
      await collateralDialog.expectAlertMessage(setUseAsCollateralValidationIssueToMessage['zero-balance-asset'])
      const actionsContainer = new ActionsPageObject(collateralDialog.locatePanelByHeader('Actions'))
      await actionsContainer.expectActionsDisabled()

      await dashboardPage.goToDashboardAction()
      await dashboardPage.expectCollateralSwitch(asset, false)
    })
  })

  test.describe('Single collateral, DAI borrow', () => {
    const initialDeposits = {
      wstETH: 1,
    }
    const daiToBorrow = 1000

    test.beforeEach(async ({ page }) => {
      await setup(page, fork, {
        initialPage: 'easyBorrow',
        account: {
          type: 'connected',
          assetBalances: { ...initialBalances },
        },
      })

      const borrowPage = new BorrowPageObject(page)
      await borrowPage.depositAssetsActions(initialDeposits, daiToBorrow)
      await borrowPage.viewInDashboardAction()

      const dashboardPage = new DashboardPageObject(page)
      await dashboardPage.goToDashboardAction()

      await dashboardPage.expectDepositTable({
        wstETH: initialDeposits.wstETH,
      })
    })

    test('cannot disable sole collateral', async ({ page }) => {
      const collateral = 'wstETH'

      const dashboardPage = new DashboardPageObject(page)
      await dashboardPage.expectCollateralSwitch(collateral, true)
      await dashboardPage.clickCollateralSwitchAction(collateral)

      const collateralDialog = new CollateralDialogPageObject(page)
      await collateralDialog.expectDialogHeader('Collateral')
      await collateralDialog.expectHealthFactorBefore('2.08')
      await collateralDialog.expectHealthFactorAfter('0')
      await collateralDialog.expectAlertMessage(setUseAsCollateralValidationIssueToMessage['exceeds-ltv'])
      const actionsContainer = new ActionsPageObject(collateralDialog.locatePanelByHeader('Actions'))
      await actionsContainer.expectActionsDisabled()

      await dashboardPage.goToDashboardAction()
      await dashboardPage.expectCollateralSwitch(collateral, true)
    })
  })

  test.describe('Multiple collaterals, DAI borrow', () => {
    const initialDeposits = {
      wstETH: 1,
      rETH: 0.01,
    }
    const daiToBorrow = 1000

    test.beforeEach(async ({ page }) => {
      await setup(page, fork, {
        initialPage: 'easyBorrow',
        account: {
          type: 'connected',
          assetBalances: { ...initialBalances },
        },
      })

      const borrowPage = new BorrowPageObject(page)
      await borrowPage.depositAssetsActions(initialDeposits, daiToBorrow)
      await borrowPage.viewInDashboardAction()

      const dashboardPage = new DashboardPageObject(page)
      await dashboardPage.goToDashboardAction()

      await dashboardPage.expectDepositTable({
        wstETH: initialDeposits.wstETH,
        rETH: initialDeposits.rETH,
      })
    })

    test('disables collateral', async ({ page }) => {
      const collateral = 'rETH'

      const dashboardPage = new DashboardPageObject(page)
      await dashboardPage.expectCollateralSwitch(collateral, true)
      await dashboardPage.clickCollateralSwitchAction(collateral)

      const collateralDialog = new CollateralDialogPageObject(page)
      await collateralDialog.expectDialogHeader('Collateral')
      await collateralDialog.expectHealthFactorBefore('2.1')
      await collateralDialog.expectHealthFactorAfter('2.08')
      const actionsContainer = new ActionsPageObject(collateralDialog.locatePanelByHeader('Actions'))
      await actionsContainer.acceptAllActionsAction(1)

      await collateralDialog.expectSetUseAsCollateralSuccessPage(collateral, 'disabled')
      await dashboardPage.goToDashboardAction()
      await dashboardPage.expectCollateralSwitch('rETH', false)
    })

    test('cannot disable collateral when second one would not cover loan', async ({ page }) => {
      const collateral = 'wstETH'

      const dashboardPage = new DashboardPageObject(page)
      await dashboardPage.expectCollateralSwitch(collateral, true)
      await dashboardPage.clickCollateralSwitchAction(collateral)

      const collateralDialog = new CollateralDialogPageObject(page)
      await collateralDialog.expectDialogHeader('Collateral')
      await collateralDialog.expectHealthFactorBefore('2.1')
      await collateralDialog.expectHealthFactorAfter('0.02')
      await collateralDialog.expectAlertMessage(setUseAsCollateralValidationIssueToMessage['exceeds-ltv'])
      const actionsContainer = new ActionsPageObject(collateralDialog.locatePanelByHeader('Actions'))
      await actionsContainer.expectActionsDisabled()

      await dashboardPage.goToDashboardAction()
      await dashboardPage.expectCollateralSwitch(collateral, true)
    })
  })

  test.describe('Isolation mode', () => {
    const fork = setupFork(GNO_ACTIVE_BLOCK_NUMBER)
    const isolatedAsset = 'GNO'
    const regularAsset = 'rETH'
    const initialDeposits = {
      [regularAsset]: 1,
    }
    const dashboardDeposits = {
      [isolatedAsset]: 100,
    }

    test.beforeEach(async ({ page }) => {
      await setup(page, fork, {
        initialPage: 'easyBorrow',
        account: {
          type: 'connected',
          assetBalances: { ...initialBalances },
        },
      })

      // Depositing regular asset at borrow page to show dashboard positions
      const borrowPage = new BorrowPageObject(page)
      await borrowPage.depositWithoutBorrowActions(initialDeposits)
      const dashboardPage = new DashboardPageObject(page)
      await dashboardPage.goToDashboardAction()

      await dashboardPage.expectDepositTable({
        [regularAsset]: initialDeposits[regularAsset],
      })

      // Depositing isolated asset at dashboard
      await dashboardPage.clickDepositButtonAction(isolatedAsset)
      const depositDialog = new DialogPageObject(page, /Deposit/)
      await depositDialog.fillAmountAction(dashboardDeposits[isolatedAsset])
      const actionsContainer = new ActionsPageObject(depositDialog.locatePanelByHeader('Actions'))
      await actionsContainer.acceptAllActionsAction(2)
      await depositDialog.viewInDashboardAction()

      const collateralDialog = new CollateralDialogPageObject(page)
      // Disabling regular asset as collateral
      await dashboardPage.clickCollateralSwitchAction(regularAsset)
      await collateralDialog.setUseAsCollateralAction(regularAsset, 'disabled')
      await dashboardPage.goToDashboardAction()
      await dashboardPage.expectCollateralSwitch(isolatedAsset, false)

      // Entering isolation mode
      await dashboardPage.clickCollateralSwitchAction(isolatedAsset)
      await collateralDialog.setUseAsCollateralAction(isolatedAsset, 'enabled')
      await dashboardPage.goToDashboardAction()

      await dashboardPage.expectCollateralSwitch(isolatedAsset, true)
    })

    test('cannot enable asset as collateral in isolation mode', async ({ page }) => {
      const collateral = 'rETH'

      const dashboardPage = new DashboardPageObject(page)
      await dashboardPage.expectCollateralSwitch(collateral, false)
      await dashboardPage.clickCollateralSwitchAction(collateral)

      const collateralDialog = new CollateralDialogPageObject(page)
      await collateralDialog.expectAlertMessage(setUseAsCollateralValidationIssueToMessage['isolation-mode-active'])
      const actionsContainer = new ActionsPageObject(collateralDialog.locatePanelByHeader('Actions'))
      await actionsContainer.expectActionsDisabled()

      await dashboardPage.goToDashboardAction()
      await dashboardPage.expectCollateralSwitch(collateral, false)
    })
  })
})
