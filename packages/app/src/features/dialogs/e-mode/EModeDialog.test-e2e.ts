// import { setUserEModeValidationIssueToMessage } from '@/domain/market-validators/validateSetUserEMode'
// import { BorrowPageObject } from '@/pages/Borrow.PageObject'
// import { MyPortfolioPageObject } from '@/pages/MyPortfolio.PageObject'
// import { DEFAULT_BLOCK_NUMBER } from '@/test/e2e/constants'
// import { setupFork } from '@/test/e2e/forking/setupFork'
// import { setup } from '@/test/e2e/setup'
// import { test } from '@playwright/test'
// import { mainnet } from 'viem/chains'
// import { DialogPageObject } from '../common/Dialog.PageObject'
// import { EModeDialogPageObject } from './EModeDialog.PageObject'

// test.describe('E-Mode dialog', () => {
//   const fork = setupFork({ blockNumber: DEFAULT_BLOCK_NUMBER, chainId: mainnet.id, useTenderlyVnet: true })

//   test.describe('ETH correlated assets borrowed', () => {
//     let eModeDialog: EModeDialogPageObject
//     let borrowDialog: DialogPageObject
//     let myPortfolioPage: MyPortfolioPageObject

//     test.beforeEach(async ({ page }) => {
//       await setup(page, fork, {
//         initialPage: 'easyBorrow',
//         account: {
//           type: 'connected-random',
//           assetBalances: { ETH: 1, wstETH: 100 },
//         },
//       })

//       eModeDialog = new EModeDialogPageObject(page)
//       borrowDialog = new DialogPageObject(page, /Borrow/)
//       myPortfolioPage = new MyPortfolioPageObject(page)

//       const borrowPage = new BorrowPageObject(page)
//       await borrowPage.depositWithoutBorrowActions({ wstETH: 20 })
//       await myPortfolioPage.goToMyPortfolioAction()

//       await myPortfolioPage.clickBorrowButtonAction('rETH')
//       await borrowDialog.fillAmountAction(5)
//       await borrowDialog.actionsContainer.acceptAllActionsAction(1)
//       await borrowDialog.viewInMyPortfolioAction()
//       await myPortfolioPage.clickBorrowButtonAction('WETH')
//       await borrowDialog.fillAmountAction(5)
//       await borrowDialog.actionsContainer.acceptAllActionsAction(1)
//       await borrowDialog.viewInMyPortfolioAction()
//     })

//     test('can switch from no e-mode to eth correlated', async () => {
//       await myPortfolioPage.clickEModeButtonAction()
//       await eModeDialog.expectEModeCategoryTileStatus('No E-Mode', 'Active')
//       await eModeDialog.expectEModeCategoryTileStatus('ETH Correlated', 'Inactive')
//       await eModeDialog.expectEModeTransactionOverview({
//         variant: 'e-mode-no-change',
//         availableAssets: {
//           assets: 'All assets',
//         },
//         hf: '1.75',
//         maxLtv: '68.50%',
//       })

//       await eModeDialog.clickEModeCategoryTileAction('ETH Correlated')
//       await eModeDialog.actionsContainer.expectActions([{ type: 'setUserEMode', eModeCategoryId: 1 }])
//       await eModeDialog.expectEModeTransactionOverview({
//         variant: 'e-mode-change',
//         availableAssets: {
//           category: 'ETH Correlated',
//           assets: 'WETH, wstETH, rETH',
//         },
//         hf: {
//           before: '1.75',
//           after: '2.05',
//         },
//         maxLtv: {
//           before: '68.50%',
//           after: '90.00%',
//         },
//       })

//       await eModeDialog.actionsContainer.acceptAllActionsAction(1)
//       await eModeDialog.expectEModeSuccessPage('ETH Correlated')
//       await eModeDialog.viewInMyPortfolioAction()
//       await myPortfolioPage.expectEModeBadgeText('ETH Correlated')
//     })

