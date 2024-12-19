// import { test } from '@playwright/test'
// import { mainnet } from 'viem/chains'

// import { withdrawalValidationIssueToMessage } from '@/domain/market-validators/validateWithdraw'
// import { ActionsPageObject } from '@/features/actions/ActionsContainer.PageObject'
// import { BorrowPageObject } from '@/pages/Borrow.PageObject'
// import { MyPortfolioPageObject } from '@/pages/MyPortfolio.PageObject'
// import { DEFAULT_BLOCK_NUMBER } from '@/test/e2e/constants'
// import { setupFork } from '@/test/e2e/forking/setupFork'
// import { setup } from '@/test/e2e/setup'
// import { screenshot } from '@/test/e2e/utils'

// import { CollateralDialogPageObject } from '../collateral/CollateralDialog.PageObject'
// import { DialogPageObject } from '../common/Dialog.PageObject'
// import { EModeDialogPageObject } from '../e-mode/EModeDialog.PageObject'
// import { withdrawValidationIssueToMessage } from '../savings/withdraw/logic/validation'

// const headerRegExp = /Withdr*/

// test.describe('Withdraw dialog', () => {
//   const fork = setupFork({ blockNumber: DEFAULT_BLOCK_NUMBER, chainId: mainnet.id })
//   const initialBalances = {
//     wstETH: 100,
//     rETH: 100,
//     ETH: 100,
//   }

//   test.describe('Position with deposit and borrow', () => {
//     const initialDeposits = {
//       wstETH: 2,
//       rETH: 2,
//     } as const
//     const daiToBorrow = 3500

//     test.beforeEach(async ({ page }) => {
//       await setup(page, fork, {
//         initialPage: 'easyBorrow',
//         account: {
//           type: 'connected-random',
//           assetBalances: { ...initialBalances },
//         },
//       })

//       const borrowPage = new BorrowPageObject(page)
//       await borrowPage.depositAssetsActions(initialDeposits, daiToBorrow)
//       await borrowPage.viewInMyPortfolioAction()

//       const myPortfolioPage = new MyPortfolioPageObject(page)
//       // @todo This waits for the refetch of the data after successful borrow transaction to happen.
//       // This is no ideal, probably we need to refactor expectDepositTable so it takes advantage from
//       // playwright's timeouts instead of parsing it's current state. Then we would be able to
//       // easily wait for the table to be updated.
//       await myPortfolioPage.expectAssetToBeInDepositTable('DAI')
//     })

//     test('opens dialog with selected asset', async ({ page }) => {
//       const myPortfolioPage = new MyPortfolioPageObject(page)
//       await myPortfolioPage.clickWithdrawButtonAction('rETH')

//       const withdrawDialog = new DialogPageObject(page, headerRegExp)
//       await withdrawDialog.expectSelectedAsset('rETH')
//       await withdrawDialog.expectDialogHeader('Withdraw rETH')
//       await withdrawDialog.expectHealthFactorBeforeVisible()

//       await screenshot(withdrawDialog.getDialog(), 'withdraw-dialog-default-view')
//     })

//     test('calculates health factor changes correctly', async ({ page }) => {
//       const myPortfolioPage = new MyPortfolioPageObject(page)
//       await myPortfolioPage.clickWithdrawButtonAction('rETH')

//       const withdrawDialog = new DialogPageObject(page, headerRegExp)
//       await withdrawDialog.fillAmountAction(1)

//       await withdrawDialog.expectRiskLevelBefore('Moderate')
//       await withdrawDialog.expectHealthFactorBefore('2.32')
//       await withdrawDialog.expectRiskLevelAfter('Risky')
//       await withdrawDialog.expectHealthFactorAfter('1.76')

//       // @note this is needed for deterministic screenshots
//       const actionsContainer = new ActionsPageObject(withdrawDialog.locatePanelByHeader('Actions'))
//       await actionsContainer.expectEnabledActionAtIndex(0)

//       await screenshot(withdrawDialog.getDialog(), 'withdraw-dialog-health-factor')
//     })

//     test('has correct action plan for erc-20', async ({ page }) => {
//       const myPortfolioPage = new MyPortfolioPageObject(page)

//       await myPortfolioPage.clickWithdrawButtonAction('rETH')

