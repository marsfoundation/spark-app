// import { test } from '@playwright/test'
// import { mainnet } from 'viem/chains'

// import { ActionsPageObject } from '@/features/actions/ActionsContainer.PageObject'
// import { TopbarPageObject } from '@/features/topbar/Topbar.PageObject'
// import { MyPortfolioPageObject } from '@/pages/MyPortfolio.PageObject'
// import { setupFork } from '@/test/e2e/forking/setupFork'
// import { setup } from '@/test/e2e/setup'
// import { ClaimRewardsDialogPageObject } from './ClaimRewardsDialog.PageObject'

// test.describe('Claim rewards dialog', () => {
//   const fork = setupFork({
//     blockNumber: 20189272n, // block number where the reward program is finished
//     chainId: mainnet.id,
//   })
//   let navbar: TopbarPageObject
//   let claimRewardsDialog: ClaimRewardsDialogPageObject
//   let actionsContainer: ActionsPageObject

//   test.beforeEach(async ({ page }) => {
//     await setup(page, fork, {
//       initialPage: 'easyBorrow',
//       account: {
//         type: 'connected-address',
//         address: '0xf8de75c7b95edb6f1e639751318f117663021cf0',
//       },
//     })

//     navbar = new TopbarPageObject(page)
//     await navbar.openClaimRewardsDialog()

//     claimRewardsDialog = new ClaimRewardsDialogPageObject(page)
//     actionsContainer = new ActionsPageObject(claimRewardsDialog.locatePanelByHeader('Actions'))
//   })

//   test('displays correct transaction overview', async () => {
//     await claimRewardsDialog.expectRewards([
//       {
//         tokenSymbol: 'wstETH',
//         amount: '6.3697',
//         amountUSD: '$25,583.20',
//       },
//     ])
//   })

//   test('has correct action plan', async () => {
//     await actionsContainer.expectActions([
//       {
//         type: 'claimMarketRewards',
//         asset: 'wstETH',
//       },
//     ])
//   })

//   test('executes transaction', async ({ page }) => {
//     await actionsContainer.acceptAllActionsAction(1)

//     await claimRewardsDialog.expectClaimRewardsSuccessPage([
//       {
//         tokenSymbol: 'wstETH',
//         amount: '6.3697',
//         amountUSD: '$25,583.20',
//       },
//     ])

//     const myPortfolioPage = new MyPortfolioPageObject(page)
//     await myPortfolioPage.goToMyPortfolioAction()

//     await myPortfolioPage.expectBalancesInDepositTable({
//       wstETH: 6.3697,
//     })

//     await navbar.expectRewardsBadgeNotVisible()
//   })
// })