//     test('cannot switch from no e-mode to stablecoins', async () => {
//       await myPortfolioPage.clickEModeButtonAction()
//       await eModeDialog.clickEModeCategoryTileAction('Stablecoins')
//       await eModeDialog.expectAlertMessage(
//         setUserEModeValidationIssueToMessage['borrowed-assets-emode-category-mismatch'],
//       )
//       await eModeDialog.actionsContainer.expectDisabledActions([{ type: 'setUserEMode', eModeCategoryId: 2 }])
//     })

//     test('can enter eth correlated e-mode and switch back to no e-mode', async () => {
//       await myPortfolioPage.clickEModeButtonAction()
//       await eModeDialog.setEModeAction('ETH Correlated')
//       await myPortfolioPage.expectEModeBadgeText('ETH Correlated')
//       await myPortfolioPage.clickEModeButtonAction()

//       await eModeDialog.expectEModeCategoryTileStatus('ETH Correlated', 'Active')
//       await eModeDialog.expectEModeCategoryTileStatus('No E-Mode', 'Inactive')
//       await eModeDialog.clickEModeCategoryTileAction('No E-Mode')

//       await eModeDialog.expectEModeTransactionOverview({
//         variant: 'e-mode-change',
//         availableAssets: {
//           assets: 'All assets',
//         },
//         hf: {
//           before: '2.05',
//           after: '1.75',
//         },
//         maxLtv: {
//           before: '90.00%',
//           after: '68.50%',
//         },
//       })
//       await eModeDialog.actionsContainer.acceptAllActionsAction(1)
//       await eModeDialog.expectEModeSuccessPage('No E-Mode')
//       await eModeDialog.viewInMyPortfolioAction()
//       await myPortfolioPage.expectEModeBadgeText('E-Mode Off')
//     })

//     test('cannot switch back to no e-mode if hf below 1', async () => {
//       await myPortfolioPage.clickEModeButtonAction()
//       await eModeDialog.setEModeAction('ETH Correlated')
//       await myPortfolioPage.expectEModeBadgeText('ETH Correlated')

//       await myPortfolioPage.clickBorrowButtonAction('WETH')
//       await borrowDialog.fillAmountAction(10)
//       await eModeDialog.clickAcknowledgeRisk()
//       await borrowDialog.actionsContainer.acceptAllActionsAction(1)
//       await borrowDialog.viewInMyPortfolioAction()

//       await myPortfolioPage.clickEModeButtonAction()
//       await eModeDialog.clickEModeCategoryTileAction('No E-Mode')
//       await eModeDialog.expectAlertMessage(setUserEModeValidationIssueToMessage['exceeds-ltv'])
//       await eModeDialog.actionsContainer.expectDisabledActions([{ type: 'setUserEMode', eModeCategoryId: 0 }])
//     })
//   })

//   test.describe('Stablecoins borrowed', () => {
//     let eModeDialog: EModeDialogPageObject
//     let borrowDialog: DialogPageObject
//     let myPortfolioPage: MyPortfolioPageObject

//     test.beforeEach(async ({ page }) => {
//       await setup(page, fork, {
//         initialPage: 'easyBorrow',
//         account: {
//           type: 'connected-random',
//           assetBalances: { ETH: 1, wstETH: 100 },
//         },
//       })

//       eModeDialog = new EModeDialogPageObject(page)
//       borrowDialog = new DialogPageObject(page, /Borrow/)
//       myPortfolioPage = new MyPortfolioPageObject(page)

//       const borrowPage = new BorrowPageObject(page)
//       await borrowPage.depositWithoutBorrowActions({ wstETH: 1 })
//       await myPortfolioPage.goToMyPortfolioAction()

//       await myPortfolioPage.clickBorrowButtonAction('USDC')
//       await borrowDialog.fillAmountAction(1000)
//       await borrowDialog.actionsContainer.acceptAllActionsAction(1)
//       await borrowDialog.viewInMyPortfolioAction()
//     })

