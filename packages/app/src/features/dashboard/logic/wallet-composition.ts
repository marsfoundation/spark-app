import { getChainConfigEntry } from '@/config/chain'
import { NativeAssetInfo } from '@/config/chain/types'
import { paths } from '@/config/paths'
import { TokenWithValue } from '@/domain/common/types'
import { MarketInfo } from '@/domain/market-info/marketInfo'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'
import { WalletBalance, WalletInfo } from '@/domain/wallet/useWalletInfo'
import { generatePath } from 'react-router-dom'
import { AssetsTableRow } from '../components/wallet-composition/AssetTable'

interface MakeAssetListParams {
  marketInfo: MarketInfo
  walletInfo: WalletInfo
  includeDeposits: boolean
  nativeAssetInfo: NativeAssetInfo
  chainId: number
}
function makeAssetList({
  marketInfo,
  walletInfo,
  includeDeposits,
  nativeAssetInfo,
  chainId,
}: MakeAssetListParams): AssetsTableRow[] {
  return walletInfo.walletBalances
    .map((walletBalance) => calculateCombinedBalance({ walletBalance, marketInfo, includeDeposits, nativeAssetInfo }))
    .filter(({ value }) => value.gt(0))
    .sort((a, b) => b.token.toUSD(b.value).comparedTo(a.token.toUSD(a.value)))
    .map((asset) => ({
      token: asset.token,
      value: asset.value,
      detailsLink: getDetailsLink({
        marketInfo,
        token: asset.token,
        chainId,
      }),
    }))
}

interface GetDetailsLinkParams {
  marketInfo: MarketInfo
  token: Token
  chainId: number
}
function getDetailsLink({ marketInfo, token, chainId }: GetDetailsLinkParams): string {
  const chainConfig = getChainConfigEntry(chainId)
  const address =
    token.symbol === marketInfo.sDAI.symbol && chainConfig.mergedDaiAndSDaiMarkets
      ? marketInfo.DAI.address
      : token.address

  return generatePath(paths.marketDetails, { asset: address, chainId: chainId.toString() })
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
  chainId: number
}

export interface WalletCompositionInfo {
  assets: AssetsTableRow[]
  chainId: number
  includeDeposits: boolean
  setIncludeDeposits: (includeDeposits: boolean) => void
  hasCollaterals: boolean
}

export function makeWalletComposition({
  marketInfo,
  walletInfo,
  compositionWithDeposits,
  setCompositionWithDeposits,
  nativeAssetInfo,
  chainId,
}: MakeWalletCompositionParams): WalletCompositionInfo {
  return {
    hasCollaterals: marketInfo.userPositionSummary.totalCollateralUSD.gt(0),
    assets: makeAssetList({
      marketInfo,
      walletInfo,
      includeDeposits: compositionWithDeposits,
      nativeAssetInfo,
      chainId,
    }),
    chainId: marketInfo.chainId,
    includeDeposits: compositionWithDeposits,
    setIncludeDeposits: setCompositionWithDeposits,
  }
}
