import { getChainConfigEntry } from '@/config/chain'
import { sortByUsdValueWithUsdsPriority } from '@/domain/common/sorters'
import { TokenWithBalance } from '@/domain/common/types'
import { useGetBlockExplorerAddressLink } from '@/domain/hooks/useGetBlockExplorerAddressLink'
import { usePageChainId } from '@/domain/hooks/usePageChainId'
import {
  UseSavingsChartsInfoQueryResult,
  useSavingsChartsInfoQuery,
} from '@/domain/savings-charts/useSavingsChartsInfoQuery'
import { useSavingsAccountRepository } from '@/domain/savings-info/useSavingsAccountRepository'
import { calculateMaxBalanceTokenAndTotal } from '@/domain/savings/calculateMaxBalanceTokenAndTotal'
import { useSavingsTokens } from '@/domain/savings/useSavingsTokens'
import { OpenDialogFunction, useOpenDialog } from '@/domain/state/dialogs'
import { Token } from '@/domain/types/Token'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { useTokensInfo } from '@/domain/wallet/useTokens/useTokensInfo'
import { useTimestamp } from '@/utils/useTimestamp'
import { NormalizedUnitNumber, Percentage } from '@marsfoundation/common-universal'
import { useState } from 'react'
import { Projections } from '../types'
import { getInterestData } from './getInterestData'
import { MigrationInfo, makeMigrationInfo } from './makeMigrationInfo'
import { SavingsOverview } from './makeSavingsOverview'

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
  liquidity: number
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
  users: number
  tvl: number
  openDialog: OpenDialogFunction
}
export function useSavings(): UseSavingsResults {
  const { chainId } = usePageChainId()
  const { inputTokens } = useSavingsTokens({ chainId })
  const { extraTokens, psmStables } = getChainConfigEntry(chainId)
  const { tokensInfo } = useTokensInfo({ tokens: extraTokens, chainId })
  const savingsAccounts = useSavingsAccountRepository({ chainId })
  const { timestamp } = useTimestamp()
  const openDialog = useOpenDialog()
  const getBlockExplorerLink = useGetBlockExplorerAddressLink()

  const [selectedAccount, setSelectedAccount] = useState<TokenSymbol>(TokenSymbol('sUSDC'))

  const { maxBalanceToken } = calculateMaxBalanceTokenAndTotal({
    assets: inputTokens,
  })

  const selectedAccountData = {
    ...savingsAccounts.findOneBySavingsTokenSymbol(selectedAccount),
    savingsTokenBalance: tokensInfo.findOneBalanceBySymbol(selectedAccount),
  }
  const savingsChartsInfo = useSavingsChartsInfoQuery({
    savingsInfo: selectedAccountData.converter,
    savingsTokenWithBalance: {
      token: selectedAccountData.savingsToken,
      balance: selectedAccountData.savingsTokenBalance,
    },
  })

  const migrationInfo = makeMigrationInfo({
    selectedAccount,
    savingsAccounts,
    openDialog,
  })

  const entryAssets = sortByUsdValueWithUsdsPriority(inputTokens, tokensInfo).map((tokenWithBalance) => ({
    ...tokenWithBalance,
    blockExplorerLink: getBlockExplorerLink(tokenWithBalance.token.address),
  }))

  const allAccounts: ShortAccountDefinition[] = savingsAccounts
    .all()
    .map(({ underlyingToken, savingsToken, converter }) => {
      const savingsTokenBalance = tokensInfo.findOneBalanceBySymbol(savingsToken.symbol)
      const underlyingTokenDeposit = converter.convertToAssets({ shares: savingsTokenBalance })
      return { savingsToken, underlyingToken, underlyingTokenDeposit }
    })

  const interestData = getInterestData({
    savingsInfo: selectedAccountData.converter,
    savingsToken: selectedAccountData.savingsToken,
    savingsTokenBalance: selectedAccountData.savingsTokenBalance,
    timestamp,
  })

  return {
    openDialog,
    allAccounts,
    setSelectedAccount,
    // @todo: Populate with real data after adding BA endpoints
    users: 4_234,
    tvl: 2_320_691_847,
    selectedAccount: {
      chartsData: savingsChartsInfo,
      interestData,
      savingsToken: selectedAccountData.savingsToken,
      savingsTokenBalance: selectedAccountData.savingsTokenBalance,
      underlyingToken: selectedAccountData.underlyingToken,
      entryAssets,
      mostValuableAsset: maxBalanceToken,
      showConvertDialogButton: Boolean(psmStables && psmStables.length > 1),
      migrationInfo,
      // @todo: Populate with real data after adding BA endpoints
      liquidity: Number.POSITIVE_INFINITY,
    },
  }
}
