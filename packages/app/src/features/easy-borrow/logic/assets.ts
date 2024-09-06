import { getChainConfigEntry } from '@/config/chain'
import { NativeAssetInfo } from '@/config/chain/types'
import { TokenWithBalance } from '@/domain/common/types'
import { MarketInfo, UserPosition } from '@/domain/market-info/marketInfo'
import { MarketWalletInfo } from '@/domain/wallet/useMarketWalletInfo'
import { assert } from '@/utils/assert'

const blacklistedDepositOptions = ['USDC', 'USDT', 'DAI', 'sDAI', 'XDAI']
export function getDepositOptions(positions: UserPosition[], walletInfo: MarketWalletInfo): TokenWithBalance[] {
  return (
    positions
      .filter((p) => p.reserve.status === 'active' && !p.reserve.isIsolated)
      // Filter out reserves that cannot be used as collateral
      .filter((p) => p.reserve.usageAsCollateralEnabled)
      // Filter out positions that have deposit, but usage as collateral is turned off by user
      .filter((p) => p.collateralBalance.eq(0) || p.reserve.usageAsCollateralEnabledOnUser)
      .filter((p) => !blacklistedDepositOptions.includes(p.reserve.token.symbol))
      .map((p) => ({
        token: p.reserve.token,
        balance: walletInfo.findWalletBalanceForToken(p.reserve.token),
      }))
      .sort((a, b) => b.balance.minus(a.balance).toNumber())
  )
}

export interface GetBorrowOptionsParams {
  allTokens: TokenWithBalance[]
  chainId: number
}
export function getBorrowOptions({
  allTokens,
  chainId,
}: GetBorrowOptionsParams): [TokenWithBalance, ...TokenWithBalance[]] {
  const whitelistedBorrowOptions = getChainConfigEntry(chainId).easyBorrowConfig.borrowOptions
  const borrowOptions = allTokens.filter(({ token }) => whitelistedBorrowOptions.includes(token.symbol))
  assert(borrowOptions.length > 0, 'No borrow options')

  return borrowOptions as [TokenWithBalance, ...TokenWithBalance[]]
}

export function imputeNativeAsset(marketInfo: MarketInfo, nativeAssetInfo: NativeAssetInfo): UserPosition[] {
  const positionsWithoutWrappedNativeAsset = marketInfo.userPositions.filter(
    (p) => p.reserve.token.symbol !== nativeAssetInfo.wrappedNativeAssetSymbol,
  )

  return [...positionsWithoutWrappedNativeAsset, marketInfo.findOnePositionBySymbol(nativeAssetInfo.nativeAssetSymbol)]
}
