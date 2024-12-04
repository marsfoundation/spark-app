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
import { Token } from '@/domain/types/Token'
import { useTokensInfo } from '@/domain/wallet/useTokens/useTokensInfo'
import { useTimestamp } from '@/utils/useTimestamp'
import { NormalizedUnitNumber, Percentage } from '@marsfoundation/common-universal'
import { useMemo } from 'react'
import { Projections } from '../types'
import { MigrationInfo, makeMigrationInfo } from './makeMigrationInfo'
import { SavingsMeta, makeSavingsMeta } from './makeSavingsMeta'
import { SavingsOverview } from './makeSavingsOverview'
import { makeSavingsTokenDetails } from './makeSavingsTokenDetails'
import { useWelcomeDialog } from './useWelcomeDialog'

export interface SavingsTokenDetails {
  APY: Percentage
  currentProjections: Projections
  savingsTokenWithBalance: TokenWithBalance
  assetsToken: Token
  calculateSavingsBalance: (timestampInMs: number) => SavingsOverview
  balanceRefreshIntervalInMs: number | undefined
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
        migrationInfo?: MigrationInfo
        sDaiDetails?: SavingsTokenDetails
        sUSDSDetails?: SavingsTokenDetails
        savingsMeta: SavingsMeta
        showWelcomeDialog: boolean
        showConvertDialogButton: boolean
        saveConfirmedWelcomeDialog: (confirmedWelcomeDialog: boolean) => void
        savingsChartsInfo: UseSavingsChartsInfoQueryResult
      }
    | { state: 'unsupported' }
}
export function useSavings(): UseSavingsResults {
  const { chainId } = usePageChainId()
  const { savingsDaiInfo } = useSavingsDaiInfo({ chainId })
  const { savingsUsdsInfo } = useSavingsUsdsInfo({ chainId })
  const { inputTokens, sdaiWithBalance, susdsWithBalance } = useSavingsTokens({ chainId })
  const { originChainId, extraTokens, psmStables } = getChainConfigEntry(chainId)
  const { tokensInfo } = useTokensInfo({ tokens: extraTokens, chainId })
  const { timestamp } = useTimestamp()
  const openDialog = useOpenDialog()
  const { showWelcomeDialog, saveConfirmedWelcomeDialog } = useWelcomeDialog({
    chainId,
  })
  const getBlockExplorerLink = useGetBlockExplorerAddressLink()

  const { totalUSD: totalEligibleCashUSD, maxBalanceToken } = calculateMaxBalanceTokenAndTotal({
    assets: inputTokens,
  })

  const savingsChartsInfo = useSavingsChartsInfoQuery({
    savingsDaiInfo,
    savingsUsdsInfo,
    sdaiWithBalance,
    susdsWithBalance,
  })

  const sDaiDetails = makeSavingsTokenDetails({
    savingsInfo: savingsDaiInfo,
    savingsTokenWithBalance: sdaiWithBalance,
    assetsToken: tokensInfo.DAI,
    timestamp,
  })

  const sUSDSDetails = makeSavingsTokenDetails({
    savingsInfo: savingsUsdsInfo,
    savingsTokenWithBalance: susdsWithBalance,
    assetsToken: tokensInfo.USDS,
    timestamp,
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
      sDaiDetails,
      sUSDSDetails,
      savingsMeta,
      migrationInfo,
      showWelcomeDialog,
      showConvertDialogButton: Boolean(psmStables && psmStables.length > 1),
      saveConfirmedWelcomeDialog,
      savingsChartsInfo,
    },
  }
}
