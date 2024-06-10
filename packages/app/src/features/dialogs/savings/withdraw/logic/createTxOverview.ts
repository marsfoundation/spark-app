import { SwapInfo } from '@/domain/exchanges/types'
import { MarketInfo } from '@/domain/market-info/marketInfo'
import { SavingsInfo } from '@/domain/savings-info/types'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { WalletInfo } from '@/domain/wallet/useWalletInfo'
import { DialogFormNormalizedData } from '@/features/dialogs/common/logic/form'
import { SavingsDialogTxOverview } from '../../common/types'

interface createTxOverviewParams {
  formValues: DialogFormNormalizedData
  marketInfo: MarketInfo
  walletInfo: WalletInfo
  savingsInfo: SavingsInfo
  swapInfo: SwapInfo
  useNativeRoutes: boolean
}

export function createTxOverview({
  marketInfo,
  formValues,
  savingsInfo,
  walletInfo,
  swapInfo,
  useNativeRoutes,
}: createTxOverviewParams): SavingsDialogTxOverview {
  const sDAI = marketInfo.sDAI
  const DAI = marketInfo.DAI
  const sDaiBalanceBefore = walletInfo.findWalletBalanceForToken(sDAI)

  if (useNativeRoutes) {
    const sDaiAmount = NormalizedUnitNumber(formValues.value.div(sDAI.unitPriceUsd))

    const sDaiBalanceAfter = NormalizedUnitNumber(sDaiBalanceBefore.minus(sDaiAmount))

    return {
      status: 'success',
      showExchangeRate: false,
      exchangeRatioFromToken: DAI,
      exchangeRatioToToken: DAI,
      exchangeRatio: NormalizedUnitNumber(1),
      sDaiToken: sDAI,
      sDaiBalanceBefore,
      sDaiBalanceAfter,
      APY: savingsInfo.apy,
      outTokenAmount: formValues.value,
    }
  }

  const showExchangeRate = formValues.token.symbol !== marketInfo.DAI.symbol

  if (!swapInfo.isSuccess) {
    return swapInfo.isLoading ? { showExchangeRate, status: 'loading' } : { showExchangeRate, status: 'no-overview' }
  }

  const otherToken = formValues.token
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
