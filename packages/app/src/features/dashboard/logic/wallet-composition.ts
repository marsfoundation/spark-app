import { NativeAssetInfo } from '@/config/chain/types'
import { TokenWithValue } from '@/domain/common/types'
import { MarketInfo } from '@/domain/market-info/marketInfo'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { WalletBalance, WalletInfo } from '@/domain/wallet/useWalletInfo'

interface MakeAssetListParams {
  marketInfo: MarketInfo
  walletInfo: WalletInfo
  includeDeposits: boolean
  nativeAssetInfo: NativeAssetInfo
}
function makeAssetList({
  marketInfo,
  walletInfo,
  includeDeposits,
  nativeAssetInfo,
}: MakeAssetListParams): TokenWithValue[] {
  return walletInfo.walletBalances
    .map((walletBalance) => calculateCombinedBalance({ walletBalance, marketInfo, includeDeposits, nativeAssetInfo }))
    .filter(({ value }) => value.gt(0))
    .sort((a, b) => b.token.toUSD(b.value).comparedTo(a.token.toUSD(a.value)))
}

interface CalculateCombinedBalanceParams {
  walletBalance: WalletBalance
  marketInfo: MarketInfo
  includeDeposits: boolean
  nativeAssetInfo: NativeAssetInfo
}
function calculateCombinedBalance({
  walletBalance,
  marketInfo,
  includeDeposits,
  nativeAssetInfo,
}: CalculateCombinedBalanceParams): TokenWithValue {
  if (!includeDeposits || walletBalance.token.symbol === nativeAssetInfo.nativeAssetSymbol) {
    return {
      token: walletBalance.token,
      value: walletBalance.balance,
    }
  }

  const deposit = marketInfo.findPositionByToken(walletBalance.token)?.collateralBalance ?? NormalizedUnitNumber(0)
  return {
    token: walletBalance.token,
    value: NormalizedUnitNumber(walletBalance.balance.plus(deposit)),
  }
}

export interface MakeWalletCompositionParams {
  marketInfo: MarketInfo
  walletInfo: WalletInfo
  compositionWithDeposits: boolean
  setCompositionWithDeposits: (includeDeposits: boolean) => void
  nativeAssetInfo: NativeAssetInfo
}

export interface WalletCompositionInfo {
  assets: TokenWithValue[]
  chainId: number
  includeDeposits: boolean
  setIncludeDeposits: (includeDeposits: boolean) => void
  hasDeposits: boolean
}

export function makeWalletComposition({
  marketInfo,
  walletInfo,
  compositionWithDeposits,
  setCompositionWithDeposits,
  nativeAssetInfo,
}: MakeWalletCompositionParams): WalletCompositionInfo {
  return {
    hasDeposits: marketInfo.userPositionSummary.totalCollateralUSD.gt(0),
    assets: makeAssetList({
      marketInfo,
      walletInfo,
      includeDeposits: compositionWithDeposits,
      nativeAssetInfo,
    }),
    chainId: marketInfo.chainId,
    includeDeposits: compositionWithDeposits,
    setIncludeDeposits: setCompositionWithDeposits,
  }
}
