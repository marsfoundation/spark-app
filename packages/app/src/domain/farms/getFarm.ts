import { infoSkyApiUrl } from '@/config/consts'
import { usdsSkyRewardsConfig } from '@/config/contracts-generated'
import { FarmConfig } from '@/domain/farms/types'
import { CheckedAddress } from '@/domain/types/CheckedAddress'
import { BaseUnitNumber, NormalizedUnitNumber, Percentage } from '@/domain/types/NumericValues'
import { TokensInfo } from '@/domain/wallet/useTokens/TokenInfo'
import { Address } from 'viem'
import { Config } from 'wagmi'
import { readContract } from 'wagmi/actions'
import { z } from 'zod'
import { Farm } from './types'

export interface GetFarmParams {
  farmConfig: FarmConfig
  wagmiConfig: Config
  tokensInfo: TokensInfo
  chainId: number
  account: Address | undefined
}

export async function getFarm({ farmConfig, wagmiConfig, tokensInfo, chainId, account }: GetFarmParams): Promise<Farm> {
  const [contractData, baData] = await Promise.all([
    getFarmContractData({ farmConfig, wagmiConfig, chainId, account }),
    getBAFarmData({ farmConfig }),
  ])

  const rewardToken = tokensInfo
    .findOneTokenByAddress(CheckedAddress(contractData.rewardTokenAddress))
    .clone({ unitPriceUsd: baData.rewardTokenPriceUsd })
  const stakingToken = tokensInfo.findOneTokenByAddress(CheckedAddress(contractData.stakingTokenAddress))

  return {
    ...farmConfig,

    apy: baData.apy,
    rewardToken,
    stakingToken,
    rewardRate: NormalizedUnitNumber(rewardToken.fromBaseUnit(BaseUnitNumber(contractData.rewardRate))),
    periodFinish: Number(contractData.periodFinish),
    totalSupply: NormalizedUnitNumber(stakingToken.fromBaseUnit(BaseUnitNumber(contractData.totalSupply))),

    earned: NormalizedUnitNumber(rewardToken.fromBaseUnit(BaseUnitNumber(contractData.earned))),
    staked: NormalizedUnitNumber(stakingToken.fromBaseUnit(BaseUnitNumber(contractData.staked))),
    earnedTimestamp: Number(contractData.earnedTimestamp),

    depositors: baData.depositors,
  }
}

interface GetFarmContractDataParams {
  farmConfig: FarmConfig
  wagmiConfig: Config
  chainId: number
  account: Address | undefined
}

interface GetFarmContractDataResult {
  rewardTokenAddress: Address
  stakingTokenAddress: Address
  earned: bigint
  staked: bigint
  rewardRate: bigint
  earnedTimestamp: bigint
  periodFinish: bigint
  totalSupply: bigint
}

async function getFarmContractData({
  farmConfig,
  wagmiConfig,
  chainId,
  account,
}: GetFarmContractDataParams): Promise<GetFarmContractDataResult> {
  function getStaked(): Promise<bigint> {
    if (!account) {
      return Promise.resolve(0n)
    }

    const res = readContract(wagmiConfig, {
      address: farmConfig.address,
      abi: usdsSkyRewardsConfig.abi,
      functionName: 'balanceOf',
      args: [account],
      chainId,
    })

    return res
  }

  function getEarned(): Promise<bigint> {
    if (!account) {
      return Promise.resolve(0n)
    }

    const res = readContract(wagmiConfig, {
      address: farmConfig.address,
      abi: usdsSkyRewardsConfig.abi,
      functionName: 'earned',
      args: [account],
      chainId,
    })

    return res
  }

  const [
    staked,
    earned,
    rewardTokenAddress,
    stakingTokenAddress,
    rewardRate,
    earnedTimestamp,
    periodFinish,
    totalSupply,
  ] = await Promise.all([
    getStaked(),
    getEarned(),
    readContract(wagmiConfig, {
      address: farmConfig.address,
      abi: usdsSkyRewardsConfig.abi,
      functionName: 'rewardsToken',
      chainId,
    }),
    readContract(wagmiConfig, {
      address: farmConfig.address,
      abi: usdsSkyRewardsConfig.abi,
      functionName: 'stakingToken',
      chainId,
    }),
    readContract(wagmiConfig, {
      address: farmConfig.address,
      abi: usdsSkyRewardsConfig.abi,
      functionName: 'rewardRate',
      chainId,
    }),
    readContract(wagmiConfig, {
      address: farmConfig.address,
      abi: usdsSkyRewardsConfig.abi,
      functionName: 'lastTimeRewardApplicable',
      chainId,
    }),
    readContract(wagmiConfig, {
      address: farmConfig.address,
      abi: usdsSkyRewardsConfig.abi,
      functionName: 'periodFinish',
      chainId,
    }),
    readContract(wagmiConfig, {
      address: farmConfig.address,
      abi: usdsSkyRewardsConfig.abi,
      functionName: 'totalSupply',
      chainId,
    }),
  ])

  return {
    rewardTokenAddress,
    stakingTokenAddress,
    earned,
    staked,
    rewardRate,
    earnedTimestamp,
    periodFinish,
    totalSupply,
  }
}

interface GetFarmBADataParams {
  farmConfig: FarmConfig
}

interface GetFarmBADataResult {
  apy: Percentage
  depositors: number
  rewardTokenPriceUsd: NormalizedUnitNumber
}

async function getBAFarmData({ farmConfig }: GetFarmBADataParams): Promise<GetFarmBADataResult> {
  const res = await fetch(`${infoSkyApiUrl}/farms/${farmConfig.address.toLowerCase()}/`)
  if (!res.ok) {
    throw new Error(`Failed to fetch farm data: ${res.statusText}`)
  }

  return baFarmDataResponseSchema.parse(await res.json())
}

const baFarmDataResponseSchema = z
  .object({
    apy: z.string().transform((value) => Percentage(value, true)),
    depositors: z.number(),
    price: z.string().transform((value) => NormalizedUnitNumber(value)),
  })
  .transform(({ apy, depositors, price }) => ({
    apy,
    depositors,
    rewardTokenPriceUsd: NormalizedUnitNumber(price),
  }))
