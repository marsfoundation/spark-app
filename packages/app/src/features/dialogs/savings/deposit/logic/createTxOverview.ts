import { SwapInfo, SwapParams } from '@/domain/exchanges/types'
import { MarketInfo } from '@/domain/market-info/marketInfo'
import { SavingsInfo } from '@/domain/savings-info/types'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { WalletInfo } from '@/domain/wallet/useWalletInfo'
import { DialogFormNormalizedData } from '@/features/dialogs/common/logic/form'
import { SavingsDialogTxOverview } from '../../common/types'

interface UseTxOverviewParams {
  formValues: DialogFormNormalizedData
  marketInfo: MarketInfo
  savingsInfo: SavingsInfo
  swapInfo: SwapInfo
  swapParams: SwapParams
  walletInfo: WalletInfo
  useNativeRoutes: boolean
}

export function createTxOverview({
  formValues,
  marketInfo,
  walletInfo,
  savingsInfo,
  swapInfo,
  swapParams,
  useNativeRoutes,
}: UseTxOverviewParams): SavingsDialogTxOverview {
  const sDAI = marketInfo.sDAI
  const DAI = marketInfo.DAI

  if (useNativeRoutes) {
    const sDaiAmount = NormalizedUnitNumber(formValues.value.div(sDAI.unitPriceUsd))
    const sDaiBalanceBefore = walletInfo.findWalletBalanceForToken(sDAI)
    const sDaiBalanceAfter = NormalizedUnitNumber(sDaiBalanceBefore.plus(sDaiAmount))

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
      outTokenAmount: sDaiAmount,
    }
  }

  const showExchangeRate = swapParams.fromToken.symbol !== marketInfo.DAI.symbol

  if (!swapInfo.isSuccess) {
    return swapInfo.isLoading ? { showExchangeRate, status: 'loading' } : { showExchangeRate, status: 'no-overview' }
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
    status: 'success',
    showExchangeRate,
    exchangeRatioFromToken: swapParams.fromToken,
    exchangeRatioToToken: DAI,
    sDaiToken: sDAI,
    exchangeRatio: tokenToDaiRatio,
    sDaiBalanceBefore,
    sDaiBalanceAfter,
    APY: savingsInfo.apy,
    outTokenAmount: otherTokenAmount,
  }
}
