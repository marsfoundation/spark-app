import { SupportedChainId } from '@/config/chain/types'
import { TokenWithBalance } from '@/domain/common/types'
import { useOriginChainId } from '@/domain/hooks/useOriginChainId'
import { useSavingsDaiInfo } from '@/domain/savings-info/useSavingsDaiInfo'
import { useSavingsNstInfo } from '@/domain/savings-info/useSavingsNstInfo'
import { calculateMaxBalanceTokenAndTotal } from '@/domain/savings/calculateMaxBalanceTokenAndTotal'
import { useSavingsTokens } from '@/domain/savings/useSavingsTokens'
import { OpenDialogFunction, useOpenDialog } from '@/domain/state/dialogs'
import { NormalizedUnitNumber, Percentage } from '@/domain/types/NumericValues'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { SandboxDialog } from '@/features/dialogs/sandbox/SandboxDialog'
import { Projections } from '@/features/savings/types'
import { raise } from '@/utils/assert'
import { useTimestamp } from '@/utils/useTimestamp'
import { useAccount } from 'wagmi'
import { makeSavingsTokenDetails } from './makeSavingsTokenDetails'

const stepInMs = 50

export interface SavingsTokenDetails {
  APY: Percentage
  tokenWithBalance: TokenWithBalance
  currentProjections: Projections
  depositedUSD: NormalizedUnitNumber
  depositedUSDPrecision: number
}

export interface UpgradeInfo {
  isUpgradable: boolean
  tokenToUpgrade: TokenSymbol
  upgradedToken: TokenSymbol
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
        upgradeInfo?: UpgradeInfo
        sDaiDetails?: SavingsTokenDetails
        sNSTDetails?: SavingsTokenDetails
      }
    | { state: 'unsupported' }
}
export function useSavings(): UseSavingsResults {
  const { savingsDaiInfo } = useSavingsDaiInfo()
  const { savingsNstInfo } = useSavingsNstInfo()
  const guestMode = useAccount().isConnected === false
  const { inputTokens, dai, nst, sDaiWithBalance, sNSTWithBalance } = useSavingsTokens()
  const originChainId = useOriginChainId()
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
    baseToken: dai,
    eligibleCashUSD: totalEligibleCashUSD,
    timestamp,
    timestampInMs,
    stepInMs,
  })

  const sNSTDetails = makeSavingsTokenDetails({
    savingsInfo: savingsNstInfo,
    savingsTokenWithBalance: sNSTWithBalance,
    baseToken: nst,
    eligibleCashUSD: totalEligibleCashUSD,
    timestamp,
    timestampInMs,
    stepInMs,
  })

  const upgradeInfo =
    sDaiDetails && sNSTDetails
      ? {
          isUpgradable: true,
          tokenToUpgrade: sDaiDetails.baseTokenSymbol,
          upgradedToken: sNSTDetails.baseTokenSymbol,
        }
      : undefined

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
      upgradeInfo,
    },
  }
}
