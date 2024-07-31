import { MarketInfo } from '@/domain/market-info/marketInfo'
import { SavingsInfo } from '@/domain/savings-info/types'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { MarketWalletInfo } from '@/domain/wallet/useMarketWalletInfo'
import { DialogFormNormalizedData } from '@/features/dialogs/common/logic/form'
import { RouteItem, SavingsDialogTxOverview } from '../../common/types'

export interface CreateTxOverviewParams {
  formValues: DialogFormNormalizedData
  marketInfo: MarketInfo
  walletInfo: MarketWalletInfo
  savingsInfo: SavingsInfo
}
export function createTxOverview({
  formValues,
  marketInfo,
  savingsInfo,
  walletInfo,
}: CreateTxOverviewParams): SavingsDialogTxOverview {
  const isDaiWithdraw = formValues.token.address === marketInfo.DAI.address

  const [daiValue, sDAIValue] = (() => {
    if (formValues.isMaxSelected) {
      const sDAIValue = walletInfo.findWalletBalanceForToken(marketInfo.sDAI)
      const daiValue = savingsInfo.convertToAssets({ shares: sDAIValue })

      return [daiValue, sDAIValue]
    }

    const daiValue = formValues.value
    const sDAIValue = savingsInfo.convertToShares({ assets: daiValue })
    return [daiValue, sDAIValue]
  })()

  if (daiValue.eq(0)) {
    return { status: 'no-overview' }
  }
  const daiEarnRate = NormalizedUnitNumber(daiValue.multipliedBy(savingsInfo.apy))
  const route: RouteItem[] = [
    {
      token: marketInfo.sDAI,
      value: sDAIValue,
      usdValue: savingsInfo.convertToAssets({ shares: sDAIValue }),
    },
    {
      token: marketInfo.DAI,
      value: daiValue,
      usdValue: daiValue,
    },
    ...(!isDaiWithdraw
      ? [
          {
            token: formValues.token,
            value: daiValue,
            usdValue: daiValue,
          },
        ]
      : []),
  ]

  return {
    baseStable: marketInfo.DAI,
    status: 'success',
    APY: savingsInfo.apy,
    stableEarnRate: daiEarnRate,
    route,
    makerBadgeToken: formValues.token,
    outTokenAmount: daiValue,
  }
}
