import { Farm } from '@/domain/farms/types'
import { NormalizedUnitNumber, Percentage } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'
import { TokensInfo } from '@/domain/wallet/useTokens/TokenInfo'
import { TokenWithBalanceFormNormalizedData } from '@/features/dialogs/common/logic/asset-balance/form'
import { TxOverviewRouteItem } from '@/features/dialogs/common/types'

export interface CreateTxOverviewParams {
  formValues: TokenWithBalanceFormNormalizedData
  tokensInfo: TokensInfo
  farm: Farm
}

export type TxOverview =
  | { status: 'no-overview' }
  | {
      status: 'success'
      apy: Percentage
      rewardsToken: Token
      rewardsRate: NormalizedUnitNumber
      routeToStakingToken: TxOverviewRouteItem[]
    }

export function createTxOverview({ formValues, tokensInfo, farm }: CreateTxOverviewParams): TxOverview {
  const value = formValues.value
  if (value.eq(0)) {
    return { status: 'no-overview' }
  }

  const stakingToken = tokensInfo.findOneTokenBySymbol(farm.stakingToken.symbol)

  const routeToStakingToken: TxOverviewRouteItem[] = createRouteToStakingToken({
    formValues,
    stakingToken,
  })

  return {
    status: 'success',
    apy: farm.apy,
    rewardsToken: farm.rewardToken,
    rewardsRate: farm.rewardRate,
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
