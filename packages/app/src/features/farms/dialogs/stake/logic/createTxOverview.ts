import { Farm } from '@/domain/farms/types'
import { NormalizedUnitNumber, Percentage } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'
import { TokensInfo } from '@/domain/wallet/useTokens/TokenInfo'
import { TxOverviewRouteItem } from '@/features/dialogs/common/types'
import { SavingsDialogFormNormalizedData } from '@/features/dialogs/savings/common/logic/form'
import { raise } from '@/utils/assert'

export interface CreateTxOverviewParams {
  formValues: SavingsDialogFormNormalizedData
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
      routeToUsds: TxOverviewRouteItem[]
    }

export function createTxOverview({ formValues, tokensInfo, farm }: CreateTxOverviewParams): TxOverview {
  const value = formValues.value
  if (value.eq(0)) {
    return { status: 'no-overview' }
  }

  const route: TxOverviewRouteItem[] = createUsdsRoute({
    formValues,
    tokensInfo,
  })

  return {
    status: 'success',
    apy: farm.apy,
    rewardsToken: farm.rewardToken,
    rewardsRate: farm.rewardRate,
    routeToUsds: route,
  }
}

export interface CreateUsdsRouteParams {
  formValues: SavingsDialogFormNormalizedData
  tokensInfo: TokensInfo
}
function createUsdsRoute({ formValues, tokensInfo }: CreateUsdsRouteParams): TxOverviewRouteItem[] {
  const usds = tokensInfo.USDS ?? raise('USDS token is required for stake action tx overview')
  const usdValue = tokensInfo.findOneTokenBySymbol(formValues.token.symbol).unitPriceUsd
  return [
    ...(usds.symbol !== formValues.token.symbol
      ? [
          {
            token: formValues.token,
            usdValue,
            value: formValues.value,
          },
        ]
      : []),
    {
      token: usds,
      usdValue,
      value: usdValue,
    },
  ]
}
