import { Farm } from '@/domain/farms/types'
import { NormalizedUnitNumber, Percentage } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'
import { TokenWithBalanceFormNormalizedData } from '@/features/dialogs/common/logic/asset-balance/form'
import { TxOverviewRouteItem } from '@/features/dialogs/common/types'

const SECONDS_PER_YEAR = 60 * 60 * 24 * 365

export interface CreateTxOverviewParams {
  formValues: TokenWithBalanceFormNormalizedData
  farm: Farm
}

export type TxOverview =
  | { status: 'no-overview' }
  | {
      status: 'success'
      apy: Percentage
      stakingToken: Token
      rewardToken: Token
      rewardsPerYear: NormalizedUnitNumber
      routeToStakingToken: TxOverviewRouteItem[]
    }

export function createTxOverview({ formValues, farm }: CreateTxOverviewParams): TxOverview {
  const value = formValues.value
  if (value.eq(0)) {
    return { status: 'no-overview' }
  }

  const routeToStakingToken: TxOverviewRouteItem[] = createRouteToStakingToken({
    formValues,
    stakingToken: farm.stakingToken,
  })

  const stakedAmountUsd = formValues.token.toUSD(formValues.value)
  const rewardsPerYear = NormalizedUnitNumber(
    stakedAmountUsd
      .multipliedBy(farm.rewardRate)
      .dividedBy(farm.totalSupply.plus(formValues.value))
      .multipliedBy(SECONDS_PER_YEAR),
  )
  const rewardsPerYearUsd = farm.rewardToken.toUSD(rewardsPerYear)
  const apy = Percentage(rewardsPerYearUsd.dividedBy(stakedAmountUsd), true)

  return {
    status: 'success',
    apy,
    stakingToken: farm.stakingToken,
    rewardToken: farm.rewardToken,
    rewardsPerYear,
    routeToStakingToken,
  }
}

export interface CreateRouteToStakingTokenParams {
  formValues: TokenWithBalanceFormNormalizedData
  stakingToken: Token
}
function createRouteToStakingToken({
  formValues,
  stakingToken,
}: CreateRouteToStakingTokenParams): TxOverviewRouteItem[] {
  const entryTokenUsdValue = formValues.token.toUSD(formValues.value)
  const stakingTokenAmount = NormalizedUnitNumber(entryTokenUsdValue.dividedBy(stakingToken.unitPriceUsd))
  return [
    ...(stakingToken.symbol !== formValues.token.symbol
      ? [
          {
            token: formValues.token,
            usdValue: entryTokenUsdValue,
            value: formValues.value,
          },
        ]
      : []),
    {
      token: stakingToken,
      usdValue: entryTokenUsdValue,
      value: stakingTokenAmount,
    },
  ]
}