//     test('can switch from no e-mode to stablecoins', async () => {
//       await myPortfolioPage.clickEModeButtonAction()
//       await eModeDialog.expectEModeCategoryTileStatus('No E-Mode', 'Active')
//       await eModeDialog.expectEModeCategoryTileStatus('Stablecoins', 'Inactive')
//       await eModeDialog.expectEModeTransactionOverview({
//         variant: 'e-mode-no-change',
//         availableAssets: {
//           assets: 'All assets',
//         },
//         hf: '2.08',
//         maxLtv: '68.50%',
//       })

//       await eModeDialog.clickEModeCategoryTileAction('Stablecoins')
//       await eModeDialog.actionsContainer.expectActions([{ type: 'setUserEMode', eModeCategoryId: 2 }])
//       await eModeDialog.expectEModeTransactionOverview({
//         variant: 'e-mode-change',
//         availableAssets: {
//           category: 'Stablecoins',
//           assets: 'sDAI, USDC, USDT',
//         },
//         hf: {
//           before: '2.08',
//           after: '2.08',
//         },
//         maxLtv: {
//           before: '68.50%',
//           after: '68.50%',
//         },
//       })

//       await eModeDialog.actionsContainer.acceptAllActionsAction(1)
//       await eModeDialog.expectEModeSuccessPage('Stablecoins')
//       await eModeDialog.viewInMyPortfolioAction()
//       await myPortfolioPage.expectEModeBadgeText('Stablecoins')
//     })

//     test('cannot switch from no e-mode to eth correlated', async () => {
//       await myPortfolioPage.clickEModeButtonAction()
//       await eModeDialog.clickEModeCategoryTileAction('ETH Correlated')
//       await eModeDialog.expectAlertMessage(
//         setUserEModeValidationIssueToMessage['borrowed-assets-emode-category-mismatch'],
//       )
//       await eModeDialog.actionsContainer.expectDisabledActions([{ type: 'setUserEMode', eModeCategoryId: 2 }])
//     })

//     test('can enter stablecoins e-mode and switch back to no e-mode', async () => {
//       await myPortfolioPage.clickEModeButtonAction()
//       await eModeDialog.setEModeAction('Stablecoins')
//       await myPortfolioPage.expectEModeBadgeText('Stablecoins')
//       await myPortfolioPage.clickEModeButtonAction()

//       await eModeDialog.expectEModeCategoryTileStatus('Stablecoins', 'Active')
//       await eModeDialog.expectEModeCategoryTileStatus('No E-Mode', 'Inactive')
//       await eModeDialog.clickEModeCategoryTileAction('No E-Mode')

//       await eModeDialog.expectEModeTransactionOverview({
//         variant: 'e-mode-change',
//         availableAssets: {
//           assets: 'All assets',
//         },
//         hf: {
//           before: '2.08',
//           after: '2.08',
//         },
//         maxLtv: {
//           before: '68.50%',
//           after: '68.50%',
//         },
//       })
//       await eModeDialog.actionsContainer.acceptAllActionsAction(1)
//       await eModeDialog.expectEModeSuccessPage('No E-Mode')
//       await eModeDialog.viewInMyPortfolioAction()
//       await myPortfolioPage.expectEModeBadgeText('E-Mode Off')
//     })
//   })

//   test.describe('Assets from multiple categories borrowed', () => {
//     let eModeDialog: EModeDialogPageObject
//     let borrowDialog: DialogPageObject
//     let myPortfolioPage: MyPortfolioPageObject

//     test.beforeEach(async ({ page }) => {
//       await setup(page, fork, {
//         initialPage: 'easyBorrow',
//         account: {
//           type: 'connected-random',
//           assetBalances: { ETH: 1, wstETH: 100 },
//         },
//       })

//       eModeDialog = new EModeDialogPageObject(page)
//       borrowDialog = new DialogPageObject(page, /Borrow/)
//       myPortfolioPage = new MyPortfolioPageObject(page)

