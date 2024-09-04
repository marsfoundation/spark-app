import { useChainConfigEntry } from '@/domain/hooks/useChainConfigEntry'
import { useConditionalFreeze } from '@/domain/hooks/useConditionalFreeze'
import { useSavingsDaiInfo } from '@/domain/savings-info/useSavingsDaiInfo'
import { useSavingsUsdsInfo } from '@/domain/savings-info/useSavingsUsdsInfo'
import { NormalizedUnitNumber, Percentage } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'
import { TokensInfo } from '@/domain/wallet/useTokens/TokenInfo'
import { useTokensInfo } from '@/domain/wallet/useTokens/useTokensInfo'
import { InjectedActionsContext, Objective } from '@/features/actions/logic/types'
import { PageState, PageStatus } from '@/features/dialogs/common/types'
import { determineApyImprovement } from '@/features/savings-with-usds/logic/determineApyImprovement'
import { assert } from '@/utils/assert'
import { useState } from 'react'
import { createMigrateObjectives } from './createMigrateObjectives'

export interface UseMigrateDialogParams {
  type: 'upgrade' | 'downgrade'
  fromToken: Token
  toToken: Token
}

export interface UseMigrateDialogResult {
  objectives: Objective[]
  pageStatus: PageStatus
  migrationAmount: NormalizedUnitNumber
  tokensInfo: TokensInfo
  apyImprovement?: Percentage
  actionsContext: InjectedActionsContext
}

export function useMigrateDialog({ type, fromToken, toToken }: UseMigrateDialogParams): UseMigrateDialogResult {
  const [pageStatus, setPageStatus] = useState<PageState>('form')
  const { extraTokens } = useChainConfigEntry()
  const { tokensInfo } = useTokensInfo({ tokens: extraTokens })
  const { savingsUsdsInfo } = useSavingsUsdsInfo()
  const { savingsDaiInfo } = useSavingsDaiInfo()
  assert(savingsUsdsInfo, 'USDS savings info is required for upgrade dialog')
  assert(savingsDaiInfo, 'DAI savings info is required for upgrade dialog')

  const fromTokenBalance = useConditionalFreeze(
    tokensInfo.findOneBalanceBySymbol(fromToken.symbol),
    pageStatus === 'success',
  )
  const objectives = createMigrateObjectives({ type, fromToken, toToken, amount: fromTokenBalance })

  return {
    objectives,
    migrationAmount: fromTokenBalance,
    apyImprovement: determineApyImprovement({ savingsUsdsInfo, savingsDaiInfo }),
    tokensInfo,
    actionsContext: {
      tokensInfo,
    },
    pageStatus: {
      actionsEnabled: true,
      state: pageStatus,
      goToSuccessScreen: () => setPageStatus('success'),
    },
  }
}
