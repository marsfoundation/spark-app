import { SupportedChainId } from '@/config/chain/types'
import { TokenWithBalance } from '@/domain/common/types'
import { useChainConfigEntry } from '@/domain/hooks/useChainConfigEntry'
import { useSavingsDaiInfo } from '@/domain/savings-info/useSavingsDaiInfo'
import { useSavingsNstInfo } from '@/domain/savings-info/useSavingsNstInfo'
import { calculateMaxBalanceTokenAndTotal } from '@/domain/savings/calculateMaxBalanceTokenAndTotal'
import { useSavingsTokens } from '@/domain/savings/useSavingsTokens'
import { OpenDialogFunction, useOpenDialog } from '@/domain/state/dialogs'
import { NormalizedUnitNumber, Percentage } from '@/domain/types/NumericValues'
import { useTokensInfo } from '@/domain/wallet/useTokens/useTokensInfo'
import { SandboxDialog } from '@/features/dialogs/sandbox/SandboxDialog'
import { Projections } from '@/features/savings/types'
import { raise } from '@/utils/assert'
import { useTimestamp } from '@/utils/useTimestamp'
import { useMemo } from 'react'
import { useAccount } from 'wagmi'
import { MigrationInfo, makeMigrationInfo } from './makeMigrationInfo'
import { makeSavingsTokenDetails } from './makeSavingsTokenDetails'

const stepInMs = 50

export interface SavingsTokenDetails {
  APY: Percentage
  tokenWithBalance: TokenWithBalance
  currentProjections: Projections
  depositedUSD: NormalizedUnitNumber
  depositedUSDPrecision: number
}

export interface UseSavingsResults {
  guestMode: boolean
  openDialog: OpenDialogFunction
  openSandboxModal: () => void
  savingsDetails:
    | {
        state: 'supported'
        assetsInWallet: TokenWithBalance[]
        totalEligibleCashUSD: NormalizedUnitNumber
        maxBalanceToken: TokenWithBalance
        chainId: SupportedChainId
        opportunityProjections: Projections
        migrationInfo?: MigrationInfo
        sDaiDetails?: SavingsTokenDetails
        sNSTDetails?: SavingsTokenDetails
      }
    | { state: 'unsupported' }
}
export function useSavings(): UseSavingsResults {
  const { savingsDaiInfo } = useSavingsDaiInfo()
  const { savingsNstInfo } = useSavingsNstInfo()
  const guestMode = useAccount().isConnected === false
  const { inputTokens, sDaiWithBalance, sNSTWithBalance } = useSavingsTokens()
  const { id: originChainId, extraTokens } = useChainConfigEntry()
  const { tokensInfo } = useTokensInfo({ tokens: extraTokens })
  const { timestamp, timestampInMs } = useTimestamp({
    refreshIntervalInMs: savingsDaiInfo?.supportsRealTimeInterestAccrual ? stepInMs : undefined,
  })
  const openDialog = useOpenDialog()

  const { totalUSD: totalEligibleCashUSD, maxBalanceToken } = calculateMaxBalanceTokenAndTotal({
    assets: inputTokens,
  })

  const sDaiDetails = makeSavingsTokenDetails({
    savingsInfo: savingsDaiInfo,
    savingsTokenWithBalance: sDaiWithBalance,
    eligibleCashUSD: totalEligibleCashUSD,
    timestamp,
    timestampInMs,
    stepInMs,
  })

  const sNSTDetails = makeSavingsTokenDetails({
    savingsInfo: savingsNstInfo,
    savingsTokenWithBalance: sNSTWithBalance,
    eligibleCashUSD: totalEligibleCashUSD,
    timestamp,
    timestampInMs,
    stepInMs,
  })

  // biome-ignore lint/correctness/useExhaustiveDependencies:
  const migrationInfo = useMemo(
    () =>
      makeMigrationInfo({
        savingsNstInfo,
        savingsDaiInfo,
        tokensInfo,
        openDialog,
      }),
    [!savingsDaiInfo, !savingsNstInfo, tokensInfo.DAI, tokensInfo.NST, openDialog],
  )

  function openSandboxModal(): void {
    openDialog(SandboxDialog, { mode: 'ephemeral' } as const)
  }

  if (!sDaiDetails && !sNSTDetails) {
    return {
      guestMode,
      openDialog,
      openSandboxModal,
      savingsDetails: { state: 'unsupported' },
    }
  }

  const opportunityProjections =
    sNSTDetails?.opportunityProjections ??
    sDaiDetails?.opportunityProjections ??
    raise('Savings opportunity projections should be defined')

  return {
    guestMode,
    openSandboxModal,
    openDialog,
    savingsDetails: {
      state: 'supported',
      assetsInWallet: inputTokens,
      totalEligibleCashUSD,
      maxBalanceToken,
      chainId: originChainId,
      opportunityProjections,
      sDaiDetails,
      sNSTDetails,
      migrationInfo,
    },
  }
}
