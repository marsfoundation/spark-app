import { SupportedChainId } from '@/config/chain/types'
import { sortByUsdValueWithUsdsPriority } from '@/domain/common/sorters'
import { TokenWithBalance } from '@/domain/common/types'
import { useChainConfigEntry } from '@/domain/hooks/useChainConfigEntry'
import { useGetBlockExplorerAddressLink } from '@/domain/hooks/useGetBlockExplorerAddressLink'
import { useSavingsDaiInfo } from '@/domain/savings-info/useSavingsDaiInfo'
import { useSavingsUsdsInfo } from '@/domain/savings-info/useSavingsUsdsInfo'
import { calculateMaxBalanceTokenAndTotal } from '@/domain/savings/calculateMaxBalanceTokenAndTotal'
import { useSavingsTokens } from '@/domain/savings/useSavingsTokens'
import { OpenDialogFunction, useOpenDialog } from '@/domain/state/dialogs'
import { NormalizedUnitNumber, Percentage } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'
import { useTokensInfo } from '@/domain/wallet/useTokens/useTokensInfo'
import { raise } from '@/utils/assert'
import { useTimestamp } from '@/utils/useTimestamp'
import { useMemo } from 'react'
import { useChainId } from 'wagmi'
import { Projections } from '../types'
import { MigrationInfo, makeMigrationInfo } from './makeMigrationInfo'
import { SavingsMeta, makeSavingsMeta } from './makeSavingsMeta'
import { makeSavingsTokenDetails } from './makeSavingsTokenDetails'
import { useWelcomeDialog } from './useWelcomeDialog'

const stepInMs = 50

export interface SavingsTokenDetails {
  APY: Percentage
  tokenWithBalance: TokenWithBalance
  currentProjections: Projections
  depositedUSD: NormalizedUnitNumber
  depositedUSDPrecision: number
}

export interface AssetInWallet {
  token: Token
  balance: NormalizedUnitNumber
  blockExplorerLink: string | undefined
}

export interface UseSavingsResults {
  openDialog: OpenDialogFunction
  savingsDetails:
    | {
        state: 'supported'
        assetsInWallet: AssetInWallet[]
        totalEligibleCashUSD: NormalizedUnitNumber
        maxBalanceToken: TokenWithBalance
        originChainId: SupportedChainId
        opportunityProjections: Projections
        migrationInfo?: MigrationInfo
        sDaiDetails?: SavingsTokenDetails
        sUSDSDetails?: SavingsTokenDetails
        savingsMeta: SavingsMeta
        showWelcomeDialog: boolean
        saveConfirmedWelcomeDialog: (confirmedWelcomeDialog: boolean) => void
      }
    | { state: 'unsupported' }
}
export function useSavings(): UseSavingsResults {
  const chainId = useChainId()
  const { savingsDaiInfo } = useSavingsDaiInfo()
  const { savingsUsdsInfo } = useSavingsUsdsInfo()
  const { inputTokens, sDaiWithBalance, sUSDSWithBalance } = useSavingsTokens()
  const { id: originChainId, extraTokens } = useChainConfigEntry()
  const { tokensInfo } = useTokensInfo({ tokens: extraTokens })
  const { timestamp, timestampInMs } = useTimestamp({
    refreshIntervalInMs: savingsDaiInfo?.supportsRealTimeInterestAccrual ? stepInMs : undefined,
  })
  const openDialog = useOpenDialog()
  const { showWelcomeDialog, saveConfirmedWelcomeDialog } = useWelcomeDialog()
  const getBlockExplorerLink = useGetBlockExplorerAddressLink()

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

  const sUSDSDetails = makeSavingsTokenDetails({
    savingsInfo: savingsUsdsInfo,
    savingsTokenWithBalance: sUSDSWithBalance,
    eligibleCashUSD: totalEligibleCashUSD,
    timestamp,
    timestampInMs,
    stepInMs,
  })

  // biome-ignore lint/correctness/useExhaustiveDependencies:
  const migrationInfo = useMemo(
    () =>
      makeMigrationInfo({
        savingsUsdsInfo,
        savingsDaiInfo,
        tokensInfo,
        openDialog,
      }),
    [!savingsDaiInfo, !savingsUsdsInfo, tokensInfo.DAI, tokensInfo.USDS, openDialog],
  )

  if (!sDaiDetails && !sUSDSDetails) {
    return {
      openDialog,
      savingsDetails: { state: 'unsupported' },
    }
  }

  const opportunityProjections =
    sUSDSDetails?.opportunityProjections ??
    sDaiDetails?.opportunityProjections ??
    raise('Savings opportunity projections should be defined')

  const assetsInWallet = sortByUsdValueWithUsdsPriority(inputTokens, tokensInfo).map((tokenWithBalance) => ({
    ...tokenWithBalance,
    blockExplorerLink: getBlockExplorerLink(tokenWithBalance.token.address),
  }))

  const savingsMeta = makeSavingsMeta(chainId)

  return {
    openDialog,
    savingsDetails: {
      state: 'supported',
      assetsInWallet,
      totalEligibleCashUSD,
      maxBalanceToken,
      originChainId,
      opportunityProjections,
      sDaiDetails,
      sUSDSDetails,
      savingsMeta,
      migrationInfo,
      showWelcomeDialog,
      saveConfirmedWelcomeDialog,
    },
  }
}
