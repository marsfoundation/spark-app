import { setUserEModeValidationIssueToMessage } from '@/domain/market-validators/validateSetUserEMode'
import { BorrowPageObject } from '@/pages/Borrow.PageObject'
import { DashboardPageObject } from '@/pages/Dashboard.PageObject'
import { DEFAULT_BLOCK_NUMBER } from '@/test/e2e/constants'
import { setup } from '@/test/e2e/setup'
import { setupFork } from '@/test/e2e/setupFork'
import { test } from '@playwright/test'
import { mainnet } from 'viem/chains'
import { DialogPageObject } from '../common/Dialog.PageObject'
import { EModeDialogPageObject } from './EModeDialog.PageObject'

test.describe('E-Mode dialog', () => {
  const fork = setupFork({ blockNumber: DEFAULT_BLOCK_NUMBER, chainId: mainnet.id })

  test.describe('Liquidation risk warning', () => {
    test.describe('In danger zone', () => {
      let eModeDialog: EModeDialogPageObject
      let dashboardPage: DashboardPageObject

      test.beforeEach(async ({ page }) => {
        await setup(page, fork, {
          initialPage: 'easyBorrow',
          account: {
            type: 'connected',
            assetBalances: { ETH: 1, rETH: 100, wstETH: 100 },
          },
        })

        eModeDialog = new EModeDialogPageObject(page)
        dashboardPage = new DashboardPageObject(page)

        const borrowPage = new BorrowPageObject(page)
        await borrowPage.depositWithoutBorrowActions({ rETH: 2, wstETH: 10 })
        await dashboardPage.goToDashboardAction()

        dashboardPage.clickBorrowButtonAction('WETH')
        const borrowDialog = new DialogPageObject(page, /Borrow/)
        await borrowDialog.fillAmountAction(8)
        await borrowDialog.clickAcknowledgeRisk()
        await borrowDialog.actionsContainer.acceptAllActionsAction(1)
        await borrowDialog.expectSuccessPage([{ asset: 'WETH', amount: 8 }], fork)
        await borrowDialog.viewInDashboardAction()
        await dashboardPage.expectAssetToBeInBorrowTable('WETH')

        await dashboardPage.clickEModeButtonAction()
        await eModeDialog.setEModeAction('ETH Correlated')
        await dashboardPage.expectEModeCategory('ETH Correlated')
      })

      test('shows risk warning', async () => {
        await dashboardPage.clickEModeButtonAction()
        await eModeDialog.clickEModeCategoryTileAction('No E-Mode')
        await eModeDialog.expectLiquidationRiskWarning(
          'Disabling E-Mode decreases health factor of your position and puts you at risk of quick liquidation. You may lose part of your collateral.',
        )
      })

      test('actions stay disabled until risk warning is acknowledged', async () => {
        await dashboardPage.clickEModeButtonAction()

        await eModeDialog.clickEModeCategoryTileAction('No E-Mode')
        await eModeDialog.actionsContainer.expectDisabledActionAtIndex(0)
        await eModeDialog.clickAcknowledgeRisk()
        await eModeDialog.actionsContainer.expectEnabledActionAtIndex(0)
      })

      test('validation error; risk warning is not shown', async () => {
        await dashboardPage.clickEModeButtonAction()

        await eModeDialog.clickEModeCategoryTileAction('Stablecoins')
        await eModeDialog.expectAlertMessage(
          setUserEModeValidationIssueToMessage['borrowed-assets-emode-category-mismatch'],
        )
        await eModeDialog.expectLiquidationRiskWarningNotVisible()
      })
    })

    test.describe('Not in danger zone', () => {
      let eModeDialog: EModeDialogPageObject
      let dashboardPage: DashboardPageObject

      test.beforeEach(async ({ page }) => {
        await setup(page, fork, {
          initialPage: 'easyBorrow',
          account: {
            type: 'connected',
            assetBalances: { ETH: 1, rETH: 100, wstETH: 100 },
          },
        })

        eModeDialog = new EModeDialogPageObject(page)
        dashboardPage = new DashboardPageObject(page)

        const borrowPage = new BorrowPageObject(page)
        await borrowPage.depositWithoutBorrowActions({ rETH: 2, wstETH: 10 })
        await dashboardPage.goToDashboardAction()

        dashboardPage.clickBorrowButtonAction('WETH')
        const borrowDialog = new DialogPageObject(page, /Borrow/)
        await borrowDialog.fillAmountAction(2)
        await borrowDialog.actionsContainer.acceptAllActionsAction(1)
        await borrowDialog.expectSuccessPage([{ asset: 'WETH', amount: 2 }], fork)
        await borrowDialog.viewInDashboardAction()
        await dashboardPage.expectAssetToBeInBorrowTable('WETH')
      })

      test('hf above danger zone threshold; risk warning is not shown', async () => {
        await dashboardPage.clickEModeButtonAction()
        await eModeDialog.clickEModeCategoryTileAction('No E-Mode')
        await eModeDialog.expectLiquidationRiskWarningNotVisible()
      })
    })
  })
})
