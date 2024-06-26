import { WEETH_ACTIVE_BLOCK_NUMBER } from '@/test/e2e/constants'
import { setup } from '@/test/e2e/setup'
import { setupFork } from '@/test/e2e/setupFork'
import { test } from '@playwright/test'
import { mainnet } from 'viem/chains'
import { MarketsPageObject } from './Markets.PageObject'

test.describe('Markets', () => {
  const fork = setupFork({ blockNumber: WEETH_ACTIVE_BLOCK_NUMBER, chainId: mainnet.id })
  let marketsPage: MarketsPageObject

  test.beforeEach(async ({ page }) => {
    await setup(page, fork, {
      initialPage: 'markets',
      account: {
        type: 'not-connected',
      },
    })

    marketsPage = new MarketsPageObject(page)
  })

  test('active markets table', async () => {
    await marketsPage.expectActiveMarketsTable([
      {
        asset: {
          name: 'DAI Stablecoin',
          symbol: 'DAI',
        },
        totalSupplied: {
          tokenValue: '967.5M',
          usdValue: '$967.5M',
        },
        depositAPY: {
          value: '0.00%',
        },
        totalBorrowed: {
          tokenValue: '918.4M',
          usdValue: '$918.4M',
        },
        borrowAPY: {
          value: '9.00%',
          hasAirDrop: true,
          hasReward: false,
        },
        status: {
          supply: 'Active',
          borrow: 'Active',
          collateral: 'Active',
        },
      },
    ])
  })
})
