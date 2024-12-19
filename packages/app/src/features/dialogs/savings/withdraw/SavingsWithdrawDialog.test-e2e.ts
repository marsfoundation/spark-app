// import { ActionsPageObject } from '@/features/actions/ActionsContainer.PageObject'
// import { SavingsPageObject } from '@/pages/Savings.PageObject'
// import { DEFAULT_BLOCK_NUMBER, GNOSIS_DEFAULT_BLOCK_NUMBER, DEFAULT_BLOCK_NUMBER } from '@/test/e2e/constants'
// import { setupFork } from '@/test/e2e/forking/setupFork'
// import { setup } from '@/test/e2e/setup'
// import { test } from '@playwright/test'
// import { base, gnosis, mainnet } from 'viem/chains'
// import { SavingsDialogPageObject } from '../common/e2e/SavingsDialog.PageObject'

// test.describe('Savings withdraw dialog', () => {
//   test.describe('Mainnet', () => {
//     const fork = setupFork({
//       blockNumber: DEFAULT_BLOCK_NUMBER,
//       chainId: mainnet.id,
//       useTenderlyVnet: true,
//     })

//     test('can switch between tokens', async ({ page }) => {
//       await setup(page, fork, {
//         initialPage: 'savings',
//         account: {
//           type: 'connected-random',
//           assetBalances: {
//             ETH: 1,
//             sDAI: 1000,
//           },
//         },
//       })

//       const savingsPage = new SavingsPageObject(page)

//       await savingsPage.clickWithdrawSDaiButtonAction()

//       const withdrawalDialog = new SavingsDialogPageObject({ page, type: 'withdraw' })
//       const actionsContainer = new ActionsPageObject(withdrawalDialog.locatePanelByHeader('Actions'))

//       await withdrawalDialog.fillAmountAction(1000)
//       await actionsContainer.expectEnabledActionAtIndex(0)
//       await actionsContainer.expectActions([
//         { type: 'withdrawFromSavings', asset: 'DAI', savingsAsset: 'sDAI', mode: 'withdraw' },
//       ])

//       await withdrawalDialog.selectAssetAction('USDC')
//       await withdrawalDialog.fillAmountAction(1000)
//       await actionsContainer.expectEnabledActionAtIndex(0)
//       await actionsContainer.expectActions([
//         { type: 'approve', asset: 'sDAI' },
//         { type: 'withdrawFromSavings', asset: 'USDC', savingsAsset: 'sDAI', mode: 'withdraw' },
//       ])

//       await withdrawalDialog.selectAssetAction('DAI')
//       await withdrawalDialog.fillAmountAction(1000)
//       await actionsContainer.expectEnabledActionAtIndex(0)
//       await actionsContainer.expectActions([
//         { type: 'withdrawFromSavings', asset: 'DAI', savingsAsset: 'sDAI', mode: 'withdraw' },
//       ])
//     })
//   })

//   test.describe('Base', () => {
//     const fork = setupFork({ chainId: base.id, blockNumber: 22143788n, useTenderlyVnet: true })

//     test('can switch between tokens', async ({ page }) => {
//       await setup(page, fork, {
//         initialPage: 'savings',
//         account: {
//           type: 'connected-random',
//           assetBalances: {
//             ETH: 1,
//             sUSDS: 1000,
//           },
//         },
//       })

//       const savingsPage = new SavingsPageObject(page)

//       await savingsPage.clickWithdrawSUsdsButtonAction()

//       const withdrawalDialog = new SavingsDialogPageObject({ page, type: 'withdraw' })
//       const actionsContainer = new ActionsPageObject(withdrawalDialog.locatePanelByHeader('Actions'))

//       await withdrawalDialog.fillAmountAction(1000)
//       await actionsContainer.expectEnabledActionAtIndex(0)
//       await actionsContainer.expectActions([
//         { type: 'approve', asset: 'sUSDS' },
//         { type: 'withdrawFromSavings', asset: 'USDS', savingsAsset: 'sUSDS', mode: 'withdraw' },
//       ])

