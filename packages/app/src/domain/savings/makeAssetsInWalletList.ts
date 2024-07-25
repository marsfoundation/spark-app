import { getChainConfigEntry } from '@/config/chain'
import { TokenWithBalance } from '@/domain/common/types'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { bigNumberify } from '@/utils/bigNumber'
import { MarketWalletInfo } from '../wallet/useMarketWalletInfo'

export interface MakeAssetsInWalletListParams {
  walletInfo: MarketWalletInfo
  chainId: number
}

export interface MakeAssetsInWalletListResults {
  assets: TokenWithBalance[]
  maxBalanceToken: TokenWithBalance
  totalUSD: NormalizedUnitNumber
}

export function makeAssetsInWalletList({
  walletInfo,
  chainId,
}: MakeAssetsInWalletListParams): MakeAssetsInWalletListResults {
  const nativeRouteTokens = getChainConfigEntry(chainId).savingsNativeRouteTokens
  const assets = walletInfo.walletBalances.filter(({ token }) => nativeRouteTokens.includes(token.symbol))
  const totalUSD = NormalizedUnitNumber(
    assets.reduce((acc, { token, balance }) => acc.plus(token.toUSD(balance)), bigNumberify('0')),
  )
  const maxBalanceToken = assets.reduce((acc, token) => (token.balance.gt(acc.balance) ? token : acc), assets[0]!)

  return { assets, totalUSD, maxBalanceToken }
}
