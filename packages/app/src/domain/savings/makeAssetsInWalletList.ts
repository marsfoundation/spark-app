import { getChainConfigEntry } from '@/config/chain'
import { TokenWithBalance } from '@/domain/common/types'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { WalletInfo } from '@/domain/wallet/useWalletInfo'
import { bigNumberify } from '@/utils/bigNumber'

export const whitelistedAssets = ['DAI', 'USDC', 'USDT', 'XDAI']

export interface MakeAssetsInWalletListParams {
  walletInfo: WalletInfo
  nativeRouteOptions?: {
    shouldFilterNativeRoutes: boolean
    chainId: number
  }
}

export interface MakeAssetsInWalletListResults {
  assets: TokenWithBalance[]
  maxBalanceToken: TokenWithBalance
  totalUSD: NormalizedUnitNumber
}

export function makeAssetsInWalletList({
  walletInfo,
  nativeRouteOptions,
}: MakeAssetsInWalletListParams): MakeAssetsInWalletListResults {
  let assets = walletInfo.walletBalances.filter(({ token }) => whitelistedAssets.includes(token.symbol))
  if (nativeRouteOptions?.shouldFilterNativeRoutes) {
    const nativeRouteTokens = getChainConfigEntry(nativeRouteOptions.chainId).savingsNativeRouteTokens
    assets = assets.filter(({ token }) => nativeRouteTokens.includes(token.symbol))
  }
  const totalUSD = NormalizedUnitNumber(
    assets.reduce((acc, { token, balance }) => acc.plus(token.toUSD(balance)), bigNumberify('0')),
  )
  const maxBalanceToken = assets.reduce((acc, token) => (token.balance.gt(acc.balance) ? token : acc), assets[0]!)

  return { assets, totalUSD, maxBalanceToken }
}
