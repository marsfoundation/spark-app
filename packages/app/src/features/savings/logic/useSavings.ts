import { getChainConfigEntry } from '@/config/chain'
import { sortByUsdValueWithUsdsPriority } from '@/domain/common/sorters'
import { TokenWithBalance } from '@/domain/common/types'
import { useGetBlockExplorerAddressLink } from '@/domain/hooks/useGetBlockExplorerAddressLink'
import { usePageChainId } from '@/domain/hooks/usePageChainId'
import { useSavingsChartsInfoQuery, UseSavingsChartsInfoQueryResult } from '@/domain/savings-charts/useSavingsChartsInfoQuery'
import { calculateMaxBalanceTokenAndTotal } from '@/domain/savings/calculateMaxBalanceTokenAndTotal'
import { useSavingsTokens } from '@/domain/savings/useSavingsTokens'
import { OpenDialogFunction, useOpenDialog } from '@/domain/state/dialogs'
import { Token } from '@/domain/types/Token'
import { useTokensInfo } from '@/domain/wallet/useTokens/useTokensInfo'
import { useTimestamp } from '@/utils/useTimestamp'
import { NormalizedUnitNumber, Percentage, raise } from '@marsfoundation/common-universal'
import { useState } from 'react'
import { Projections } from '../types'
import { MigrationInfo, makeMigrationInfo } from './makeMigrationInfo'
import { SavingsOverview } from './makeSavingsOverview'
import { getInterestData } from './getInterestData'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { useSavingsInfos } from './useSavingsInfos'
import { TokensInfo } from '@/domain/wallet/useTokens/TokenInfo'

export interface InterestData {
  APY: Percentage
  currentProjections: Projections
  calculateUnderlyingTokenBalance: (timestampInMs: number) => SavingsOverview
  balanceRefreshIntervalInMs: number | undefined
}

export type ChartsData = UseSavingsChartsInfoQueryResult

export interface SavingsAccountEntryAssets {
  token: Token
  balance: NormalizedUnitNumber
  blockExplorerLink: string | undefined
}

export interface AccountDefinition {
  savingsToken: Token
  savingsTokenBalance: NormalizedUnitNumber
  underlyingToken: Token
  entryAssets: SavingsAccountEntryAssets[]
  mostValuableAsset: TokenWithBalance
  interestData: InterestData
  chartsData: ChartsData
  showConvertDialogButton: boolean
  migrationInfo?: MigrationInfo
}

export interface ShortAccountDefinition {
  underlyingToken: Token
  underlyingTokenBalance: NormalizedUnitNumber
}

export interface UseSavingsResults {
  openDialog: OpenDialogFunction
  allAccounts: ShortAccountDefinition[]
  selectedAccount: AccountDefinition
}
export function useSavings(): UseSavingsResults {
  const { chainId } = usePageChainId()
  const { inputTokens } = useSavingsTokens({ chainId })
  const { extraTokens, psmStables } = getChainConfigEntry(chainId)
  const { tokensInfo } = useTokensInfo({ tokens: extraTokens, chainId })
  const savingsInfos = useSavingsInfos()
  const { timestamp } = useTimestamp()
  const openDialog = useOpenDialog()
  const getBlockExplorerLink = useGetBlockExplorerAddressLink()

  const [selectedAccount] = useState<TokenSymbol>(TokenSymbol('sUSDC'))

  const { maxBalanceToken } = calculateMaxBalanceTokenAndTotal({
    assets: inputTokens,
  })

  const selectedAccountData = getSelectedAccountData({ tokensInfo, savingsInfos, selectedAccount })
  const savingsChartsInfo = useSavingsChartsInfoQuery({
    savingsInfo: selectedAccountData.savingsInfo,
    savingsTokenWithBalance: { token: selectedAccountData.savingsToken, balance: selectedAccountData.savingsTokenBalance },
  })

  // biome-ignore lint/correctness/useExhaustiveDependencies:
  const migrationInfo = makeMigrationInfo({
    selectedAccount,
    accounts: savingsInfos,
    tokensInfo,
    openDialog,
  })

  const entryAssets = sortByUsdValueWithUsdsPriority(inputTokens, tokensInfo).map((tokenWithBalance) => ({
    ...tokenWithBalance,
    blockExplorerLink: getBlockExplorerLink(tokenWithBalance.token.address),
  }))

  const allAccounts: ShortAccountDefinition[] = savingsInfos.map(({
    savingsToken,
  }) => {
    const underlyingToken = savingsToUnderlyingToken(tokensInfo, savingsToken)
    return {
      underlyingToken,
      underlyingTokenBalance: tokensInfo.findOneBalanceBySymbol(underlyingToken.symbol),
    }
  })

  const interestData = getInterestData({
    savingsInfo: selectedAccountData.savingsInfo,
    savingsToken: selectedAccountData.savingsToken,
    savingsTokenBalance: selectedAccountData.savingsTokenBalance,
    timestamp,
  })

  return {
    openDialog,
    allAccounts,
    selectedAccount: {
      chartsData: savingsChartsInfo,
      interestData,
      savingsToken: selectedAccountData.savingsToken,
      savingsTokenBalance: selectedAccountData.savingsTokenBalance,
      underlyingToken: savingsToUnderlyingToken(tokensInfo, selectedAccountData.savingsToken),
      entryAssets,
      mostValuableAsset: maxBalanceToken,
      showConvertDialogButton: Boolean(psmStables && psmStables.length > 1),
      migrationInfo,
    },
  }
}

function getSelectedAccountData({ tokensInfo, savingsInfos, selectedAccount }: { tokensInfo: TokensInfo, savingsInfos: ReturnType<typeof useSavingsInfos>, selectedAccount: TokenSymbol }) {
  const account = savingsInfos.find((info) => info.savingsToken.symbol === selectedAccount) ?? raise('Wrong account selected')
  const savingsTokenWithBalance = tokensInfo.findOneTokenWithBalanceBySymbol(account.savingsToken.symbol)

  return {
    savingsInfo: account.savingsInfo,
    savingsToken: account.savingsToken,
    savingsTokenBalance: savingsTokenWithBalance.balance,
  }
}

function savingsToUnderlyingToken(tokensInfo: TokensInfo, savingsToken: Token) {
  const underlyingTokenSymbol = (() => {
    switch (savingsToken.symbol) {
      case TokenSymbol('sUSDS'): return TokenSymbol('USDS')
      case TokenSymbol('sDAI'): return TokenSymbol('DAI')
      case TokenSymbol('sUSDC'): return TokenSymbol('USDC')
      default:
        throw new Error(`Savings token ${savingsToken.symbol} is not supported`)
    }
  })()
  return tokensInfo.findOneTokenBySymbol(underlyingTokenSymbol)
}
