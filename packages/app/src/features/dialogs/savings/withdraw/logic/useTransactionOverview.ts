import { SwapInfo } from '@/domain/exchanges/types'
import { MarketInfo } from '@/domain/market-info/marketInfo'
import { SavingsInfo } from '@/domain/savings-info/types'
import { NormalizedUnitNumber, Percentage } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'
import { WalletInfo } from '@/domain/wallet/useWalletInfo'
import { DialogFormNormalizedData } from '@/features/dialogs/common/logic/form'

interface UseTxOverviewParams {
  formValues: DialogFormNormalizedData
  marketInfo: MarketInfo
  walletInfo: WalletInfo
  savingsInfo: SavingsInfo
  swapInfo: SwapInfo
}

export interface SavingsDialogTxOverview {
  exchangeRatioFromToken: Token
  exchangeRatioToToken: Token
  exchangeRatio: NormalizedUnitNumber
  sDaiToken: Token
  sDaiBalanceBefore: NormalizedUnitNumber
  sDaiBalanceAfter: NormalizedUnitNumber
  DSR: Percentage
  tokenWithdrew: NormalizedUnitNumber
}

export function useTxOverview({
  marketInfo,
  formValues,
  savingsInfo,
  walletInfo,
  swapInfo,
}: UseTxOverviewParams): SavingsDialogTxOverview | undefined {
  const otherToken = formValues.token
  const sDAI = marketInfo.sDAI
  const DAI = marketInfo.DAI
  const sDaiBalance = walletInfo.findWalletBalanceForToken(sDAI)

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

  const sDaiBalanceAfter = NormalizedUnitNumber(sDaiBalance.minus(sDaiAmount))

  return {
    exchangeRatioFromToken: DAI,
    exchangeRatioToToken: formValues.token,
    sDaiToken: sDAI,
    exchangeRatio: daiToTokenRatio,
    sDaiBalanceBefore: sDaiBalance,
    sDaiBalanceAfter,
    DSR: savingsInfo.apy,
    tokenWithdrew: otherTokenAmount,
  }
}
