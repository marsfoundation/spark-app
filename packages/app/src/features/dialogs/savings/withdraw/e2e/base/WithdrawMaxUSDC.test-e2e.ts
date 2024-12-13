// import { ActionsPageObject } from '@/features/actions/ActionsContainer.PageObject'
// import { SavingsPageObject } from '@/pages/Savings.PageObject'
// import { setupFork } from '@/test/e2e/forking/setupFork'
// import { setup } from '@/test/e2e/setup'
// import { test } from '@playwright/test'
// import { base } from 'viem/chains'
// import { SavingsDialogPageObject } from '../../../common/e2e/SavingsDialog.PageObject'

// test.describe('Withdraw Max USDC', () => {
//   const fork = setupFork({ chainId: base.id, blockNumber: 22143788n, useTenderlyVnet: true })
//   let savingsPage: SavingsPageObject
//   let withdrawDialog: SavingsDialogPageObject

//   test.beforeEach(async ({ page }) => {
//     await setup(page, fork, {
//       initialPage: 'savings',
//       account: {
//         type: 'connected-random',
//         assetBalances: {
//           ETH: 1,
//           sUSDS: 10_000,
//         },
//       },
//     })

//     savingsPage = new SavingsPageObject(page)

//     await savingsPage.clickWithdrawSUsdsButtonAction()
//     withdrawDialog = new SavingsDialogPageObject({ page, type: 'withdraw' })
//     await withdrawDialog.selectAssetAction('USDC')
//     await withdrawDialog.clickMaxAmountAction()
//   })

//   test('has correct action plan', async () => {
//     await withdrawDialog.actionsContainer.expectActions([
//       { type: 'approve', asset: 'sUSDS' },
//       { type: 'withdrawFromSavings', asset: 'USDC', savingsAsset: 'sUSDS', mode: 'withdraw' },
//     ])
//   })

//   test('displays transaction overview', async () => {
//     await withdrawDialog.expectNativeRouteTransactionOverview({
//       routeItems: [
//         {
//           tokenAmount: '10,000.00 sUSDS',
//           tokenUsdValue: '$10,089.01',
//         },
//         {
//           tokenAmount: '10,089.01 USDS',
//           tokenUsdValue: '$10,089.01',
//         },
//       ],
//       outcome: '10,089.01 USDC',
//       outcomeUsd: '$10,089.01',
//     })

//     await withdrawDialog.expectUpgradeSwitchToBeHidden()
//   })

//   test('executes withdraw', async () => {
//     const actionsContainer = new ActionsPageObject(withdrawDialog.locatePanelByHeader('Actions'))
//     await actionsContainer.acceptAllActionsAction(2, fork)

//     await withdrawDialog.expectSuccessPage()
//     await withdrawDialog.clickBackToSavingsButton()

//     await savingsPage.expectOpportunityStablecoinsAmount('~$10,089.01')
//     await savingsPage.expectStablecoinsInWalletAssetBalance('USDC', '10,089.01')
//   })
// })
