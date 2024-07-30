import { SupportedChainId } from '@/config/chain/types'
import { TokenWithBalance } from '@/domain/common/types'
import { useOriginChainId } from '@/domain/hooks/useOriginChainId'
import { useSavingsDaiInfo } from '@/domain/savings-info/useSavingsDaiInfo'
import { useSavingsNstInfo } from '@/domain/savings-info/useSavingsNstInfo'
import { calculateMaxBalanceTokenAndTotal } from '@/domain/savings/calculateMaxBalanceTokenAndTotal'
import { OpenDialogFunction, useOpenDialog } from '@/domain/state/dialogs'
import { NormalizedUnitNumber, Percentage } from '@/domain/types/NumericValues'
import { SandboxDialog } from '@/features/dialogs/sandbox/SandboxDialog'
import { makeSavingsOverview } from '@/features/savings/logic/makeSavingsOverview'
import { calculateProjections } from '@/features/savings/logic/projections'
import { useSavingsTokens } from '@/features/savings/logic/useSavingsTokens'
import { Projections } from '@/features/savings/types'
import { useTimestamp } from '@/utils/useTimestamp'
import { useAccount } from 'wagmi'

const stepInMs = 50

export interface UseSavingsResults {
  guestMode: boolean
  openDialog: OpenDialogFunction
  openSandboxModal: () => void
  savingsDaiDetails:
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
  savingsNSTDetails:
    | {
        state: 'supported'
        APY: Percentage
      }
    | { state: 'unsupported' }
}
export function useSavings(): UseSavingsResults {
  const { savingsDaiInfo } = useSavingsDaiInfo()
  const { savingsNstInfo } = useSavingsNstInfo()
  const guestMode = useAccount().isConnected === false
  const { sDaiWithBalance, savingsInputTokens } = useSavingsTokens()
  const chainId = useOriginChainId()
  const { timestamp, timestampInMs } = useTimestamp({
    refreshIntervalInMs: savingsDaiInfo?.supportsRealTimeInterestAccrual ? stepInMs : undefined,
  })
  const openDialog = useOpenDialog()

  if (!savingsDaiInfo) {
    return {
      guestMode,
      openDialog,
      openSandboxModal,
      savingsDaiDetails: { state: 'unsupported' },
      savingsNSTDetails: { state: 'unsupported' },
    }
  }

  const { totalUSD: totalEligibleCashUSD, maxBalanceToken } = calculateMaxBalanceTokenAndTotal({
    assets: savingsInputTokens,
  })

  const { potentialShares, depositedUSD, depositedUSDPrecision } = makeSavingsOverview({
    sDaiWithBalance,
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
    savingsDaiDetails: {
      state: 'supported',
      APY: savingsDaiInfo.apy,
      depositedUSD,
      depositedUSDPrecision,
      sDaiWithBalance,
      currentProjections,
      opportunityProjections,
      assetsInWallet: savingsInputTokens,
      totalEligibleCashUSD,
      maxBalanceToken,
      chainId,
    },
    savingsNSTDetails: savingsNstInfo
      ? {
          state: 'supported',
          APY: savingsNstInfo.apy,
        }
      : { state: 'unsupported' },
  }
}
