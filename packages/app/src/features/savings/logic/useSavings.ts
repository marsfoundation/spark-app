import { getChainConfigEntry } from '@/config/chain'
import { SupportedChainId } from '@/config/chain/types'
import { sortByUsdValueWithUsdsPriority } from '@/domain/common/sorters'
import { TokenWithBalance } from '@/domain/common/types'
import { useGetBlockExplorerAddressLink } from '@/domain/hooks/useGetBlockExplorerAddressLink'
import { usePageChainId } from '@/domain/hooks/usePageChainId'
import {
  UseSavingsChartsInfoQueryResult,
  useSavingsChartsInfoQuery,
} from '@/domain/savings-charts/useSavingsChartsInfoQuery'
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
        savingsChartsInfo: UseSavingsChartsInfoQueryResult
      }
    | { state: 'unsupported' }
}
export function useSavings(): UseSavingsResults {
  const pageChainId = usePageChainId()
  const { savingsDaiInfo } = useSavingsDaiInfo({ chainId: pageChainId })
  const { savingsUsdsInfo } = useSavingsUsdsInfo({ chainId: pageChainId })
  const { inputTokens, sDaiWithBalance, sUSDSWithBalance } = useSavingsTokens({ chainId: pageChainId })
  const { id: originChainId, extraTokens } = getChainConfigEntry(pageChainId)
  const { tokensInfo } = useTokensInfo({ tokens: extraTokens, chainId: pageChainId })
  const { timestamp, timestampInMs } = useTimestamp({
    refreshIntervalInMs: savingsDaiInfo?.supportsRealTimeInterestAccrual ? stepInMs : undefined,
  })
  const openDialog = useOpenDialog()
  const { showWelcomeDialog, saveConfirmedWelcomeDialog } = useWelcomeDialog({
    chainId: pageChainId,
  })
  const getBlockExplorerLink = useGetBlockExplorerAddressLink()

  const { totalUSD: totalEligibleCashUSD, maxBalanceToken } = calculateMaxBalanceTokenAndTotal({
    assets: inputTokens,
  })

  const savingsChartsInfo = useSavingsChartsInfoQuery({
    savingsDaiInfo,
    savingsUsdsInfo,
    sDaiWithBalance,
    sUSDSWithBalance,
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

  const savingsMeta = makeSavingsMeta(pageChainId)

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
      savingsChartsInfo,
    },
  }
}
