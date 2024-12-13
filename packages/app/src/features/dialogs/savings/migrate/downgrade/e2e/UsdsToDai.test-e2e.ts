// import { SavingsPageObject } from '@/pages/Savings.PageObject'
// import { USDS_ACTIVATED_BLOCK_NUMBER } from '@/test/e2e/constants'
// import { setupFork } from '@/test/e2e/forking/setupFork'
// import { setup } from '@/test/e2e/setup'
// import { test } from '@playwright/test'
// import { mainnet } from 'viem/chains'
// import { DowngradeDialogPageObject } from '../DowngradeDialog.PageObject'

// test.describe('Downgrade USDS to DAI', () => {
//   const fork = setupFork({ blockNumber: USDS_ACTIVATED_BLOCK_NUMBER, chainId: mainnet.id, useTenderlyVnet: true })

//   test('downgrade to DAI is disabled when USDS balance is 0', async ({ page }) => {
//     await setup(page, fork, {
//       initialPage: 'savings',
//       account: {
//         type: 'connected-random',
//         assetBalances: { USDS: 0 },
//       },
//     })

//     const savingsPage = new SavingsPageObject(page)

//     await savingsPage.expectDowngradeToDaiToBeDisabled()
//   })

//   test('uses downgrade action', async ({ page }) => {
//     await setup(page, fork, {
//       initialPage: 'savings',
//       account: {
//         type: 'connected-random',
//         assetBalances: { USDS: 10_000 },
//       },
//     })

//     const savingsPage = new SavingsPageObject(page)

//     await savingsPage.clickDowngradeUsdsToDaiOption()

//     const downgradeDialog = new DowngradeDialogPageObject(page)
//     await downgradeDialog.fillAmountAction(100)

//     await downgradeDialog.actionsContainer.expectEnabledActionAtIndex(0)
//     await downgradeDialog.actionsContainer.expectActions([
//       { type: 'approve', asset: 'USDS' },
//       { type: 'downgrade', fromToken: 'USDS', toToken: 'DAI' },
//     ])
//   })

//   test('displays transaction overview', async ({ page }) => {
//     await setup(page, fork, {
//       initialPage: 'savings',
//       account: {
//         type: 'connected-random',
//         assetBalances: { USDS: 10_000 },
//       },
//     })

//     const savingsPage = new SavingsPageObject(page)

//     await savingsPage.clickDowngradeUsdsToDaiOption()

//     const downgradeDialog = new DowngradeDialogPageObject(page)
//     await downgradeDialog.fillAmountAction(100)

//     await downgradeDialog.expectTransactionOverview({
//       routeItems: [
//         {
//           tokenAmount: '100.00 USDS',
//           tokenUsdValue: '$100.00',
//         },
//         {
//           tokenAmount: '100.00 DAI',
//           tokenUsdValue: '$100.00',
//         },
//       ],
//       outcome: '100.00 DAI',
//       outcomeUsd: '$100.00',
//     })
//   })

//   test('executes transaction', async ({ page }) => {
//     await setup(page, fork, {
//       initialPage: 'savings',
//       account: {
//         type: 'connected-random',
//         assetBalances: { USDS: 10_000 },
//       },
//     })

//     const savingsPage = new SavingsPageObject(page)

//     await savingsPage.expectStablecoinsInWalletAssetBalance('DAI', '-')
//     await savingsPage.clickDowngradeUsdsToDaiOption()

//     const downgradeDialog = new DowngradeDialogPageObject(page)
//     await downgradeDialog.fillAmountAction(10_000)

//     await downgradeDialog.actionsContainer.acceptAllActionsAction(2, fork)
//     await downgradeDialog.expectDowngradeSuccessPage({ token: 'USDS', amount: '10,000.00', usdValue: '$10,000.00' })
//     await downgradeDialog.clickBackToSavingsButton()

//     await savingsPage.expectUpgradableDaiBalance('10,000.00')
//   })
// })
