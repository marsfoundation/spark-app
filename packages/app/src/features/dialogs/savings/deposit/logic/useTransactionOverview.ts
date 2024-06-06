import { SwapInfo, SwapParams } from '@/domain/exchanges/types'
import { MarketInfo } from '@/domain/market-info/marketInfo'
import { SavingsInfo } from '@/domain/savings-info/types'
import { NormalizedUnitNumber, Percentage } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'
import { WalletInfo } from '@/domain/wallet/useWalletInfo'
import { DialogFormNormalizedData } from '@/features/dialogs/common/logic/form'
import { mainnet } from 'viem/chains'

interface UseTxOverviewParams {
  formValues: DialogFormNormalizedData
  marketInfo: MarketInfo
  savingsInfo: SavingsInfo
  swapInfo: SwapInfo
  swapParams: SwapParams
  walletInfo: WalletInfo
}

export interface SavingsDialogTxOverview {
  exchangeRatioFromToken: Token
  exchangeRatioToToken: Token
  exchangeRatio: NormalizedUnitNumber
  sDaiToken: Token
  sDaiBalanceBefore: NormalizedUnitNumber
  sDaiBalanceAfter: NormalizedUnitNumber
  APY: Percentage
}

export function useTxOverview({
  formValues,
  marketInfo,
  walletInfo,
  savingsInfo,
  swapInfo,
  swapParams,
}: UseTxOverviewParams): SavingsDialogTxOverview | undefined {
  const sDAI = marketInfo.sDAI
  const DAI = marketInfo.DAI

  if (marketInfo.chainId === mainnet.id && formValues.token.address === DAI.address) {
    const sDaiAmount = NormalizedUnitNumber(formValues.value.div(sDAI.unitPriceUsd))

    const sDaiBalanceBefore = walletInfo.findWalletBalanceForToken(sDAI)
    const sDaiBalanceAfter = NormalizedUnitNumber(sDaiBalanceBefore.plus(sDaiAmount))

    return {
      exchangeRatioFromToken: DAI,
      exchangeRatioToToken: DAI,
      exchangeRatio: NormalizedUnitNumber(1),
      sDaiToken: sDAI,
      sDaiBalanceBefore,
      sDaiBalanceAfter,
      APY: savingsInfo.apy,
    }
  }

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
    exchangeRatioFromToken: swapParams.fromToken,
    exchangeRatioToToken: DAI,
    sDaiToken: sDAI,
    exchangeRatio: tokenToDaiRatio,
    sDaiBalanceBefore,
    sDaiBalanceAfter,
    APY: savingsInfo.apy,
  }
}
