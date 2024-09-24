import { Farm } from '@/domain/farms/types'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'
import { TransferFromUserFormNormalizedData } from '@/features/dialogs/common/logic/transfer-from-user/form'
import { TxOverviewRouteItem } from '@/features/dialogs/common/types'

export interface CreateTxOverviewParams {
  formValues: TransferFromUserFormNormalizedData
  farm: Farm
}

export type TxOverview =
  | { status: 'no-overview' }
  | {
      status: 'success'
      stakingToken: Token
      rewardToken: Token
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

  return {
    status: 'success',
    stakingToken: farm.stakingToken,
    rewardToken: farm.rewardToken,
    routeToStakingToken,
  }
}

export interface CreateRouteToStakingTokenParams {
  formValues: TransferFromUserFormNormalizedData
  stakingToken: Token
}
function createRouteToStakingToken({
  formValues,
  stakingToken,
}: CreateRouteToStakingTokenParams): TxOverviewRouteItem[] {
  const entryTokenUsdValue = formValues.token.toUSD(formValues.value)
  const stakingTokenAmount = NormalizedUnitNumber(entryTokenUsdValue.dividedBy(stakingToken.unitPriceUsd))

  return [
    {
      token: stakingToken,
      usdValue: entryTokenUsdValue,
      value: stakingTokenAmount,
    },
    ...(stakingToken.symbol !== formValues.token.symbol
      ? [
          {
            token: formValues.token,
            usdValue: entryTokenUsdValue,
            value: formValues.value,
          },
        ]
      : []),
  ]
}
