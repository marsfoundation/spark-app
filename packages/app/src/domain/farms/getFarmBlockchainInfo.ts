import { stakingRewardsAbi } from '@/config/abis/stakingRewardsAbi'
import { FarmBlockchainInfo, FarmConfig } from '@/domain/farms/types'
import { CheckedAddress } from '@/domain/types/CheckedAddress'
import { BaseUnitNumber, NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { TokensInfo } from '@/domain/wallet/useTokens/TokenInfo'
import { Address } from 'viem'
import { Config } from 'wagmi'
import { readContract } from 'wagmi/actions'

export interface GetFarmParams {
  farmConfig: FarmConfig
  wagmiConfig: Config
  tokensInfo: TokensInfo
  chainId: number
  account: Address | undefined
}

export async function getFarmBlockchainInfo({
  farmConfig,
  wagmiConfig,
  tokensInfo,
  chainId,
  account,
}: GetFarmParams): Promise<FarmBlockchainInfo> {
  const contractData = await getFarmContractData({ farmConfig, wagmiConfig, chainId, account })

  const rewardTokenAddress = CheckedAddress(contractData.rewardTokenAddress)
  const rewardToken =
    farmConfig.rewardType === 'token' ? tokensInfo.findOneTokenByAddress(rewardTokenAddress) : farmConfig.rewardPoints
  const stakingToken = tokensInfo.findOneTokenByAddress(CheckedAddress(contractData.stakingTokenAddress))

  return {
    ...farmConfig,
    name: `${rewardToken.symbol} ${farmConfig.rewardType === 'points' ? 'points' : ''} Farm`,
    rewardTokenAddress,
    stakingToken,
    rewardRate: NormalizedUnitNumber(rewardToken.fromBaseUnit(BaseUnitNumber(contractData.rewardRate))),
    periodFinish: Number(contractData.periodFinish),
    totalSupply: NormalizedUnitNumber(stakingToken.fromBaseUnit(BaseUnitNumber(contractData.totalSupply))),
    earned: NormalizedUnitNumber(rewardToken.fromBaseUnit(BaseUnitNumber(contractData.earned))),
    staked: NormalizedUnitNumber(stakingToken.fromBaseUnit(BaseUnitNumber(contractData.staked))),
    earnedTimestamp: Number(contractData.earnedTimestamp),
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
      abi: stakingRewardsAbi,
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
      abi: stakingRewardsAbi,
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
      abi: stakingRewardsAbi,
      functionName: 'rewardsToken',
      chainId,
    }),
    readContract(wagmiConfig, {
      address: farmConfig.address,
      abi: stakingRewardsAbi,
      functionName: 'stakingToken',
      chainId,
    }),
    readContract(wagmiConfig, {
      address: farmConfig.address,
      abi: stakingRewardsAbi,
      functionName: 'rewardRate',
      chainId,
    }),
    readContract(wagmiConfig, {
      address: farmConfig.address,
      abi: stakingRewardsAbi,
      functionName: 'lastTimeRewardApplicable',
      chainId,
    }),
    readContract(wagmiConfig, {
      address: farmConfig.address,
      abi: stakingRewardsAbi,
      functionName: 'periodFinish',
      chainId,
    }),
    readContract(wagmiConfig, {
      address: farmConfig.address,
      abi: stakingRewardsAbi,
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
