import { SwapInfo, SwapParams } from '@/domain/exchanges/types'
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
}
export type SavingsDialogTxOverview = SavingsDialogTxOverviewMaker | SavingsDialogTxOverviewLiFi

export interface CreateTxOverviewParams {
  marketInfo: MarketInfo
  savingsInfo: SavingsInfo
  swapInfo: SwapInfo
  swapParams: SwapParams
  walletInfo: WalletInfo
}
export function createTxOverview({
  marketInfo,
  walletInfo,
  savingsInfo,
  swapInfo,
  swapParams,
}: CreateTxOverviewParams): SavingsDialogTxOverview | undefined {
  const sDAI = marketInfo.sDAI
  const DAI = marketInfo.DAI

  if (!swapInfo.data) {
    return undefined
  }

  const sDaiAmountBaseUnit = swapInfo.data.estimate.toAmount
  const sDaiAmount = sDAI.fromBaseUnit(sDaiAmountBaseUnit)
  const otherTokenAmountBaseUnit = swapInfo.data.estimate.fromAmount
  const otherTokenAmount = swapParams.fromToken.fromBaseUnit(otherTokenAmountBaseUnit)

  const daiAmountNormalized = savingsInfo.convertSharesToDai({
    shares: sDaiAmount,
  })
  const tokenToDaiRatio = NormalizedUnitNumber(daiAmountNormalized.dividedBy(otherTokenAmount))

  const sDaiBalanceBefore = walletInfo.findWalletBalanceForToken(sDAI)
  const sDaiBalanceAfter = NormalizedUnitNumber(sDaiBalanceBefore.plus(sDaiAmount))

  return {
    type: 'lifi',
    exchangeRatioFromToken: swapParams.fromToken,
    exchangeRatioToToken: DAI,
    sDaiToken: sDAI,
    exchangeRatio: tokenToDaiRatio,
    sDaiBalanceBefore,
    sDaiBalanceAfter,
    APY: savingsInfo.apy,
  }
}

export interface CreateMakerTxOverviewParams {
  formValues: DialogFormNormalizedData
  marketInfo: MarketInfo
  savingsInfo: SavingsInfo
}
export function createMakerTxOverview({
  formValues,
  marketInfo,
  savingsInfo,
}: CreateMakerTxOverviewParams): SavingsDialogTxOverviewMaker {
  const daiValue = formValues.value
  const sDAIValue = savingsInfo.convertDaiToShares({ dai: daiValue })
  const daiEarnRate = NormalizedUnitNumber(daiValue.multipliedBy(savingsInfo.apy))
  const route: RouteItem[] = [
    {
      token: marketInfo.DAI,
      value: daiValue,
      usdValue: daiValue,
    },
    {
      token: marketInfo.sDAI,
      value: sDAIValue,
      usdValue: savingsInfo.convertSharesToDai({ shares: sDAIValue }),
    },
  ]

  return {
    type: 'maker',
    APY: savingsInfo.apy,
    daiEarnRate,
    route,
    makerBadgeToken: marketInfo.DAI,
  }
}
