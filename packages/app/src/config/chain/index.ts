import { getOriginChainId } from '@/domain/hooks/useOriginChainId'
import { baseSavingsInfoQueryOptions } from '@/domain/savings-info/baseSavingsInfo'
import { useStore } from '@/domain/state'
import { CheckedAddress } from '@/domain/types/CheckedAddress'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { assets } from '@/ui/assets'
import { base } from 'viem/chains'
import { AppConfig } from '../feature-flags'
import { PLAYWRIGHT_USDS_CONTRACTS_NOT_AVAILABLE_KEY } from '../wagmi/config.e2e'
import { lastSepolia } from './constants'
import { ChainConfigEntry, ChainMeta, SupportedChainId } from './types'
import { USDXL_ADDRESS } from '../consts'

const commonTokenSymbolToReplacedName = {
  [TokenSymbol('DAI')]: { name: 'DAI Stablecoin', symbol: TokenSymbol('DAI') },
  [TokenSymbol('USDC')]: { name: 'Circle USD', symbol: TokenSymbol('USDC') },
  [TokenSymbol('wstETH')]: { name: 'Lido Staked ETH', symbol: TokenSymbol('wstETH') },
  [TokenSymbol('rETH')]: { name: 'Rocket Pool Staked ETH', symbol: TokenSymbol('rETH') },
  [TokenSymbol('GNO')]: { name: 'Gnosis Token', symbol: TokenSymbol('GNO') },
  [TokenSymbol('WETH')]: { name: 'Ethereum', symbol: TokenSymbol('ETH') },
  [TokenSymbol('weETH')]: { name: 'Ether.fi Staked ETH', symbol: TokenSymbol('weETH') },
}

const _PLAYWRIGHT_MAINNET_USDS_CONTRACTS_NOT_AVAILABLE =
  import.meta.env.VITE_PLAYWRIGHT === '1' && (window as any)[PLAYWRIGHT_USDS_CONTRACTS_NOT_AVAILABLE_KEY] === true

