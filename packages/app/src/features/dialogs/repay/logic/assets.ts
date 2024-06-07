import { assert } from '@/utils/assert'

import { NativeAssetInfo } from '@/config/chain/types'
import { TokenWithBalance, TokenWithValue } from '@/domain/common/types'
import { MarketInfo } from '@/domain/market-info/marketInfo'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'
import { WalletInfo } from '@/domain/wallet/useWalletInfo'
import { applyTransformers } from '@/utils/applyTransformers'

export interface GetDepositOptionsParams {
  token: Token
  marketInfo: MarketInfo
  walletInfo: WalletInfo
  nativeAssetInfo: NativeAssetInfo
}

export function getRepayOptions({
  token,
  marketInfo,
  walletInfo,
  nativeAssetInfo,
}: GetDepositOptionsParams): TokenWithBalance[] {
  const options = applyTransformers({ token, marketInfo, walletInfo, nativeAssetInfo })([
    getNativeAssetRepayOptions,
    getDefaultRepayOptions,
  ])
  assert(options, `No deposit options found for token ${token.symbol}`)

  return options
}

function getNativeAssetRepayOptions({
  token,
  marketInfo,
  walletInfo,
  nativeAssetInfo,
}: GetDepositOptionsParams): TokenWithBalance[] | undefined {
  const { nativeAssetSymbol, wrappedNativeAssetSymbol } = nativeAssetInfo

  if (token.symbol !== nativeAssetSymbol && token.symbol !== wrappedNativeAssetSymbol) {
    return undefined
  }
  const native = marketInfo.findOneReserveBySymbol(nativeAssetSymbol)
  const wrapped = marketInfo.findOneReserveBySymbol(wrappedNativeAssetSymbol)

  return [
    {
      token: native.token,
      balance: walletInfo.findWalletBalanceForToken(native.token),
    },
    {
      token: wrapped.token,
      balance: walletInfo.findWalletBalanceForToken(wrapped.token),
    },
    {
      token: wrapped.aToken,
      balance: wrapped.aTokenBalance,
    },
  ]
}

function getDefaultRepayOptions({ token, marketInfo, walletInfo }: GetDepositOptionsParams): TokenWithBalance[] {
  const reserve = marketInfo.findOneReserveBySymbol(token.symbol)

  return [
    {
      token,
      balance: walletInfo.findWalletBalanceForToken(token),
    },
    {
      token: reserve.aToken,
      balance: reserve.aTokenBalance,
    },
  ]
}

export function getTokenDebt(marketInfo: MarketInfo, repayAsset: TokenWithValue): NormalizedUnitNumber {
  const position = marketInfo.findOnePositionBySymbol(repayAsset.token.symbol)
  return NormalizedUnitNumber(position.borrowBalance.minus(repayAsset.value))
}
