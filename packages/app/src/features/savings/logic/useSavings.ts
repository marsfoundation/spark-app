import { getChainConfigEntry } from '@/config/chain'
import { sortByUsdValueWithUsdsPriority } from '@/domain/common/sorters'
import { TokenWithBalance } from '@/domain/common/types'
import { useGetBlockExplorerAddressLink } from '@/domain/hooks/useGetBlockExplorerAddressLink'
import { usePageChainId } from '@/domain/hooks/usePageChainId'
import { UseSavingsChartsDataResult, useSavingsChartsData } from '@/domain/savings-charts/useSavingsChartsData'
import { calculateMaxBalanceTokenAndTotal } from '@/domain/savings/calculateMaxBalanceTokenAndTotal'
import { useSavingsAccountRepository } from '@/domain/savings/useSavingsAccountRepository'
import { useOpenDialog } from '@/domain/state/dialogs'
import { Token } from '@/domain/types/Token'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { useTokensInfo } from '@/domain/wallet/useTokens/useTokensInfo'
import { convertStablesDialogConfig } from '@/features/dialogs/convert-stables/ConvertStablesDialog'
import { savingsDepositDialogConfig } from '@/features/dialogs/savings/deposit/SavingsDepositDialog'
import { savingsWithdrawDialogConfig } from '@/features/dialogs/savings/withdraw/SavingsWithdrawDialog'
import { useTimestamp } from '@/utils/useTimestamp'
import { NormalizedUnitNumber, Percentage, raise } from '@marsfoundation/common-universal'
import { useCallback, useState } from 'react'
import { UseGeneralStatsResult, useGeneralStats } from './general-stats/useGeneralStats'
import { getInterestData } from './getInterestData'
import { MigrationInfo, makeMigrationInfo } from './makeMigrationInfo'
import { SavingsOverview } from './makeSavingsOverview'
import { usePrefetchValidators } from './usePrefetchValidators'

export interface InterestData {
  APY: Percentage
  oneYearProjection: NormalizedUnitNumber
  calculateUnderlyingTokenBalance: (timestampInMs: number) => SavingsOverview
  balanceRefreshIntervalInMs: number | undefined
}

export type ChartsData = UseSavingsChartsDataResult

export interface SavingsAccountSupportedStablecoin {
  token: Token
  balance: NormalizedUnitNumber
  blockExplorerLink: string | undefined
}

export interface AccountDefinition {
  savingsToken: Token
  savingsTokenBalance: NormalizedUnitNumber
  underlyingToken: Token
  supportedStablecoins: SavingsAccountSupportedStablecoin[]
  mostValuableAsset: TokenWithBalance
  interestData: InterestData
  chartsData: ChartsData
  showConvertDialogButton: boolean
  migrationInfo?: MigrationInfo
}

