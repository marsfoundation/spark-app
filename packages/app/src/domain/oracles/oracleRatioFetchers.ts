import { rEthRatioAbi, weEthRatioAbi, wstEthOracleAbi, wstEthRatioAbi } from '@/config/abis/yieldingTokensRatioAbi'
import { toBigInt } from '@/utils/bigNumber'
import { mainnet } from 'viem/chains'
import { Config } from 'wagmi'
import { readContract } from 'wagmi/actions'
import { Reserve } from '../market-info/marketInfo'
import { BaseUnitNumber, NormalizedUnitNumber } from '../types/NumericValues'

export interface OracleRatioFetcherParams {
  reserve: Reserve
  wagmiConfig: Config
}

export async function fetchWstEthRatioMainnet({
  reserve,
  wagmiConfig,
}: OracleRatioFetcherParams): Promise<NormalizedUnitNumber> {
  const stethAddress = await readContract(wagmiConfig, {
    abi: wstEthOracleAbi,
    address: reserve.priceOracle,
    functionName: 'steth',
    args: [],
    chainId: mainnet.id,
  })

  const ratio = await readContract(wagmiConfig, {
    abi: wstEthRatioAbi,
    address: stethAddress,
    functionName: 'getPooledEthByShares',
    args: [toBigInt(10 ** reserve.token.decimals)],
    chainId: mainnet.id,
  })

  return reserve.token.fromBaseUnit(BaseUnitNumber(ratio))
}

export async function fetchREthRatio({
  reserve,
  wagmiConfig,
}: OracleRatioFetcherParams): Promise<NormalizedUnitNumber> {
  const ratio = await readContract(wagmiConfig, {
    abi: rEthRatioAbi,
    address: reserve.token.address,
    functionName: 'getExchangeRate',
    args: [],
    chainId: mainnet.id,
  })

  return reserve.token.fromBaseUnit(BaseUnitNumber(ratio))
}

export async function fetchWeEthRatio({
  reserve,
  wagmiConfig,
}: OracleRatioFetcherParams): Promise<NormalizedUnitNumber> {
  const ratio = await readContract(wagmiConfig, {
    abi: weEthRatioAbi,
    address: reserve.token.address,
    functionName: 'getRate',
    args: [],
    chainId: mainnet.id,
  })

  return reserve.token.fromBaseUnit(BaseUnitNumber(ratio))
}
