// import { SavingsPageObject } from '@/pages/Savings.PageObject'
// import { DEFAULT_BLOCK_NUMBER } from '@/test/e2e/constants'
// import { setupFork } from '@/test/e2e/forking/setupFork'
// import { setup } from '@/test/e2e/setup'
// import { test } from '@playwright/test'
// import { mainnet } from 'viem/chains'
// import { ConvertStablesDialogPageObject } from '../../ConvertStablesDialog.PageObject'

// test.describe('Convert DAI to USDS', () => {
//   const fork = setupFork({ blockNumber: DEFAULT_BLOCK_NUMBER, chainId: mainnet.id, useTenderlyVnet: true })
//   let savingsPage: SavingsPageObject
//   let convertStablesDialog: ConvertStablesDialogPageObject

//   test.beforeEach(async ({ page }) => {
//     await setup(page, fork, {
//       initialPage: 'savings',
//       account: {
//         type: 'connected-random',
//         assetBalances: {
//           ETH: 1,
//           DAI: 10_000,
//         },
//       },
//     })

//     savingsPage = new SavingsPageObject(page)
//     await savingsPage.clickConvertStablesButtonAction()

//     convertStablesDialog = new ConvertStablesDialogPageObject(page)
//     await convertStablesDialog.selectAssetInAction('DAI')
//     await convertStablesDialog.selectAssetOutAction('USDS')
//     await convertStablesDialog.fillAmountInAction(10_000)
//   })

//   test('uses upgrade action', async () => {
//     await convertStablesDialog.actionsContainer.expectEnabledActionAtIndex(0)
//     await convertStablesDialog.actionsContainer.expectActions([
//       { type: 'approve', asset: 'DAI' },
//       { type: 'upgrade', fromToken: 'DAI', toToken: 'USDS' },
//     ])
//   })

//   test('displays transaction overview', async () => {
//     await convertStablesDialog.expectTransactionOverview({
//       routeItems: [
//         {
//           tokenAmount: '10,000.00 DAI',
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
//   })

//   test('executes conversion', async () => {
//     await convertStablesDialog.actionsContainer.acceptAllActionsAction(2)
//     await convertStablesDialog.expectSuccessPage()
//     await convertStablesDialog.clickBackToSavingsButton()
//     await savingsPage.expectStablecoinsInWalletAssetBalance('DAI', '-')
//     await savingsPage.expectStablecoinsInWalletAssetBalance('USDS', '10,000.00')
//   })
// })
