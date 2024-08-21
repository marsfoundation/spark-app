import { stakingRewardsAbi } from '@/config/abis/stakingRewardsAbi'
import { mkrAtlasApiUrl } from '@/config/consts'
import { CheckedAddress } from '@/domain/types/CheckedAddress'
import { BaseUnitNumber, NormalizedUnitNumber, Percentage } from '@/domain/types/NumericValues'
import { TokensInfo } from '@/domain/wallet/useTokens/TokenInfo'
import { Address } from 'viem'
import { Config } from 'wagmi'
import { readContract } from 'wagmi/actions'
import { z } from 'zod'
import { FarmConfig, FarmInfo } from '../types'

export interface GetFarmInfoParams {
  farm: FarmConfig
  wagmiConfig: Config
  tokensInfo: TokensInfo
  account: Address | undefined
}

export async function getFarmInfo({ farm, wagmiConfig, tokensInfo, account }: GetFarmInfoParams): Promise<FarmInfo> {
  const [{ balance, rewardTokenAddress, stakingTokenAddress }, { apy }] = await Promise.all([
    getFarmContractData({ farm, wagmiConfig, account }),
    getBAFarmData({ farm }),
  ])

  const rewardToken = tokensInfo.findOneTokenByAddress(CheckedAddress(rewardTokenAddress))
  const stakingToken = tokensInfo.findOneTokenByAddress(CheckedAddress(stakingTokenAddress))

  return {
    apy,
    rewardToken,
    stakingToken,
    deposit: NormalizedUnitNumber(stakingToken.fromBaseUnit(BaseUnitNumber(balance))),
  }
}

interface GetFarmContractDataParams {
  farm: FarmConfig
  wagmiConfig: Config
  account: Address | undefined
}

interface GetFarmContractDataResult {
  balance: bigint
  rewardTokenAddress: Address
  stakingTokenAddress: Address
}

async function getFarmContractData({
  farm,
  wagmiConfig,
  account,
}: GetFarmContractDataParams): Promise<GetFarmContractDataResult> {
  function getBalance(): Promise<bigint> {
    if (!account) {
      return Promise.resolve(0n)
    }

    const res = readContract(wagmiConfig, {
      address: farm.address,
      abi: stakingRewardsAbi,
      functionName: 'balanceOf',
      args: [account],
    })

    return res
  }

  const [balance, rewardTokenAddress, stakingTokenAddress] = await Promise.all([
    getBalance(),
    readContract(wagmiConfig, {
      address: farm.address,
      abi: stakingRewardsAbi,
      functionName: 'rewardsToken',
    }),
    readContract(wagmiConfig, {
      address: farm.address,
      abi: stakingRewardsAbi,
      functionName: 'stakingToken',
    }),
  ])

  return { balance, rewardTokenAddress, stakingTokenAddress }
}

interface GetFarmBADataParams {
  farm: FarmConfig
}

interface GetFarmBADataResult {
  apy: Percentage
}

async function getBAFarmData({ farm }: GetFarmBADataParams): Promise<GetFarmBADataResult> {
  const res = await fetch(`${mkrAtlasApiUrl}/farms/${farm.address.toLowerCase()}/`)

  if (!res.ok) {
    throw new Error(`Failed to fetch farm data: ${res.statusText}`)
  }

  const data = await res.json()

  const dataSchema = z.object({
    apy: z.string().transform((value) => Percentage(value)),
  })

  return dataSchema.parse(data)
}
