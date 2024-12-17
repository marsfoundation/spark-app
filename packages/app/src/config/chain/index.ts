import { getOriginChainId } from '@/domain/hooks/useOriginChainId'
import {
  fetchRethOracleInfo,
  fetchSdaiOracleInfoGnosis,
  fetchWeethOracleInfo,
  fetchWstethOracleInfoMainnet,
} from '@/domain/oracles/oracleInfoFetchers'
import { baseSavingsInfoQueryOptions } from '@/domain/savings-info/baseSavingsInfo'
import { gnosisSavingsDaiInfoQuery } from '@/domain/savings-info/gnosisSavingsInfo'
import { mainnetSavingsDaiInfoQuery, mainnetSavingsUsdsInfoQuery } from '@/domain/savings-info/mainnetSavingsInfo'
import { useStore } from '@/domain/state'
import { Token } from '@/domain/types/Token'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { assets } from '@/ui/assets'
import { NormalizedUnitNumber } from '@marsfoundation/common-universal'
import { CheckedAddress } from '@marsfoundation/common-universal'
import { zeroAddress } from 'viem'
import { base, gnosis, mainnet } from 'viem/chains'
import { NATIVE_ASSET_MOCK_ADDRESS, infoSkyApiUrl } from '../consts'
import { AppConfig } from '../feature-flags'
import { PLAYWRIGHT_USDS_CONTRACTS_NOT_AVAILABLE_KEY } from '../wagmi/config.e2e'
import { SUPPORTED_CHAINS, farmAddresses, farmStablecoinsEntryGroup, susdsAddresses } from './constants'
import { ChainConfigEntry, ChainMeta, SupportedChainId } from './types'

const commonTokenSymbolToReplacedName = {
  [TokenSymbol('DAI')]: { name: 'DAI Stablecoin', symbol: TokenSymbol('DAI') },
  [TokenSymbol('USDC')]: { name: 'Circle USD', symbol: TokenSymbol('USDC') },
  [TokenSymbol('wstETH')]: { name: 'Lido Staked ETH', symbol: TokenSymbol('wstETH') },
  [TokenSymbol('rETH')]: { name: 'Rocket Pool Staked ETH', symbol: TokenSymbol('rETH') },
  [TokenSymbol('GNO')]: { name: 'Gnosis Token', symbol: TokenSymbol('GNO') },
  [TokenSymbol('WETH')]: { name: 'Ethereum', symbol: TokenSymbol('ETH') },
  [TokenSymbol('weETH')]: { name: 'Ether.fi Staked ETH', symbol: TokenSymbol('weETH') },
}

const PLAYWRIGHT_MAINNET_USDS_CONTRACTS_NOT_AVAILABLE =
  import.meta.env.VITE_PLAYWRIGHT === '1' && (window as any)[PLAYWRIGHT_USDS_CONTRACTS_NOT_AVAILABLE_KEY] === true