//       const withdrawDialog = new DialogPageObject(page, headerRegExp)
//       await withdrawDialog.fillAmountAction(1)
//       const actionsContainer = new ActionsPageObject(withdrawDialog.locatePanelByHeader('Actions'))
//       await actionsContainer.expectActions([{ type: 'withdraw', asset: 'rETH' }])
//     })

//     test('can withdraw erc-20', async ({ page }) => {
//       const withdraw = {
//         asset: 'rETH',
//         amount: 1,
//       } as const

//       const myPortfolioPage = new MyPortfolioPageObject(page)

//       await myPortfolioPage.clickWithdrawButtonAction(withdraw.asset)

//       const withdrawDialog = new DialogPageObject(page, headerRegExp)
//       await withdrawDialog.fillAmountAction(withdraw.amount)
//       const actionsContainer = new ActionsPageObject(withdrawDialog.locatePanelByHeader('Actions'))
//       await actionsContainer.acceptAllActionsAction(1)
//       await withdrawDialog.expectSuccessPage([withdraw], fork)

//       await screenshot(withdrawDialog.getDialog(), 'withdraw-dialog-erc-20-success')

//       await withdrawDialog.viewInMyPortfolioAction()

//       await myPortfolioPage.expectDepositTable({
//         ...initialDeposits,
//         [withdraw.asset]: initialDeposits[withdraw.asset] - withdraw.amount,
//       })
//     })
//   })

//   test.describe('Form validation', () => {
//     const initialDeposits = {
//       wstETH: 5,
//       rETH: 1,
//     } as const
//     const daiToBorrow = 4500

//     test.beforeEach(async ({ page }) => {
//       await setup(page, fork, {
//         initialPage: 'easyBorrow',
//         account: {
//           type: 'connected-random',
//           assetBalances: { ...initialBalances },
//         },
//       })

//       const borrowPage = new BorrowPageObject(page)
//       await borrowPage.depositAssetsActions(initialDeposits, daiToBorrow)
//       await borrowPage.viewInMyPortfolioAction()

//       const myPortfolioPage = new MyPortfolioPageObject(page)
//       // @todo This waits for the refetch of the data after successful borrow transaction to happen.
//       // This is no ideal, probably we need to refactor expectDepositTable so it takes advantage from
//       // playwright's timeouts instead of parsing it's current state. Then we would be able to
//       // easily wait for the table to be updated.
//       await myPortfolioPage.expectAssetToBeInDepositTable('DAI')
//     })

//     test('cannot withdraw amount that will result in health factor under 1', async ({ page }) => {
//       const withdrawAsset = 'wstETH'
//       const myPortfolioPage = new MyPortfolioPageObject(page)
//       await myPortfolioPage.expectDepositTable(initialDeposits)
//       await myPortfolioPage.clickWithdrawButtonAction(withdrawAsset)

//       const withdrawDialog = new DialogPageObject(page, headerRegExp)
//       await withdrawDialog.expectHealthFactorBefore('2.75')
//       await withdrawDialog.fillAmountAction(initialDeposits[withdrawAsset] - 0.1) // we subtract small amount to ensure that we have enough balance in test, which may not be the case due to timestamp issues
//       await withdrawDialog.expectAssetInputError('Remaining collateral cannot support the loan')

//       await screenshot(withdrawDialog.getDialog(), 'withdraw-dialog-cannot-support-loan')
//     })

//     test('cannot withdraw more than deposited', async ({ page }) => {
//       const withdrawAsset = 'rETH'
//       const myPortfolioPage = new MyPortfolioPageObject(page)
//       await myPortfolioPage.expectDepositTable(initialDeposits)
//       await myPortfolioPage.clickWithdrawButtonAction(withdrawAsset)

//       const withdrawDialog = new DialogPageObject(page, headerRegExp)
//       await withdrawDialog.expectHealthFactorBefore('2.75')
//       await withdrawDialog.fillAmountAction(initialDeposits[withdrawAsset] + 1)
//       await withdrawDialog.expectAssetInputError(withdrawalValidationIssueToMessage['exceeds-balance'])

//       await screenshot(withdrawDialog.getDialog(), 'withdraw-dialog-more-than-deposited')
//     })
//   })

