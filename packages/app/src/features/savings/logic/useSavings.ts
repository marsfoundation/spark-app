import { SupportedChainId } from '@/config/chain/types'
import { TokenWithBalance } from '@/domain/common/types'
import { useOriginChainId } from '@/domain/hooks/useOriginChainId'
import { useSavingsInfo } from '@/domain/savings-info/useSavingsInfo'
import { makeAssetsInWalletList } from '@/domain/savings/makeAssetsInWalletList'
import { OpenDialogFunction, useOpenDialog } from '@/domain/state/dialogs'
import { NormalizedUnitNumber, Percentage } from '@/domain/types/NumericValues'
import { SandboxDialog } from '@/features/dialogs/sandbox/SandboxDialog'
import { useTimestamp } from '@/utils/useTimestamp'
import { useAccount } from 'wagmi'
import { Projections } from '../types'
import { makeSavingsOverview } from './makeSavingsOverview'
import { calculateProjections } from './projections'
import { useSavingsSupportedTokens } from './useSavingsSupportedTokens'

const stepInMs = 50

export interface UseSavingsResults {
  guestMode: boolean
  openDialog: OpenDialogFunction
  openSandboxModal: () => void
  savingsDetails:
    | {
        state: 'supported'
        APY: Percentage
        depositedUSD: NormalizedUnitNumber
        depositedUSDPrecision: number
        sDaiWithBalance: TokenWithBalance
        currentProjections: Projections
        opportunityProjections: Projections
        assetsInWallet: TokenWithBalance[]
        totalEligibleCashUSD: NormalizedUnitNumber
        maxBalanceToken: TokenWithBalance
        chainId: SupportedChainId
      }
    | { state: 'unsupported' }
}
export function useSavings(): UseSavingsResults {
  const { savingsInfo } = useSavingsInfo()
  const guestMode = useAccount().isConnected === false
  const { sDaiWithBalance, savingsEntryTokens } = useSavingsSupportedTokens()
  const chainId = useOriginChainId()
  const { timestamp, timestampInMs } = useTimestamp({
    refreshIntervalInMs: savingsInfo?.supportsRealTimeInterestAccrual ? stepInMs : undefined,
  })
  const openDialog = useOpenDialog()

  if (!savingsInfo) {
    return { guestMode, openDialog, openSandboxModal, savingsDetails: { state: 'unsupported' } }
  }

  const { totalUSD: totalEligibleCashUSD, maxBalanceToken } = makeAssetsInWalletList({ savingsEntryTokens })

  const { potentialShares, depositedUSD, depositedUSDPrecision } = makeSavingsOverview({
    sDaiWithBalance,
    savingsInfo,
    eligibleCashUSD: totalEligibleCashUSD,
    timestampInMs,
    stepInMs,
  })

  const currentProjections = calculateProjections({ timestamp, shares: sDaiWithBalance.balance, savingsInfo })
  const opportunityProjections = calculateProjections({
    timestamp,
    shares: potentialShares,
    savingsInfo,
  })

  function openSandboxModal(): void {
    openDialog(SandboxDialog, { mode: 'ephemeral' } as const)
  }

  return {
    guestMode,
    openSandboxModal,
    openDialog,
    savingsDetails: {
      state: 'supported',
      APY: savingsInfo.apy,
      depositedUSD,
      depositedUSDPrecision,
      sDaiWithBalance,
      currentProjections,
      opportunityProjections,
      assetsInWallet: savingsEntryTokens,
      totalEligibleCashUSD,
      maxBalanceToken,
      chainId,
    },
  }
}
