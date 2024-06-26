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

  test('summary', async () => {
    await marketsPage.expectSummary([
      { description: 'Total market size', value: '$4.441B' },
      { description: 'Total value locked', value: '$2.869B' },
      { description: 'Total available', value: '$2.904B' },
      { description: 'Total borrows', value: '$1.537B' },
    ])
  })

  test('active markets table', async () => {
    await marketsPage.expectActiveMarketsTable([
      {
        asset: {
          name: 'DAI Stablecoin',
          symbol: 'DAI',
        },
        totalSupplied: {
          tokenAmount: '962.8M',
          usdValue: '$962.8M',
        },
        depositAPY: {
          value: '0.00%',
        },
        totalBorrowed: {
          tokenAmount: '913.6M',
          usdValue: '$913.6M',
        },
        borrowAPY: {
          value: '9.00%',
          hasAirDrop: true,
        },
        status: {
          supply: 'Cannot be supplied',
          collateral: 'Can be used as collateral',
          borrow: 'Can be borrowed',
        },
      },
      {
        asset: {
          name: 'Circle USD',
          symbol: 'USDC',
        },
        totalSupplied: {
          tokenAmount: '2.559M',
          usdValue: '$2.559M',
        },
        depositAPY: {
          value: '5.90%',
        },
        totalBorrowed: {
          tokenAmount: '2.077M',
          usdValue: '$2.077M',
        },
        borrowAPY: {
          value: '7.72%',
        },
        status: {
          supply: 'Can be supplied',
          collateral: 'Cannot be used as collateral',
          borrow: 'Can be borrowed',
        },
      },
      {
        asset: {
          name: 'Ethereum',
          symbol: 'ETH',
        },
        totalSupplied: {
          tokenAmount: '252.1K',
          usdValue: '$854.8M',
        },
        depositAPY: {
          value: '1.31%',
          hasAirDrop: true,
        },
        totalBorrowed: {
          tokenAmount: '177K',
          usdValue: '$600M',
        },
        borrowAPY: {
          value: '1.97%',
        },
        status: {
          supply: 'Can be supplied',
          collateral: 'Can be used as collateral',
          borrow: 'Can be borrowed',
        },
      },
      {
        asset: {
          name: 'Lido Staked ETH',
          symbol: 'wstETH',
        },
        totalSupplied: {
          tokenAmount: '519K',
          usdValue: '$2.06B',
        },
        depositAPY: {
          value: '<0.01%',
        },
        totalBorrowed: {
          tokenAmount: '51.56',
          usdValue: '$204.7K',
        },
        borrowAPY: {
          value: '0.25%',
        },
        status: {
          supply: 'Can be supplied',
          collateral: 'Can be used as collateral',
          borrow: 'Can be borrowed',
        },
      },
      {
        asset: {
          name: 'Wrapped BTC',
          symbol: 'WBTC',
        },
        totalSupplied: {
          tokenAmount: '5,790',
          usdValue: '$358M',
        },
        depositAPY: {
          value: '<0.01%',
        },
        totalBorrowed: {
          tokenAmount: '332.8',
          usdValue: '$20.58M',
        },
        borrowAPY: {
          value: '0.19%',
        },
        status: {
          supply: 'Can be supplied',
          collateral: 'Can be used as collateral',
          borrow: 'Can be borrowed',
        },
      },
      {
        asset: {
          name: 'Rocket Pool Staked ETH',
          symbol: 'rETH',
        },
        totalSupplied: {
          tokenAmount: '38.95K',
          usdValue: '$146.5M',
        },
        depositAPY: {
          value: '<0.01%',
        },
        totalBorrowed: {
          tokenAmount: '6.271',
          usdValue: '$23.59K',
        },
        borrowAPY: {
          value: '0.25%',
        },
        status: {
          supply: 'Can be supplied',
          collateral: 'Can be used as collateral',
          borrow: 'Can be borrowed',
        },
      },
      {
        asset: {
          name: 'Tether USD',
          symbol: 'USDT',
        },
        totalSupplied: {
          tokenAmount: '316.6K',
          usdValue: '$316.6K',
        },
        depositAPY: {
          value: '4.03%',
        },
        totalBorrowed: {
          tokenAmount: '213.2K',
          usdValue: '$213.2K',
        },
        borrowAPY: {
          value: '6.36%',
        },
        status: {
          supply: 'Can be supplied',
          collateral: 'Cannot be used as collateral',
          borrow: 'Can be borrowed',
        },
      },
      {
        asset: {
          name: 'Ether.fi Staked ETH',
          symbol: 'weETH',
        },
        totalSupplied: {
          tokenAmount: '11.66K',
          usdValue: '$41.17M',
        },
        depositAPY: {
          value: '0.00%',
        },
        totalBorrowed: undefined,
        borrowAPY: undefined,
        status: {
          supply: 'Can be supplied',
          collateral: 'Can be used as collateral only in isolation mode',
          borrow: 'Cannot be borrowed',
        },
      },
    ])
  })

  test('frozen markets table', async () => {
    await marketsPage.showFrozenMarkets()
    await marketsPage.expectFrozenMarketsTable([
      {
        asset: {
          name: 'Gnosis Token',
          symbol: 'GNO',
          isFrozen: true,
        },
        totalSupplied: {
          tokenAmount: '55.1',
          usdValue: '$15.91K',
        },
        depositAPY: undefined,
        totalBorrowed: undefined,
        borrowAPY: undefined,
        status: {
          supply: 'Cannot be supplied',
          collateral: 'Cannot be used as collateral',
          borrow: 'Cannot be borrowed',
        },
      },
    ])
  })
})
