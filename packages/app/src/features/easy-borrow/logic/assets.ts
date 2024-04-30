import { NativeAssetInfo } from '@/config/chain/types'
import { MarketInfo, Reserve, UserPosition } from '@/domain/market-info/marketInfo'
import { WalletInfo } from '@/domain/wallet/useWalletInfo'

const blacklistedDepositableAssets = ['USDC', 'USDT', 'DAI', 'sDAI', 'XDAI']
export function getDepositableAssets(reserves: Reserve[]): Reserve[] {
  return reserves
    .filter((r) => r.status === 'active' && !r.isIsolated && r.usageAsCollateralEnabled)
    .filter((r) => !blacklistedDepositableAssets.includes(r.token.symbol))
}

const whitelistedBorrowableAssets = ['DAI', 'WXDAI']
export function getBorrowableAssets(reserves: Reserve[]): Reserve[] {
  return reserves.filter((r) => whitelistedBorrowableAssets.includes(r.token.symbol))
}

export function sortByDecreasingBalances(reserves: Reserve[], walletInfo: WalletInfo): Reserve[] {
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
