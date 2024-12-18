import { DEFAULT_BLOCK_NUMBER } from '@/test/e2e/constants'
import { setup } from '@/test/e2e/setup'
import { test } from '@playwright/test'
import { mainnet } from 'viem/chains'
import { MarketsPageObject } from './Markets.PageObject'

test.describe('Markets', () => {
  let marketsPage: MarketsPageObject

  test.beforeEach(async ({ page }) => {
    const testContext = await setup(page, {
      blockchain: {
        chainId: mainnet.id,
        blockNumber: DEFAULT_BLOCK_NUMBER,
      },
      initialPage: 'markets',
      account: {
        type: 'not-connected',
      },
    })

    marketsPage = new MarketsPageObject(testContext)
  })

  test('summary', async () => {
    await marketsPage.expectSummary([
      { description: 'Total market size', value: '$4.447B' },
      { description: 'Total value locked', value: '$2.873B' },
      { description: 'Total available', value: '$2.904B' },
      { description: 'Total borrows', value: '$1.542B' },
    ])
  })

  test('active markets table', async () => {
    await marketsPage.expectActiveMarketsTable([
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
          tokenAmount: '51.57',
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
          name: 'DAI Stablecoin',
          symbol: 'DAI',
        },
        totalSupplied: {
          tokenAmount: '967.5M',
          usdValue: '$967.5M',
        },
        depositAPY: {
          // @note: This value is different in production since VITE_FEATURE_DISABLE_DAI_LEND is disabled in playwright tests
          value: '8.52%',
        },
        totalBorrowed: {
          tokenAmount: '918.3M',
          usdValue: '$918.3M',
        },
        borrowAPY: {
          value: '9.00%',
          hasAirDrop: true,
        },
        status: {
          // @note: This value is different in production since VITE_FEATURE_DISABLE_DAI_LEND is disabled in playwright tests
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
          tokenAmount: '252.3K',
          usdValue: '$855.5M',
        },
        depositAPY: {
          value: '1.31%',
          hasAirDrop: true,
        },
        totalBorrowed: {
          tokenAmount: '177.2K',
          usdValue: '$600.7M',
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
          tokenAmount: '6.272',
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
      {
        asset: {
          name: 'Savings Dai',
          symbol: 'sDAI',
        },
        totalSupplied: {
          tokenAmount: '13.49M',
          usdValue: '$14.73M',
        },
        depositAPY: {
          value: '0.00%',
        },
        totalBorrowed: undefined,
        borrowAPY: undefined,
        status: {
          supply: 'Can be supplied',
          collateral: 'Can be used as collateral',
          borrow: 'Cannot be borrowed',
        },
      },
      {
        asset: {
          name: 'Circle USD',
          symbol: 'USDC',
        },
        totalSupplied: {
          tokenAmount: '2.568M',
          usdValue: '$2.568M',
        },
        depositAPY: {
          value: '5.90%',
        },
        totalBorrowed: {
          tokenAmount: '2.086M',
          usdValue: '$2.086M',
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
          name: 'Tether USD',
          symbol: 'USDT',
        },
        totalSupplied: {
          tokenAmount: '317.4K',
          usdValue: '$317.4K',
        },
        depositAPY: {
          value: '4.03%',
        },
        totalBorrowed: {
          tokenAmount: '214K',
          usdValue: '$214K',
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
