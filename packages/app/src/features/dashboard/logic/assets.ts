import { NativeAssetInfo } from '@/config/chain/types'
import { assetCanBeBorrowed } from '@/domain/common/assets'
import { MarketInfo, UserPosition } from '@/domain/market-info/marketInfo'
import { ReserveStatus } from '@/domain/market-info/reserve-status'
import { NormalizedUnitNumber, Percentage } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { WalletInfo } from '@/domain/wallet/useWalletInfo'
import { applyTransformers } from '@/utils/applyTransformers'

export interface Deposit {
  token: Token
  reserveStatus: ReserveStatus
  balance: NormalizedUnitNumber
  deposit: NormalizedUnitNumber
  supplyAPY: Percentage
  isUsedAsCollateral: boolean
}

export interface Borrow {
  token: Token
  reserveStatus: ReserveStatus
  available: NormalizedUnitNumber
  debt: NormalizedUnitNumber
  borrowAPY: Percentage
}

export interface GetDepositsParams {
  marketInfo: MarketInfo
  walletInfo: WalletInfo
  nativeAssetInfo: NativeAssetInfo
}
export function getDeposits({ marketInfo, walletInfo, nativeAssetInfo }: GetDepositsParams): Deposit[] {
  return marketInfo.userPositions
    .map((position) => {
      return applyTransformers({ position, marketInfo, walletInfo, nativeAssetInfo })([
        hideDaiWhenLendingDisabled,
        hideFrozenAssetIfNotDeposited,
        transformNativeAssetDeposit,
        transformDefaultDeposit,
      ])
    })
    .filter(Boolean)
}

interface DepositTransformerParams extends GetDepositsParams {
  position: UserPosition
  nativeAssetInfo: NativeAssetInfo
}

function transformNativeAssetDeposit({
  position,
  marketInfo,
  walletInfo,
  nativeAssetInfo,
}: DepositTransformerParams): Deposit | undefined {
  if (position.reserve.token.symbol !== nativeAssetInfo.wrappedNativeAssetSymbol) {
    return undefined
  }
  const deposit = transformDefaultDeposit({ position, marketInfo, walletInfo, nativeAssetInfo })

  return {
    ...deposit,
    balance: NormalizedUnitNumber(
      walletInfo
        .findWalletBalanceForToken(position.reserve.token)
        .plus(walletInfo.findWalletBalanceForSymbol(nativeAssetInfo.nativeAssetSymbol)),
    ),
  }
}

function transformDefaultDeposit({ position, walletInfo }: DepositTransformerParams): Deposit {
  return {
    token: position.reserve.token,
    reserveStatus: position.reserve.status,
    balance: walletInfo.findWalletBalanceForToken(position.reserve.token),
    deposit: position.collateralBalance,
    supplyAPY: position.reserve.supplyAPY,
    isUsedAsCollateral: position.reserve.usageAsCollateralEnabledOnUser,
  }
}

function hideDaiWhenLendingDisabled({ position }: DepositTransformerParams): null | undefined {
  if (import.meta.env.VITE_FEATURE_DISABLE_DAI_LEND === '1' && position.reserve.token.symbol === TokenSymbol('DAI')) {
    return null
  }
}

function hideFrozenAssetIfNotDeposited({ position }: DepositTransformerParams): null | undefined {
  if (position.reserve.status === 'frozen' && position.collateralBalance.isZero()) {
    return null
  }
}

export interface GetBorrowsParams {
  marketInfo: MarketInfo
  nativeAssetInfo: NativeAssetInfo
}

export function getBorrows({ marketInfo, nativeAssetInfo }: GetBorrowsParams): Borrow[] {
  return marketInfo.userPositions
    .filter((position) => assetCanBeBorrowed(position.reserve) || position.borrowBalance.gt(0))
    .map((position) => {
      return applyTransformers({ position, marketInfo, nativeAssetInfo })([
        transformNativeAssetBorrow,
        transformDefaultBorrow,
      ])
    })
    .filter(Boolean)
}

interface BorrowTransformerParams extends GetBorrowsParams {
  position: UserPosition
  nativeAssetInfo: NativeAssetInfo
}

function transformNativeAssetBorrow({
  position,
  marketInfo,
  nativeAssetInfo,
}: BorrowTransformerParams): Borrow | undefined {
  if (position.reserve.token.symbol !== nativeAssetInfo.wrappedNativeAssetSymbol) {
    return undefined
  }
  const borrow = transformDefaultBorrow({ position, marketInfo, nativeAssetInfo })

  return {
    ...borrow,
    available: position.reserve.availableLiquidity,
    debt: position.borrowBalance,
    borrowAPY: position.reserve.variableBorrowApy,
  }
}

function transformDefaultBorrow({ position }: BorrowTransformerParams): Borrow {
  return {
    token: position.reserve.token,
    reserveStatus: position.reserve.status,
    available: position.reserve.availableLiquidity,
    debt: position.borrowBalance,
    borrowAPY: position.reserve.variableBorrowApy,
  }
}
