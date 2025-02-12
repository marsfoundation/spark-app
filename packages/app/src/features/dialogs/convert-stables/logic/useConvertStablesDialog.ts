import { useChainConfigEntry } from '@/domain/hooks/useChainConfigEntry'
import { useTokenRepositoryForFeature } from '@/domain/token-repository/useTokenRepositoryForFeature'
import { ConvertStablesObjective } from '@/features/actions/flavours/convert-stables/types'
import { InjectedActionsContext, Objective } from '@/features/actions/logic/types'
import { PageState, PageStatus } from '@/features/dialogs/common/types'
import { useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { ConvertStablesFormFields } from '../types'
import { TxOverview, createTxOverview } from './createTxOverview'
import { ConvertStablesFormSchema } from './form/schema'
import { useConvertStablesForm } from './form/useConvertStablesForm'

export interface UseConvertStablesDialogResult {
  formFields: ConvertStablesFormFields
  form: UseFormReturn<ConvertStablesFormSchema>
  objectives: Objective[]
  pageStatus: PageStatus
  txOverview: TxOverview
  actionsContext: InjectedActionsContext
}

export function useConvertStablesDialog(): UseConvertStablesDialogResult {
  const chainConfig = useChainConfigEntry()
  const { tokenRepository } = useTokenRepositoryForFeature({ featureGroup: 'savings' })

  const [pageStatus, setPageStatus] = useState<PageState>('form')
  const { form, formValues, formFields, isDebouncing, isFormValid } = useConvertStablesForm({
    tokenRepository,
    psmStables: chainConfig.savings?.psmStables,
  })
  const objectives: ConvertStablesObjective[] = [{ type: 'convertStables', ...formValues }]
  const txOverview = createTxOverview({ ...formValues })
  const actionsEnabled = formValues.amount.gt(0) && isFormValid && !isDebouncing

  return {
    form,
    formFields,
    objectives,
    txOverview,
    pageStatus: {
      state: pageStatus,
      actionsEnabled,
      goToSuccessScreen: () => setPageStatus('success'),
    },
    actionsContext: { tokenRepository },
  }
}