//   test.describe('Position with native deposit and borrow', () => {
//     const ETHdeposit = {
//       asset: 'ETH',
//       amount: 10,
//     }
//     const borrow = {
//       asset: 'DAI',
//       amount: 1000,
//     }

//     test.beforeEach(async ({ page }) => {
//       await setup(page, fork, {
//         initialPage: 'easyBorrow',
//         account: {
//           type: 'connected-random',
//           assetBalances: { ...initialBalances },
//         },
//       })

//       const borrowPage = new BorrowPageObject(page)
//       const actionsContainer = new ActionsPageObject(page)
//       await borrowPage.fillDepositAssetAction(0, ETHdeposit.asset, ETHdeposit.amount)
//       await borrowPage.fillBorrowAssetAction(borrow.amount)

//       await borrowPage.submitAction()

//       await actionsContainer.acceptAllActionsAction(2)

//       await borrowPage.expectSuccessPage([ETHdeposit], borrow, fork)

//       const myPortfolioPage = new MyPortfolioPageObject(page)
//       await myPortfolioPage.goToMyPortfolioAction()
//     })

//     // @note When ETH is deposited, deposit table shows WETH instead of ETH
//     test('has correct action plan for native asset', async ({ page }) => {
//       const myPortfolioPage = new MyPortfolioPageObject(page)

//       await myPortfolioPage.clickWithdrawButtonAction('WETH')

//       const withdrawDialog = new DialogPageObject(page, headerRegExp)
//       await withdrawDialog.selectAssetAction('ETH')
//       await withdrawDialog.fillAmountAction(1)
//       await withdrawDialog.expectHealthFactorVisible()
//       const actionsContainer = new ActionsPageObject(withdrawDialog.locatePanelByHeader('Actions'))
//       await actionsContainer.expectActions([
//         { type: 'approve', asset: 'aWETH' },
//         { type: 'withdraw', asset: 'ETH' },
//       ])

//       await screenshot(withdrawDialog.getDialog(), 'withdraw-dialog-eth-action-plan')
//     })

//     // @note When ETH is deposited, deposit table shows WETH instead of ETH
//     test('can withdraw native asset', async ({ page }) => {
//       const withdrawAmount = 1

//       const myPortfolioPage = new MyPortfolioPageObject(page)

//       await myPortfolioPage.clickWithdrawButtonAction('WETH')

//       const withdrawDialog = new DialogPageObject(page, headerRegExp)
//       await withdrawDialog.selectAssetAction('ETH')
//       await withdrawDialog.fillAmountAction(withdrawAmount)
//       const actionsContainer = new ActionsPageObject(withdrawDialog.locatePanelByHeader('Actions'))
//       await actionsContainer.acceptAllActionsAction(2)
//       await withdrawDialog.expectSuccessPage(
//         [
//           {
//             asset: 'ETH',
//             amount: withdrawAmount,
//           },
//         ],
//         fork,
//       )
//       await screenshot(withdrawDialog.getDialog(), 'withdraw-dialog-eth-success')

//       await withdrawDialog.viewInMyPortfolioAction()

//       await myPortfolioPage.expectDepositTable({
//         // @todo Figure out how WETH and ETH conversion should work
//         WETH: ETHdeposit.amount - withdrawAmount,
//       })
//     })
//   })

//   test.describe('Position with only deposit', () => {
//     const initialDeposits = {
//       wstETH: 10,
//       ETH: 2,
//     } as const

//     test.beforeEach(async ({ page }) => {
//       await setup(page, fork, {
//         initialPage: 'easyBorrow',
//         account: {
//           type: 'connected-random',
//           assetBalances: { ...initialBalances },
//         },
//       })

//       const borrowPage = new BorrowPageObject(page)
//       // to simulate a position with only deposits, we go through the easy borrow flow
//       // but interrupt it before the borrow action, going directly to the myPortfolio
//       // this way we have deposit transactions executed, but no borrow transaction
//       // resulting in a position with only deposits
//       await borrowPage.fillDepositAssetAction(0, 'wstETH', initialDeposits.wstETH)
//       await borrowPage.addNewDepositAssetAction()
//       await borrowPage.fillBorrowAssetAction(1) // doesn't matter, we're not borrowing anything
//       await borrowPage.fillDepositAssetAction(1, 'ETH', initialDeposits.ETH)
//       await borrowPage.submitAction()

