// import { test } from '@playwright/test'
// import { mainnet } from 'viem/chains'

// import { overrideAirdropInfoRoute } from '@/test/e2e/airdropInfo'
// import { DEFAULT_BLOCK_NUMBER } from '@/test/e2e/constants'
// import { setupFork } from '@/test/e2e/forking/setupFork'
// import { setup } from '@/test/e2e/setup'

// import { MyPortfolioPageObject } from '@/pages/MyPortfolio.PageObject'
// import { TopbarPageObject } from './Topbar.PageObject'

// test.describe('Topbar', () => {
//   const fork = setupFork({ blockNumber: DEFAULT_BLOCK_NUMBER, chainId: mainnet.id })

//   test.describe('Airdrop counter', () => {
//     test('Disconnected', async ({ page }) => {
//       await setup(page, fork, {
//         initialPage: 'easyBorrow',
//         account: {
//           type: 'not-connected',
//         },
//       })

//       const topbar = new TopbarPageObject(page)
//       await topbar.expectAirdropCompactValue('0')
//       await topbar.openAirdropDropdown()
//       await topbar.expectAirdropPreciseValue('0.00 SPK')
//     })

//     test('Connected', async ({ page }) => {
//       const { account } = await setup(page, fork, {
//         initialPage: 'easyBorrow',
//         account: {
//           type: 'connected-random',
//         },
//       })

//       await overrideAirdropInfoRoute(page, { account })

//       const topbar = new TopbarPageObject(page)
//       await topbar.expectAirdropCompactValue('7.841M')
//       await topbar.openAirdropDropdown()
//       await topbar.expectAirdropPreciseValue('7,840,591')
//     })

//     test('Api error', async ({ page }) => {
//       const { account } = await setup(page, fork, {
//         initialPage: 'easyBorrow',
//         account: {
//           type: 'connected-random',
//         },
//       })

//       await overrideAirdropInfoRoute(page, { account, shouldFail: true })

//       const topbar = new TopbarPageObject(page)
//       await topbar.expectAirdropBadgeNotVisible()
//     })

//     test('Wallet with no airdrop', async ({ page }) => {
//       const { account } = await setup(page, fork, {
//         initialPage: 'easyBorrow',
//         account: {
//           type: 'connected-random',
//         },
//       })

//       await overrideAirdropInfoRoute(page, { account, noAirdrop: true })

//       const topbar = new TopbarPageObject(page)
//       await topbar.expectAirdropCompactValue('0')
//       await topbar.openAirdropDropdown()
//       await topbar.expectAirdropPreciseValue('0.00 SPK')
//     })
//   })

//   test.describe('Rewards badge', () => {
//     const fork = setupFork({
//       blockNumber: 20189272n, // block number where the reward program is finished
//       chainId: mainnet.id,
//     })

//     test('Displays total rewards in badge', async ({ page }) => {
//       await setup(page, fork, {
//         initialPage: 'easyBorrow',
//         account: {
//           type: 'connected-address',
//           address: '0xf8de75c7b95edb6f1e639751318f117663021cf0',
//         },
//       })

//       const topbar = new TopbarPageObject(page)
//       await topbar.expectClaimableRewardsValue('$25.58K')
//     })

//     test('Displays details in dropdown', async ({ page }) => {
//       await setup(page, fork, {
//         initialPage: 'easyBorrow',
//         account: {
//           type: 'connected-address',
//           address: '0xf8de75c7b95edb6f1e639751318f117663021cf0',
//         },
//       })

//       const topbar = new TopbarPageObject(page)
//       await topbar.openRewardsDropdown()

//       await topbar.expectRewards([
//         {
//           tokenSymbol: 'wstETH',
//           amount: '6.3697',
//           amountUSD: '$25,583.20',
//         },
//       ])
//     })

//     test('Does not display badge when no rewards', async ({ page }) => {
//       await setup(page, fork, {
//         initialPage: 'myPortfolio',
//         account: {
//           type: 'connected-random',
//         },
//       })

//       const topbar = new TopbarPageObject(page)
//       const myPortfolioPage = new MyPortfolioPageObject(page)

//       await myPortfolioPage.expectPositionToBeEmpty() // waiting for reserves to load
//       await topbar.expectRewardsBadgeNotVisible() // asserting that after reserves are loaded, rewards badge is not visible
//     })
//   })

//   test.describe('Malformed localStorage', () => {
//     test('Sandbox info in wagmi.store but not in zustand-app-store', async ({ page }) => {
//       await setup(page, fork, {
//         initialPage: 'easyBorrow',
//         account: {
//           type: 'not-connected',
//         },
//         skipInjectingNetwork: true,
//       })
//       await page.evaluate(() => {
//         localStorage.setItem('wagmi.recentConnectorId', 'mock')
//         localStorage.setItem('wagmi.io.metamask.disconnected', 'true')
//         localStorage.setItem('wagmi.io.rabby.disconnected', 'true')
//         localStorage.setItem('zustand-app-store', JSON.stringify({ state: {}, sandbox: {} }))
//         localStorage.setItem('actionSettings', JSON.stringify({ preferPermits: true, exchangeMaxSlippage: '0.001' }))
//         localStorage.setItem('compliance', JSON.stringify({ agreedToSAdresses: [] }))
//         localStorage.setItem(
//           'wagmi.store',
//           JSON.stringify({
//             state: { connections: { _type: 'Map', value: [] }, chainId: '30301713953503', current: null },
//             version: 2,
//           }),
//         )
//       })

//       await page.reload()

//       const topbar = new TopbarPageObject(page)
//       await topbar.expectSavingsLinkVisible()
//     })
//   })
// })
