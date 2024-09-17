import { gnosis, mainnet } from 'viem/chains'

import { getContractAddress } from '@/domain/hooks/useContractAddress'
import { getOriginChainId } from '@/domain/hooks/useOriginChainId'
import { gnosisSavingsDaiInfoQuery } from '@/domain/savings-info/gnosisSavingsInfo'
import { mainnetSavingsDaiInfoQuery, mainnetSavingsUsdsInfoQuery } from '@/domain/savings-info/mainnetSavingsInfo'
import { useStore } from '@/domain/state'
import { CheckedAddress } from '@/domain/types/CheckedAddress'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { assets } from '@/ui/assets'
import { NATIVE_ASSET_MOCK_ADDRESS, stablecoinsGroup } from '../consts'
import { usdsSkyRewardsConfig } from '../contracts-generated'
import { AppConfig } from '../feature-flags'
import { PLAYWRIGHT_USDS_CONTRACTS_NOT_AVAILABLE_KEY } from '../wagmi/config.e2e'
import { USDS_DEV_CHAIN_ID } from './constants'
import { ChainConfig, ChainConfigEntry, ChainMeta } from './types'

const commonTokenSymbolToReplacedName = {
  [TokenSymbol('DAI')]: { name: 'DAI Stablecoin', symbol: TokenSymbol('DAI') },
  [TokenSymbol('USDC')]: { name: 'Circle USD', symbol: TokenSymbol('USDC') },
  [TokenSymbol('wstETH')]: { name: 'Lido Staked ETH', symbol: TokenSymbol('wstETH') },
  [TokenSymbol('rETH')]: { name: 'Rocket Pool Staked ETH', symbol: TokenSymbol('rETH') },
  [TokenSymbol('GNO')]: { name: 'Gnosis Token', symbol: TokenSymbol('GNO') },
  [TokenSymbol('WETH')]: { name: 'Ethereum', symbol: TokenSymbol('ETH') },
  [TokenSymbol('weETH')]: { name: 'Ether.fi Staked ETH', symbol: TokenSymbol('weETH') },
}

const PLAYWRIGHT_USDS_CONTRACTS_NOT_AVAILABLE =
  import.meta.env.VITE_PLAYWRIGHT === '1' && (window as any)[PLAYWRIGHT_USDS_CONTRACTS_NOT_AVAILABLE_KEY] === true