const chainConfig: Record<SupportedChainId, ChainConfigEntry> = {
  [mainnet.id]: {
    originChainId: mainnet.id,
    daiSymbol: TokenSymbol('DAI'),
    sdaiSymbol: TokenSymbol('sDAI'),
    usdsSymbol: PLAYWRIGHT_MAINNET_USDS_CONTRACTS_NOT_AVAILABLE ? undefined : TokenSymbol('USDS'),
    susdsSymbol: PLAYWRIGHT_MAINNET_USDS_CONTRACTS_NOT_AVAILABLE ? undefined : TokenSymbol('sUSDS'),
    psmStables: [TokenSymbol('DAI'), TokenSymbol('USDC'), TokenSymbol('USDS')],
    meta: {
      name: 'Ethereum Mainnet',
      logo: assets.chain.ethereum,
    },
    permitSupport: {
      [CheckedAddress('0x6b175474e89094c44da98b954eedeac495271d0f')]: false, // DAI
      [CheckedAddress('0x83f20f44975d03b1b09e64809b757c47f942beea')]: true, // sDAI
      [CheckedAddress('0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48')]: false, // USDC
      [CheckedAddress('0xdAC17F958D2ee523a2206206994597C13D831ec7')]: false, // USDT
      [CheckedAddress('0x2260fac5e5542a773aa44fbcfedf7c193bc2c599')]: false, // WBTC
      [CheckedAddress('0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2')]: false, // WETH
      [CheckedAddress('0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0')]: true, // wstETH
      [CheckedAddress('0xae78736Cd615f374D3085123A210448E74Fc6393')]: false, // rETH
      [CheckedAddress('0x6810e776880C02933D47DB1b9fc05908e5386b96')]: false, // GNO
    },
    tokensWithMalformedApprove: [CheckedAddress('0xdac17f958d2ee523a2206206994597c13d831ec7')], // USDT
    airdrop: {
      [TokenSymbol('ETH')]: {
        deposit: [TokenSymbol('SPK')],
        borrow: [],
      },
      [TokenSymbol('WETH')]: {
        deposit: [TokenSymbol('SPK')],
        borrow: [],
      },
      [TokenSymbol('DAI')]: {
        deposit: [],
        borrow: [TokenSymbol('SPK')],
      },
    },
    extraTokens: [
      {
        symbol: TokenSymbol('DAI'),
        oracleType: 'fixed-usd',
        address: CheckedAddress('0x6b175474e89094c44da98b954eedeac495271d0f'),
      },
      {
        symbol: TokenSymbol('USDC'),
        oracleType: 'fixed-usd',
        address: CheckedAddress('0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'),
      },
      {
        symbol: TokenSymbol('sDAI'),
        oracleType: 'vault',
        address: CheckedAddress('0x83f20f44975d03b1b09e64809b757c47f942beea'),
      },
      ...(PLAYWRIGHT_MAINNET_USDS_CONTRACTS_NOT_AVAILABLE
        ? []
        : ([
            {
              symbol: TokenSymbol('sUSDS'),
              oracleType: 'vault',
              address: susdsAddresses[mainnet.id],
            },
            {
              symbol: TokenSymbol('USDS'),
              oracleType: 'fixed-usd',
              address: CheckedAddress('0xdC035D45d973E3EC169d2276DDab16f1e407384F'),
            },
            {
              symbol: TokenSymbol('SKY'),
              oracleType: 'zero-price',
              address: CheckedAddress('0x56072C95FAA701256059aa122697B133aDEd9279'),
            },
          ] as const)),
    ],
    markets: {
      defaultAssetToBorrow: TokenSymbol('DAI'),
      nativeAssetInfo: {
        nativeAssetName: 'Ethereum',
        wrappedNativeAssetSymbol: TokenSymbol('WETH'),
        wrappedNativeAssetAddress: CheckedAddress('0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'),
        nativeAssetSymbol: TokenSymbol('ETH'),
        minRemainingNativeAssetBalance: NormalizedUnitNumber(0.001),
      },
      tokenSymbolToReplacedName: {
        ...commonTokenSymbolToReplacedName,
      },
      oracles: {
        [TokenSymbol('WETH')]: {
          type: 'market-price',
          providedBy: ['chainlink', 'chronicle'],
        },
        [TokenSymbol('WBTC')]: {
          type: 'market-price',
          providedBy: ['chainlink'],
        },
        [TokenSymbol('wstETH')]: {
          type: 'yielding-fixed',
          baseAssetSymbol: TokenSymbol('WETH'),
          providedBy: ['chainlink', 'chronicle'],
          oracleFetcher: fetchWstethOracleInfoMainnet,
        },
        [TokenSymbol('rETH')]: {
          type: 'yielding-fixed',
          baseAssetSymbol: TokenSymbol('WETH'),
          providedBy: ['chainlink', 'chronicle'],
          oracleFetcher: fetchRethOracleInfo,
        },
        [TokenSymbol('weETH')]: {
          type: 'yielding-fixed',
          baseAssetSymbol: TokenSymbol('WETH'),
          providedBy: ['chainlink', 'chronicle'],
          oracleFetcher: fetchWeethOracleInfo,
        },
        [TokenSymbol('USDC')]: {
          type: 'fixed',
        },
        [TokenSymbol('USDT')]: {
          type: 'fixed',
        },
        [TokenSymbol('DAI')]: {
          type: 'fixed',
        },
        [TokenSymbol('cbBTC')]: {
          type: 'underlying-asset',
          asset: 'BTC',
        },
      },
    },
    savings: {
      savingsDaiInfoQuery: mainnetSavingsDaiInfoQuery,
      savingsUsdsInfoQuery: PLAYWRIGHT_MAINNET_USDS_CONTRACTS_NOT_AVAILABLE ? undefined : mainnetSavingsUsdsInfoQuery,
      inputTokens: [
        TokenSymbol('DAI'),
        TokenSymbol('USDC'),
        ...(PLAYWRIGHT_MAINNET_USDS_CONTRACTS_NOT_AVAILABLE ? [] : [TokenSymbol('USDS')]),
      ],
      getEarningsApiUrl: (address) => `${infoSkyApiUrl}/savings-rate/wallets/${address.toLowerCase()}/?days_ago=9999`,
      savingsRateApiUrl: `${infoSkyApiUrl}/savings-rate/`,
    },
    farms: {
      configs: [
        {
          rewardType: 'token',
          address: farmAddresses[mainnet.id].skyUsds,
          entryAssetsGroup: farmStablecoinsEntryGroup[mainnet.id],
          historyCutoff: new Date('2024-09-17T00:00:00.000Z'),
        },
        {
          // Chronicle farm
          rewardType: 'points',
          address: farmAddresses[mainnet.id].chroniclePoints,
          entryAssetsGroup: farmStablecoinsEntryGroup[mainnet.id],
          historyCutoff: new Date('2024-09-17T00:00:00.000Z'),
          rewardPoints: new Token({
            address: CheckedAddress(zeroAddress),
            decimals: 18,
            name: 'Chronicle',
            symbol: TokenSymbol('CLE'),
            unitPriceUsd: '0',
          }),
        },
      ],
      getFarmDetailsApiUrl: (address) => `${infoSkyApiUrl}/farms/${address.toLowerCase()}/historic/`,
    },
  },
  [gnosis.id]: {
    originChainId: gnosis.id,
    daiSymbol: TokenSymbol('XDAI'),
    sdaiSymbol: TokenSymbol('sDAI'),
    usdsSymbol: undefined,
    susdsSymbol: undefined,
    psmStables: undefined,
    meta: {
      name: 'Gnosis Chain',
      logo: assets.chain.gnosis,
    },
    tokensWithMalformedApprove: [],
    permitSupport: {
      [CheckedAddress('0x9C58BAcC331c9aa871AFD802DB6379a98e80CEdb')]: false, // GNO
      [CheckedAddress('0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d')]: false, // WXDAI
      [CheckedAddress('0xaf204776c7245bF4147c2612BF6e5972Ee483701')]: false, // sDAI
      [CheckedAddress('0x6A023CCd1ff6F2045C3309768eAd9E68F978f6e1')]: false, // WETH
      [CheckedAddress('0x6C76971f98945AE98dD7d4DFcA8711ebea946eA6')]: false, // wstETH
      [CheckedAddress('0xDDAfbb505ad214D7b80b1f830fcCc89B60fb7A83')]: false, // USDC
      [CheckedAddress('0x4ECaBa5870353805a9F068101A40E0f32ed605C6')]: false, // USDT
      [CheckedAddress('0xcB444e90D8198415266c6a2724b7900fb12FC56E')]: false, // EURe
    },
    airdrop: {},
    extraTokens: [
      {
        symbol: TokenSymbol('XDAI'),
        oracleType: 'fixed-usd',
        address: NATIVE_ASSET_MOCK_ADDRESS,
      },
      {
        symbol: TokenSymbol('sDAI'),
        oracleType: 'vault',
        address: CheckedAddress('0xaf204776c7245bF4147c2612BF6e5972Ee483701'),
      },
    ],
    markets: {
      defaultAssetToBorrow: TokenSymbol('WXDAI'),
      nativeAssetInfo: {
        nativeAssetName: 'XDAI',
        wrappedNativeAssetSymbol: TokenSymbol('WXDAI'),
        wrappedNativeAssetAddress: CheckedAddress('0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d'),
        nativeAssetSymbol: TokenSymbol('XDAI'),
        minRemainingNativeAssetBalance: NormalizedUnitNumber(0.1),
      },
      tokenSymbolToReplacedName: {
        ...commonTokenSymbolToReplacedName,
        [TokenSymbol('WXDAI')]: { name: 'DAI Stablecoin', symbol: TokenSymbol('XDAI') },
        [TokenSymbol('sDAI')]: { name: 'Savings DAI', symbol: TokenSymbol('sDAI') },
        [TokenSymbol('USDC')]: { name: 'Circle USD (Legacy)', symbol: TokenSymbol('USDC') },
        [TokenSymbol('USDC.e')]: { name: 'Circle USD (Bridged)', symbol: TokenSymbol('USDC') },
        [TokenSymbol('USDT')]: { name: 'Tether USD (Bridged)', symbol: TokenSymbol('USDT') },
        [TokenSymbol('EURe')]: { name: 'Monerium EURO', symbol: TokenSymbol('EURe') },
      },
      oracles: {
        [TokenSymbol('EURe')]: {
          type: 'underlying-asset',
          asset: 'EUR',
        },
        [TokenSymbol('WETH')]: {
          type: 'market-price',
          providedBy: ['chainlink'],
        },
        [TokenSymbol('wstETH')]: {
          type: 'market-price',
          providedBy: ['chainlink'],
        },
        [TokenSymbol('GNO')]: {
          type: 'market-price',
          providedBy: ['chainlink'],
        },
        [TokenSymbol('USDC')]: {
          type: 'fixed',
        },
        [TokenSymbol('USDC.e')]: {
          type: 'fixed',
        },
        [TokenSymbol('USDT')]: {
          type: 'fixed',
        },
        [TokenSymbol('WXDAI')]: {
          type: 'fixed',
        },
        [TokenSymbol('sDAI')]: {
          type: 'yielding-fixed',
          baseAssetSymbol: TokenSymbol('DAI'),
          providedBy: ['chainlink'],
          oracleFetcher: fetchSdaiOracleInfoGnosis,
        },
      },
    },
    savings: {
      savingsDaiInfoQuery: gnosisSavingsDaiInfoQuery,
      savingsUsdsInfoQuery: undefined,
      inputTokens: [TokenSymbol('XDAI')],
      getEarningsApiUrl: undefined,
      savingsRateApiUrl: undefined,
    },
    farms: undefined,
  },
  [base.id]: {
    originChainId: base.id as SupportedChainId,
    daiSymbol: undefined,
    sdaiSymbol: undefined,
    usdsSymbol: TokenSymbol('USDS'),
    susdsSymbol: TokenSymbol('sUSDS'),
    psmStables: [TokenSymbol('USDC'), TokenSymbol('USDS')],
    meta: {
      name: 'Base',
      logo: assets.chain.base,
    },
    tokensWithMalformedApprove: [],
    permitSupport: {},
    airdrop: {},
    extraTokens: [
      {
        symbol: TokenSymbol('USDC'),
        oracleType: 'fixed-usd',
        address: CheckedAddress('0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'),
      },
      {
        symbol: TokenSymbol('sUSDS'),
        oracleType: 'ssr-auth-oracle',
        address: CheckedAddress('0x5875eEE11Cf8398102FdAd704C9E96607675467a'),
      },
      {
        symbol: TokenSymbol('USDS'),
        oracleType: 'fixed-usd',
        address: CheckedAddress('0x820C137fa70C8691f0e44Dc420a5e53c168921Dc'),
      },
      {
        symbol: TokenSymbol('SKY'),
        oracleType: 'zero-price',
        address: CheckedAddress('0x60e3c701e65DEE30c23c9Fb78c3866479cc0944a'),
      },
    ] as const,
    markets: undefined,
    savings: {
      savingsDaiInfoQuery: undefined,
      savingsUsdsInfoQuery: baseSavingsInfoQueryOptions,
      inputTokens: [TokenSymbol('USDC'), TokenSymbol('USDS')],
      getEarningsApiUrl: (address) =>
        `${infoSkyApiUrl}/savings-rate/wallets/${address.toLowerCase()}/?days_ago=9999&chainId=${base.id}`,
      savingsRateApiUrl: `${infoSkyApiUrl}/savings-rate/?chainId=${base.id}`,
    },
    farms: undefined,
  },
}

