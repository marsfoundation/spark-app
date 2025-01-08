import {
  rethBaseAssetOracleAbi,
  rethOracleAbi,
  rethRatioAbi,
  sdaiBaseAssetOracleGnosisAbi,
  sdaiOracleGnosisAbi,
  sdaiRatioGnosisAbi,
  weethBaseAssetOracleAbi,
  weethOracleAbi,
  weethRatioAbi,
  wstethBaseAssetOracleMainnetAbi,
  wstethOracleMainnetAbi,
  wstethRatioMainnetAbi,
} from '@/config/abis/yieldingTokensRatioAbi'
import { toBigInt } from '@marsfoundation/common-universal'
import { CheckedAddress } from '@marsfoundation/common-universal'
import { BaseUnitNumber, NormalizedUnitNumber } from '@marsfoundation/common-universal'
import { gnosis, mainnet } from 'viem/chains'
import { Config } from 'wagmi'
import { readContract } from 'wagmi/actions'
import { Reserve } from '../market-info/marketInfo'

export interface OracleInfoFetcherParams {
  reserve: Reserve
  wagmiConfig: Config
}

export interface OracleInfoFetcherResult {
  ratio: NormalizedUnitNumber
  baseAssetOracle: CheckedAddress
  baseAssetPrice: NormalizedUnitNumber
}

export async function fetchWstethOracleInfoMainnet({
  reserve,
  wagmiConfig,
}: OracleInfoFetcherParams): Promise<OracleInfoFetcherResult> {
  const [steth, baseAssetOracle] = await Promise.all([
    readContract(wagmiConfig, {
      abi: wstethOracleMainnetAbi,
      address: reserve.priceOracle,
      functionName: 'steth',
      args: [],
      chainId: mainnet.id,
    }),
    readContract(wagmiConfig, {
      abi: wstethOracleMainnetAbi,
      address: reserve.priceOracle,
      functionName: 'ethSource',
      args: [],
      chainId: mainnet.id,
    }),
  ])

  const [ratio, baseAssetPrice, baseAssetPriceDecimals] = await Promise.all([
    readContract(wagmiConfig, {
      abi: wstethRatioMainnetAbi,
      address: steth,
      functionName: 'getPooledEthByShares',
      args: [toBigInt(reserve.token.toBaseUnit(NormalizedUnitNumber(1)))],
      chainId: mainnet.id,
    }),
    readContract(wagmiConfig, {
      abi: wstethBaseAssetOracleMainnetAbi,
      address: baseAssetOracle,
      account: reserve.priceOracle,
      functionName: 'latestAnswer',
      args: [],
      chainId: mainnet.id,
    }),
    readContract(wagmiConfig, {
      abi: wstethBaseAssetOracleMainnetAbi,
      address: baseAssetOracle,
      account: reserve.priceOracle,
      functionName: 'decimals',
      args: [],
      chainId: mainnet.id,
    }),
  ])

  return {
    ratio: reserve.token.fromBaseUnit(BaseUnitNumber(ratio)),
    baseAssetOracle: CheckedAddress(baseAssetOracle),
    baseAssetPrice: NormalizedUnitNumber(BaseUnitNumber(baseAssetPrice).shiftedBy(-baseAssetPriceDecimals)),
  }
}

export async function fetchSdaiOracleInfoGnosis({
  reserve,
  wagmiConfig,
}: OracleInfoFetcherParams): Promise<OracleInfoFetcherResult> {
  const [sdaiAddress, baseAssetOracle] = await Promise.all([
    readContract(wagmiConfig, {
      abi: sdaiOracleGnosisAbi,
      address: reserve.priceOracle,
      functionName: 'sDAI',
      args: [],
      chainId: gnosis.id,
    }),
    readContract(wagmiConfig, {
      abi: sdaiOracleGnosisAbi,
      address: reserve.priceOracle,
      functionName: 'DAI_TO_BASE',
      args: [],
      chainId: gnosis.id,
    }),
  ])

  const [ratio, baseAssetPrice, baseAssetPriceDecimals] = await Promise.all([
    readContract(wagmiConfig, {
      abi: sdaiRatioGnosisAbi,
      address: sdaiAddress,
      functionName: 'convertToAssets',
      args: [toBigInt(reserve.token.toBaseUnit(NormalizedUnitNumber(1)))],
      chainId: gnosis.id,
    }),
    readContract(wagmiConfig, {
      abi: sdaiBaseAssetOracleGnosisAbi,
      address: baseAssetOracle,
      functionName: 'latestAnswer',
      args: [],
      chainId: gnosis.id,
    }),
    readContract(wagmiConfig, {
      abi: sdaiBaseAssetOracleGnosisAbi,
      address: baseAssetOracle,
      functionName: 'decimals',
      args: [],
      chainId: gnosis.id,
    }),
  ])

  return {
    ratio: reserve.token.fromBaseUnit(BaseUnitNumber(ratio)),
    baseAssetOracle: CheckedAddress(baseAssetOracle),
    baseAssetPrice: NormalizedUnitNumber(BaseUnitNumber(baseAssetPrice).shiftedBy(-baseAssetPriceDecimals)),
  }
}

