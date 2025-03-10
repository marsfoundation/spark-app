import { spark2ApiUrl } from '@/config/consts'
import { sparkRewardsAbi, sparkRewardsAddress } from '@/config/contracts-generated'
import { setSparkRewards } from '@/domain/spark-rewards/setSparkRewards'
import { TOKENS_ON_FORK } from '@/test/e2e/constants'
import { randomHexId } from '@/utils/random'
import { BaseUnitNumber, CheckedAddress, Hex, NormalizedUnitNumber, raise } from '@marsfoundation/common-universal'
import { http, HttpResponse } from 'msw'
import { setupWorker } from 'msw/browser'
import { getTenderlyClient } from 'node_modules/@marsfoundation/common-testnets/src/nodes/tenderly/TenderlyClient'
import { mainnet } from 'viem/chains'
import { Config } from 'wagmi'
import { readContract } from 'wagmi/actions'

export interface SetupSparkRewardsParams {
  forkUrl: string
  account: CheckedAddress
  wagmiConfig: Config
}

type MockedRewardConfig = {
  rewardTokenSymbol: keyof (typeof TOKENS_ON_FORK)[typeof mainnet.id]
  cumulativeAmount: NormalizedUnitNumber
  rewardTokenPrice?: NormalizedUnitNumber
}

const REWARDS_CONFIG: MockedRewardConfig[] = [
  { rewardTokenSymbol: 'USDC', cumulativeAmount: NormalizedUnitNumber(152), rewardTokenPrice: NormalizedUnitNumber(1) },
  {
    rewardTokenSymbol: 'wstETH',
    cumulativeAmount: NormalizedUnitNumber(0.0178),
    rewardTokenPrice: NormalizedUnitNumber(2893.09),
  },
]

const MAINNET_REWARDS_CONFIG: MockedRewardConfig[] = [
  { rewardTokenSymbol: 'USDS', cumulativeAmount: NormalizedUnitNumber(83), rewardTokenPrice: NormalizedUnitNumber(1) },
]

const CAMPAIGNS_CONFIG = [
  {
    campaign_uid: randomHexId(),
    short_description: 'Supply WETH and get wstETH',
    long_description: 'Supply WETH and get wstETH',
    domain: 'sandbox',
    type: 'sparklend',
    apy: '0.012',
    reward_token_address: '0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0',
    deposit_token_addresses: ['0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'],
    borrow_token_addresses: [],
    restricted_country_codes: [],
  },
  {
    campaign_uid: randomHexId(),
    short_description: 'Borrow USDS and get USDC',
    long_description: 'Borrow USDS and get USDC',
    domain: 'sandbox',
    type: 'sparklend',
    apy: '0.008',
    reward_token_address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    deposit_token_addresses: [],
    borrow_token_addresses: ['0xdC035D45d973E3EC169d2276DDab16f1e407384F'],
    restricted_country_codes: [],
  },
  {
    campaign_uid: randomHexId(),
    short_description: 'Deposit USDS to Savings and get USDS',
    long_description: 'Deposit USDS to Savings and get USDS',
    domain: 'sandbox',
    type: 'savings',
    apy: '0.005',
    reward_token_address: '0xdc035d45d973e3ec169d2276ddab16f1e407384f',
    deposit_to_token_addresses: ['0xa3931d71877C0E7a3148CB7Eb4463524FEc27fbD'],
    restricted_country_codes: [],
  },
  {
    campaign_uid: randomHexId(),
    short_description: 'Follow us on X and get USDS',
    long_description: 'Follow us on X and get USDS',
    domain: 'mainnet',
    type: 'social',
    platform: 'x',
    link: 'https://x.com/sparkdotfi',
    reward_token_address: '0xdc035d45d973e3ec169d2276ddab16f1e407384f',
    restricted_country_codes: [],
  },
]

export async function setupSparkRewards({ forkUrl, account, wagmiConfig }: SetupSparkRewardsParams): Promise<void> {
  const testnetClient = getTenderlyClient(forkUrl, mainnet, mainnet.id)

  function prepareRewards(config: MockedRewardConfig[]): {
    tokenSymbol: string
    tokenAddress: CheckedAddress
    cumulativeAmount: NormalizedUnitNumber
    cumulativeAmountBaseUnit: BaseUnitNumber
    rewardTokenPrice?: NormalizedUnitNumber
  }[] {
    return config.map(({ rewardTokenSymbol, rewardTokenPrice, cumulativeAmount }) => {
      const tokenConfig = TOKENS_ON_FORK[mainnet.id][rewardTokenSymbol]

      return {
        tokenSymbol: rewardTokenSymbol,
        tokenAddress: CheckedAddress(tokenConfig.address),
        cumulativeAmount,
        cumulativeAmountBaseUnit: NormalizedUnitNumber.toBaseUnit(cumulativeAmount, tokenConfig.decimals),
        rewardTokenPrice,
      }
    })
  }
  const rewards = prepareRewards(REWARDS_CONFIG)
  const mainnetRewards = prepareRewards(MAINNET_REWARDS_CONFIG)

  const { merkleRoot, proofs } = await setSparkRewards({
    testnetClient,
    account,
    rewards: rewards.map(({ tokenAddress, cumulativeAmountBaseUnit }) => ({
      token: tokenAddress,
      cumulativeAmount: cumulativeAmountBaseUnit,
    })),
  })

  const mainnetMerkleRoot = await readContract(wagmiConfig, {
    address: sparkRewardsAddress[mainnet.id],
    abi: sparkRewardsAbi,
    functionName: 'merkleRoot',
    args: [],
    chainId: mainnet.id,
  })

  const worker = setupWorker(
    http.get(`${spark2ApiUrl}/rewards/roots/${merkleRoot}/${account}/`, async () => {
      return HttpResponse.json(
        rewards.map(({ tokenAddress, tokenSymbol, rewardTokenPrice, cumulativeAmount, cumulativeAmountBaseUnit }) => ({
          root_hash: merkleRoot,
          epoch: 1,
          wallet_address: account,
          token_address: tokenAddress,
          token_price: rewardTokenPrice?.toFixed() ?? null,
          pending_amount: '0',
          pending_amount_normalized: '0',
          cumulative_amount: cumulativeAmountBaseUnit.toFixed(),
          cumulative_amount_normalized: cumulativeAmount.toFixed(),
          proof:
            proofs.find(({ token }) => token === tokenAddress)?.proof ??
            raise(`Proof for token ${tokenSymbol} not found`),
          restricted_country_codes: [],
        })),
      )
    }),
    http.get(`${spark2ApiUrl}/rewards/roots/${mainnetMerkleRoot}/${account}/`, async () => {
      return HttpResponse.json(
        mainnetRewards.map(({ tokenAddress, rewardTokenPrice, cumulativeAmount, cumulativeAmountBaseUnit }) => ({
          root_hash: mainnetMerkleRoot,
          epoch: 1,
          wallet_address: account,
          token_address: tokenAddress,
          token_price: rewardTokenPrice?.toFixed() ?? null,
          pending_amount: '0',
          pending_amount_normalized: '0',
          cumulative_amount: cumulativeAmountBaseUnit.toFixed(),
          cumulative_amount_normalized: cumulativeAmount.toFixed(),
          proof: [Hex.random()],
          restricted_country_codes: [],
        })),
      )
    }),
    http.get(`${spark2ApiUrl}/rewards/campaigns/`, async () => {
      return HttpResponse.json(CAMPAIGNS_CONFIG)
    }),
  )
  await worker.start({
    onUnhandledRequest: 'bypass',
  })
}
