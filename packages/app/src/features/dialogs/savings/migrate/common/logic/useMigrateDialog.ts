import { TokenWithBalance } from '@/domain/common/types'
import { useChainConfigEntry } from '@/domain/hooks/useChainConfigEntry'
import { useSavingsDaiInfo } from '@/domain/savings-info/useSavingsDaiInfo'
import { useSavingsUsdsInfo } from '@/domain/savings-info/useSavingsUsdsInfo'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { useTokensInfo } from '@/domain/wallet/useTokens/useTokensInfo'
import { InjectedActionsContext, Objective } from '@/features/actions/logic/types'
import { AssetInputSchema } from '@/features/dialogs/common/logic/form'
import { FormFieldsForDialog, PageState, PageStatus } from '@/features/dialogs/common/types'
import { useDebouncedDialogFormValues } from '@/features/dialogs/savings/common/logic/form'
import { assert } from '@/utils/assert'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { UseFormReturn, useForm } from 'react-hook-form'
import { MigrateDialogTxOverview } from '../types'
import { createMigrateObjectives } from './createMigrateObjectives'
import { createTxOverview } from './createTxOverview'
import { getFormFieldsForMigrateDialog } from './form'
import { useFromTokenInfo } from './useFromTokenInfo'
import { getMigrateDialogFormValidator } from './validation'

export interface UseMigrateDialogParams {
  type: 'upgrade' | 'downgrade'
  fromToken: Token
  toToken: Token
}

export interface UseMigrateDialogResult {
  selectableAssets: TokenWithBalance[]
  assetsFields: FormFieldsForDialog
  form: UseFormReturn<AssetInputSchema>
  objectives: Objective[]
  pageStatus: PageStatus
  migrationAmount: NormalizedUnitNumber
  actionsContext: InjectedActionsContext
  txOverview: MigrateDialogTxOverview
  dai: TokenSymbol
  sdai: TokenSymbol
}

export function useMigrateDialog({ type, fromToken, toToken }: UseMigrateDialogParams): UseMigrateDialogResult {
  const [pageStatus, setPageStatus] = useState<PageState>('form')
  const { extraTokens, daiSymbol, sDaiSymbol } = useChainConfigEntry()
  const { tokensInfo } = useTokensInfo({ tokens: extraTokens })
  const { savingsUsdsInfo } = useSavingsUsdsInfo()
  const { savingsDaiInfo } = useSavingsDaiInfo()
  const fromTokenWithBalance = useFromTokenInfo(fromToken.symbol)
  assert(savingsUsdsInfo, 'USDS savings info is required for upgrade dialog')
  assert(savingsDaiInfo, 'DAI savings info is required for upgrade dialog')

  const form = useForm<AssetInputSchema>({
    resolver: zodResolver(getMigrateDialogFormValidator(tokensInfo)),
    defaultValues: {
      symbol: fromToken.symbol,
      value: type === 'downgrade' ? '' : fromTokenWithBalance.balance.toFixed(),
      isMaxSelected: type === 'upgrade',
    },
    mode: 'onChange',
  })

  const {
    debouncedFormValues: formValues,
    isDebouncing,
    isFormValid,
  } = useDebouncedDialogFormValues({
    form,
    tokensInfo,
  })

  const objectives = createMigrateObjectives({ type, fromToken, toToken, amount: formValues.value })
  const actionsEnabled = formValues.value.gt(0) && isFormValid && !isDebouncing

  const txOverview = createTxOverview({
    formValues,
    tokensInfo,
    outputToken: toToken,
    savingsDaiInfo: savingsDaiInfo,
    savingsUsdsInfo: savingsUsdsInfo,
  })

  return {
    selectableAssets: [fromTokenWithBalance],
    assetsFields: getFormFieldsForMigrateDialog(form, tokensInfo),
    form,
    objectives,
    migrationAmount: formValues.value,
    actionsContext: {
      tokensInfo,
    },
    pageStatus: {
      actionsEnabled,
      state: pageStatus,
      goToSuccessScreen: () => setPageStatus('success'),
    },
    txOverview,
    dai: daiSymbol,
    sdai: sDaiSymbol,
  }
}
