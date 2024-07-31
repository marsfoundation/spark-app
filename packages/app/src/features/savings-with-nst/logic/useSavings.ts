import { getChainConfigEntry } from '@/config/chain'
import { SupportedChainId } from '@/config/chain/types'
import { TokenWithBalance } from '@/domain/common/types'
import { useOriginChainId } from '@/domain/hooks/useOriginChainId'
import { useSavingsDaiInfo } from '@/domain/savings-info/useSavingsDaiInfo'
import { useSavingsNstInfo } from '@/domain/savings-info/useSavingsNstInfo'
import { calculateMaxBalanceTokenAndTotal } from '@/domain/savings/calculateMaxBalanceTokenAndTotal'
import { OpenDialogFunction, useOpenDialog } from '@/domain/state/dialogs'
import { NormalizedUnitNumber, Percentage } from '@/domain/types/NumericValues'
import { useTokens } from '@/domain/wallet/useTokens/useTokens'
import { SandboxDialog } from '@/features/dialogs/sandbox/SandboxDialog'
import { Projections } from '@/features/savings/types'
import { useTimestamp } from '@/utils/useTimestamp'
import { useAccount, useChainId } from 'wagmi'
import { makeSavingsTokenDetails } from './makeSavingsTokenDetails'
import { useSavingsTokens } from './useSavingsInputTokens'

const stepInMs = 50

export interface SavingsTokenDetails {
  APY: Percentage
  tokenWithBalance: TokenWithBalance
  currentProjections: Projections
  opportunityProjections: Projections
  depositedUSD: NormalizedUnitNumber
  depositedUSDPrecision: number
}

export interface UseSavingsResults {
  guestMode: boolean
  openDialog: OpenDialogFunction
  openSandboxModal: () => void
  savingsDetails:
    | ({
        state: 'supported'
        assetsInWallet: TokenWithBalance[]
        totalEligibleCashUSD: NormalizedUnitNumber
        maxBalanceToken: TokenWithBalance
        originChainId: SupportedChainId
      } & (
        | {
            sDai: SavingsTokenDetails
          }
        | {
            sNST: SavingsTokenDetails
          }
        | {
            sDai: SavingsTokenDetails
            sNST: SavingsTokenDetails
          }
      ))
    | { state: 'unsupported' }
}
export function useSavings(): UseSavingsResults {
  const { savingsDaiInfo } = useSavingsDaiInfo()
  const { savingsNstInfo } = useSavingsNstInfo()
  const guestMode = useAccount().isConnected === false
  const inputTokens = useSavingsTokens()
  const chainId = useChainId()
  const originChainId = useOriginChainId()
  const chainConfig = getChainConfigEntry(chainId)
  const { timestamp, timestampInMs } = useTimestamp({
    refreshIntervalInMs: savingsDaiInfo?.supportsRealTimeInterestAccrual ? stepInMs : undefined,
  })
  const openDialog = useOpenDialog()

  const { totalUSD: totalEligibleCashUSD, maxBalanceToken } = calculateMaxBalanceTokenAndTotal({
    assets: inputTokens,
  })

  const { tokens } = useTokens({ tokens: getChainConfigEntry(chainId).extraTokens })
  const sDaiWithBalance = tokens.find(({ token }) => token.symbol === chainConfig.sDaiSymbol)
  const sNSTWithBalance = tokens.find(({ token }) => token.symbol === chainConfig.sNSTSymbol)

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

  function openSandboxModal(): void {
    openDialog(SandboxDialog, { mode: 'ephemeral' } as const)
  }

  const baseResult = {
    guestMode,
    openSandboxModal,
    openDialog,
    savingsDetails: {
      state: 'supported',
      assetsInWallet: inputTokens,
      totalEligibleCashUSD,
      maxBalanceToken,
      originChainId,
    },
  } as const

  if (sDaiDetails && sNSTDetails) {
    return {
      ...baseResult,
      savingsDetails: {
        ...baseResult.savingsDetails,
        sDai: sDaiDetails,
        sNST: sNSTDetails,
      },
    }
  }

  if (sDaiDetails) {
    return {
      ...baseResult,
      savingsDetails: {
        ...baseResult.savingsDetails,
        sDai: sDaiDetails,
      },
    }
  }

  if (sNSTDetails) {
    return {
      ...baseResult,
      savingsDetails: {
        ...baseResult.savingsDetails,
        sNST: sNSTDetails,
      },
    }
  }

  return {
    guestMode,
    openDialog,
    openSandboxModal,
    savingsDetails: { state: 'unsupported' },
  }
}