import { setUseAsCollateralValidationIssueToMessage } from '@/domain/market-validators/validateSetUseAsCollateral'
import { BorrowPageObject } from '@/pages/Borrow.PageObject'
import { MyPortfolioPageObject } from '@/pages/MyPortfolio.PageObject'
import { DEFAULT_BLOCK_NUMBER } from '@/test/e2e/constants'
import { setup } from '@/test/e2e/setup'
import { test } from '@playwright/test'
import { mainnet } from 'viem/chains'
import { DialogPageObject } from '../common/Dialog.PageObject'
import { CollateralDialogPageObject } from './CollateralDialog.PageObject'

test.describe('Collateral dialog', () => {
  const initialBalances = {
    wstETH: 100,
    rETH: 100,
    DAI: 10000,
    weETH: 100,
  }

  test.describe('Deposited multiple assets, no borrow', () => {
    const initialDeposits = {
      wstETH: 1,
    }
    const myPortfolioDesposits = {
      DAI: 1000, // cannot be used as collateral
    }

    let collateralDialog: CollateralDialogPageObject
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
          assetBalances: { ...initialBalances },
        },
      })

      const borrowPage = new BorrowPageObject(testContext)
      const depositDialog = new DialogPageObject({ testContext, header: /Deposit/ })
      myPortfolioPage = new MyPortfolioPageObject(testContext)
      collateralDialog = new CollateralDialogPageObject(testContext)

      await borrowPage.depositWithoutBorrowActions({ assetsToDeposit: initialDeposits })
      await myPortfolioPage.goToMyPortfolioAction()

      // Depositing DAI in myPortfolio
      await myPortfolioPage.clickDepositButtonAction('DAI')
      await depositDialog.fillAmountAction(myPortfolioDesposits.DAI)
      await depositDialog.actionsContainer.acceptAllActionsAction(2)
      await depositDialog.viewInMyPortfolioAction()

      await myPortfolioPage.expectDepositTable({
        wstETH: initialDeposits.wstETH,
        DAI: myPortfolioDesposits.DAI,
      })
    })

    test('disables collateral', async () => {
      const collateral = 'wstETH'

      await myPortfolioPage.expectCollateralSwitch(collateral, true)
      await myPortfolioPage.clickCollateralSwitchAction(collateral)

      await collateralDialog.expectDialogHeader('Collateral')
      await collateralDialog.expectHealthFactorNotVisible()
      await collateralDialog.actionsContainer.acceptAllActionsAction(1)
      await collateralDialog.expectSetUseAsCollateralSuccessPage(collateral, 'disabled')

      await myPortfolioPage.goToMyPortfolioAction()
      await myPortfolioPage.expectCollateralSwitch('wstETH', false)
    })

    test('enables collateral', async () => {
      const collateral = 'wstETH'

      // disabling collateral
      await myPortfolioPage.clickCollateralSwitchAction(collateral)
      await collateralDialog.setUseAsCollateralAction({ assetName: collateral, setting: 'disabled' })
      await myPortfolioPage.goToMyPortfolioAction()

      // enabling collateral
      await myPortfolioPage.expectCollateralSwitch(collateral, false)
      await myPortfolioPage.clickCollateralSwitchAction(collateral)
      await collateralDialog.expectDialogHeader('Collateral')
      await collateralDialog.expectHealthFactorNotVisible()
      await collateralDialog.actionsContainer.acceptAllActionsAction(1)
      await collateralDialog.expectSetUseAsCollateralSuccessPage(collateral, 'enabled')

      await myPortfolioPage.goToMyPortfolioAction()
      await myPortfolioPage.expectCollateralSwitch(collateral, true)
    })

    test('cannot enable collateral for asset that cannot be used as collateral', async () => {
      const asset = 'DAI'

      await myPortfolioPage.expectCollateralSwitch(asset, false)
      await myPortfolioPage.clickCollateralSwitchAction(asset)

      await collateralDialog.expectDialogHeader('Collateral')
      await collateralDialog.expectHealthFactorNotVisible()
      await collateralDialog.expectAlertMessage(setUseAsCollateralValidationIssueToMessage['zero-ltv-asset'])
      await collateralDialog.actionsContainer.expectDisabledActionAtIndex(0)

      await myPortfolioPage.goToMyPortfolioAction()
      await myPortfolioPage.expectCollateralSwitch(asset, false)
    })

    test('cannot enable collateral for not deposited asset', async () => {
      const asset = 'WBTC'

      await myPortfolioPage.expectCollateralSwitch(asset, false)
      await myPortfolioPage.clickCollateralSwitchAction(asset)

      await collateralDialog.expectDialogHeader('Collateral')
      await collateralDialog.expectHealthFactorNotVisible()
      await collateralDialog.expectAlertMessage(setUseAsCollateralValidationIssueToMessage['zero-deposit-asset'])
      await collateralDialog.actionsContainer.expectDisabledActionAtIndex(0)

      await myPortfolioPage.goToMyPortfolioAction()
      await myPortfolioPage.expectCollateralSwitch(asset, false)
    })
  })

  test.describe('Single collateral, DAI borrow', () => {
    const initialDeposits = {
      wstETH: 1,
    }
    const daiToBorrow = 1000
    let collateralDialog: CollateralDialogPageObject
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
          assetBalances: { ...initialBalances },
        },
      })

      const borrowPage = new BorrowPageObject(testContext)
      myPortfolioPage = new MyPortfolioPageObject(testContext)
      collateralDialog = new CollateralDialogPageObject(testContext)

      await borrowPage.depositAssetsActions({ assetsToDeposit: initialDeposits, daiToBorrow })
      await borrowPage.viewInMyPortfolioAction()

      await myPortfolioPage.goToMyPortfolioAction()
      await myPortfolioPage.expectDepositTable({
        wstETH: initialDeposits.wstETH,
      })
    })

    test('cannot disable sole collateral', async () => {
      const collateral = 'wstETH'

      await myPortfolioPage.expectCollateralSwitch(collateral, true)
      await myPortfolioPage.clickCollateralSwitchAction(collateral)

      await collateralDialog.expectDialogHeader('Collateral')
      await collateralDialog.expectHealthFactorBefore('3.73')
      await collateralDialog.expectHealthFactorAfter('0')
      await collateralDialog.expectAlertMessage(setUseAsCollateralValidationIssueToMessage['exceeds-ltv'])
      await collateralDialog.actionsContainer.expectDisabledActionAtIndex(0)

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
    let collateralDialog: CollateralDialogPageObject
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
          assetBalances: { ...initialBalances },
        },
      })

      const borrowPage = new BorrowPageObject(testContext)
      myPortfolioPage = new MyPortfolioPageObject(testContext)
      collateralDialog = new CollateralDialogPageObject(testContext)

      await borrowPage.depositAssetsActions({ assetsToDeposit: initialDeposits, daiToBorrow })
      await borrowPage.viewInMyPortfolioAction()

      await myPortfolioPage.goToMyPortfolioAction()
      await myPortfolioPage.expectDepositTable({
        wstETH: initialDeposits.wstETH,
        rETH: initialDeposits.rETH,
      })
    })

    test('disables collateral', async () => {
      const collateral = 'rETH'

      await myPortfolioPage.expectCollateralSwitch(collateral, true)
      await myPortfolioPage.clickCollateralSwitchAction(collateral)

      await collateralDialog.expectDialogHeader('Collateral')
      await collateralDialog.expectHealthFactorBefore('3.77')
      await collateralDialog.expectHealthFactorAfter('3.73')
      await collateralDialog.actionsContainer.acceptAllActionsAction(1)
      await collateralDialog.expectSetUseAsCollateralSuccessPage(collateral, 'disabled')

      await myPortfolioPage.goToMyPortfolioAction()
      await myPortfolioPage.expectCollateralSwitch('rETH', false)
    })

    test('cannot disable collateral when second one would not cover loan', async () => {
      const collateral = 'wstETH'

      await myPortfolioPage.expectCollateralSwitch(collateral, true)
      await myPortfolioPage.clickCollateralSwitchAction(collateral)

      await collateralDialog.expectDialogHeader('Collateral')
      await collateralDialog.expectHealthFactorBefore('3.77')
      await collateralDialog.expectHealthFactorAfter('0.04')
      await collateralDialog.expectAlertMessage(setUseAsCollateralValidationIssueToMessage['exceeds-ltv'])
      await collateralDialog.actionsContainer.expectDisabledActionAtIndex(0)

      await myPortfolioPage.goToMyPortfolioAction()
      await myPortfolioPage.expectCollateralSwitch(collateral, true)
    })
  })

  test.describe('Isolation mode', () => {
    const isolatedAsset = 'weETH'
    const regularAsset = 'rETH'
    const initialDeposits = {
      [regularAsset]: 1,
    }
    const myPortfolioDesposits = {
      [isolatedAsset]: 100,
    }

    let collateralDialog: CollateralDialogPageObject
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
          assetBalances: { ...initialBalances },
        },
      })

      // Depositing regular asset at borrow page to show myPortfolio positions
      const borrowPage = new BorrowPageObject(testContext)
      myPortfolioPage = new MyPortfolioPageObject(testContext)
      collateralDialog = new CollateralDialogPageObject(testContext)

      await borrowPage.depositWithoutBorrowActions({ assetsToDeposit: initialDeposits })

      await myPortfolioPage.goToMyPortfolioAction()
      await myPortfolioPage.expectDepositTable({
        [regularAsset]: initialDeposits[regularAsset],
      })

      // Depositing isolated asset at myPortfolio
      await myPortfolioPage.clickDepositButtonAction(isolatedAsset)
      const depositDialog = new DialogPageObject({ testContext, header: /Deposit/ })
      await depositDialog.fillAmountAction(myPortfolioDesposits[isolatedAsset])
      await depositDialog.actionsContainer.acceptAllActionsAction(2)
      await depositDialog.viewInMyPortfolioAction()

      // Disabling regular asset as collateral
      await myPortfolioPage.clickCollateralSwitchAction(regularAsset)
      await collateralDialog.setUseAsCollateralAction({ assetName: regularAsset, setting: 'disabled' })
      await myPortfolioPage.goToMyPortfolioAction()
      await myPortfolioPage.expectCollateralSwitch(isolatedAsset, false)

      // Entering isolation mode
      await myPortfolioPage.clickCollateralSwitchAction(isolatedAsset)
      await collateralDialog.setUseAsCollateralAction({ assetName: isolatedAsset, setting: 'enabled' })
      await myPortfolioPage.goToMyPortfolioAction()

      await myPortfolioPage.expectCollateralSwitch(isolatedAsset, true)
    })

    test('cannot enable asset as collateral in isolation mode', async () => {
      const collateral = 'rETH'

      await myPortfolioPage.expectCollateralSwitch(collateral, false)
      await myPortfolioPage.clickCollateralSwitchAction(collateral)

      await collateralDialog.expectAlertMessage(setUseAsCollateralValidationIssueToMessage['isolation-mode-active'])
      await collateralDialog.actionsContainer.expectDisabledActionAtIndex(0)

      await myPortfolioPage.goToMyPortfolioAction()
      await myPortfolioPage.expectCollateralSwitch(collateral, false)
    })
  })

  test.describe('Liquidation risk warning', () => {
    test.describe('In danger zone', () => {
      let collateralDialog: CollateralDialogPageObject
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
        const borrowDialog = new DialogPageObject({ testContext, header: /Borrow/ })
        collateralDialog = new CollateralDialogPageObject(testContext)
        myPortfolioPage = new MyPortfolioPageObject(testContext)

        await borrowPage.depositWithoutBorrowActions({ assetsToDeposit: { rETH: 2, wstETH: 10 } })

        await myPortfolioPage.goToMyPortfolioAction()
        await myPortfolioPage.clickBorrowButtonAction('WETH')

        await borrowDialog.fillAmountAction(7)
        await borrowDialog.actionsContainer.acceptAllActionsAction(1)
        await borrowDialog.expectSuccessPage({
          tokenWithValue: [{ asset: 'WETH', amount: '7.00', usdValue: '$27,498.19' }],
        })
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
      let borrowPage: BorrowPageObject

      const rETHDeposit = { asset: 'rETH', amount: 1 }
      const wstETHDeposit = { asset: 'wstETH', amount: 1 }
      const daiBorrow = { asset: 'DAI', amount: 500 }

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

        collateralDialog = new CollateralDialogPageObject(testContext)
        myPortfolioPage = new MyPortfolioPageObject(testContext)
        borrowPage = new BorrowPageObject(testContext)
      })

      test('validation issue; risk warning is not shown', async () => {
        // depositing single asset as collateral, so turing off will trigger validation
        await borrowPage.depositAssetsActions({
          assetsToDeposit: { rETH: rETHDeposit.amount },
          daiToBorrow: daiBorrow.amount,
        })
        await borrowPage.expectSuccessPage({
          deposited: [{ asset: 'rETH', amount: '1.00', usdValue: '$4,413.26' }],
          borrowed: { asset: 'DAI', amount: '500.00', usdValue: '$500.00' },
        })
        await myPortfolioPage.goToMyPortfolioAction()
        await myPortfolioPage.expectAssetToBeInBorrowTable('DAI')

        await myPortfolioPage.clickCollateralSwitchAction('rETH')
        await collateralDialog.expectAlertMessage(setUseAsCollateralValidationIssueToMessage['exceeds-ltv'])
        await collateralDialog.expectLiquidationRiskWarningNotVisible()
      })

      test('no validation issue; risk warning is not shown', async () => {
        // depositing multiple assets as collateral, so turning off single asset will not trigger validation
        await borrowPage.depositAssetsActions({
          assetsToDeposit: { wstETH: wstETHDeposit.amount, rETH: rETHDeposit.amount },
          daiToBorrow: daiBorrow.amount,
        })
        await borrowPage.expectSuccessPage({
          deposited: [
            { asset: 'wstETH', amount: '1.00', usdValue: '$4,665.46' },
            { asset: 'rETH', amount: '1.00', usdValue: '$4,413.26' },
          ],
          borrowed: { asset: 'DAI', amount: '500.00', usdValue: '$500.00' },
        })

        await myPortfolioPage.goToMyPortfolioAction()
        await myPortfolioPage.expectAssetToBeInBorrowTable('DAI')

        await myPortfolioPage.clickCollateralSwitchAction('rETH')
        await collateralDialog.expectLiquidationRiskWarningNotVisible()
      })
    })
  })
})
