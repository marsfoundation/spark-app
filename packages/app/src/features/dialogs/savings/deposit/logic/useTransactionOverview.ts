import { SwapInfo, SwapParams } from '@/domain/exchanges/types'
import { MakerInfo } from '@/domain/maker-info/types'
import { MarketInfo } from '@/domain/market-info/marketInfo'
import { NormalizedUnitNumber, Percentage } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { WalletInfo } from '@/domain/wallet/useWalletInfo'
import { convertSharesToDai } from '@/features/savings/logic/projections'

interface UseTxOverviewParams {
  marketInfo: MarketInfo
  makerInfo: MakerInfo
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
  DSR: Percentage
}

export function useTxOverview({
  marketInfo,
  walletInfo,
  makerInfo,
  swapInfo,
  swapParams,
}: UseTxOverviewParams): SavingsDialogTxOverview | undefined {
  const sdai = marketInfo.findOneTokenBySymbol(TokenSymbol('sDAI'))
  const dai = marketInfo.findOneTokenBySymbol(TokenSymbol('DAI'))

  if (!swapInfo.data) {
    return undefined
  }

  const sDaiAmountBaseUnit = swapInfo.data.estimate.toAmount
  const sDaiAmount = sdai.fromBaseUnit(sDaiAmountBaseUnit)
  const otherTokenAmountBaseUnit = swapInfo.data.estimate.fromAmount
  const otherTokenAmount = swapParams.fromToken.fromBaseUnit(otherTokenAmountBaseUnit)

  const daiAmountNormalized = convertSharesToDai({
    shares: sDaiAmount,
    potParams: makerInfo.potParameters,
    timestamp: marketInfo.timestamp,
  })
  const tokenToDaiRatio = NormalizedUnitNumber(daiAmountNormalized.dividedBy(otherTokenAmount))

  const sDaiBalanceBefore = walletInfo.findWalletBalanceForSymbol(TokenSymbol('sDAI'))
  const sDaiBalanceAfter = NormalizedUnitNumber(sDaiBalanceBefore.plus(sDaiAmount))

  return {
    exchangeRatioFromToken: swapParams.fromToken,
    exchangeRatioToToken: dai,
    sDaiToken: sdai,
    exchangeRatio: tokenToDaiRatio,
    sDaiBalanceBefore,
    sDaiBalanceAfter,
    DSR: makerInfo.DSR,
  }
}
