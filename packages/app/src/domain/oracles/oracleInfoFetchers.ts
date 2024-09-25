import {
  rethOracleAbi,
  rethRatioAbi,
  sdaiOracleGnosisAbi,
  sdaiRatioGnosisAbi,
  weethOracleAbi,
  weethRatioAbi,
  wstethOracleMainnetAbi,
  wstethRatioAbi,
} from '@/config/abis/yieldingTokensRatioAbi'
import { toBigInt } from '@/utils/bigNumber'
import { gnosis, mainnet } from 'viem/chains'
import { Config } from 'wagmi'
import { readContract } from 'wagmi/actions'
import { Reserve } from '../market-info/marketInfo'
import { CheckedAddress } from '../types/CheckedAddress'
import { BaseUnitNumber, NormalizedUnitNumber } from '../types/NumericValues'

export interface OracleInfoFetcherParams {
  reserve: Reserve
  wagmiConfig: Config
}

export interface OracleInfoFetcherResult {
  ratio: NormalizedUnitNumber
  baseAssetOracle: CheckedAddress
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

  const ratio = await readContract(wagmiConfig, {
    abi: wstethRatioAbi,
    address: steth,
    functionName: 'getPooledEthByShares',
    args: [toBigInt(10 ** reserve.token.decimals)],
    chainId: mainnet.id,
  })

  return {
    ratio: reserve.token.fromBaseUnit(BaseUnitNumber(ratio)),
    baseAssetOracle: CheckedAddress(baseAssetOracle),
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

  const ratio = await readContract(wagmiConfig, {
    abi: sdaiRatioGnosisAbi,
    address: sdaiAddress,
    functionName: 'convertToAssets',
    args: [toBigInt(10 ** reserve.token.decimals)],
    chainId: gnosis.id,
  })

  return {
    ratio: reserve.token.fromBaseUnit(BaseUnitNumber(ratio)),
    baseAssetOracle: CheckedAddress(baseAssetOracle),
  }
}

export async function fetchRethhOracleInfo({
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

  const ratio = await readContract(wagmiConfig, {
    abi: rethRatioAbi,
    address: reth,
    functionName: 'getExchangeRate',
    args: [],
    chainId: mainnet.id,
  })

  return {
    ratio: reserve.token.fromBaseUnit(BaseUnitNumber(ratio)),
    baseAssetOracle: CheckedAddress(baseAssetOracle),
  }
}

export async function fetchWeethhOracleInfo({
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

  const ratio = await readContract(wagmiConfig, {
    abi: weethRatioAbi,
    address: weeth,
    functionName: 'getRate',
    args: [],
    chainId: mainnet.id,
  })

  return {
    ratio: reserve.token.fromBaseUnit(BaseUnitNumber(ratio)),
    baseAssetOracle: CheckedAddress(baseAssetOracle),
  }
}