//       const borrowPage = new BorrowPageObject(page)
//       await borrowPage.depositWithoutBorrowActions({ wstETH: 10 })
//       await myPortfolioPage.goToMyPortfolioAction()

//       await myPortfolioPage.clickBorrowButtonAction('rETH')
//       await borrowDialog.fillAmountAction(1)
//       await borrowDialog.actionsContainer.acceptAllActionsAction(1)
//       await borrowDialog.viewInMyPortfolioAction()

//       await myPortfolioPage.clickBorrowButtonAction('WBTC')
//       await borrowDialog.fillAmountAction(0.1)
//       await borrowDialog.actionsContainer.acceptAllActionsAction(1)
//       await borrowDialog.viewInMyPortfolioAction()
//     })

//     test('cannot switch from no e-mode to stablecoins', async () => {
//       await myPortfolioPage.clickEModeButtonAction()
//       await eModeDialog.expectEModeCategoryTileStatus('No E-Mode', 'Active')
//       await eModeDialog.expectEModeCategoryTileStatus('Stablecoins', 'Inactive')

//       await eModeDialog.clickEModeCategoryTileAction('Stablecoins')

//       await eModeDialog.expectAlertMessage(
//         setUserEModeValidationIssueToMessage['borrowed-assets-emode-category-mismatch'],
//       )
//       await eModeDialog.expectEModeTransactionOverview({
//         variant: 'e-mode-change',
//         availableAssets: {
//           category: 'Stablecoins',
//           assets: 'sDAI, USDC, USDT',
//         },
//         hf: {
//           before: '3.12',
//           after: '3.12',
//         },
//         maxLtv: {
//           before: '68.50%',
//           after: '68.50%',
//         },
//       })
//       await eModeDialog.actionsContainer.expectDisabledActions([{ type: 'setUserEMode', eModeCategoryId: 2 }])
//     })

//     test('cannot switch from no e-mode to eth correlated', async () => {
//       await myPortfolioPage.clickEModeButtonAction()
//       await eModeDialog.expectEModeCategoryTileStatus('No E-Mode', 'Active')
//       await eModeDialog.expectEModeCategoryTileStatus('ETH Correlated', 'Inactive')

//       await eModeDialog.clickEModeCategoryTileAction('ETH Correlated')
//       await eModeDialog.expectEModeTransactionOverview({
//         variant: 'e-mode-change',
//         availableAssets: {
//           category: 'ETH Correlated',
//           assets: 'WETH, wstETH, rETH',
//         },
//         hf: {
//           before: '3.12',
//           after: '3.65',
//         },
//         maxLtv: {
//           before: '68.50%',
//           after: '90.00%',
//         },
//       })
//       await eModeDialog.expectAlertMessage(
//         setUserEModeValidationIssueToMessage['borrowed-assets-emode-category-mismatch'],
//       )
//       await eModeDialog.actionsContainer.expectDisabledActions([{ type: 'setUserEMode', eModeCategoryId: 2 }])
//     })
//   })

//   test.describe('Nothing borrowed', () => {
//     let eModeDialog: EModeDialogPageObject
//     let myPortfolioPage: MyPortfolioPageObject

//     test.beforeEach(async ({ page }) => {
//       await setup(page, fork, {
//         initialPage: 'easyBorrow',
//         account: {
//           type: 'connected-random',
//           assetBalances: { ETH: 1, wstETH: 100 },
//         },
//       })

//       eModeDialog = new EModeDialogPageObject(page)
//       myPortfolioPage = new MyPortfolioPageObject(page)

//       const borrowPage = new BorrowPageObject(page)
//       await borrowPage.depositWithoutBorrowActions({ wstETH: 20 })
//       await myPortfolioPage.goToMyPortfolioAction()
//     })

//     test('can switch from no e-mode to eth correleated', async () => {
//       await myPortfolioPage.clickEModeButtonAction()
//       await eModeDialog.expectEModeCategoryTileStatus('No E-Mode', 'Active')
//       await eModeDialog.expectEModeCategoryTileStatus('ETH Correlated', 'Inactive')

