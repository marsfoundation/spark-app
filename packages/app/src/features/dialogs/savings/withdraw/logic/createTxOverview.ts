import { SwapInfo } from '@/domain/exchanges/types'
import { MarketInfo } from '@/domain/market-info/marketInfo'
import { SavingsInfo } from '@/domain/savings-info/types'
import { NormalizedUnitNumber, Percentage } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'
import { WalletInfo } from '@/domain/wallet/useWalletInfo'
import { DialogFormNormalizedData } from '@/features/dialogs/common/logic/form'

interface createTxOverviewParams {
  formValues: DialogFormNormalizedData
  marketInfo: MarketInfo
  walletInfo: WalletInfo
  savingsInfo: SavingsInfo
  swapInfo: SwapInfo
  useNativeRoutes: boolean
}

export interface SavingsDialogTxOverview {
  exchangeRatioFromToken: Token
  exchangeRatioToToken: Token
  exchangeRatio: NormalizedUnitNumber
  sDaiToken: Token
  sDaiBalanceBefore: NormalizedUnitNumber
  sDaiBalanceAfter: NormalizedUnitNumber
  APY: Percentage
  tokenWithdrew: NormalizedUnitNumber
}

export function createTxOverview({
  marketInfo,
  formValues,
  savingsInfo,
  walletInfo,
  swapInfo,
  useNativeRoutes,
}: createTxOverviewParams): SavingsDialogTxOverview | undefined {
  const otherToken = formValues.token
  const sDAI = marketInfo.sDAI
  const DAI = marketInfo.DAI
  const sDaiBalanceBefore = walletInfo.findWalletBalanceForToken(sDAI)

  if (useNativeRoutes) {
    const sDaiAmount = NormalizedUnitNumber(formValues.value.div(sDAI.unitPriceUsd))

    const sDaiBalanceAfter = NormalizedUnitNumber(sDaiBalanceBefore.minus(sDaiAmount))

    return {
      exchangeRatioFromToken: DAI,
      exchangeRatioToToken: DAI,
      exchangeRatio: NormalizedUnitNumber(1),
      sDaiToken: sDAI,
      sDaiBalanceBefore,
      sDaiBalanceAfter,
      APY: savingsInfo.apy,
      tokenWithdrew: formValues.value,
    }
  }

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
