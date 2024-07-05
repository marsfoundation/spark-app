import { test } from '@playwright/test'
import { mainnet } from 'viem/chains'

import { setUseAsCollateralValidationIssueToMessage } from '@/domain/market-validators/validateSetUseAsCollateral'
import { ActionsPageObject } from '@/features/actions/ActionsContainer.PageObject'
import { BorrowPageObject } from '@/pages/Borrow.PageObject'
import { DashboardPageObject } from '@/pages/Dashboard.PageObject'
import { DEFAULT_BLOCK_NUMBER, GNO_ACTIVE_BLOCK_NUMBER } from '@/test/e2e/constants'
import { setupFork } from '@/test/e2e/forking/setupFork'
import { setup } from '@/test/e2e/setup'

import { DialogPageObject } from '../common/Dialog.PageObject'
import { CollateralDialogPageObject } from './CollateralDialog.PageObject'

test.describe('Collateral dialog', () => {
  const fork = setupFork({ blockNumber: DEFAULT_BLOCK_NUMBER, chainId: mainnet.id })
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
          type: 'connected-random',
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
      await actionsContainer.expectDisabledActionAtIndex(0)

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
      await collateralDialog.expectAlertMessage(setUseAsCollateralValidationIssueToMessage['zero-deposit-asset'])
      const actionsContainer = new ActionsPageObject(collateralDialog.locatePanelByHeader('Actions'))
      await actionsContainer.expectDisabledActionAtIndex(0)

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
          type: 'connected-random',
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
      await actionsContainer.expectDisabledActionAtIndex(0)

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
          type: 'connected-random',
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
      await actionsContainer.expectDisabledActionAtIndex(0)

      await dashboardPage.goToDashboardAction()
      await dashboardPage.expectCollateralSwitch(collateral, true)
    })
  })

  test.describe('Isolation mode', () => {
    const fork = setupFork({ blockNumber: GNO_ACTIVE_BLOCK_NUMBER, chainId: mainnet.id })
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
          type: 'connected-random',
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
      await actionsContainer.expectDisabledActionAtIndex(0)

      await dashboardPage.goToDashboardAction()
      await dashboardPage.expectCollateralSwitch(collateral, false)
    })
  })

  test.describe('Liquidation risk warning', () => {
    test.describe('In danger zone', () => {
      let collateralDialog: CollateralDialogPageObject
      let dashboardPage: DashboardPageObject

      test.beforeEach(async ({ page }) => {
        await setup(page, fork, {
          initialPage: 'easyBorrow',
          account: {
            type: 'connected-random',
            assetBalances: { ETH: 1, rETH: 100, wstETH: 100 },
          },
        })

        collateralDialog = new CollateralDialogPageObject(page)
        dashboardPage = new DashboardPageObject(page)

        const borrowPage = new BorrowPageObject(page)
        await borrowPage.depositWithoutBorrowActions({ rETH: 2, wstETH: 10 })
        await dashboardPage.goToDashboardAction()

        await dashboardPage.clickBorrowButtonAction('WETH')
        const borrowDialog = new DialogPageObject(page, /Borrow/)
        await borrowDialog.fillAmountAction(7)
        await borrowDialog.actionsContainer.acceptAllActionsAction(1)
        await borrowDialog.expectSuccessPage([{ asset: 'WETH', amount: 7 }], fork)
        await borrowDialog.viewInDashboardAction()
        await dashboardPage.expectAssetToBeInBorrowTable('WETH')
      })

      test('shows risk warning', async () => {
        await dashboardPage.clickCollateralSwitchAction('rETH')
        await collateralDialog.expectLiquidationRiskWarning(
          'Disabling this asset as collateral puts you at risk of quick liquidation. You may lose part of your remaining collateral.',
        )
      })

      test('actions stay disabled until risk warning is acknowledged', async () => {
        await dashboardPage.clickCollateralSwitchAction('rETH')

        await collateralDialog.actionsContainer.expectDisabledActionAtIndex(0)
        await collateralDialog.clickAcknowledgeRisk()
        await collateralDialog.actionsContainer.expectEnabledActionAtIndex(0)
      })
    })

    test.describe('Not in danger zone', () => {
      let collateralDialog: CollateralDialogPageObject
      let dashboardPage: DashboardPageObject

      const rETHDeposit = { asset: 'rETH', amount: 1 }
      const wstETHDeposit = { asset: 'wstETH', amount: 1 }
      const daiBorrow = { asset: 'DAI', amount: 500 }

      test.beforeEach(async ({ page }) => {
        await setup(page, fork, {
          initialPage: 'easyBorrow',
          account: {
            type: 'connected-random',
            assetBalances: { ETH: 1, rETH: 100, wstETH: 100 },
          },
        })

        collateralDialog = new CollateralDialogPageObject(page)
        dashboardPage = new DashboardPageObject(page)
      })

      test('validation issue; risk warning is not shown', async ({ page }) => {
        // depositing single asset as collateral, so turing off will trigger validation
        const borrowPage = new BorrowPageObject(page)
        await borrowPage.depositAssetsActions({ rETH: rETHDeposit.amount }, daiBorrow.amount)
        await borrowPage.expectSuccessPage([rETHDeposit], daiBorrow, fork)
        await dashboardPage.goToDashboardAction()
        await dashboardPage.expectAssetToBeInBorrowTable('DAI')

        await dashboardPage.clickCollateralSwitchAction('rETH')
        await collateralDialog.expectAlertMessage(setUseAsCollateralValidationIssueToMessage['exceeds-ltv'])
        await collateralDialog.expectLiquidationRiskWarningNotVisible()
      })

      test('no validation issue; risk warning is not shown', async ({ page }) => {
        // depositing multiple assets as collateral, so turning off single asset will not trigger validation
        const borrowPage = new BorrowPageObject(page)
        await borrowPage.depositAssetsActions(
          { wstETH: wstETHDeposit.amount, rETH: rETHDeposit.amount },
          daiBorrow.amount,
        )
        await borrowPage.expectSuccessPage([wstETHDeposit, rETHDeposit], daiBorrow, fork)
        await dashboardPage.goToDashboardAction()
        await dashboardPage.expectAssetToBeInBorrowTable('DAI')

        await dashboardPage.clickCollateralSwitchAction('rETH')
        await collateralDialog.expectLiquidationRiskWarningNotVisible()
      })
    })
  })
})
