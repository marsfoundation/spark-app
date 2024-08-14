import { useChainConfigEntry } from '@/domain/hooks/useChainConfigEntry'
import { useSavingsNstInfo } from '@/domain/savings-info/useSavingsNstInfo'
import { NormalizedUnitNumber, Percentage } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'
import { TokensInfo } from '@/domain/wallet/useTokens/TokenInfo'
import { useTokensInfo } from '@/domain/wallet/useTokens/useTokensInfo'
import { Objective } from '@/features/actions/logic/types'
import { PageState, PageStatus } from '@/features/dialogs/common/types'
import { assert } from '@/utils/assert'
import { useState } from 'react'
import { createUpgradeObjectives } from './createUpgradeObjectives'

export interface UseUpgradeDialogParams {
  fromToken: Token
  toToken: Token
}

export interface UseUpgradeDialogResult {
  objectives: Objective[]
  pageStatus: PageStatus
  upgradedAmount: NormalizedUnitNumber
  tokensInfo: TokensInfo
  sNstAPY: Percentage
}

export function useUpgradeDialog({ fromToken, toToken }: UseUpgradeDialogParams): UseUpgradeDialogResult {
  const [pageStatus, setPageStatus] = useState<PageState>('form')
  const { extraTokens } = useChainConfigEntry()
  const { tokensInfo } = useTokensInfo({ tokens: extraTokens })
  const fromTokenBalance = tokensInfo.findOneBalanceBySymbol(fromToken.symbol)
  const objectives = createUpgradeObjectives({ fromToken, toToken, amount: fromTokenBalance })
  const { savingsNstInfo } = useSavingsNstInfo()
  assert(savingsNstInfo, 'NST savings info is required for upgrade dialog')

  return {
    objectives,
    upgradedAmount: fromTokenBalance,
    sNstAPY: savingsNstInfo.apy,
    tokensInfo,
    pageStatus: {
      actionsEnabled: true,
      state: pageStatus,
      goToSuccessScreen: () => setPageStatus('success'),
    },
  }
}
