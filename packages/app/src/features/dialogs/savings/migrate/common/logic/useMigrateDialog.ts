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
import {
  getFieldsForTransferFromUserForm,
  useDebouncedFormValues,
} from '@/features/dialogs/common/logic/transfer-from-user/form'
import { FormFieldsForDialog, PageState, PageStatus } from '@/features/dialogs/common/types'
import { assert } from '@/utils/assert'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { UseFormReturn, useForm } from 'react-hook-form'
import { useChainId } from 'wagmi'
import { MigrateDialogTxOverview } from '../types'
import { createMigrateObjectives } from './createMigrateObjectives'
import { createTxOverview } from './createTxOverview'
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
  const chainId = useChainId()
  const [pageStatus, setPageStatus] = useState<PageState>('form')
  const { extraTokens, daiSymbol, sdaiSymbol } = useChainConfigEntry()
  const { tokensInfo } = useTokensInfo({ tokens: extraTokens })
  const { savingsUsdsInfo } = useSavingsUsdsInfo({ chainId })
  const { savingsDaiInfo } = useSavingsDaiInfo({ chainId })
  const fromTokenWithBalance = useFromTokenInfo(fromToken.symbol)
  assert(savingsUsdsInfo && savingsDaiInfo && daiSymbol && sdaiSymbol, 'Incorrect chain config for savings migration')

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
  } = useDebouncedFormValues({
    form,
    tokensInfo,
  })

  const objectives = createMigrateObjectives({ type, fromToken, toToken, amount: formValues.value })
  const actionsEnabled = formValues.value.gt(0) && isFormValid && !isDebouncing

  const txOverview = createTxOverview({
    formValues,
    tokensInfo,
    outputToken: toToken,
    savingsDaiInfo,
    savingsUsdsInfo,
  })

  return {
    selectableAssets: [fromTokenWithBalance],
    assetsFields: getFieldsForTransferFromUserForm({ form, tokensInfo }),
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
    sdai: sdaiSymbol,
  }
}