const chainConfig: ChainConfig = {
  [mainnet.id]: {
    id: mainnet.id,
    meta: {
      name: 'Ethereum Mainnet',
      logo: assets.chain.ethereum,
      defaultAssetToBorrow: TokenSymbol('DAI'),
    },
    nativeAssetInfo: {
      nativeAssetName: 'Ethereum',
      wrappedNativeAssetSymbol: TokenSymbol('WETH'),
      wrappedNativeAssetAddress: CheckedAddress('0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'),
      nativeAssetSymbol: TokenSymbol('ETH'),
      minRemainingNativeAssetBalance: NormalizedUnitNumber(0.001),
    },
    erc20TokensWithApproveFnMalformed: [CheckedAddress('0xdac17f958d2ee523a2206206994597c13d831ec7')], // USDT
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
    tokenSymbolToReplacedName: {
      ...commonTokenSymbolToReplacedName,
    },
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
    savingsDaiInfoQuery: mainnetSavingsDaiInfoQuery,
    savingsUsdsInfoQuery: PLAYWRIGHT_USDS_CONTRACTS_NOT_AVAILABLE ? undefined : mainnetSavingsUsdsInfoQuery,
    daiSymbol: TokenSymbol('DAI'),
    sDaiSymbol: TokenSymbol('sDAI'),
    USDSSymbol: PLAYWRIGHT_USDS_CONTRACTS_NOT_AVAILABLE ? undefined : TokenSymbol('USDS'),
    sUSDSSymbol: PLAYWRIGHT_USDS_CONTRACTS_NOT_AVAILABLE ? undefined : TokenSymbol('sUSDS'),
    mergedDaiAndSDaiMarkets: true,
    savingsInputTokens: [
      TokenSymbol('DAI'),
      TokenSymbol('USDC'),
      ...(PLAYWRIGHT_USDS_CONTRACTS_NOT_AVAILABLE ? [] : [TokenSymbol('USDS')]),
    ],
    extraTokens: [
      {
        symbol: TokenSymbol('DAI'),
        reserveReserveOracleType: 'fixed-usd',
        address: CheckedAddress('0x6b175474e89094c44da98b954eedeac495271d0f'),
      },
      {
        symbol: TokenSymbol('USDC'),
        reserveReserveOracleType: 'fixed-usd',
        address: CheckedAddress('0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'),
      },
      {
        symbol: TokenSymbol('sDAI'),
        reserveReserveOracleType: 'vault',
        address: CheckedAddress('0x83f20f44975d03b1b09e64809b757c47f942beea'),
      },
      ...(PLAYWRIGHT_USDS_CONTRACTS_NOT_AVAILABLE
        ? []
        : ([
            {
              symbol: TokenSymbol('sUSDS'),
              reserveReserveOracleType: 'vault',
              address: CheckedAddress('0xa3931d71877C0E7a3148CB7Eb4463524FEc27fbD'),
            },
            {
              symbol: TokenSymbol('USDS'),
              reserveReserveOracleType: 'fixed-usd',
              address: CheckedAddress('0xdC035D45d973E3EC169d2276DDab16f1e407384F'),
            },
            {
              symbol: TokenSymbol('SKY'),
              reserveReserveOracleType: 'fixed-usd', // @todo: this is not correct, but it's not used in the app for now
              address: CheckedAddress('0x56072C95FAA701256059aa122697B133aDEd9279'),
            },
          ] as const)),
    ],
    farms: [
      {
        address: getContractAddress(usdsSkyRewardsConfig.address, mainnet.id),
        entryAssetsGroup: stablecoinsGroup,
      },
    ],
    oracles: {},
  },
  [gnosis.id]: {
    id: gnosis.id,
    meta: {
      name: 'Gnosis Chain',
      logo: assets.chain.gnosis,
      defaultAssetToBorrow: TokenSymbol('WXDAI'),
    },
    nativeAssetInfo: {
      nativeAssetName: 'XDAI',
      wrappedNativeAssetSymbol: TokenSymbol('WXDAI'),
      wrappedNativeAssetAddress: CheckedAddress('0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d'),
      nativeAssetSymbol: TokenSymbol('XDAI'),
      minRemainingNativeAssetBalance: NormalizedUnitNumber(0.1),
    },
    erc20TokensWithApproveFnMalformed: [],
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
    tokenSymbolToReplacedName: {
      ...commonTokenSymbolToReplacedName,
      [TokenSymbol('WXDAI')]: { name: 'DAI Stablecoin', symbol: TokenSymbol('XDAI') },
      [TokenSymbol('sDAI')]: { name: 'Savings DAI', symbol: TokenSymbol('sDAI') },
      [TokenSymbol('USDC')]: { name: 'Circle USD (Legacy)', symbol: TokenSymbol('USDC') },
      [TokenSymbol('USDC.e')]: { name: 'Circle USD (Bridged)', symbol: TokenSymbol('USDC') },
      [TokenSymbol('USDT')]: { name: 'Tether USD (Bridged)', symbol: TokenSymbol('USDT') },
      [TokenSymbol('EURe')]: { name: 'Monerium EURO', symbol: TokenSymbol('EURe') },
    },
    airdrop: {},
    savingsDaiInfoQuery: gnosisSavingsDaiInfoQuery,
    savingsUsdsInfoQuery: undefined,
    daiSymbol: TokenSymbol('XDAI'),
    sDaiSymbol: TokenSymbol('sDAI'),
    USDSSymbol: undefined,
    sUSDSSymbol: undefined,
    mergedDaiAndSDaiMarkets: false,
    savingsInputTokens: [TokenSymbol('XDAI')],
    extraTokens: [
      {
        symbol: TokenSymbol('XDAI'),
        reserveReserveOracleType: 'fixed-usd',
        address: NATIVE_ASSET_MOCK_ADDRESS,
      },
      {
        symbol: TokenSymbol('sDAI'),
        reserveReserveOracleType: 'vault',
        address: CheckedAddress('0xaf204776c7245bF4147c2612BF6e5972Ee483701'),
      },
    ],
    farms: [],
    oracles: {},
  },
}

export function getChainConfigEntry(chainId: number): ChainConfigEntry {
  const sandboxConfig = useStore.getState().appConfig.sandbox
  const sandbox = useStore.getState().sandbox.network

  if (typeof import.meta.env.VITE_DEV_USDS_NETWORK_RPC_URL === 'string' && chainId === USDS_DEV_CHAIN_ID) {
    const mainnetConfig = chainConfig[mainnet.id]
    return {
      ...mainnetConfig,
      meta: getUSDSDevChainMeta(mainnetConfig.meta),
      extraTokens: [
        ...mainnetConfig.extraTokens.filter(({ symbol }) => !['USDS', 'sUSDS', 'SKY'].includes(symbol)),
        {
          symbol: TokenSymbol('USDS'),
          reserveReserveOracleType: 'fixed-usd',
          address: CheckedAddress('0xd2983525E903Ef198d5dD0777712EB66680463bc'),
        },
        {
          symbol: TokenSymbol('sUSDS'),
          reserveReserveOracleType: 'vault',
          address: CheckedAddress('0xCd9BC6cE45194398d12e27e1333D5e1d783104dD'),
        },
        {
          symbol: TokenSymbol('SKY'),
          reserveReserveOracleType: 'fixed-usd',
          address: CheckedAddress('0x72aC6A36de2f72BD39e9c782e9db0DCc41FEbfe2'),
        },
      ],
    }
  }

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

function getUSDSDevChainMeta(originChainMeta: ChainMeta): ChainMeta {
  return {
    ...originChainMeta,
    name: 'USDS DevNet',
    logo: assets.token.usds,
  }
}