//       const actionsContainer = new ActionsPageObject(page)
//       await actionsContainer.acceptAllActionsAction(3)
//       await actionsContainer.expectEnabledActionAtIndex(3)

//       const myPortfolioPage = new MyPortfolioPageObject(page)
//       await myPortfolioPage.goToMyPortfolioAction()
//     })

//     test('can withdraw erc-20', async ({ page }) => {
//       const withdraw = {
//         asset: 'wstETH',
//         amount: 1,
//       } as const

//       const myPortfolioPage = new MyPortfolioPageObject(page)
//       await myPortfolioPage.clickWithdrawButtonAction(withdraw.asset)

//       const withdrawDialog = new DialogPageObject(page, headerRegExp)
//       await withdrawDialog.fillAmountAction(withdraw.amount)
//       const actionsContainer = new ActionsPageObject(withdrawDialog.locatePanelByHeader('Actions'))
//       await actionsContainer.acceptAllActionsAction(1)
//       await withdrawDialog.expectSuccessPage([withdraw], fork)

//       await screenshot(withdrawDialog.getDialog(), 'withdraw-dialog-only-deposit-erc-20-success')

//       await withdrawDialog.viewInMyPortfolioAction()

//       await myPortfolioPage.expectDepositTable({
//         WETH: initialDeposits.ETH,
//         [withdraw.asset]: initialDeposits[withdraw.asset] - withdraw.amount,
//       })
//     })

//     test('can fully withdraw erc-20', async ({ page }) => {
//       const withdraw = {
//         asset: 'wstETH',
//         amount: 10,
//       } as const

//       const myPortfolioPage = new MyPortfolioPageObject(page)
//       await myPortfolioPage.clickWithdrawButtonAction(withdraw.asset)

//       const withdrawDialog = new DialogPageObject(page, headerRegExp)
//       await withdrawDialog.clickMaxAmountAction()
//       const actionsContainer = new ActionsPageObject(withdrawDialog.locatePanelByHeader('Actions'))
//       await actionsContainer.acceptAllActionsAction(1)
//       await withdrawDialog.expectSuccessPage([withdraw], fork)

//       await screenshot(withdrawDialog.getDialog(), 'withdraw-dialog-only-deposit-erc-20-success')

//       await withdrawDialog.viewInMyPortfolioAction()

//       await myPortfolioPage.expectDepositTable({
//         WETH: initialDeposits.ETH,
//         [withdraw.asset]: 0,
//       })
//     })

//     test('does not display health factor', async ({ page }) => {
//       const myPortfolioPage = new MyPortfolioPageObject(page)
//       await myPortfolioPage.clickWithdrawButtonAction('wstETH')

//       const withdrawDialog = new DialogPageObject(page, headerRegExp)
//       await withdrawDialog.fillAmountAction(1)

//       await withdrawDialog.expectHealthFactorNotVisible()

//       // @note this is needed for deterministic screenshots
//       const actionsContainer = new ActionsPageObject(withdrawDialog.locatePanelByHeader('Actions'))
//       await actionsContainer.expectEnabledActionAtIndex(0)

//       await screenshot(withdrawDialog.getDialog(), 'withdraw-dialog-only-deposit-health-factor')
//     })

//     test('can fully withdraw native asset', async ({ page }) => {
//       const myPortfolioPage = new MyPortfolioPageObject(page)
//       await myPortfolioPage.clickWithdrawButtonAction('WETH')

//       const withdrawDialog = new DialogPageObject(page, headerRegExp)
//       await withdrawDialog.selectAssetAction('ETH')
//       await withdrawDialog.clickMaxAmountAction()
//       const actionsContainer = new ActionsPageObject(withdrawDialog.locatePanelByHeader('Actions'))
//       await actionsContainer.acceptAllActionsAction(2)
//       await withdrawDialog.expectSuccessPage(
//         [
//           {
//             asset: 'ETH',
//             amount: initialDeposits.ETH,
//           },
//         ],
//         fork,
//       )

//       await withdrawDialog.viewInMyPortfolioAction()

//       await myPortfolioPage.expectDepositTable({
//         WETH: 0,
//         wstETH: initialDeposits.wstETH,
//       })
//     })
//   })

