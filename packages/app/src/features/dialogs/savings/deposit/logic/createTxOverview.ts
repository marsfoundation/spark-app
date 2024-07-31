import { SavingsInfo } from '@/domain/savings-info/types'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { TokensInfo } from '@/domain/wallet/useTokens/TokenInfo'
import { raise } from '@/utils/assert'
import { SavingsDialogFormNormalizedData } from '../../common/logic/form'
import { RouteItem, SavingsDialogTxOverview } from '../../common/types'

export interface CreateTxOverviewParams {
  formValues: SavingsDialogFormNormalizedData
  tokensInfo: TokensInfo
  savingsInfo: SavingsInfo
}
export function createTxOverview({
  formValues,
  tokensInfo,
  savingsInfo,
}: CreateTxOverviewParams): SavingsDialogTxOverview {
  // the value is normalized, so assuming 1 to 1 conversion rate for USDC
  // value denominated in DAI equals to value denominated in USDC
  const value = formValues.value
  if (formValues.token.symbol === tokensInfo.NST?.symbol) {}


  const dai = tokensInfo.DAI ?? raise('DAI token not found')
  const isDaiDeposit = formValues.token.address === dai.address
  if (value.eq(0)) {
    return { status: 'no-overview' }
  }

  const sDAIValue = savingsInfo.convertToShares({ assets: value })
  const daiEarnRate = NormalizedUnitNumber(value.multipliedBy(savingsInfo.apy))
  const route: RouteItem[] = [
    ...(!isDaiDeposit
      ? [
          {
            token: formValues.token,
            value: value,
            usdValue: value,
          },
        ]
      : []),
    {
      token: dai,
      value: value,
      usdValue: value,
    },
    {
      token: dai,
      value: sDAIValue,
      usdValue: savingsInfo.convertToAssets({ shares: sDAIValue }),
    },
  ]

  return {
    dai,
    status: 'success',
    APY: savingsInfo.apy,
    daiEarnRate,
    route,
    makerBadgeToken: formValues.token,
    outTokenAmount: sDAIValue,
  }
}
