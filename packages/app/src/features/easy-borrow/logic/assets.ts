import { NativeAssetInfo } from '@/config/chain/types'
import { MarketInfo, Reserve, UserPosition } from '@/domain/market-info/marketInfo'
import { MarketWalletInfo } from '@/domain/wallet/useMarketWalletInfo'

const blacklistedDepositableAssets = ['USDC', 'USDT', 'DAI', 'sDAI', 'XDAI']
export function getDepositableAssets(positions: UserPosition[]): Reserve[] {
  return (
    positions
      .filter((p) => p.reserve.status === 'active' && !p.reserve.isIsolated)
      // Filter out reserves that cannot be used as collateral
      .filter((p) => p.reserve.usageAsCollateralEnabled)
      // Filter out positions that have deposit, but usage as collateral is turned off by user
      .filter((p) => p.collateralBalance.eq(0) || p.reserve.usageAsCollateralEnabledOnUser)
      .filter((p) => !blacklistedDepositableAssets.includes(p.reserve.token.symbol))
      .map((p) => p.reserve)
  )
}

const whitelistedBorrowableAssets = ['DAI', 'WXDAI']
export function getBorrowableAssets(reserves: Reserve[]): Reserve[] {
  return reserves.filter((r) => whitelistedBorrowableAssets.includes(r.token.symbol))
}

export function sortByDecreasingBalances(reserves: Reserve[], walletInfo: MarketWalletInfo): Reserve[] {
  const reservesWithBalances = reserves.map((reserve) => ({
    reserve,
    balance: walletInfo.findWalletBalanceForToken(reserve.token),
  }))
  const sortedReserves = reservesWithBalances.sort((a, b) => b.balance.minus(a.balance).toNumber())

  return sortedReserves.map((r) => r.reserve)
}

export function imputeNativeAsset(marketInfo: MarketInfo, nativeAssetInfo: NativeAssetInfo): UserPosition[] {
  const positionsWithoutWrappedNativeAsset = marketInfo.userPositions.filter(
    (p) => p.reserve.token.symbol !== nativeAssetInfo.wrappedNativeAssetSymbol,
  )

  return [...positionsWithoutWrappedNativeAsset, marketInfo.findOnePositionBySymbol(nativeAssetInfo.nativeAssetSymbol)]
}