//   test.describe('Liquidation risk warning', () => {
//     let withdrawDialog: DialogPageObject
//     let myPortfolioPage: MyPortfolioPageObject

//     test.beforeEach(async ({ page }) => {
//       await setup(page, fork, {
//         initialPage: 'easyBorrow',
//         account: {
//           type: 'connected-random',
//           assetBalances: { ETH: 1, rETH: 100, wstETH: 100 },
//         },
//       })

//       withdrawDialog = new DialogPageObject(page, headerRegExp)
//       myPortfolioPage = new MyPortfolioPageObject(page)

//       const borrowPage = new BorrowPageObject(page)
//       await borrowPage.depositWithoutBorrowActions({ rETH: 2, wstETH: 10 })
//       await myPortfolioPage.goToMyPortfolioAction()

//       await myPortfolioPage.clickBorrowButtonAction('WETH')
//       const borrowDialog = new DialogPageObject(page, /Borrow/)
//       await borrowDialog.fillAmountAction(7)
//       await borrowDialog.actionsContainer.acceptAllActionsAction(1)
//       await borrowDialog.expectSuccessPage([{ asset: 'WETH', amount: 7 }], fork)
//       await borrowDialog.viewInMyPortfolioAction()
//       await myPortfolioPage.expectAssetToBeInBorrowTable('WETH')
//     })

//     test('shows risk warning', async () => {
//       await myPortfolioPage.clickWithdrawButtonAction('rETH')

//       await withdrawDialog.clickMaxAmountAction()
//       await withdrawDialog.expectLiquidationRiskWarning(
//         'Withdrawing this amount puts you at risk of quick liquidation. You may lose part of your collateral.',
//       )
//     })

//     test('actions stay disabled until risk warning is acknowledged', async () => {
//       await myPortfolioPage.clickWithdrawButtonAction('rETH')

//       await withdrawDialog.clickMaxAmountAction()
//       await withdrawDialog.actionsContainer.expectDisabledActionAtIndex(0)
//       await withdrawDialog.clickAcknowledgeRisk()
//       await withdrawDialog.actionsContainer.expectEnabledActionAtIndex(0)
//     })

//     test('hf above danger zone threshold; risk warning is not shown', async () => {
//       await myPortfolioPage.clickWithdrawButtonAction('rETH')

//       await withdrawDialog.fillAmountAction(0.1)
//       await withdrawDialog.actionsContainer.expectEnabledActionAtIndex(0)
//       await withdrawDialog.expectLiquidationRiskWarningNotVisible()
//     })

//     test('input validation error; risk warning is not shown', async () => {
//       await myPortfolioPage.clickWithdrawButtonAction('rETH')

//       await withdrawDialog.fillAmountAction(0)
//       await withdrawDialog.expectAssetInputError(withdrawValidationIssueToMessage['value-not-positive'])
//       await withdrawDialog.expectLiquidationRiskWarningNotVisible()
//     })

//     test('hf in danger zone; asset not collateral; risk warning is not shown', async ({ page }) => {
//       // disabling collateral and entering danger zone
//       await myPortfolioPage.clickCollateralSwitchAction('rETH')
//       const collateralDialog = new CollateralDialogPageObject(page)
//       await collateralDialog.clickAcknowledgeRisk()
//       await collateralDialog.actionsContainer.acceptAllActionsAction(1)
//       await collateralDialog.expectSetUseAsCollateralSuccessPage('rETH', 'disabled')
//       await myPortfolioPage.goToMyPortfolioAction()
//       await myPortfolioPage.expectCollateralSwitch('rETH', false)

//       await myPortfolioPage.clickWithdrawButtonAction('rETH')
//       await withdrawDialog.clickMaxAmountAction()
//       await withdrawDialog.actionsContainer.expectEnabledActionAtIndex(0)
//       await withdrawDialog.expectLiquidationRiskWarningNotVisible()
//     })
//   })

//   test.describe('MAX button', () => {
//     let withdrawDialog: DialogPageObject
//     let borrowDialog: DialogPageObject
//     let depositDialog: DialogPageObject
//     let myPortfolioPage: MyPortfolioPageObject

//     test.beforeEach(async ({ page }) => {
//       await setup(page, fork, {
//         initialPage: 'myPortfolio',
//         account: {
//           type: 'connected-random',
//           assetBalances: { ETH: 10, wstETH: 5, rETH: 1, WBTC: 1 },
//         },
//       })

