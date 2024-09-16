import { test } from '@playwright/test'
import { mainnet } from 'viem/chains'

import { setUseAsCollateralValidationIssueToMessage } from '@/domain/market-validators/validateSetUseAsCollateral'
import { ActionsPageObject } from '@/features/actions/ActionsContainer.PageObject'
import { BorrowPageObject } from '@/pages/Borrow.PageObject'
import { MyPortfolioPageObject } from '@/pages/MyPortfolio.PageObject'
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
    const myPortfolioDesposits = {
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
      const myPortfolioPage = new MyPortfolioPageObject(page)
      await myPortfolioPage.goToMyPortfolioAction()

      // Depositing DAI in myPortfolio
      await myPortfolioPage.clickDepositButtonAction('DAI')
      const depositDialog = new DialogPageObject(page, /Deposit/)
      await depositDialog.fillAmountAction(myPortfolioDesposits.DAI)
      const actionsContainer = new ActionsPageObject(depositDialog.locatePanelByHeader('Actions'))
      await actionsContainer.acceptAllActionsAction(2)
      await depositDialog.viewInMyPortfolioAction()

      await myPortfolioPage.expectDepositTable({
        wstETH: initialDeposits.wstETH,
        DAI: myPortfolioDesposits.DAI,
      })
    })

    test('disables collateral', async ({ page }) => {
      const collateral = 'wstETH'

      const myPortfolioPage = new MyPortfolioPageObject(page)
      await myPortfolioPage.expectCollateralSwitch(collateral, true)
      await myPortfolioPage.clickCollateralSwitchAction(collateral)

      const collateralDialog = new CollateralDialogPageObject(page)
      await collateralDialog.expectDialogHeader('Collateral')
      await collateralDialog.expectHealthFactorNotVisible()
      const actionsContainer = new ActionsPageObject(collateralDialog.locatePanelByHeader('Actions'))
      await actionsContainer.acceptAllActionsAction(1)
      await collateralDialog.expectSetUseAsCollateralSuccessPage(collateral, 'disabled')

      await myPortfolioPage.goToMyPortfolioAction()
      await myPortfolioPage.expectCollateralSwitch('wstETH', false)
    })

    test('enables collateral', async ({ page }) => {
      const collateral = 'wstETH'

      // disabling collateral
      const myPortfolioPage = new MyPortfolioPageObject(page)
      await myPortfolioPage.clickCollateralSwitchAction(collateral)
      const collateralDialog = new CollateralDialogPageObject(page)
      await collateralDialog.setUseAsCollateralAction(collateral, 'disabled')
      await myPortfolioPage.goToMyPortfolioAction()

      // enabling collateral
      await myPortfolioPage.expectCollateralSwitch(collateral, false)
      await myPortfolioPage.clickCollateralSwitchAction(collateral)
      await collateralDialog.expectDialogHeader('Collateral')
      await collateralDialog.expectHealthFactorNotVisible()
      const actionsContainer = new ActionsPageObject(collateralDialog.locatePanelByHeader('Actions'))
      await actionsContainer.acceptAllActionsAction(1)
      await collateralDialog.expectSetUseAsCollateralSuccessPage(collateral, 'enabled')

      await myPortfolioPage.goToMyPortfolioAction()
      await myPortfolioPage.expectCollateralSwitch(collateral, true)
    })

    test('cannot enable collateral for asset that cannot be used as collateral', async ({ page }) => {
      const asset = 'DAI'

      const myPortfolioPage = new MyPortfolioPageObject(page)
      await myPortfolioPage.expectCollateralSwitch(asset, false)
      await myPortfolioPage.clickCollateralSwitchAction(asset)

      const collateralDialog = new CollateralDialogPageObject(page)
      await collateralDialog.expectDialogHeader('Collateral')
      await collateralDialog.expectHealthFactorNotVisible()
      await collateralDialog.expectAlertMessage(setUseAsCollateralValidationIssueToMessage['zero-ltv-asset'])
      const actionsContainer = new ActionsPageObject(collateralDialog.locatePanelByHeader('Actions'))
      await actionsContainer.expectDisabledActionAtIndex(0)

      await myPortfolioPage.goToMyPortfolioAction()
      await myPortfolioPage.expectCollateralSwitch(asset, false)
    })

    test('cannot enable collateral for not deposited asset', async ({ page }) => {
      const asset = 'WBTC'

      const myPortfolioPage = new MyPortfolioPageObject(page)
      await myPortfolioPage.expectCollateralSwitch(asset, false)
      await myPortfolioPage.clickCollateralSwitchAction(asset)

      const collateralDialog = new CollateralDialogPageObject(page)
      await collateralDialog.expectDialogHeader('Collateral')
      await collateralDialog.expectHealthFactorNotVisible()
      await collateralDialog.expectAlertMessage(setUseAsCollateralValidationIssueToMessage['zero-deposit-asset'])
      const actionsContainer = new ActionsPageObject(collateralDialog.locatePanelByHeader('Actions'))
      await actionsContainer.expectDisabledActionAtIndex(0)

      await myPortfolioPage.goToMyPortfolioAction()
      await myPortfolioPage.expectCollateralSwitch(asset, false)
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
      await borrowPage.viewInMyPortfolioAction()

      const myPortfolioPage = new MyPortfolioPageObject(page)
      await myPortfolioPage.goToMyPortfolioAction()

      await myPortfolioPage.expectDepositTable({
        wstETH: initialDeposits.wstETH,
      })
    })

    test('cannot disable sole collateral', async ({ page }) => {
      const collateral = 'wstETH'

      const myPortfolioPage = new MyPortfolioPageObject(page)
      await myPortfolioPage.expectCollateralSwitch(collateral, true)
      await myPortfolioPage.clickCollateralSwitchAction(collateral)

      const collateralDialog = new CollateralDialogPageObject(page)
      await collateralDialog.expectDialogHeader('Collateral')
      await collateralDialog.expectHealthFactorBefore('2.08')
      await collateralDialog.expectHealthFactorAfter('0')
      await collateralDialog.expectAlertMessage(setUseAsCollateralValidationIssueToMessage['exceeds-ltv'])
      const actionsContainer = new ActionsPageObject(collateralDialog.locatePanelByHeader('Actions'))
      await actionsContainer.expectDisabledActionAtIndex(0)

      await myPortfolioPage.goToMyPortfolioAction()
      await myPortfolioPage.expectCollateralSwitch(collateral, true)
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
      await borrowPage.viewInMyPortfolioAction()

      const myPortfolioPage = new MyPortfolioPageObject(page)
      await myPortfolioPage.goToMyPortfolioAction()

      await myPortfolioPage.expectDepositTable({
        wstETH: initialDeposits.wstETH,
        rETH: initialDeposits.rETH,
      })
    })

    test('disables collateral', async ({ page }) => {
      const collateral = 'rETH'

      const myPortfolioPage = new MyPortfolioPageObject(page)
      await myPortfolioPage.expectCollateralSwitch(collateral, true)
      await myPortfolioPage.clickCollateralSwitchAction(collateral)

      const collateralDialog = new CollateralDialogPageObject(page)
      await collateralDialog.expectDialogHeader('Collateral')
      await collateralDialog.expectHealthFactorBefore('2.1')
      await collateralDialog.expectHealthFactorAfter('2.08')
      const actionsContainer = new ActionsPageObject(collateralDialog.locatePanelByHeader('Actions'))
      await actionsContainer.acceptAllActionsAction(1)

      await collateralDialog.expectSetUseAsCollateralSuccessPage(collateral, 'disabled')
      await myPortfolioPage.goToMyPortfolioAction()
      await myPortfolioPage.expectCollateralSwitch('rETH', false)
    })

    test('cannot disable collateral when second one would not cover loan', async ({ page }) => {
      const collateral = 'wstETH'

      const myPortfolioPage = new MyPortfolioPageObject(page)
      await myPortfolioPage.expectCollateralSwitch(collateral, true)
      await myPortfolioPage.clickCollateralSwitchAction(collateral)

      const collateralDialog = new CollateralDialogPageObject(page)
      await collateralDialog.expectDialogHeader('Collateral')
      await collateralDialog.expectHealthFactorBefore('2.1')
      await collateralDialog.expectHealthFactorAfter('0.02')
      await collateralDialog.expectAlertMessage(setUseAsCollateralValidationIssueToMessage['exceeds-ltv'])
      const actionsContainer = new ActionsPageObject(collateralDialog.locatePanelByHeader('Actions'))
      await actionsContainer.expectDisabledActionAtIndex(0)

      await myPortfolioPage.goToMyPortfolioAction()
      await myPortfolioPage.expectCollateralSwitch(collateral, true)
    })
  })

  test.describe('Isolation mode', () => {
    const fork = setupFork({ blockNumber: GNO_ACTIVE_BLOCK_NUMBER, chainId: mainnet.id })
    const isolatedAsset = 'GNO'
    const regularAsset = 'rETH'
    const initialDeposits = {
      [regularAsset]: 1,
    }
    const myPortfolioDesposits = {
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

      // Depositing regular asset at borrow page to show myPortfolio positions
      const borrowPage = new BorrowPageObject(page)
      await borrowPage.depositWithoutBorrowActions(initialDeposits)
      const myPortfolioPage = new MyPortfolioPageObject(page)
      await myPortfolioPage.goToMyPortfolioAction()

      await myPortfolioPage.expectDepositTable({
        [regularAsset]: initialDeposits[regularAsset],
      })

      // Depositing isolated asset at myPortfolio
      await myPortfolioPage.clickDepositButtonAction(isolatedAsset)
      const depositDialog = new DialogPageObject(page, /Deposit/)
      await depositDialog.fillAmountAction(myPortfolioDesposits[isolatedAsset])
      const actionsContainer = new ActionsPageObject(depositDialog.locatePanelByHeader('Actions'))
      await actionsContainer.acceptAllActionsAction(2)
      await depositDialog.viewInMyPortfolioAction()

      const collateralDialog = new CollateralDialogPageObject(page)
      // Disabling regular asset as collateral
      await myPortfolioPage.clickCollateralSwitchAction(regularAsset)
      await collateralDialog.setUseAsCollateralAction(regularAsset, 'disabled')
      await myPortfolioPage.goToMyPortfolioAction()
      await myPortfolioPage.expectCollateralSwitch(isolatedAsset, false)

      // Entering isolation mode
      await myPortfolioPage.clickCollateralSwitchAction(isolatedAsset)
      await collateralDialog.setUseAsCollateralAction(isolatedAsset, 'enabled')
      await myPortfolioPage.goToMyPortfolioAction()

      await myPortfolioPage.expectCollateralSwitch(isolatedAsset, true)
    })

    test('cannot enable asset as collateral in isolation mode', async ({ page }) => {
      const collateral = 'rETH'

      const myPortfolioPage = new MyPortfolioPageObject(page)
      await myPortfolioPage.expectCollateralSwitch(collateral, false)
      await myPortfolioPage.clickCollateralSwitchAction(collateral)

      const collateralDialog = new CollateralDialogPageObject(page)
      await collateralDialog.expectAlertMessage(setUseAsCollateralValidationIssueToMessage['isolation-mode-active'])
      const actionsContainer = new ActionsPageObject(collateralDialog.locatePanelByHeader('Actions'))
      await actionsContainer.expectDisabledActionAtIndex(0)

      await myPortfolioPage.goToMyPortfolioAction()
      await myPortfolioPage.expectCollateralSwitch(collateral, false)
    })
  })

  test.describe('Liquidation risk warning', () => {
    test.describe('In danger zone', () => {
      let collateralDialog: CollateralDialogPageObject
      let myPortfolioPage: MyPortfolioPageObject

      test.beforeEach(async ({ page }) => {
        await setup(page, fork, {
          initialPage: 'easyBorrow',
          account: {
            type: 'connected-random',
            assetBalances: { ETH: 1, rETH: 100, wstETH: 100 },
          },
        })

        collateralDialog = new CollateralDialogPageObject(page)
        myPortfolioPage = new MyPortfolioPageObject(page)

        const borrowPage = new BorrowPageObject(page)
        await borrowPage.depositWithoutBorrowActions({ rETH: 2, wstETH: 10 })
        await myPortfolioPage.goToMyPortfolioAction()

        await myPortfolioPage.clickBorrowButtonAction('WETH')
        const borrowDialog = new DialogPageObject(page, /Borrow/)
        await borrowDialog.fillAmountAction(7)
        await borrowDialog.actionsContainer.acceptAllActionsAction(1)
        await borrowDialog.expectSuccessPage([{ asset: 'WETH', amount: 7 }], fork)
        await borrowDialog.viewInMyPortfolioAction()
        await myPortfolioPage.expectAssetToBeInBorrowTable('WETH')
      })

      test('shows risk warning', async () => {
        await myPortfolioPage.clickCollateralSwitchAction('rETH')
        await collateralDialog.expectLiquidationRiskWarning(
          'Disabling this asset as collateral puts you at risk of quick liquidation. You may lose part of your remaining collateral.',
        )
      })

      test('actions stay disabled until risk warning is acknowledged', async () => {
        await myPortfolioPage.clickCollateralSwitchAction('rETH')

        await collateralDialog.actionsContainer.expectDisabledActionAtIndex(0)
        await collateralDialog.clickAcknowledgeRisk()
        await collateralDialog.actionsContainer.expectEnabledActionAtIndex(0)
      })
    })

    test.describe('Not in danger zone', () => {
      let collateralDialog: CollateralDialogPageObject
      let myPortfolioPage: MyPortfolioPageObject

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
        myPortfolioPage = new MyPortfolioPageObject(page)
      })

      test('validation issue; risk warning is not shown', async ({ page }) => {
        // depositing single asset as collateral, so turing off will trigger validation
        const borrowPage = new BorrowPageObject(page)
        await borrowPage.depositAssetsActions({ rETH: rETHDeposit.amount }, daiBorrow.amount)
        await borrowPage.expectSuccessPage([rETHDeposit], daiBorrow, fork)
        await myPortfolioPage.goToMyPortfolioAction()
        await myPortfolioPage.expectAssetToBeInBorrowTable('DAI')

        await myPortfolioPage.clickCollateralSwitchAction('rETH')
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
        await myPortfolioPage.goToMyPortfolioAction()
        await myPortfolioPage.expectAssetToBeInBorrowTable('DAI')

        await myPortfolioPage.clickCollateralSwitchAction('rETH')
        await collateralDialog.expectLiquidationRiskWarningNotVisible()
      })
    })
  })
})