//       await withdrawalDialog.selectAssetAction('USDC')
//       await withdrawalDialog.fillAmountAction(1000)
//       await actionsContainer.expectEnabledActionAtIndex(0)
//       await actionsContainer.expectActions([
//         { type: 'approve', asset: 'sUSDS' },
//         { type: 'withdrawFromSavings', asset: 'USDC', savingsAsset: 'sUSDS', mode: 'withdraw' },
//       ])

//       await withdrawalDialog.selectAssetAction('USDS')
//       await withdrawalDialog.fillAmountAction(1000)
//       await actionsContainer.expectEnabledActionAtIndex(0)
//       await actionsContainer.expectActions([
//         { type: 'approve', asset: 'sUSDS' },
//         { type: 'withdrawFromSavings', asset: 'USDS', savingsAsset: 'sUSDS', mode: 'withdraw' },
//       ])
//     })
//   })
// })

// test.describe('Savings withdraw dialog send mode', () => {
//   test.describe('Mainnet', () => {
//     const fork = setupFork({ blockNumber: DEFAULT_BLOCK_NUMBER, chainId: mainnet.id, useTenderlyVnet: true })
//     let savingsPage: SavingsPageObject
//     let sendDialog: SavingsDialogPageObject

//     test.beforeEach(async ({ page }) => {
//       await setup(page, fork, {
//         initialPage: 'savings',
//         account: {
//           type: 'connected-random',
//           assetBalances: {
//             ETH: 1,
//             sDAI: 10_000,
//           },
//         },
//       })

//       savingsPage = new SavingsPageObject(page)
//       await savingsPage.clickSendSDaiButtonAction()

//       sendDialog = new SavingsDialogPageObject({ page, type: 'send' })
//     })

//     test('can select only supported assets', async () => {
//       await sendDialog.openAssetSelectorAction()
//       await sendDialog.expectAssetSelectorOptions(['DAI', 'USDC'])
//     })
//   })

//   test.describe('Gnosis', () => {
//     const fork = setupFork({ blockNumber: GNOSIS_DEFAULT_BLOCK_NUMBER, chainId: gnosis.id, useTenderlyVnet: true })
//     let savingsPage: SavingsPageObject
//     let sendDialog: SavingsDialogPageObject

//     test.beforeEach(async ({ page }) => {
//       await setup(page, fork, {
//         initialPage: 'savings',
//         account: {
//           type: 'connected-random',
//           assetBalances: {
//             XDAI: 100,
//             sDAI: 10_000,
//           },
//         },
//       })

//       savingsPage = new SavingsPageObject(page)
//       await savingsPage.clickSendSDaiButtonAction()

//       sendDialog = new SavingsDialogPageObject({ page, type: 'send' })
//     })

//     test('can select only supported assets', async () => {
//       await sendDialog.openAssetSelectorAction()
//       await sendDialog.expectAssetSelectorOptions(['XDAI'])
//     })
//   })

//   test.describe('Base', () => {
//     const fork = setupFork({ chainId: base.id, blockNumber: 22143788n, useTenderlyVnet: true })
//     let savingsPage: SavingsPageObject
//     let sendDialog: SavingsDialogPageObject

//     test.beforeEach(async ({ page }) => {
//       await setup(page, fork, {
//         initialPage: 'savings',
//         account: {
//           type: 'connected-random',
//           assetBalances: {
//             USDS: 100,
//             sUSDS: 10_000,
//           },
//         },
//       })

//       savingsPage = new SavingsPageObject(page)
//       await savingsPage.clickSendSUsdsButtonAction()

//       sendDialog = new SavingsDialogPageObject({ page, type: 'send' })
//     })

//     test('can select only supported assets', async () => {
//       await sendDialog.openAssetSelectorAction()
//       await sendDialog.expectAssetSelectorOptions(['USDC', 'USDS'])
//     })
//   })
// })
