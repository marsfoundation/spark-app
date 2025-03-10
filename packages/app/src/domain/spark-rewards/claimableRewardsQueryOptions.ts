import { spark2ApiUrl } from '@/config/consts'
import { sparkRewardsConfig } from '@/config/contracts-generated'
import { BaseUnitNumber, Hex, NormalizedUnitNumber } from '@marsfoundation/common-universal'
import { QueryKey, queryOptions, skipToken } from '@tanstack/react-query'
import { Address, erc20Abi } from 'viem'
import { mainnet } from 'viem/chains'
import { Config } from 'wagmi'
import { readContract } from 'wagmi/actions'
import { z } from 'zod'
import { checkedAddressSchema, hexSchema, normalizedUnitNumberSchema } from '../common/validation'
import { getContractAddress } from '../hooks/useContractAddress'
import { Token } from '../types/Token'
import { TokenSymbol } from '../types/TokenSymbol'

export interface ClaimableRewardsQueryOptionsParams {
  wagmiConfig: Config
  account?: Address
  countryCode: string | undefined
  isInSandbox: boolean
  sandboxChainId: number | undefined
}

const SPARK_REWARDS_CHAIN_IDS = [mainnet.id]

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function claimableRewardsQueryOptions({
  wagmiConfig,
  account,
  countryCode,
  isInSandbox,
  sandboxChainId,
}: ClaimableRewardsQueryOptionsParams) {
  // connectedChainId is used to fetch sandbox mock rewards. Unique is used to remove duplicate if connected to supported chain.
  const sparkRewardChainIds = isInSandbox
    ? [...SPARK_REWARDS_CHAIN_IDS, sandboxChainId].filter(Boolean)
    : SPARK_REWARDS_CHAIN_IDS

  return queryOptions({
    queryKey: claimableRewardsQueryKey({ account }),
    queryFn: !account
      ? skipToken
      : async () =>
          (
            await Promise.all(
              sparkRewardChainIds.map((chainId) => fetchChainRewards({ chainId, wagmiConfig, account, countryCode })),
            )
          ).flat(),
  })
}

export function claimableRewardsQueryKey({ account }: { account?: Address }): QueryKey {
  return ['claimable-spark-rewards', account]
}

interface ClaimableRewardData {
  merkleRoot: Hex
  epoch: number
  rewardToken: Token
  cumulativeAmount: NormalizedUnitNumber
  pendingAmount: NormalizedUnitNumber
  restrictedCountryCodes: string[]
  preClaimed: NormalizedUnitNumber
  merkleProof: Hex[]
  chainId: number
}

interface FetchChainRewardsParams {
  chainId: number
  wagmiConfig: Config
  account: Address
  countryCode: string | undefined
}

async function fetchChainRewards({
  chainId,
  wagmiConfig,
  account,
  countryCode,
}: FetchChainRewardsParams): Promise<ClaimableRewardData[]> {
  const sparkRewardsAddress = getContractAddress(sparkRewardsConfig.address, chainId)
  const expectedMerkleRoot = await readContract(wagmiConfig, {
    address: sparkRewardsAddress,
    abi: sparkRewardsConfig.abi,
    functionName: 'merkleRoot',
    chainId,
  })

  // @todo: Add chainId parameter to the API call
  const res = await fetch(`${spark2ApiUrl}/rewards/roots/${expectedMerkleRoot}/${account}/`)
  if (!res.ok) {
    throw new Error('Failed to fetch rewards')
  }

  const unfilteredClaimData = claimableRewardsResponseSchema.parse(await res.json())
  const claimData = unfilteredClaimData.filter((claim) =>
    claim.restricted_country_codes.every((code) => code !== countryCode),
  )

  return Promise.all(
    claimData.map(async (claim) => {
      const { token_address, epoch } = claim

      const [symbol, name, decimals, preClaimed] = await Promise.all([
        readContract(wagmiConfig, {
          address: token_address,
          abi: erc20Abi,
          functionName: 'symbol',
          chainId,
        }),
        readContract(wagmiConfig, {
          address: token_address,
          abi: erc20Abi,
          functionName: 'name',
          chainId,
        }),
        readContract(wagmiConfig, {
          address: token_address,
          abi: erc20Abi,
          functionName: 'decimals',
          chainId,
        }),
        readContract(wagmiConfig, {
          address: sparkRewardsAddress,
          abi: sparkRewardsConfig.abi,
          functionName: 'cumulativeClaimed',
          args: [account, token_address, BigInt(epoch)],
          chainId,
        }),
      ])

      const rewardToken = new Token({
        address: claim.token_address,
        symbol: TokenSymbol(symbol),
        name,
        decimals,
        unitPriceUsd: claim.token_price?.toFixed() ?? '0',
      })
      return {
        merkleRoot: claim.root_hash,
        epoch: claim.epoch,
        rewardToken,
        cumulativeAmount: claim.claimable_amount_normalized,
        pendingAmount: claim.pending_amount_normalized,
        restrictedCountryCodes: claim.restricted_country_codes,
        preClaimed: rewardToken.fromBaseUnit(BaseUnitNumber(preClaimed)),
        merkleProof: claim.proof,
        chainId,
      }
    }),
  )
}

const claimableRewardsResponseSchema = z.array(
  z.object({
    root_hash: hexSchema,
    epoch: z.number(),
    wallet_address: checkedAddressSchema,
    token_address: checkedAddressSchema,
    token_price: normalizedUnitNumberSchema.nullish(),
    pending_amount_normalized: normalizedUnitNumberSchema,
    claimable_amount_normalized: normalizedUnitNumberSchema,
    proof: z.array(hexSchema),
    restricted_country_codes: z.array(z.string()),
  }),
)