export async function fetchRethOracleInfo({
  reserve,
  wagmiConfig,
}: OracleInfoFetcherParams): Promise<OracleInfoFetcherResult> {
  const [reth, baseAssetOracle] = await Promise.all([
    readContract(wagmiConfig, {
      abi: rethOracleAbi,
      address: reserve.priceOracle,
      functionName: 'reth',
      args: [],
      chainId: mainnet.id,
    }),
    readContract(wagmiConfig, {
      abi: rethOracleAbi,
      address: reserve.priceOracle,
      functionName: 'ethSource',
      args: [],
      chainId: mainnet.id,
    }),
  ])

  const [ratio, baseAssetPrice, baseAssetPriceDecimals] = await Promise.all([
    readContract(wagmiConfig, {
      abi: rethRatioAbi,
      address: reth,
      functionName: 'getExchangeRate',
      args: [],
      chainId: mainnet.id,
    }),
    readContract(wagmiConfig, {
      abi: rethBaseAssetOracleAbi,
      address: baseAssetOracle,
      account: reserve.priceOracle,
      functionName: 'latestAnswer',
      args: [],
      chainId: mainnet.id,
    }),
    readContract(wagmiConfig, {
      abi: rethBaseAssetOracleAbi,
      address: baseAssetOracle,
      account: reserve.priceOracle,
      functionName: 'decimals',
      args: [],
      chainId: mainnet.id,
    }),
  ])

  return {
    ratio: reserve.token.fromBaseUnit(BaseUnitNumber(ratio)),
    baseAssetOracle: CheckedAddress(baseAssetOracle),
    baseAssetPrice: NormalizedUnitNumber(BaseUnitNumber(baseAssetPrice).shiftedBy(-baseAssetPriceDecimals)),
  }
}

export async function fetchWeethOracleInfo({
  reserve,
  wagmiConfig,
}: OracleInfoFetcherParams): Promise<OracleInfoFetcherResult> {
  const [weeth, baseAssetOracle] = await Promise.all([
    readContract(wagmiConfig, {
      abi: weethOracleAbi,
      address: reserve.priceOracle,
      functionName: 'weeth',
      args: [],
      chainId: mainnet.id,
    }),
    readContract(wagmiConfig, {
      abi: weethOracleAbi,
      address: reserve.priceOracle,
      functionName: 'ethSource',
      args: [],
      chainId: mainnet.id,
    }),
  ])

  const [ratio, baseAssetPrice, baseAssetPriceDecimals] = await Promise.all([
    readContract(wagmiConfig, {
      abi: weethRatioAbi,
      address: weeth,
      functionName: 'getRate',
      args: [],
      chainId: mainnet.id,
    }),
    readContract(wagmiConfig, {
      abi: weethBaseAssetOracleAbi,
      address: baseAssetOracle,
      account: reserve.priceOracle,
      functionName: 'latestAnswer',
      args: [],
      chainId: mainnet.id,
    }),
    readContract(wagmiConfig, {
      abi: weethBaseAssetOracleAbi,
      address: baseAssetOracle,
      account: reserve.priceOracle,
      functionName: 'decimals',
      args: [],
      chainId: mainnet.id,
    }),
  ])

  return {
    ratio: reserve.token.fromBaseUnit(BaseUnitNumber(ratio)),
    baseAssetOracle: CheckedAddress(baseAssetOracle),
    baseAssetPrice: NormalizedUnitNumber(BaseUnitNumber(baseAssetPrice).shiftedBy(-baseAssetPriceDecimals)),
  }
}
