import { TokenWithBalance, TokenWithValue } from '@/domain/common/types'
import { useSavingsDaiInfo } from '@/domain/savings-info/useSavingsDaiInfo'
import { useSavingsNstInfo } from '@/domain/savings-info/useSavingsNstInfo'
import { useSavingsTokens } from '@/domain/savings/useSavingsTokens'
import { Token } from '@/domain/types/Token'
import { Objective } from '@/features/actions/logic/types'
import { AssetInputSchema } from '@/features/dialogs/common/logic/form'
import { FormFieldsForDialog, PageState, PageStatus } from '@/features/dialogs/common/types'
import { assert } from '@/utils/assert'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { UseFormReturn, useForm } from 'react-hook-form'
import { useChainId } from 'wagmi'
import { useDebouncedDialogFormValues } from '../../common/logic/form'
import { SavingsDialogTxOverview } from '../../common/types'
import { createTxOverview } from './createTxOverview'
import { getFormFieldsForDepositDialog } from './form'
import { createObjectives } from './objectives'
import { getSavingsDepositDialogFormValidator } from './validation'

export interface UseSavingsDepositDialogParams {
  initialToken: Token
}

export interface UseSavingsDepositDialogResults {
  selectableAssets: TokenWithBalance[]
  assetsFields: FormFieldsForDialog
  form: UseFormReturn<AssetInputSchema>
  objectives: Objective[]
  tokenToDeposit: TokenWithValue
  pageStatus: PageStatus
  txOverview: SavingsDialogTxOverview
}

export function useSavingsDepositDialog({
  initialToken,
}: UseSavingsDepositDialogParams): UseSavingsDepositDialogResults {
  const { savingsDaiInfo } = useSavingsDaiInfo()
  const { savingsNstInfo } = useSavingsNstInfo()
  assert(savingsDaiInfo || savingsNstInfo, 'Neither sDai nor sNST is supported')
  const chainId = useChainId()

  const { tokensInfo, inputTokens, sDaiWithBalance } = useSavingsTokens()

  const [pageStatus, setPageStatus] = useState<PageState>('form')

  const form = useForm<AssetInputSchema>({
    resolver: zodResolver(getSavingsDepositDialogFormValidator(tokensInfo)),
    defaultValues: {
      symbol: initialToken.symbol,
      value: '',
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

  const objectives = createObjectives({
    formValues,
    tokensInfo,
    chainId,
  })
  const txOverview = createTxOverview({
    formValues,
    tokensInfo,
    savingsInfo: savingsDaiInfo!,
  })

  const tokenToDeposit: TokenWithValue = {
    token: formValues.token,
    value: formValues.value,
  }
  const actionsEnabled = formValues.value.gt(0) && isFormValid && !isDebouncing

  return {
    selectableAssets: inputTokens,
    assetsFields: getFormFieldsForDepositDialog(form, tokensInfo),
    form,
    objectives,
    tokenToDeposit,
    txOverview,
    pageStatus: {
      state: pageStatus,
      actionsEnabled,
      goToSuccessScreen: () => setPageStatus('success'),
    },
  }
}
