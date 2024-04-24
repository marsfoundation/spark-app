import { useState } from 'react'

import { getNativeAssetInfo } from '@/config/chain/utils/getNativeAssetInfo'
import { EModeCategoryId } from '@/domain/e-mode/types'
import { LiquidationDetails } from '@/domain/market-info/getLiquidationDetails'
import { useMarketInfo } from '@/domain/market-info/useMarketInfo'
import { useWalletInfo } from '@/domain/wallet/useWalletInfo'

import { Borrow, Deposit, getBorrows, getDeposits } from './assets'
import { makeLiquidationDetails } from './makeLiquidationDetails'
import { makePositionSummary } from './position'
import { PositionSummary } from './types'
import { makeWalletComposition, WalletCompositionInfo } from './wallet-composition'

export interface UseDashboardResults {
  positionSummary: PositionSummary
  deposits: Deposit[]
  borrows: Borrow[]
  walletComposition: WalletCompositionInfo
  guestMode: boolean
  eModeCategoryId: EModeCategoryId
  liquidationDetails?: LiquidationDetails
}

export function useDashboard(): UseDashboardResults {
  const { marketInfo } = useMarketInfo()
  const walletInfo = useWalletInfo()
  const [compositionWithDeposits, setCompositionWithDeposits] = useState(true)
  const nativeAssetInfo = getNativeAssetInfo(marketInfo.chainId)

  const deposits = getDeposits({
    marketInfo,
    walletInfo,
    nativeAssetInfo,
  })
  const borrows = getBorrows({ marketInfo, nativeAssetInfo })
  const positionSummary = makePositionSummary({ marketInfo })
  const walletComposition = makeWalletComposition({
    marketInfo,
    walletInfo,
    compositionWithDeposits,
    setCompositionWithDeposits,
    nativeAssetInfo,
  })

  const eModeCategoryId = (
    marketInfo.userConfiguration.eModeState.enabled ? marketInfo.userConfiguration.eModeState.category.id : 0
  ) as EModeCategoryId

  const liquidationDetails = makeLiquidationDetails(marketInfo)

  return {
    positionSummary,
    deposits,
    borrows,
    walletComposition,
    eModeCategoryId,
    guestMode: !walletInfo.isConnected,
    liquidationDetails,
  }
}