//       await eModeDialog.clickEModeCategoryTileAction('ETH Correlated')
//       await eModeDialog.actionsContainer.expectActions([{ type: 'setUserEMode', eModeCategoryId: 1 }])
//       await eModeDialog.expectEModeTransactionOverview({
//         variant: 'no-borrow',
//         availableAssets: {
//           category: 'ETH Correlated',
//           assets: 'WETH, wstETH, rETH',
//         },
//         maxLtv: {
//           before: '68.50%',
//           after: '90.00%',
//         },
//       })

//       await eModeDialog.actionsContainer.acceptAllActionsAction(1)
//       await eModeDialog.expectEModeSuccessPage('ETH Correlated')
//       await eModeDialog.viewInMyPortfolioAction()
//       await myPortfolioPage.expectEModeBadgeText('ETH Correlated')
//     })

//     test('can switch from no e-mode to stablecoins', async () => {
//       await myPortfolioPage.clickEModeButtonAction()
//       await eModeDialog.expectEModeCategoryTileStatus('No E-Mode', 'Active')

//       await eModeDialog.expectEModeCategoryTileStatus('Stablecoins', 'Inactive')
//       await eModeDialog.clickEModeCategoryTileAction('Stablecoins')
//       await eModeDialog.actionsContainer.expectActions([{ type: 'setUserEMode', eModeCategoryId: 2 }])
//       await eModeDialog.expectEModeTransactionOverview({
//         variant: 'no-borrow',
//         availableAssets: {
//           category: 'Stablecoins',
//           assets: 'sDAI, USDC, USDT',
//         },
//         maxLtv: {
//           before: '68.50%',
//           after: '68.50%',
//         },
//       })

//       await eModeDialog.actionsContainer.acceptAllActionsAction(1)
//       await eModeDialog.expectEModeSuccessPage('Stablecoins')
//       await eModeDialog.viewInMyPortfolioAction()
//       await myPortfolioPage.expectEModeBadgeText('Stablecoins')
//     })

//     test('can enter e-mode and switch back to no e-mode', async () => {
//       await myPortfolioPage.clickEModeButtonAction()
//       await eModeDialog.setEModeAction('Stablecoins')
//       await myPortfolioPage.expectEModeBadgeText('Stablecoins')
//       await myPortfolioPage.clickEModeButtonAction()

//       await eModeDialog.expectEModeCategoryTileStatus('Stablecoins', 'Active')
//       await eModeDialog.expectEModeCategoryTileStatus('No E-Mode', 'Inactive')
//       await eModeDialog.clickEModeCategoryTileAction('No E-Mode')

//       await eModeDialog.expectEModeTransactionOverview({
//         variant: 'no-borrow',
//         availableAssets: {
//           assets: 'All assets',
//         },
//         maxLtv: {
//           before: '68.50%',
//           after: '68.50%',
//         },
//       })
//       await eModeDialog.actionsContainer.acceptAllActionsAction(1)
//       await eModeDialog.expectEModeSuccessPage('No E-Mode')
//       await eModeDialog.viewInMyPortfolioAction()
//       await myPortfolioPage.expectEModeBadgeText('E-Mode Off')
//     })
//   })

//   test.describe('Liquidation risk warning', () => {
//     test.describe('In danger zone', () => {
//       let eModeDialog: EModeDialogPageObject
//       let myPortfolioPage: MyPortfolioPageObject

//       test.beforeEach(async ({ page }) => {
//         await setup(page, fork, {
//           initialPage: 'easyBorrow',
//           account: {
//             type: 'connected-random',
//             assetBalances: { ETH: 1, rETH: 100, wstETH: 100 },
//           },
//         })

//         eModeDialog = new EModeDialogPageObject(page)
//         myPortfolioPage = new MyPortfolioPageObject(page)

