import { TokenWithBalance } from '@/domain/common/types'
import { MakerInfo } from '@/domain/maker-info/types'
import { useMakerInfo } from '@/domain/maker-info/useMakerInfo'
import { useMarketInfo } from '@/domain/market-info/useMarketInfo'
import { makeAssetsInWalletList } from '@/domain/savings/makeAssetsInWalletList'
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
  savingsDetails:
    | {
        state: 'supported'
        makerInfo: MakerInfo
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
    | { state: 'unsupported' }
}
export function useSavings(): UseSavingsResults {
  const { makerInfo } = useMakerInfo()
  const walletInfo = useWalletInfo()
  const guestMode = !walletInfo.isConnected
  const { marketInfo } = useMarketInfo()
  const { timestamp, timestampInMs } = useTimestamp({ refreshIntervalInMs: stepInMs })

  const openDialog = useOpenDialog()

  if (!makerInfo) {
    return { guestMode, openDialog, savingsDetails: { state: 'unsupported' } }
  }

  const {
    assets: assetsInWallet,
    totalUSD: totalEligibleCashUSD,
    maxBalanceToken,
  } = makeAssetsInWalletList({ walletInfo })
  const { shares, potentialShares, depositedUSD, depositedUSDPrecision, sDAIBalance } = makeSavingsOverview({
    marketInfo,
    walletInfo,
    potParams: makerInfo.potParameters,
    eligibleCashUSD: totalEligibleCashUSD,
    timestampInMs,
    stepInMs,
  })

  const currentProjections = calculateProjections({ timestamp, shares, potParams: makerInfo.potParameters })
  const opportunityProjections = calculateProjections({
    timestamp,
    shares: potentialShares,
    potParams: makerInfo.potParameters,
  })

  return {
    guestMode,
    openDialog,
    savingsDetails: {
      state: 'supported',
      makerInfo,
      DSR: makerInfo.DSR,
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