export interface ShortAccountDefinition {
  savingsToken: Token
  underlyingToken: Token
  underlyingTokenDeposit: NormalizedUnitNumber
}
export interface UseSavingsResults {
  allAccounts: ShortAccountDefinition[]
  selectedAccount: AccountDefinition
  setSelectedAccount: (savingsTokenSymbol: TokenSymbol) => void
  generalStats: UseGeneralStatsResult
  openDepositDialog: (tokenToDeposit: Token) => void
  openSendDialog: () => void
  openWithdrawDialog: () => void
  openConvertStablesDialog: () => void
}
export function useSavings(): UseSavingsResults {
  const { chainId } = usePageChainId()
  const { extraTokens, psmStables, savings } = getChainConfigEntry(chainId)
  const { tokensInfo } = useTokensInfo({ tokens: extraTokens, chainId })
  const savingsAccounts = useSavingsAccountRepository({ chainId })
  const { timestamp } = useTimestamp()
  const openDialog = useOpenDialog()
  const getBlockExplorerLink = useGetBlockExplorerAddressLink()

  usePrefetchValidators({ chainId, tokensInfo, savingsAccounts })

  const firstAccountInConfig = savings?.accounts?.[0] ?? raise('There are no accounts in config')
  const [_selectedAccount, setSelectedAccount] = useState<TokenSymbol>(firstAccountInConfig.savingsToken)
  const selectedAccount = savings?.accounts?.find(({ savingsToken }) => savingsToken === _selectedAccount)
    ? _selectedAccount
    : firstAccountInConfig.savingsToken
  const selectedAccountConfig = savings?.accounts?.find(({ savingsToken }) => savingsToken === selectedAccount)
  const selectedAccountData = {
    ...savingsAccounts.findOneBySavingsTokenSymbol(selectedAccount),
    savingsTokenBalance: tokensInfo.findOneBalanceBySymbol(selectedAccount),
  }
  const supportedStablecoins = (selectedAccountConfig?.supportedStablecoins ?? []).map((symbol) =>
    tokensInfo.findOneTokenWithBalanceBySymbol(symbol),
  )

  const { maxBalanceToken } = calculateMaxBalanceTokenAndTotal({
    assets: supportedStablecoins,
  })

  const savingsChartsData = useSavingsChartsData({
    savingsConverter: selectedAccountData.converter,
    savingsTokenBalance: selectedAccountData.savingsTokenBalance,
    getEarningsApiUrl: selectedAccountConfig?.getEarningsApiUrl,
    savingsRateApiUrl: selectedAccountConfig?.savingsRateApiUrl,
  })

  const migrationInfo = makeMigrationInfo({
    selectedAccount,
    savingsAccounts,
    openDialog,
  })

  const sortedSupportedStablecoins = sortByUsdValueWithUsdsPriority(supportedStablecoins, tokensInfo).map(
    (tokenWithBalance) => ({
      ...tokenWithBalance,
      blockExplorerLink: getBlockExplorerLink(tokenWithBalance.token.address),
    }),
  )

  const allAccounts: ShortAccountDefinition[] = savingsAccounts
    .all()
    .map(({ underlyingToken, savingsToken, converter }) => {
      const savingsTokenBalance = tokensInfo.findOneBalanceBySymbol(savingsToken.symbol)
      const underlyingTokenDeposit = converter.convertToAssets({ shares: savingsTokenBalance })
      return { savingsToken, underlyingToken, underlyingTokenDeposit }
    })

  const interestData = getInterestData({
    savingsConverter: selectedAccountData.converter,
    savingsToken: selectedAccountData.savingsToken,
    savingsTokenBalance: selectedAccountData.savingsTokenBalance,
    timestamp,
  })

  const generalStats = useGeneralStats()

  // @note: Memoized for tanstack table
  const openDepositDialog = useCallback(
    (tokenToDeposit: Token) =>
      openDialog(savingsDepositDialogConfig, {
        initialToken: tokenToDeposit,
        savingsToken: selectedAccountData.savingsToken,
        underlyingToken: selectedAccountData.underlyingToken,
      }),
    [openDialog, selectedAccountData.savingsToken, selectedAccountData.underlyingToken],
  )

  function openConvertStablesDialog(): void {
    openDialog(convertStablesDialogConfig, { proceedText: 'Back to Savings' })
  }
  function openSendDialog(): void {
    openDialog(savingsWithdrawDialogConfig, {
      mode: 'send' as const,
      savingsToken: selectedAccountData.savingsToken,
      underlyingToken: selectedAccountData.underlyingToken,
    })
  }
  function openWithdrawDialog(): void {
    openDialog(savingsWithdrawDialogConfig, {
      mode: 'withdraw' as const,
      savingsToken: selectedAccountData.savingsToken,
      underlyingToken: selectedAccountData.underlyingToken,
    })
  }

  return {
    allAccounts,
    setSelectedAccount,
    generalStats,
    openDepositDialog,
    openSendDialog,
    openWithdrawDialog,
    openConvertStablesDialog,
    selectedAccount: {
      chartsData: savingsChartsData,
      interestData,
      savingsToken: selectedAccountData.savingsToken,
      savingsTokenBalance: selectedAccountData.savingsTokenBalance,
      underlyingToken: selectedAccountData.underlyingToken,
      supportedStablecoins: sortedSupportedStablecoins,
      mostValuableAsset: maxBalanceToken,
      showConvertDialogButton: Boolean(psmStables && psmStables.length > 1),
      migrationInfo,
    },
  }
}
