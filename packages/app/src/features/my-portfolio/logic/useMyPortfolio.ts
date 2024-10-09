import { getNativeAssetInfo } from '@/config/chain/utils/getNativeAssetInfo'
import { EModeCategoryId } from '@/domain/e-mode/types'
import { LiquidationDetails } from '@/domain/market-info/getLiquidationDetails'
import { useMarketInfo } from '@/domain/market-info/useMarketInfo'
import { useOpenDialog } from '@/domain/state/dialogs'
import { useMarketWalletInfo } from '@/domain/wallet/useMarketWalletInfo'
import { sandboxDialogConfig } from '@/features/dialogs/sandbox/SandboxDialog'
import { useState } from 'react'
import { Borrow, Deposit, getBorrows, getDeposits } from './assets'
import { makeLiquidationDetails } from './makeLiquidationDetails'
import { makePositionSummary } from './position'
import { PositionSummary } from './types'
import { WalletCompositionInfo, makeWalletComposition } from './wallet-composition'
import { usePageChainId } from '@/domain/hooks/usePageChainId'

export interface UseMyPortfolioResults {
  positionSummary: PositionSummary
  deposits: Deposit[]
  borrows: Borrow[]
  walletComposition: WalletCompositionInfo
  guestMode: boolean
  eModeCategoryId: EModeCategoryId
  liquidationDetails?: LiquidationDetails
  openSandboxModal: () => void
}

export function useMyPortfolio(): UseMyPortfolioResults {
  const pageChainId = usePageChainId()
  const { marketInfo } = useMarketInfo({ chainId: pageChainId })
  const walletInfo = useMarketWalletInfo({ chainId: pageChainId })
  const [compositionWithDeposits, setCompositionWithDeposits] = useState(true)
  const nativeAssetInfo = getNativeAssetInfo(marketInfo.chainId)
  const openDialog = useOpenDialog()

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
    chainId: marketInfo.chainId,
  })

  const eModeCategoryId = (
    marketInfo.userConfiguration.eModeState.enabled ? marketInfo.userConfiguration.eModeState.category.id : 0
  ) as EModeCategoryId

  const liquidationDetails = makeLiquidationDetails(marketInfo)

  function openSandboxModal(): void {
    openDialog(sandboxDialogConfig, { mode: 'ephemeral' } as const)
  }

  return {
    positionSummary,
    deposits,
    borrows,
    walletComposition,
    eModeCategoryId,
    guestMode: !walletInfo.isConnected,
    liquidationDetails,
    openSandboxModal,
  }
}
