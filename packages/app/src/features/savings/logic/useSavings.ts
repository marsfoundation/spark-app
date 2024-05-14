import { TokenWithBalance } from '@/domain/common/types'
import { useMarketInfo } from '@/domain/market-info/useMarketInfo'
import { makeAssetsInWalletList } from '@/domain/savings/makeAssetsInWalletList'
import { useSavingsInfo } from '@/domain/savings-info/useSavingsInfo'
import { OpenDialogFunction, useOpenDialog } from '@/domain/state/dialogs'
import { NormalizedUnitNumber, Percentage } from '@/domain/types/NumericValues'
import { useWalletInfo } from '@/domain/wallet/useWalletInfo'
import { useTimestamp } from '@/utils/useTimestamp'

import { Projections } from '../types'
import { makeSavingsOverview } from './makeSavingsOverview'
import { calculateProjections } from './projections'

const stepInMs = 50

export interface UseSavingsResults {
  guestMode: boolean
  openDialog: OpenDialogFunction
  savingsDetails: {
    state: 'supported'
    DSR: Percentage
    depositedUSD: NormalizedUnitNumber
    depositedUSDPrecision: number
    sDAIBalance: TokenWithBalance
    currentProjections: Projections
    opportunityProjections: Projections
    assetsInWallet: TokenWithBalance[]
    totalEligibleCashUSD: NormalizedUnitNumber
    maxBalanceToken: TokenWithBalance
  }
}
export function useSavings(): UseSavingsResults {
  const { savingsManager } = useSavingsInfo()
  const walletInfo = useWalletInfo()
  const guestMode = !walletInfo.isConnected
  const { marketInfo } = useMarketInfo()
  const { timestamp, timestampInMs } = useTimestamp({
    refreshIntervalInMs: savingsManager.supportsRealTimeInterestAccrual ? stepInMs : undefined,
  })

  const openDialog = useOpenDialog()

  const {
    assets: assetsInWallet,
    totalUSD: totalEligibleCashUSD,
    maxBalanceToken,
  } = makeAssetsInWalletList({ walletInfo })
  const { shares, potentialShares, depositedUSD, depositedUSDPrecision, sDAIBalance } = makeSavingsOverview({
    marketInfo,
    walletInfo,
    savingsManager,
    eligibleCashUSD: totalEligibleCashUSD,
    timestampInMs,
    stepInMs,
  })

  const currentProjections = calculateProjections({ timestamp, shares, savingsManager })
  const opportunityProjections = calculateProjections({
    timestamp,
    shares: potentialShares,
    savingsManager,
  })

  return {
    guestMode,
    openDialog,
    savingsDetails: {
      state: 'supported',
      DSR: savingsManager.apy,
      depositedUSD,
      depositedUSDPrecision,
      sDAIBalance,
      currentProjections,
      opportunityProjections,
      assetsInWallet,
      totalEligibleCashUSD,
      maxBalanceToken,
    },
  }
}
