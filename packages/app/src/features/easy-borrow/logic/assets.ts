import { NativeAssetInfo } from '@/config/chain/types'
import { TokenWithBalance } from '@/domain/common/types'
import { MarketInfo, Reserve, UserPosition } from '@/domain/market-info/marketInfo'
import { MarketWalletInfo } from '@/domain/wallet/useMarketWalletInfo'
import { UpgradeOptions } from './useUpgradeOptions'

const _blacklistedDepositableAssets = []
export function getDepositableAssets(positions: UserPosition[], walletInfo: MarketWalletInfo): TokenWithBalance[] {
  return (
    positions
      .filter((p) => p.reserve.status === 'active' && !p.reserve.isIsolated)
      // Filter out reserves that cannot be used as collateral
      .filter((p) => p.reserve.usageAsCollateralEnabled)
      // Filter out positions that have deposit, but usage as collateral is turned off by user
      .filter((p) => p.collateralBalance.eq(0) || p.reserve.usageAsCollateralEnabledOnUser)
      // .filter((p) => !blacklistedDepositableAssets.includes(p.reserve.token.symbol))
      .map((p) => ({ token: p.reserve.token, balance: walletInfo.findWalletBalanceForToken(p.reserve.token) }))
  )
}

const whitelistedBorrowableAssets = ['USDC', 'USDT', 'WETH', 'USDXL']

export function getBorrowableAssets(
  reserves: Reserve[],
  walletInfo: MarketWalletInfo,
  upgradeOptions?: UpgradeOptions,
): TokenWithBalance[] {
  const usds = upgradeOptions?.usds
  const marketTokens = reserves
    .filter((r) => whitelistedBorrowableAssets.includes(r.token.symbol))
    .map((r) => ({ token: r.token, balance: walletInfo.findWalletBalanceForToken(r.token) }))
  return usds ? [...marketTokens, usds] : marketTokens
}

export function sortByDecreasingBalances(tokens: TokenWithBalance[]): TokenWithBalance[] {
  return tokens.sort((a, b) => b.balance.minus(a.balance).toNumber())
}

export function imputeNativeAsset(marketInfo: MarketInfo, nativeAssetInfo: NativeAssetInfo): UserPosition[] {
  const positionsWithoutWrappedNativeAsset = marketInfo.userPositions.filter(
    (p) => p.reserve.token.symbol !== nativeAssetInfo.wrappedNativeAssetSymbol,
  )

  return [...positionsWithoutWrappedNativeAsset, marketInfo.findOnePositionBySymbol(nativeAssetInfo.nativeAssetSymbol)]
}