export const featureAvailability = (function getFeatureAvailability(): Record<
  'savings' | 'markets' | 'farms',
  SupportedChainId[]
> {
  // @note: using SUPPORTED_CHAIN instead of Object.values(chainConfig) to maintain chains order,
  // since chain config members are automatically sorted in js (object key is a number).
  function getSupportedChains(predicate: (config: ChainConfigEntry) => boolean): SupportedChainId[] {
    return SUPPORTED_CHAINS.map((chain) => chainConfig[chain.id])
      .filter(predicate)
      .map((config) => config.originChainId)
  }
  return {
    savings: getSupportedChains((config) => config.savings !== undefined),
    markets: getSupportedChains((config) => config.markets !== undefined),
    farms: getSupportedChains((config) => config.farms !== undefined),
  }
})()

export function getChainConfigEntry(chainId: number): ChainConfigEntry {
  const sandboxConfig = useStore.getState().appConfig.sandbox
  const sandbox = useStore.getState().sandbox.network

  const originChainId = getOriginChainId(chainId, sandbox)
  if (originChainId !== chainId) {
    return {
      ...chainConfig[originChainId],
      meta: getSandboxChainMeta(chainConfig[originChainId].meta, sandboxConfig),
    }
  }

  return chainConfig[chainId]
}

function getSandboxChainMeta(originChainMeta: ChainMeta, sandboxConfig: AppConfig['sandbox']): ChainMeta {
  return {
    ...originChainMeta,
    name: sandboxConfig?.chainName || originChainMeta.name,
    logo: assets.magicWandCircle,
  }
}
