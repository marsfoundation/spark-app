// import { SavingsPageObject } from '@/pages/Savings.PageObject'
// import { TOKENS_ON_FORK, DEFAULT_BLOCK_NUMBER } from '@/test/e2e/constants'
// import { setupFork } from '@/test/e2e/forking/setupFork'
// import { setup } from '@/test/e2e/setup'
// import { randomAddress } from '@/test/utils/addressUtils'
// import { test } from '@playwright/test'
// import { mainnet } from 'viem/chains'
// import { SavingsDialogPageObject } from '../../../common/e2e/SavingsDialog.PageObject'

// test.describe('Send USDC (withdrawing from sUSDS)', () => {
//   const fork = setupFork({ blockNumber: DEFAULT_BLOCK_NUMBER, chainId: mainnet.id, useTenderlyVnet: true })
//   let savingsPage: SavingsPageObject
//   let sendDialog: SavingsDialogPageObject
//   const receiver = randomAddress('bob')
//   const amount = 7000
//   const usdc = TOKENS_ON_FORK[mainnet.id].USDC

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

//     await savingsPage.clickSendSUsdsButtonAction()
//     sendDialog = new SavingsDialogPageObject({ page, type: 'send' })
//     await sendDialog.selectAssetAction('USDC')
//     await sendDialog.fillAmountAction(amount)
//     await sendDialog.fillReceiverAction(receiver)
//   })

//   test('has correct action plan', async () => {
//     await sendDialog.actionsContainer.expectActions([
//       { type: 'approve', asset: 'sUSDS' },
//       { type: 'withdrawFromSavings', asset: 'USDC', savingsAsset: 'sUSDS', mode: 'send' },
//     ])
//   })

//   test('displays transaction overview', async () => {
//     await sendDialog.expectNativeRouteTransactionOverview({
//       routeItems: [
//         {
//           tokenAmount: '6,999.84 sUSDS',
//           tokenUsdValue: '$7,000.00',
//         },
//         {
//           tokenAmount: '7,000.00 USDS',
//           tokenUsdValue: '$7,000.00',
//         },
//         {
//           tokenAmount: '7,000.00 USDC',
//           tokenUsdValue: '$7,000.00',
//         },
//       ],
//       outcome: '7,000.00 USDC',
//       outcomeUsd: '$7,000.00',
//     })
//   })

//   test('executes send', async () => {
//     await sendDialog.expectReceiverTokenBalance({
//       forkUrl: fork.forkUrl,
//       receiver,
//       token: usdc,
//       expectedBalance: 0,
//     })

//     await sendDialog.actionsContainer.acceptAllActionsAction(2, fork)
//     await sendDialog.expectSuccessPage()

//     await sendDialog.expectReceiverTokenBalance({
//       forkUrl: fork.forkUrl,
//       receiver,
//       token: usdc,
//       expectedBalance: amount,
//     })

//     await sendDialog.clickBackToSavingsButton()
//     await savingsPage.expectSavingsUsdsBalance({ susdsBalance: '2,999.93 sUSDS', estimatedUsdsValue: '3,000' })
//     await savingsPage.expectStablecoinsInWalletAssetBalance('USDC', '-')
//   })
// })

// test.describe('Send USDC (withdrawing from sDAI)', () => {
//   const fork = setupFork({ blockNumber: DEFAULT_BLOCK_NUMBER, chainId: mainnet.id, useTenderlyVnet: true })
//   let savingsPage: SavingsPageObject
//   let sendDialog: SavingsDialogPageObject
//   const receiver = randomAddress('bob')
//   const amount = 7000
//   const usdc = TOKENS_ON_FORK[mainnet.id].USDC

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

//     await savingsPage.clickSendSDaiButtonAction()
//     sendDialog = new SavingsDialogPageObject({ page, type: 'send' })
//     await sendDialog.selectAssetAction('USDC')
//     await sendDialog.fillAmountAction(amount)
//     await sendDialog.fillReceiverAction(receiver)
//   })

//   test('uses convert sDAI to USDS action', async () => {
//     await sendDialog.actionsContainer.expectActions([
//       { type: 'approve', asset: 'sDAI' },
//       { type: 'withdrawFromSavings', asset: 'USDC', savingsAsset: 'sDAI', mode: 'send' },
//     ])
//   })

//   test('displays transaction overview', async () => {
//     await sendDialog.expectNativeRouteTransactionOverview({
//       routeItems: [
//         {
//           tokenAmount: '6,314.32 sDAI',
//           tokenUsdValue: '$7,000.00',
//         },
//         {
//           tokenAmount: '7,000.00 DAI',
//           tokenUsdValue: '$7,000.00',
//         },
//         {
//           tokenAmount: '7,000.00 USDC',
//           tokenUsdValue: '$7,000.00',
//         },
//       ],
//       outcome: '7,000.00 USDC',
//       outcomeUsd: '$7,000.00',
//     })
//   })

//   test('executes send', async () => {
//     await sendDialog.expectReceiverTokenBalance({
//       forkUrl: fork.forkUrl,
//       receiver,
//       token: usdc,
//       expectedBalance: 0,
//     })

//     await sendDialog.actionsContainer.acceptAllActionsAction(2, fork)
//     await sendDialog.expectSuccessPage()

//     await sendDialog.expectReceiverTokenBalance({
//       forkUrl: fork.forkUrl,
//       receiver,
//       token: usdc,
//       expectedBalance: amount,
//     })

//     await sendDialog.clickBackToSavingsButton()
//     await savingsPage.expectSavingsDaiBalance({ sdaiBalance: '3,685.68 sDAI', estimatedDaiValue: '4,085.90' })
//     await savingsPage.expectStablecoinsInWalletAssetBalance('USDC', '-')
//   })
// })
