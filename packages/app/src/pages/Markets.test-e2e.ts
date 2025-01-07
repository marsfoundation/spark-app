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
      { description: 'Total market size', value: '$8.145B' },
      { description: 'Total value locked', value: '$5.068B' },
      { description: 'Total available', value: '$5.149B' },
      { description: 'Total borrows', value: '$2.997B' },
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
          tokenAmount: '861.3K',
          usdValue: '$4.018B',
        },
        depositAPY: {
          value: '<0.01%',
        },
        totalBorrowed: {
          tokenAmount: '98.42',
          usdValue: '$459.2K',
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
          tokenAmount: '1.739B',
          usdValue: '$1.739B',
        },
        depositAPY: {
          // @note: This value is different in production since VITE_FEATURE_DISABLE_DAI_LEND is disabled in playwright tests
          value: '11.69%',
        },
        totalBorrowed: {
          tokenAmount: '1.626B',
          usdValue: '$1.626B',
        },
        borrowAPY: {
          value: '12.55%',
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
          tokenAmount: '391.1K',
          usdValue: '$1.536B',
        },
        depositAPY: {
          value: '2.03%',
          hasAirDrop: true,
        },
        totalBorrowed: {
          tokenAmount: '347.6K',
          usdValue: '$1.365B',
        },
        borrowAPY: {
          value: '2.41%',
        },
        status: {
          supply: 'Can be supplied',
          collateral: 'Can be used as collateral',
          borrow: 'Can be borrowed',
        },
      },
      {
        asset: {
          name: 'Coinbase Wrapped BTC',
          symbol: 'cbBTC',
        },
        totalSupplied: {
          tokenAmount: '2,950',
          usdValue: '$300M',
        },
        depositAPY: {
          value: '<0.01%',
        },
        totalBorrowed: {
          tokenAmount: '5.65',
          usdValue: '$574.6K',
        },
        borrowAPY: {
          value: '0.01%',
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
          tokenAmount: '51.75',
          usdValue: '$214.5M',
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
          name: 'Wrapped BTC',
          symbol: 'WBTC',
        },
        totalSupplied: {
          tokenAmount: '1,742',
          usdValue: '$176.8',
        },
        depositAPY: {
          value: '<0.01%',
        },
        totalBorrowed: {
          tokenAmount: '18.12',
          usdValue: '$1.839M',
        },
        borrowAPY: undefined,
        status: {
          supply: 'Can be supplied',
          collateral: 'Cannot be used as collateral',
          borrow: 'Cannot be borrowed',
        },
      },
      {
        asset: {
          name: 'Rocket Pool Staked ETH',
          symbol: 'rETH',
        },
        totalSupplied: {
          tokenAmount: '34.47K',
          usdValue: '$152.1M',
        },
        depositAPY: {
          value: '<0.01%',
        },
        totalBorrowed: {
          tokenAmount: '7.991',
          usdValue: '$35.26K',
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
          name: 'Savings USDS',
          symbol: 'sUSDS',
        },
        totalSupplied: {
          tokenAmount: '4.154M',
          usdValue: '$4.226M',
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
          tokenAmount: '1.916M',
          usdValue: '$1.916M',
        },
        depositAPY: {
          value: '16.20%',
        },
        totalBorrowed: {
          tokenAmount: '1.849M',
          usdValue: '$1.849M',
        },
        borrowAPY: {
          value: '17.79%',
        },
        status: {
          supply: 'Can be supplied',
          collateral: 'Cannot be used as collateral',
          borrow: 'Can be borrowed',
        },
      },
      {
        asset: {
          name: 'Savings Dai',
          symbol: 'sDAI',
        },
        totalSupplied: {
          tokenAmount: '1.25M',
          usdValue: '$1.407M',
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
          name: 'Tether USD',
          symbol: 'USDT',
        },
        totalSupplied: {
          tokenAmount: '579.3K',
          usdValue: '$579.3K',
        },
        depositAPY: {
          value: '6.58%',
        },
        totalBorrowed: {
          tokenAmount: '424.3K',
          usdValue: '$424.3K',
        },
        borrowAPY: {
          value: '9.60%',
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
          tokenAmount: '5',
          usdValue: '$1,459',
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
