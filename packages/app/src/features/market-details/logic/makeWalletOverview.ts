import invariant from 'tiny-invariant'

import { getBorrowMaxValue } from '@/domain/action-max-value-getters/getBorrowMaxValue'
import { getDepositMaxValue } from '@/domain/action-max-value-getters/getDepositMaxValue'
import { MarketInfo, Reserve } from '@/domain/market-info/marketInfo'
import { getValidateBorrowArgs, validateBorrow } from '@/domain/market-validators/validateBorrow'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { WalletInfo } from '@/domain/wallet/useWalletInfo'
import { applyTransformers } from '@/utils/applyTransformers'

import { WalletOverview } from '../types'

export interface MakeWalletOverviewParams {
  reserve: Reserve
  walletInfo: WalletInfo
  marketInfo: MarketInfo
  connectedChainId: number
}

export function makeWalletOverview({
  reserve,
  marketInfo,
  walletInfo,
  connectedChainId,
}: MakeWalletOverviewParams): WalletOverview {
  const overview = applyTransformers({ reserve, marketInfo, walletInfo, connectedChainId })([
    makeGuestModeOverview,
    makeChainMismatchOverview,
    makeDaiOverview,
    makeBaseWalletOverview,
  ])
  invariant(overview, 'The only item was skipped by transformers.')

  return overview
}

function makeGuestModeOverview({ reserve, walletInfo }: MakeWalletOverviewParams): WalletOverview | undefined {
  if (walletInfo.isConnected) {
    return undefined
  }

  const token = reserve.token

  return {
    guestMode: true,
    token,
    tokenBalance: walletInfo.findWalletBalanceForToken(token),
    deposit: {
      token,
      available: NormalizedUnitNumber(0),
    },
    borrow: {
      token,
      available: NormalizedUnitNumber(0),
    },
  }
}

function makeChainMismatchOverview({
  reserve,
  marketInfo,
  walletInfo,
  connectedChainId,
}: MakeWalletOverviewParams): WalletOverview | undefined {
  if (connectedChainId === marketInfo.chainId) {
    return undefined
  }

  const token = reserve.token

  return {
    guestMode: false,
    token,
    tokenBalance: walletInfo.findWalletBalanceForToken(token),
    deposit: {
      token,
      available: NormalizedUnitNumber(0),
    },
    borrow: {
      token,
      available: NormalizedUnitNumber(0),
    },
  }
}

function makeBaseWalletOverview({ reserve, marketInfo, walletInfo }: MakeWalletOverviewParams): WalletOverview {
  const token = reserve.token
  const tokenBalance = walletInfo.findWalletBalanceForToken(token)

  const availableToDeposit = getDepositMaxValue({
    asset: {
      status: reserve.status,
      totalDebt: reserve.totalDebt,
      decimals: reserve.token.decimals,
      index: reserve.variableBorrowIndex,
      rate: reserve.variableBorrowRate,
      lastUpdateTimestamp: reserve.lastUpdateTimestamp,
      totalLiquidity: reserve.totalLiquidity,
      supplyCap: reserve.supplyCap,
    },
    user: {
      balance: tokenBalance,
    },
    timestamp: marketInfo.timestamp,
  })

  const borrowValidationArgs = getValidateBorrowArgs(NormalizedUnitNumber(0), reserve, marketInfo)
  const validationIssue = validateBorrow(borrowValidationArgs)

  const availableToBorrow = getBorrowMaxValue({
    validationIssue,
    user: borrowValidationArgs.user,
    asset: borrowValidationArgs.asset,
  })

  return {
    guestMode: false,
    token,
    tokenBalance,
    deposit: {
      token,
      available: availableToDeposit,
    },
    borrow: {
      token,
      available: availableToBorrow,
    },
  }
}

function makeDaiOverview({ reserve, marketInfo, ...rest }: MakeWalletOverviewParams): WalletOverview | undefined {
  if (reserve.token.symbol !== 'DAI') {
    return undefined
  }

  const baseOverview = makeBaseWalletOverview({ reserve, marketInfo, ...rest })
  const sDaiReserve = marketInfo.findOneReserveBySymbol(TokenSymbol('sDAI'))
  const sDaiOverview = makeBaseWalletOverview({ reserve: sDaiReserve, marketInfo, ...rest })

  return {
    ...baseOverview,
    lend:
      import.meta.env.VITE_FEATURE_DISABLE_DAI_LEND !== '1'
        ? {
            ...baseOverview.deposit,
          }
        : undefined,
    deposit: {
      ...sDaiOverview.deposit,
    },
  }
}
