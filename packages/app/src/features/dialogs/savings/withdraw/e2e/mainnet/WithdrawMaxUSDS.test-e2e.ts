// import { ActionsPageObject } from '@/features/actions/ActionsContainer.PageObject'
// import { SavingsPageObject } from '@/pages/Savings.PageObject'
// import { USDS_ACTIVATED_BLOCK_NUMBER } from '@/test/e2e/constants'
// import { setupFork } from '@/test/e2e/forking/setupFork'
// import { setup } from '@/test/e2e/setup'
// import { test } from '@playwright/test'
// import { mainnet } from 'viem/chains'
// import { SavingsDialogPageObject } from '../../../common/e2e/SavingsDialog.PageObject'

// test.describe('Withdraw USDS from sUSDS', () => {
//   const fork = setupFork({ blockNumber: USDS_ACTIVATED_BLOCK_NUMBER, chainId: mainnet.id, useTenderlyVnet: true })
//   let savingsPage: SavingsPageObject
//   let withdrawDialog: SavingsDialogPageObject

//   test.beforeEach(async ({ page }) => {
//     await setup(page, fork, {
//       initialPage: 'savings',
//       account: {
//         type: 'connected-random',
//         assetBalances: {
//           ETH: 1,
//           USDS: 10_000,
//         },
//       },
//     })

//     savingsPage = new SavingsPageObject(page)

//     await savingsPage.clickDepositButtonAction('USDS')
//     const depositDialog = new SavingsDialogPageObject({ page, type: 'deposit' })
//     await depositDialog.fillAmountAction(10_000)
//     await depositDialog.actionsContainer.acceptAllActionsAction(2, fork)
//     await depositDialog.clickBackToSavingsButton()

//     await savingsPage.clickWithdrawSUsdsButtonAction()
//     withdrawDialog = new SavingsDialogPageObject({ page, type: 'withdraw' })
//     await withdrawDialog.clickMaxAmountAction()
//   })

//   test('uses native sUSDS withdraw', async () => {
//     await withdrawDialog.actionsContainer.expectActions([
//       { type: 'withdrawFromSavings', asset: 'USDS', savingsAsset: 'sUSDS', mode: 'withdraw' },
//     ])
//   })

//   test('displays transaction overview', async () => {
//     await withdrawDialog.expectNativeRouteTransactionOverview({
//       routeItems: [
//         {
//           tokenAmount: '9,999.77 sUSDS',
//           tokenUsdValue: '$10,000.00',
//         },
//         {
//           tokenAmount: '10,000.00 USDS',
//           tokenUsdValue: '$10,000.00',
//         },
//       ],
//       outcome: '10,000.00 USDS',
//       outcomeUsd: '$10,000.00',
//     })

//     await withdrawDialog.expectUpgradeSwitchToBeHidden()
//   })

//   test('executes withdraw', async () => {
//     const actionsContainer = new ActionsPageObject(withdrawDialog.locatePanelByHeader('Actions'))
//     await actionsContainer.acceptAllActionsAction(1, fork)

//     await withdrawDialog.expectSuccessPage()
//     await withdrawDialog.clickBackToSavingsButton()

//     await savingsPage.expectOpportunityStablecoinsAmount('~$10,000.00')
//     await savingsPage.expectStablecoinsInWalletAssetBalance('USDS', '10,000')
//   })
// })

// test.describe('Withdraw USDS from sDAI', () => {
//   const fork = setupFork({ blockNumber: USDS_ACTIVATED_BLOCK_NUMBER, chainId: mainnet.id, useTenderlyVnet: true })
//   let savingsPage: SavingsPageObject
//   let withdrawDialog: SavingsDialogPageObject

//   test.beforeEach(async ({ page }) => {
//     await setup(page, fork, {
//       initialPage: 'savings',
//       account: {
//         type: 'connected-random',
//         assetBalances: {
//           ETH: 1,
//           sDAI: 10_000,
//         },
//       },
//     })

//     savingsPage = new SavingsPageObject(page)

//     await savingsPage.clickWithdrawSDaiButtonAction()
//     withdrawDialog = new SavingsDialogPageObject({ page, type: 'withdraw' })
//     await withdrawDialog.selectAssetAction('USDS')
//     await withdrawDialog.clickMaxAmountAction()
//   })

//   test('uses migrate sDAI to USDS action', async () => {
//     await withdrawDialog.actionsContainer.expectActions([
//       { type: 'approve', asset: 'sDAI' },
//       { type: 'withdrawFromSavings', asset: 'USDS', savingsAsset: 'sDAI', mode: 'withdraw' },
//     ])
//   })

//   test('displays transaction overview', async () => {
//     await withdrawDialog.expectNativeRouteTransactionOverview({
//       routeItems: [
//         {
//           tokenAmount: '10,000.00 sDAI',
//           tokenUsdValue: '$11,085.91',
//         },
//         {
//           tokenAmount: '11,085.91 DAI',
//           tokenUsdValue: '$11,085.91',
//         },
//         {
//           tokenAmount: '11,085.91 USDS',
//           tokenUsdValue: '$11,085.91',
//         },
//       ],
//       outcome: '11,085.91 USDS',
//       outcomeUsd: '$11,085.91',
//     })

//     await withdrawDialog.expectUpgradeSwitchToBeHidden()
//   })

//   test('executes withdraw', async () => {
//     const actionsContainer = new ActionsPageObject(withdrawDialog.locatePanelByHeader('Actions'))
//     await actionsContainer.acceptAllActionsAction(2, fork)

//     await withdrawDialog.expectSuccessPage()
//     await withdrawDialog.clickBackToSavingsButton()

//     await savingsPage.expectOpportunityStablecoinsAmount('~$11,085.91')
//     await savingsPage.expectStablecoinsInWalletAssetBalance('USDS', '11,085.91')
//   })
// })