//         const borrowPage = new BorrowPageObject(page)
//         await borrowPage.depositWithoutBorrowActions({ rETH: 2, wstETH: 10 })
//         await myPortfolioPage.goToMyPortfolioAction()

//         await myPortfolioPage.clickBorrowButtonAction('WETH')
//         const borrowDialog = new DialogPageObject(page, /Borrow/)
//         await borrowDialog.fillAmountAction(8)
//         await borrowDialog.clickAcknowledgeRisk()
//         await borrowDialog.actionsContainer.acceptAllActionsAction(1)
//         await borrowDialog.expectSuccessPage([{ asset: 'WETH', amount: 8 }], fork)
//         await borrowDialog.viewInMyPortfolioAction()
//         await myPortfolioPage.expectAssetToBeInBorrowTable('WETH')

//         await myPortfolioPage.clickEModeButtonAction()
//         await eModeDialog.setEModeAction('ETH Correlated')
//         await myPortfolioPage.expectEModeBadgeText('ETH Correlated')
//       })

//       test('shows risk warning', async () => {
//         await myPortfolioPage.clickEModeButtonAction()
//         await eModeDialog.clickEModeCategoryTileAction('No E-Mode')
//         await eModeDialog.expectLiquidationRiskWarning(
//           'Disabling E-Mode decreases health factor of your position and puts you at risk of quick liquidation. You may lose part of your collateral.',
//         )
//       })

//       test('actions stay disabled until risk warning is acknowledged', async () => {
//         await myPortfolioPage.clickEModeButtonAction()

//         await eModeDialog.clickEModeCategoryTileAction('No E-Mode')
//         await eModeDialog.actionsContainer.expectDisabledActionAtIndex(0)
//         await eModeDialog.clickAcknowledgeRisk()
//         await eModeDialog.actionsContainer.expectEnabledActionAtIndex(0)
//       })

//       test('validation error; risk warning is not shown', async () => {
//         await myPortfolioPage.clickEModeButtonAction()

//         await eModeDialog.clickEModeCategoryTileAction('Stablecoins')
//         await eModeDialog.expectAlertMessage(
//           setUserEModeValidationIssueToMessage['borrowed-assets-emode-category-mismatch'],
//         )
//         await eModeDialog.expectLiquidationRiskWarningNotVisible()
//       })
//     })

//     test.describe('Not in danger zone', () => {
//       let eModeDialog: EModeDialogPageObject
//       let myPortfolioPage: MyPortfolioPageObject

//       test.beforeEach(async ({ page }) => {
//         await setup(page, fork, {
//           initialPage: 'easyBorrow',
//           account: {
//             type: 'connected-random',
//             assetBalances: { ETH: 1, rETH: 100, wstETH: 100 },
//           },
//         })

//         eModeDialog = new EModeDialogPageObject(page)
//         myPortfolioPage = new MyPortfolioPageObject(page)

//         const borrowPage = new BorrowPageObject(page)
//         await borrowPage.depositWithoutBorrowActions({ rETH: 2, wstETH: 10 })
//         await myPortfolioPage.goToMyPortfolioAction()

//         await myPortfolioPage.clickBorrowButtonAction('WETH')
//         const borrowDialog = new DialogPageObject(page, /Borrow/)
//         await borrowDialog.fillAmountAction(2)
//         await borrowDialog.actionsContainer.acceptAllActionsAction(1)
//         await borrowDialog.expectSuccessPage([{ asset: 'WETH', amount: 2 }], fork)
//         await borrowDialog.viewInMyPortfolioAction()
//         await myPortfolioPage.expectAssetToBeInBorrowTable('WETH')
//       })

//       test('hf above danger zone threshold; risk warning is not shown', async () => {
//         await myPortfolioPage.clickEModeButtonAction()
//         await eModeDialog.clickEModeCategoryTileAction('No E-Mode')
//         await eModeDialog.expectLiquidationRiskWarningNotVisible()
//       })
//     })
//   })
// })
