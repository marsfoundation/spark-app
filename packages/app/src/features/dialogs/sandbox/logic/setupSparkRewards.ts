import { spark2ApiUrl } from '@/config/consts'
import { setSparkRewards } from '@/domain/spark-rewards/setSparkRewards'
import { TOKENS_ON_FORK } from '@/test/e2e/constants'
import { CheckedAddress, NormalizedUnitNumber, raise } from '@marsfoundation/common-universal'
import { http, HttpResponse } from 'msw'
import { setupWorker } from 'msw/browser'
import { getTenderlyClient } from 'node_modules/@marsfoundation/common-testnets/src/nodes/tenderly/TenderlyClient'
import { mainnet } from 'viem/chains'

export interface SetupSparkRewardsParams {
  forkUrl: string
  account: CheckedAddress
}

const REWARDS_CONFIG: {
  rewardTokenSymbol: keyof (typeof TOKENS_ON_FORK)[typeof mainnet.id]
  cumulativeAmount: NormalizedUnitNumber
  rewardTokenPrice?: NormalizedUnitNumber
}[] = [
  { rewardTokenSymbol: 'USDC', cumulativeAmount: NormalizedUnitNumber(152), rewardTokenPrice: NormalizedUnitNumber(1) },
  {
    rewardTokenSymbol: 'wstETH',
    cumulativeAmount: NormalizedUnitNumber(0.0178),
    rewardTokenPrice: NormalizedUnitNumber(2893.09),
  },
]

export async function setupSparkRewards({ forkUrl, account }: SetupSparkRewardsParams): Promise<void> {
  const testnetClient = getTenderlyClient(forkUrl, mainnet, mainnet.id)

  const rewards = REWARDS_CONFIG.map(({ rewardTokenSymbol, rewardTokenPrice, cumulativeAmount }) => {
    const tokenConfig = TOKENS_ON_FORK[mainnet.id][rewardTokenSymbol]

    return {
      tokenSymbol: rewardTokenSymbol,
      tokenAddress: CheckedAddress(tokenConfig.address),
      cumulativeAmount,
      cumulativeAmountBaseUnit: NormalizedUnitNumber.toBaseUnit(cumulativeAmount, tokenConfig.decimals),
      rewardTokenPrice,
    }
  })

  const { merkleRoot, proofs } = await setSparkRewards({
    testnetClient,
    account,
    rewards: rewards.map(({ tokenAddress, cumulativeAmountBaseUnit }) => ({
      token: tokenAddress,
      cumulativeAmount: cumulativeAmountBaseUnit,
    })),
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
  )
  await worker.start({
    onUnhandledRequest: 'bypass',
  })
}
