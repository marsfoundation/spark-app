import { gnosis, mainnet } from 'viem/chains'

import { getOriginChainId } from '@/domain/hooks/useOriginChainId'
import { gnosisSavingsInfoQuery } from '@/domain/savings-info/gnosisSavingsInfo'
import { mainnetSavingsInfoQuery } from '@/domain/savings-info/mainnetSavingsInfo'
import { unsupportedSavingsInfoQuery } from '@/domain/savings-info/unsupportedSavingsInfo'
import { useStore } from '@/domain/state'
import { CheckedAddress } from '@/domain/types/CheckedAddress'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { assets } from '@/ui/assets'

import { AppConfig } from '../feature-flags'
import { ChainConfig, ChainConfigEntry, ChainMeta } from './types'

const commonTokenSymbolToReplacedName = {
  [TokenSymbol('DAI')]: { name: 'DAI Stablecoin', symbol: TokenSymbol('DAI') },
  [TokenSymbol('USDC')]: { name: 'Circle USD', symbol: TokenSymbol('USDC') },
  [TokenSymbol('wstETH')]: { name: 'Lido Staked ETH', symbol: TokenSymbol('wstETH') },
  [TokenSymbol('rETH')]: { name: 'Rocket Pool Staked ETH', symbol: TokenSymbol('rETH') },
  [TokenSymbol('GNO')]: { name: 'Gnosis Token', symbol: TokenSymbol('GNO') },
  [TokenSymbol('WETH')]: { name: 'Ethereum', symbol: TokenSymbol('ETH') },
}

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
      [TokenSymbol('SPK')]: {
        [TokenSymbol('ETH')]: {
          deposit: NormalizedUnitNumber(6_000_000),
        },
        [TokenSymbol('DAI')]: {
          borrow: NormalizedUnitNumber(24_000_000),
        },
      },
    },
    savingsInfoQuery: mainnetSavingsInfoQuery,
    daiSymbol: TokenSymbol('DAI'),
    sDaiSymbol: TokenSymbol('sDAI'),
    supportsLifiWaivedFees: true,
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
      [TokenSymbol('USDC')]: { name: 'Circle USD (Bridged)', symbol: TokenSymbol('USDC') },
      [TokenSymbol('USDT')]: { name: 'Tether USD (Bridged)', symbol: TokenSymbol('USDT') },
      [TokenSymbol('EURe')]: { name: 'Monerium EURO', symbol: TokenSymbol('EURe') },
    },
    airdrop: {},
    savingsInfoQuery:
      import.meta.env.VITE_DEV_GNOSIS_SAVINGS === '1' ? gnosisSavingsInfoQuery : unsupportedSavingsInfoQuery,
    daiSymbol: TokenSymbol('XDAI'),
    sDaiSymbol: TokenSymbol('sDAI'),
    supportsLifiWaivedFees: false,
  },
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
    logo: assets.sparkIcon,
  }
}
