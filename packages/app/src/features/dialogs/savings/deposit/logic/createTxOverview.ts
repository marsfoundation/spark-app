import { MarketInfo } from '@/domain/market-info/marketInfo'
import { SavingsInfo } from '@/domain/savings-info/types'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { DialogFormNormalizedData } from '@/features/dialogs/common/logic/form'
import { RouteItem, SavingsDialogTxOverview } from '../../common/types'

export interface CreateTxOverviewParams {
  formValues: DialogFormNormalizedData
  marketInfo: MarketInfo
  savingsInfo: SavingsInfo
}
export function createTxOverview({
  formValues,
  marketInfo,
  savingsInfo,
}: CreateTxOverviewParams): SavingsDialogTxOverview {
  // the value is normalized, so assuming 1 to 1 conversion rate for USDC
  // value denominated in DAI equals to value denominated in USDC
  const daiValue = formValues.value
  const isDaiDeposit = formValues.token.address === marketInfo.DAI.address
  if (daiValue.eq(0)) {
    return { status: 'no-overview' }
  }

  const sDAIValue = savingsInfo.convertToShares({ assets: daiValue })
  const daiEarnRate = NormalizedUnitNumber(daiValue.multipliedBy(savingsInfo.apy))
  const route: RouteItem[] = [
    ...(!isDaiDeposit
      ? [
          {
            token: formValues.token,
            value: daiValue,
            usdValue: daiValue,
          },
        ]
      : []),
    {
      token: marketInfo.DAI,
      value: daiValue,
      usdValue: daiValue,
    },
    {
      token: marketInfo.sDAI,
      value: sDAIValue,
      usdValue: savingsInfo.convertToAssets({ shares: sDAIValue }),
    },
  ]

  return {
    dai: marketInfo.DAI,
    status: 'success',
    APY: savingsInfo.apy,
    daiEarnRate,
    route,
    makerBadgeToken: formValues.token,
    outTokenAmount: sDAIValue,
  }
}
