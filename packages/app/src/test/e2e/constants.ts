/**
 * App reads tokens config from the chain but we need to mint tokens in E2E tests so we maintain this list.
 *
 * Tokens are from mainnet network.
 */
const TOKENS_ON_MAINNET = {
  DAI: {
    address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
    decimals: 18,
  },
  USDC: {
    address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    decimals: 6,
  },
  sDAI: {
    address: '0x83F20F44975D03b1b09e64809B757c47f942BEeA',
    decimals: 18,
  },
  GNO: {
    address: '0x6810e776880C02933D47DB1b9fc05908e5386b96',
    decimals: 18,
  },
  WETH: {
    address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    decimals: 18,
  },
  wstETH: {
    address: '0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0',
    decimals: 18,
  },
  rETH: {
    address: '0xae78736Cd615f374D3085123A210448E74Fc6393',
    decimals: 18,
  },
  WBTC: {
    address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
    decimals: 8,
  },
  USDT: {
    address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    decimals: 6,
  },
  weETH: {
    address: '0xcd5fe23c85820f7b72d0926fc9b05b43e359b7ee',
    decimals: 18,
  },
  USDS: {
    address: '0xdC035D45d973E3EC169d2276DDab16f1e407384F',
    decimals: 18,
  },
  sUSDS: {
    address: '0xa3931d71877C0E7a3148CB7Eb4463524FEc27fbD',
    decimals: 18,
  },
  SKY: {
    address: '0x56072c95faa701256059aa122697b133aded9279',
    decimals: 18,
  },
  cbBTC: {
    address: '0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf',
    decimals: 8,
  },
} as const

export const TOKENS_ON_FORK = {
  1: {
    ...TOKENS_ON_MAINNET,
  },
  100: {
    WXDAI: {
      address: '0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d',
      decimals: 18,
    },
    USDC: {
      address: '0xDDAfbb505ad214D7b80b1f830fcCc89B60fb7A83',
      decimals: 6,
    },
    EURe: {
      address: '0xcB444e90D8198415266c6a2724b7900fb12FC56E',
      decimals: 18,
    },
    USDT: {
      address: '0x4ECaBa5870353805a9F068101A40E0f32ed605C6',
      decimals: 6,
    },
    GNO: {
      address: '0x9C58BAcC331c9aa871AFD802DB6379a98e80CEdb',
      decimals: 18,
    },
    sDAI: {
      address: '0xaf204776c7245bF4147c2612BF6e5972Ee483701',
      decimals: 18,
    },
    WETH: {
      address: '0x6A023CCd1ff6F2045C3309768eAd9E68F978f6e1',
      decimals: 18,
    },
    wstETH: {
      address: '0x6C76971f98945AE98dD7d4DFcA8711ebea946eA6',
      decimals: 18,
    },
  },
  8453: {
    USDC: {
      address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
      decimals: 6,
    },
    USDS: {
      address: '0x820C137fa70C8691f0e44Dc420a5e53c168921Dc',
      decimals: 18,
    },
    sUSDS: {
      address: '0x5875eEE11Cf8398102FdAd704C9E96607675467a',
      decimals: 18,
    },
  },
} as const

type NonNativeTokens =
  | keyof (typeof TOKENS_ON_FORK)[1]
  | keyof (typeof TOKENS_ON_FORK)[100]
  | keyof (typeof TOKENS_ON_FORK)[8453]
export type AssetsInTests = 'ETH' | 'XDAI' | NonNativeTokens

export const __TX_LIST_KEY = '__PLAYWRIGHT_TX_LIST' as any

// @note: Block from 14 December 2024:
// Stable oracles returning exactly 1
// GNO is offboarded
// USDS, PSM light are deployed
export const DEFAULT_BLOCK_NUMBER = 21400000n

// Edge cases
export const GNO_ACTIVE_BLOCK_NUMBER = 18365842n

export const BASE_DEFAULT_BLOCK_NUMBER = 23000000n
export const GNOSIS_DEFAULT_BLOCK_NUMBER = 34543308n
