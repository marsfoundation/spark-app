// import { SavingsPageObject } from '@/pages/Savings.PageObject'
// import { DEFAULT_BLOCK_NUMBER, TOKENS_ON_FORK } from '@/test/e2e/constants'
// import { setupFork } from '@/test/e2e/forking/setupFork'
// import { setup } from '@/test/e2e/setup'
// import { randomAddress } from '@/test/utils/addressUtils'
// import { test } from '@playwright/test'
// import { mainnet } from 'viem/chains'
// import { SavingsDialogPageObject } from '../../../common/e2e/SavingsDialog.PageObject'

// test.describe('Send DAI on Mainnet', () => {
//   const fork = setupFork({ blockNumber: DEFAULT_BLOCK_NUMBER, chainId: mainnet.id, useTenderlyVnet: true })
//   let savingsPage: SavingsPageObject
//   let sendDialog: SavingsDialogPageObject
//   const receiver = randomAddress('bob')
//   const amount = 7000
//   const dai = TOKENS_ON_FORK[mainnet.id].DAI

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
//     await sendDialog.fillAmountAction(amount)
//     await sendDialog.fillReceiverAction(receiver)
//   })

//   test('uses native sDai withdraw and send', async () => {
//     await sendDialog.actionsContainer.expectActions([
//       { type: 'withdrawFromSavings', asset: 'DAI', savingsAsset: 'sDAI', mode: 'send' },
//     ])
//   })

//   test('displays transaction overview', async () => {
//     await sendDialog.expectNativeRouteTransactionOverview({
//       routeItems: [
//         {
//           tokenAmount: '6,647.10 sDAI',
//           tokenUsdValue: '$7,000.00',
//         },
//         {
//           tokenAmount: '7,000.00 DAI',
//           tokenUsdValue: '$7,000.00',
//         },
//       ],
//       outcome: '7,000.00 DAI',
//       outcomeUsd: '$7,000.00',
//     })
//   })

//   test('executes send', async () => {
//     await sendDialog.expectReceiverTokenBalance({
//       forkUrl: fork.forkUrl,
//       receiver,
//       token: dai,
//       expectedBalance: 0,
//     })

//     await sendDialog.actionsContainer.acceptAllActionsAction(1, fork)
//     await sendDialog.expectSuccessPage()

//     await sendDialog.expectReceiverTokenBalance({
//       forkUrl: fork.forkUrl,
//       receiver,
//       token: dai,
//       expectedBalance: amount,
//     })

//     await sendDialog.clickBackToSavingsButton()
//     await savingsPage.expectSavingsDaiBalance({ sdaiBalance: '3,352.90 sDAI', estimatedDaiValue: '3,530.91' })
//     await savingsPage.expectStablecoinsInWalletAssetBalance('DAI', '-')
//   })
// })
