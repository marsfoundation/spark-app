// import { test } from '@playwright/test'
// import { gnosis } from 'viem/chains'

// import { GNOSIS_DEFAULT_BLOCK_NUMBER } from '@/test/e2e/constants'
// import { setupFork } from '@/test/e2e/forking/setupFork'
// import { buildUrl, setup } from '@/test/e2e/setup'
// import { PageNotSupportedWarningPageObject } from './PageNotSupportedWarning.PageObject'

// test.describe('PageNotSupportedWarning', () => {
//   const fork = setupFork({ blockNumber: GNOSIS_DEFAULT_BLOCK_NUMBER, chainId: gnosis.id, useTenderlyVnet: true })

//   test('Displays not supported warning on unsupported page', async ({ page }) => {
//     await setup(page, fork, {
//       initialPage: 'farms',
//       account: {
//         type: 'connected-random',
//       },
//     })

//     const warning = new PageNotSupportedWarningPageObject(page)

//     await warning.expectSwitchNetworkVisible()
//   })

//   test('Displays not supported warning on entering the unsupported page', async ({ page }) => {
//     await setup(page, fork, {
//       initialPage: 'savings',
//       account: {
//         type: 'connected-random',
//       },
//     })

//     const warning = new PageNotSupportedWarningPageObject(page)

//     await warning.expectSwitchNetworkNotVisible()

//     await page.goto(buildUrl('farms'))

//     await warning.expectSwitchNetworkVisible()
//   })
// })
