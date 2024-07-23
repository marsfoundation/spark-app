import { MarketInfo } from '@/domain/market-info/marketInfo'
import { SavingsInfo } from '@/domain/savings-info/types'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { WalletInfo } from '@/domain/wallet/useWalletInfo'
import { DialogFormNormalizedData } from '@/features/dialogs/common/logic/form'
import { RouteItem, SavingsDialogTxOverview } from '../../common/types'

export interface CreateTxOverviewParams {
  formValues: DialogFormNormalizedData
  marketInfo: MarketInfo
  savingsInfo: SavingsInfo
  walletInfo: WalletInfo
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
      const daiValue = savingsInfo.convertSharesToDai({ shares: sDAIValue })

      return [daiValue, sDAIValue]
    }

    const daiValue = formValues.value
    const sDAIValue = savingsInfo.convertDaiToShares({ dai: daiValue })
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
      usdValue: savingsInfo.convertSharesToDai({ shares: sDAIValue }),
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
    dai: marketInfo.DAI,
    status: 'success',
    APY: savingsInfo.apy,
    daiEarnRate,
    route,
    makerBadgeToken: formValues.token,
    outTokenAmount: daiValue,
  }
}