//       withdrawDialog = new DialogPageObject(page, headerRegExp)
//       myPortfolioPage = new MyPortfolioPageObject(page)
//       borrowDialog = new DialogPageObject(page, /Borrow/)

//       await myPortfolioPage.clickDepositButtonAction('wstETH')
//       depositDialog = new DialogPageObject(page, /Deposit/)
//       await depositDialog.fillAmountAction(5)
//       await depositDialog.actionsContainer.acceptAllActionsAction(2, fork)
//       await depositDialog.viewInMyPortfolioAction()
//       await myPortfolioPage.expectDepositedAssets(13_104.84)
//     })

//     test('withdraws amount up to HF 1.01', async () => {
//       await myPortfolioPage.clickBorrowButtonAction('DAI')
//       await borrowDialog.fillAmountAction(5000)
//       await borrowDialog.actionsContainer.acceptAllActionsAction(1)
//       await borrowDialog.viewInMyPortfolioAction()
//       await myPortfolioPage.expectHealthFactor('2.08')

//       await myPortfolioPage.clickWithdrawButtonAction('wstETH')

//       await withdrawDialog.clickMaxAmountAction()
//       await withdrawDialog.clickAcknowledgeRisk()

//       await withdrawDialog.expectInputValue('2.576392')
//       await withdrawDialog.expectHealthFactorBefore('2.08')
//       await withdrawDialog.expectHealthFactorAfter('1.01')
//       await withdrawDialog.actionsContainer.expectActions([{ type: 'withdraw', asset: 'wstETH' }])
//       await withdrawDialog.actionsContainer.expectEnabledActionAtIndex(0)
//     })

//     test('works for collaterals with different liquidation thresholds', async () => {
//       await myPortfolioPage.clickDepositButtonAction('WBTC')
//       await depositDialog.fillAmountAction(1)
//       await depositDialog.actionsContainer.acceptAllActionsAction(2)
//       await depositDialog.viewInMyPortfolioAction()
//       await myPortfolioPage.expectDepositedAssets(54_910)

//       await myPortfolioPage.clickBorrowButtonAction('DAI')
//       await borrowDialog.fillAmountAction(35000)
//       await borrowDialog.clickAcknowledgeRisk()
//       await borrowDialog.actionsContainer.acceptAllActionsAction(1)
//       await borrowDialog.viewInMyPortfolioAction()
//       await myPortfolioPage.expectHealthFactor('1.19')

//       await myPortfolioPage.clickWithdrawButtonAction('WBTC')

//       await withdrawDialog.clickMaxAmountAction()
//       await withdrawDialog.clickAcknowledgeRisk()

//       await withdrawDialog.expectInputValue('0.204922')
//       await withdrawDialog.expectHealthFactorBefore('1.19')
//       await withdrawDialog.expectHealthFactorAfter('1.01')
//       await withdrawDialog.actionsContainer.expectActions([{ type: 'withdraw', asset: 'WBTC' }])
//       await withdrawDialog.actionsContainer.expectEnabledActionAtIndex(0)
//     })

//     test('works in e-mode', async ({ page }) => {
//       await myPortfolioPage.clickBorrowButtonAction('WETH')
//       await borrowDialog.fillAmountAction(2)
//       await borrowDialog.actionsContainer.acceptAllActionsAction(1)
//       await borrowDialog.viewInMyPortfolioAction()
//       await myPortfolioPage.expectHealthFactor('2.3')
//       await myPortfolioPage.clickEModeButtonAction()
//       const eModeDialog = new EModeDialogPageObject(page)
//       await eModeDialog.clickEModeCategoryTileAction('ETH Correlated')
//       await eModeDialog.actionsContainer.acceptAllActionsAction(1)
//       await eModeDialog.viewInMyPortfolioAction()
//       await myPortfolioPage.expectHealthFactor('2.69')

//       await myPortfolioPage.clickWithdrawButtonAction('wstETH')
//       await withdrawDialog.clickMaxAmountAction()
//       await withdrawDialog.clickAcknowledgeRisk()

