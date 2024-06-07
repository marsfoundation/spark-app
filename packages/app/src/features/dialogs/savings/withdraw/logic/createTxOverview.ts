import { SwapInfo } from '@/domain/exchanges/types'
import { MarketInfo } from '@/domain/market-info/marketInfo'
import { SavingsInfo } from '@/domain/savings-info/types'
import { NormalizedUnitNumber, Percentage } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'
import { WalletInfo } from '@/domain/wallet/useWalletInfo'
import { DialogFormNormalizedData } from '@/features/dialogs/common/logic/form'
import { RouteItem } from '../../common/components/MakerTransactionOverview'

export interface SavingsDialogTxOverviewMaker {
  type: 'maker'
  APY: Percentage
  daiEarnRate: NormalizedUnitNumber
  route: RouteItem[]
  makerBadgeToken: Token
  tokenWithdrew: NormalizedUnitNumber
}
export interface SavingsDialogTxOverviewLiFi {
  type: 'lifi'
  exchangeRatioFromToken: Token
  exchangeRatioToToken: Token
  exchangeRatio: NormalizedUnitNumber
  sDaiToken: Token
  sDaiBalanceBefore: NormalizedUnitNumber
  sDaiBalanceAfter: NormalizedUnitNumber
  APY: Percentage
  tokenWithdrew: NormalizedUnitNumber
}
export type SavingsDialogTxOverview = SavingsDialogTxOverviewMaker | SavingsDialogTxOverviewLiFi

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
}: CreateTxOverviewParams): SavingsDialogTxOverviewLiFi | undefined {
  const otherToken = formValues.token
  const sDAI = marketInfo.sDAI
  const DAI = marketInfo.DAI
  const sDaiBalanceBefore = walletInfo.findWalletBalanceForToken(sDAI)

  if (!swapInfo.data) {
    return undefined
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
    exchangeRatioFromToken: DAI,
    exchangeRatioToToken: formValues.token,
    sDaiToken: sDAI,
    exchangeRatio: daiToTokenRatio,
    sDaiBalanceBefore: sDaiBalanceBefore,
    sDaiBalanceAfter,
    APY: savingsInfo.apy,
    tokenWithdrew: otherTokenAmount,
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
  const daiEarnRate = NormalizedUnitNumber(daiValue.multipliedBy(savingsInfo.apy))
  const route: RouteItem[] = [
    {
      token: marketInfo.sDAI,
      value: sDAIValue,
    },
    {
      token: marketInfo.DAI,
      value: daiValue,
    },
  ]

  return {
    type: 'maker',
    APY: savingsInfo.apy,
    daiEarnRate,
    route,
    makerBadgeToken: marketInfo.DAI,
    tokenWithdrew: daiValue,
  }
}
