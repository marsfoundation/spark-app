import { SupportedChainId } from '@/config/chain/types'
import { TokenWithBalance } from '@/domain/common/types'
import { useOriginChainId } from '@/domain/hooks/useOriginChainId'
import { useSavingsDaiInfo } from '@/domain/savings-info/useSavingsDaiInfo'
import { calculateMaxBalanceTokenAndTotal } from '@/domain/savings/calculateMaxBalanceTokenAndTotal'
import { useSavingsTokens } from '@/domain/savings/useSavingsTokens'
import { OpenDialogFunction, useOpenDialog } from '@/domain/state/dialogs'
import { NormalizedUnitNumber, Percentage } from '@/domain/types/NumericValues'
import { SandboxDialog } from '@/features/dialogs/sandbox/SandboxDialog'
import { useTimestamp } from '@/utils/useTimestamp'
import { useAccount } from 'wagmi'
import { Projections } from '../types'
import { makeSavingsOverview } from './makeSavingsOverview'
import { calculateProjections } from './projections'

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
  const { savingsDaiInfo } = useSavingsDaiInfo()
  const guestMode = useAccount().isConnected === false
  const { sDaiWithBalance, inputTokensInfo } = useSavingsTokens()
  const chainId = useOriginChainId()
  const { timestamp, timestampInMs } = useTimestamp({
    refreshIntervalInMs: savingsDaiInfo?.supportsRealTimeInterestAccrual ? stepInMs : undefined,
  })
  const openDialog = useOpenDialog()

  if (!savingsDaiInfo) {
    return { guestMode, openDialog, openSandboxModal, savingsDetails: { state: 'unsupported' } }
  }

  const { totalUSD: totalEligibleCashUSD, maxBalanceToken } = calculateMaxBalanceTokenAndTotal({
    assets: inputTokensInfo.all(),
  })

  const { potentialShares, depositedUSD, depositedUSDPrecision } = makeSavingsOverview({
    savingsTokenWithBalance: sDaiWithBalance,
    savingsInfo: savingsDaiInfo,
    eligibleCashUSD: totalEligibleCashUSD,
    timestampInMs,
    stepInMs,
  })

  const currentProjections = calculateProjections({
    timestamp,
    shares: sDaiWithBalance.balance,
    savingsInfo: savingsDaiInfo,
  })
  const opportunityProjections = calculateProjections({
    timestamp,
    shares: potentialShares,
    savingsInfo: savingsDaiInfo,
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
      APY: savingsDaiInfo.apy,
      depositedUSD,
      depositedUSDPrecision,
      sDaiWithBalance,
      currentProjections,
      opportunityProjections,
      assetsInWallet: inputTokensInfo.all(),
      totalEligibleCashUSD,
      maxBalanceToken,
      chainId,
    },
  }
}