//       await withdrawDialog.expectInputValue('3.119467')
//       await withdrawDialog.expectHealthFactorBefore('2.69')
//       await withdrawDialog.expectHealthFactorAfter('1.01')
//       await withdrawDialog.actionsContainer.expectActions([{ type: 'withdraw', asset: 'wstETH' }])
//       await withdrawDialog.actionsContainer.expectEnabledActionAtIndex(0)
//     })

//     test('works for asset with usage as collateral disabled', async ({ page }) => {
//       await myPortfolioPage.clickBorrowButtonAction('DAI')
//       await borrowDialog.clickMaxAmountAction()
//       await borrowDialog.clickAcknowledgeRisk()
//       await borrowDialog.actionsContainer.acceptAllActionsAction(1)
//       await borrowDialog.viewInMyPortfolioAction()
//       await myPortfolioPage.expectHealthFactor('1.17')

//       await myPortfolioPage.clickDepositButtonAction('rETH')
//       const depositDialog = new DialogPageObject(page, /Deposit/)
//       await depositDialog.fillAmountAction(1)
//       await depositDialog.actionsContainer.acceptAllActionsAction(2)
//       await depositDialog.viewInMyPortfolioAction()
//       await myPortfolioPage.expectHealthFactor('1.39')

//       await myPortfolioPage.clickCollateralSwitchAction('rETH')
//       const collateralDialog = new CollateralDialogPageObject(page)
//       await collateralDialog.clickAcknowledgeRisk()
//       await collateralDialog.setUseAsCollateralAction('rETH', 'disabled')
//       await myPortfolioPage.goToMyPortfolioAction()
//       await myPortfolioPage.expectHealthFactor('1.17')

//       await myPortfolioPage.clickWithdrawButtonAction('rETH')
//       await withdrawDialog.clickMaxAmountAction()

//       await withdrawDialog.expectInputValue('1')
//       await withdrawDialog.expectMaxButtonDisabled()
//       await withdrawDialog.expectHealthFactorBefore('1.17')
//       await withdrawDialog.expectHealthFactorAfter('1.17')
//       await withdrawDialog.actionsContainer.expectActions([{ type: 'withdraw', asset: 'rETH' }])
//       await withdrawDialog.actionsContainer.expectEnabledActionAtIndex(0)
//     })

//     test('native asset withdrawal requires enough approval', async () => {
//       await myPortfolioPage.clickDepositButtonAction('WETH')
//       await depositDialog.selectAssetAction('ETH')
//       await depositDialog.fillAmountAction(5)
//       await depositDialog.actionsContainer.acceptAllActionsAction(1, fork)
//       await depositDialog.viewInMyPortfolioAction()
//       await myPortfolioPage.expectDepositedAssets(24_450)

//       await myPortfolioPage.clickWithdrawButtonAction('WETH')
//       await withdrawDialog.selectAssetAction('ETH')
//       await withdrawDialog.clickMaxAmountAction()

//       await withdrawDialog.actionsContainer.expectActions([
//         { type: 'approve', asset: 'aWETH' },
//         { type: 'withdraw', asset: 'ETH' },
//       ])

//       await withdrawDialog.actionsContainer.acceptActionAtIndex(0, fork)
//       await withdrawDialog.actionsContainer.expectEnabledActionAtIndex(1)
//       await withdrawDialog.closeDialog()

//       await myPortfolioPage.clickDepositButtonAction('WETH')
//       await depositDialog.selectAssetAction('ETH')
//       await depositDialog.fillAmountAction(4)
//       await depositDialog.actionsContainer.acceptAllActionsAction(1)
//       await depositDialog.viewInMyPortfolioAction()
//       await myPortfolioPage.expectDepositedAssets(33_530)

//       // following checks leverage the fact that approval is cached, therefore we input different values to estimate the approval value
//       await myPortfolioPage.clickWithdrawButtonAction('WETH')
//       await withdrawDialog.selectAssetAction('ETH')
//       await withdrawDialog.fillAmountAction(5.000001)
//       await withdrawDialog.actionsContainer.expectEnabledActionAtIndex(1)
//       await withdrawDialog.fillAmountAction(5.000003)
//       await withdrawDialog.actionsContainer.expectEnabledActionAtIndex(1)
//       await withdrawDialog.fillAmountAction(5.000004)
//       await withdrawDialog.actionsContainer.expectEnabledActionAtIndex(0)
//     })
//   })
// })
