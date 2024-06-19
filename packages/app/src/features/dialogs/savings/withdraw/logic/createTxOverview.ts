import { SwapInfo } from '@/domain/exchanges/types'
import { MarketInfo } from '@/domain/market-info/marketInfo'
import { SavingsInfo } from '@/domain/savings-info/types'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { WalletInfo } from '@/domain/wallet/useWalletInfo'
import { DialogFormNormalizedData } from '@/features/dialogs/common/logic/form'
import { RouteItem, SavingsDialogTxOverviewLiFi, SavingsDialogTxOverviewMaker } from '../../common/types'

export interface CreateTxOverviewParams {
  formValues: DialogFormNormalizedData
  marketInfo: MarketInfo
  walletInfo: WalletInfo
  savingsInfo: SavingsInfo
  swapInfo: SwapInfo
}

export function createTxOverview({
  marketInfo,
  formValues,
  savingsInfo,
  walletInfo,
  swapInfo,
}: CreateTxOverviewParams): SavingsDialogTxOverviewLiFi {
  const otherToken = formValues.token
  const sDAI = marketInfo.sDAI
  const DAI = marketInfo.DAI
  const sDaiBalanceBefore = walletInfo.findWalletBalanceForToken(sDAI)
  const showExchangeRate = formValues.token.symbol !== marketInfo.DAI.symbol

  if (!swapInfo.data) {
    return swapInfo.isLoading
      ? { type: 'lifi', showExchangeRate, status: 'loading' }
      : { type: 'lifi', showExchangeRate, status: 'no-overview' }
  }

  const sDaiAmountBaseUnit = swapInfo.data.estimate.fromAmount
  const sDaiAmount = sDAI.fromBaseUnit(sDaiAmountBaseUnit)
  const otherTokenAmountBaseUnit = swapInfo.data.estimate.toAmount
  const otherTokenAmount = otherToken.fromBaseUnit(otherTokenAmountBaseUnit)

  const daiAmountNormalized = savingsInfo.convertSharesToDai({
    shares: sDaiAmount,
  })
  const daiToTokenRatio = NormalizedUnitNumber(otherTokenAmount.dividedBy(daiAmountNormalized))

  const sDaiBalanceAfter = NormalizedUnitNumber(sDaiBalanceBefore.minus(sDaiAmount))

  return {
    type: 'lifi',
    status: 'success',
    showExchangeRate,
    exchangeRatioFromToken: DAI,
    exchangeRatioToToken: formValues.token,
    sDaiToken: sDAI,
    exchangeRatio: daiToTokenRatio,
    sDaiBalanceBefore: sDaiBalanceBefore,
    sDaiBalanceAfter,
    APY: savingsInfo.apy,
    outTokenAmount: otherTokenAmount,
  }
}

export interface CreateMakerTxOverviewParams {
  formValues: DialogFormNormalizedData
  marketInfo: MarketInfo
  savingsInfo: SavingsInfo
  walletInfo: WalletInfo
}
export function createMakerTxOverview({
  formValues,
  marketInfo,
  savingsInfo,
  walletInfo,
}: CreateMakerTxOverviewParams): SavingsDialogTxOverviewMaker {
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
    return { type: 'maker', status: 'no-overview' }
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
    type: 'maker',
    status: 'success',
    APY: savingsInfo.apy,
    daiEarnRate,
    route,
    makerBadgeToken: formValues.token,
    outTokenAmount: daiValue,
  }
}