const chainConfig: Record<SupportedChainId, ChainConfigEntry> = {
  [lastSepolia.id]: {
    originChainId: lastSepolia.id,
    daiSymbol: TokenSymbol('USDC'),
    sdaiSymbol: TokenSymbol('USDC'),
    usdsSymbol: undefined,
    susdsSymbol: undefined,
    psmStables: [TokenSymbol('USDC'), TokenSymbol('USDT')],
    meta: {
      name: 'Last Sepolia',
      logo: assets.lastLogo,
    },
    permitSupport: {
      [CheckedAddress('0x04f42e29D6057B7D70Ea1cab8E516C0029420B64')]: true, // USDC
      [CheckedAddress('0xc9Fc065b2e986f29138Bd398E6FaAbd291c58B8E')]: true, // USDT
      // [CheckedAddress('0x7eA65834587ABF89A94d238a404C4A638Fc7641B')]: false, // WETH
      [CheckedAddress('0x1A86bA62361DDCc680b2B230c7b3CcF5D777ed7E')]: false, // testWETH
    },
    tokensWithMalformedApprove: [],
    airdrop: {},
    extraTokens: [
      {
        symbol: TokenSymbol('USDC'),
        oracleType: 'fixed-usd',
        address: CheckedAddress('0x04f42e29D6057B7D70Ea1cab8E516C0029420B64'),
      },
      {
        symbol: TokenSymbol('USDT'),
        oracleType: 'fixed-usd',
        address: CheckedAddress('0xc9Fc065b2e986f29138Bd398E6FaAbd291c58B8E'),
      },
      {
        symbol: TokenSymbol('USDXL'),
        oracleType: 'fixed-usd',
        address: USDXL_ADDRESS,
      },
    ],
    markets: {
      defaultAssetToBorrow: TokenSymbol('USDXL'),
      nativeAssetInfo: {
        nativeAssetName: 'Ethereum',
        wrappedNativeAssetSymbol: TokenSymbol('testWETH'),
        wrappedNativeAssetAddress: CheckedAddress('0x1A86bA62361DDCc680b2B230c7b3CcF5D777ed7E'),
        nativeAssetSymbol: TokenSymbol('ETH'),
        minRemainingNativeAssetBalance: NormalizedUnitNumber(0.001),
      },
      tokenSymbolToReplacedName: {
        ...commonTokenSymbolToReplacedName,
      },
      oracles: {
        [TokenSymbol('testWETH')]: {
          type: 'market-price',
          providedBy: ['chainlink', 'chronicle'],
        },
        [TokenSymbol('USDC')]: {
          type: 'fixed',
        },
        [TokenSymbol('USDT')]: {
          type: 'fixed',
        },
      },
    },
    savings: undefined,
    farms: undefined,
  },
  // [mainnet.id]: {
  //   originChainId: mainnet.id,
  //   daiSymbol: TokenSymbol('DAI'),
  //   sdaiSymbol: TokenSymbol('sDAI'),
  //   usdsSymbol: PLAYWRIGHT_MAINNET_USDS_CONTRACTS_NOT_AVAILABLE ? undefined : TokenSymbol('USDS'),
  //   susdsSymbol: PLAYWRIGHT_MAINNET_USDS_CONTRACTS_NOT_AVAILABLE ? undefined : TokenSymbol('sUSDS'),
  //   psmStables: [TokenSymbol('DAI'), TokenSymbol('USDC'), TokenSymbol('USDS')],
  //   meta: {
  //     name: 'Ethereum Mainnet',
  //     logo: assets.chain.ethereum,
  //   },
  //   permitSupport: {
  //     [CheckedAddress('0x6b175474e89094c44da98b954eedeac495271d0f')]: false, // DAI
  //     [CheckedAddress('0x83f20f44975d03b1b09e64809b757c47f942beea')]: true, // sDAI
  //     [CheckedAddress('0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48')]: false, // USDC
  //     [CheckedAddress('0xdAC17F958D2ee523a2206206994597C13D831ec7')]: false, // USDT
  //     [CheckedAddress('0x2260fac5e5542a773aa44fbcfedf7c193bc2c599')]: false, // WBTC
  //     [CheckedAddress('0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2')]: false, // WETH
  //     [CheckedAddress('0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0')]: true, // wstETH
  //     [CheckedAddress('0xae78736Cd615f374D3085123A210448E74Fc6393')]: false, // rETH
  //     [CheckedAddress('0x6810e776880C02933D47DB1b9fc05908e5386b96')]: false, // GNO
  //   },
  //   tokensWithMalformedApprove: [CheckedAddress('0xdac17f958d2ee523a2206206994597c13d831ec7')], // USDT
  //   airdrop: {
  //     [TokenSymbol('ETH')]: {
  //       deposit: [TokenSymbol('SPK')],
  //       borrow: [],
  //     },
  //     [TokenSymbol('WETH')]: {
  //       deposit: [TokenSymbol('SPK')],
  //       borrow: [],
  //     },
  //     [TokenSymbol('DAI')]: {
  //       deposit: [],
  //       borrow: [TokenSymbol('SPK')],
  //     },
  //   },
  //   extraTokens: [
  //     {
  //       symbol: TokenSymbol('DAI'),
  //       oracleType: 'fixed-usd',
  //       address: CheckedAddress('0x6b175474e89094c44da98b954eedeac495271d0f'),
  //     },
  //     {
  //       symbol: TokenSymbol('USDC'),
  //       oracleType: 'fixed-usd',
  //       address: CheckedAddress('0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'),
  //     },
  //     {
  //       symbol: TokenSymbol('sDAI'),
  //       oracleType: 'vault',
  //       address: CheckedAddress('0x83f20f44975d03b1b09e64809b757c47f942beea'),
  //     },
  //     ...(PLAYWRIGHT_MAINNET_USDS_CONTRACTS_NOT_AVAILABLE
  //       ? []
  //       : ([
  //           {
  //             symbol: TokenSymbol('sUSDS'),
  //             oracleType: 'vault',
  //             address: susdsAddresses[mainnet.id],
  //           },
  //           {
  //             symbol: TokenSymbol('USDS'),
  //             oracleType: 'fixed-usd',
  //             address: CheckedAddress('0xdC035D45d973E3EC169d2276DDab16f1e407384F'),
  //           },
  //           {
  //             symbol: TokenSymbol('SKY'),
  //             oracleType: 'zero-price',
  //             address: CheckedAddress('0x56072C95FAA701256059aa122697B133aDEd9279'),
  //           },
  //         ] as const)),
  //   ],
  //   markets: {
  //     defaultAssetToBorrow: TokenSymbol('DAI'),
  //     nativeAssetInfo: {
  //       nativeAssetName: 'Ethereum',
  //       wrappedNativeAssetSymbol: TokenSymbol('WETH'),
  //       wrappedNativeAssetAddress: CheckedAddress('0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'),
  //       nativeAssetSymbol: TokenSymbol('ETH'),
  //       minRemainingNativeAssetBalance: NormalizedUnitNumber(0.001),
  //     },
  //     tokenSymbolToReplacedName: {
  //       ...commonTokenSymbolToReplacedName,
  //     },
  //     oracles: {
  //       [TokenSymbol('WETH')]: {
  //         type: 'market-price',
  //         providedBy: ['chainlink', 'chronicle'],
  //       },
  //       [TokenSymbol('WBTC')]: {
  //         type: 'market-price',
  //         providedBy: ['chainlink'],
  //       },
  //       [TokenSymbol('wstETH')]: {
  //         type: 'yielding-fixed',
  //         baseAssetSymbol: TokenSymbol('WETH'),
  //         providedBy: ['chainlink', 'chronicle'],
  //         oracleFetcher: fetchWstethOracleInfoMainnet,
  //       },
  //       [TokenSymbol('rETH')]: {
  //         type: 'yielding-fixed',
  //         baseAssetSymbol: TokenSymbol('WETH'),
  //         providedBy: ['chainlink', 'chronicle'],
  //         oracleFetcher: fetchRethOracleInfo,
  //       },
  //       [TokenSymbol('weETH')]: {
  //         type: 'yielding-fixed',
  //         baseAssetSymbol: TokenSymbol('WETH'),
  //         providedBy: ['chainlink', 'chronicle'],
  //         oracleFetcher: fetchWeethOracleInfo,
  //       },
  //       [TokenSymbol('USDC')]: {
  //         type: 'fixed',
  //       },
  //       [TokenSymbol('USDT')]: {
  //         type: 'fixed',
  //       },
  //       [TokenSymbol('DAI')]: {
  //         type: 'fixed',
  //       },
  //       [TokenSymbol('cbBTC')]: {
  //         type: 'underlying-asset',
  //         asset: 'BTC',
  //       },
  //     },
  //   },
  //   savings: {
  //     savingsDaiInfoQuery: mainnetSavingsDaiInfoQuery,
  //     savingsUsdsInfoQuery: PLAYWRIGHT_MAINNET_USDS_CONTRACTS_NOT_AVAILABLE ? undefined : mainnetSavingsUsdsInfoQuery,
  //     inputTokens: [
  //       TokenSymbol('DAI'),
  //       TokenSymbol('USDC'),
  //       ...(PLAYWRIGHT_MAINNET_USDS_CONTRACTS_NOT_AVAILABLE ? [] : [TokenSymbol('USDS')]),
  //     ],
  //     getEarningsApiUrl: (address) => `${infoSkyApiUrl}/savings-rate/wallets/${address.toLowerCase()}/?days_ago=9999`,
  //     savingsRateApiUrl: `${infoSkyApiUrl}/savings-rate/`,
  //   },
  //   farms: {
  //     configs: [
  //       {
  //         rewardType: 'token',
  //         address: farmAddresses[mainnet.id].skyUsds,
  //         entryAssetsGroup: farmStablecoinsEntryGroup[mainnet.id],
  //         historyCutoff: new Date('2024-09-17T00:00:00.000Z'),
  //       },
  //       {
  //         // Chronicle farm
  //         rewardType: 'points',
  //         address: farmAddresses[mainnet.id].chroniclePoints,
  //         entryAssetsGroup: farmStablecoinsEntryGroup[mainnet.id],
  //         historyCutoff: new Date('2024-09-17T00:00:00.000Z'),
  //         rewardPoints: new Token({
  //           address: CheckedAddress(zeroAddress),
  //           decimals: 18,
  //           name: 'Chronicle',
  //           symbol: TokenSymbol('CLE'),
  //           unitPriceUsd: '0',
  //         }),
  //       },
  //     ],
  //     getFarmDetailsApiUrl: (address) => `${infoSkyApiUrl}/farms/${address.toLowerCase()}/historic/`,
  //   },
  // },
  ...(typeof import.meta.env.VITE_DEV_BASE_DEVNET_RPC_URL === 'string'
    ? {
        [base.id]: {
          originChainId: base.id as SupportedChainId,
          daiSymbol: undefined,
          sdaiSymbol: undefined,
          usdsSymbol: TokenSymbol('USDS'),
          susdsSymbol: TokenSymbol('sUSDS'),
          psmStables: [TokenSymbol('USDC'), TokenSymbol('USDS')],
          meta: {
            name: 'Base DevNet',
            logo: assets.chain.baseDevNet,
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
              address: CheckedAddress('0x02Edc8718799a22fCBeBEd0C58a1D09657C81bC8'),
            },
            {
              symbol: TokenSymbol('USDS'),
              oracleType: 'fixed-usd',
              address: CheckedAddress('0x21F5b5dF683B6885D6A88f330C4474ADeE2A6ed3'),
            },
            {
              symbol: TokenSymbol('SKY'),
              oracleType: 'zero-price',
              address: CheckedAddress('0xA40D3Ad0dEdED3df8cDf02108AFf90220C437B82'),
            },
          ] as const,
          markets: undefined,
          savings: {
            savingsDaiInfoQuery: undefined,
            savingsUsdsInfoQuery: baseSavingsInfoQueryOptions,
            inputTokens: [TokenSymbol('USDC'), TokenSymbol('USDS')],
            getEarningsApiUrl: undefined,
            savingsRateApiUrl: undefined,
          },
          farms: undefined,
        } satisfies ChainConfigEntry,
      }
    : {}),
}

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
