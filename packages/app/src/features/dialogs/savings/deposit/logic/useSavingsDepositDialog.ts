import { TokenWithBalance, TokenWithValue } from '@/domain/common/types'
import { useSavingsAccountRepository } from '@/domain/savings-info/useSavingsAccountRepository'
import { useSavingsTokens } from '@/domain/savings/useSavingsTokens'
import { Token } from '@/domain/types/Token'
import { InjectedActionsContext, Objective } from '@/features/actions/logic/types'
import { AssetInputSchema } from '@/features/dialogs/common/logic/form'
import {
  getFieldsForTransferFromUserForm,
  useDebouncedFormValues,
} from '@/features/dialogs/common/logic/transfer-from-user/form'
import { getTransferFromUserFormValidator } from '@/features/dialogs/common/logic/transfer-from-user/validation'
import { FormFieldsForDialog, PageState, PageStatus } from '@/features/dialogs/common/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { UseFormReturn, useForm } from 'react-hook-form'
import { useChainId } from 'wagmi'
import { SavingsDialogTxOverview } from '../../common/types'
import { createTxOverview } from './createTxOverview'
import { useSavingsInfo } from './useSavingsInfo'
import { depositValidationIssueToMessage } from './validation'

export interface UseSavingsDepositDialogParams {
  initialToken: Token
  savingsToken: Token
}

export interface UseSavingsDepositDialogResults {
  selectableAssets: TokenWithBalance[]
  assetsFields: FormFieldsForDialog
  form: UseFormReturn<AssetInputSchema>
  objectives: Objective[]
  tokenToDeposit: TokenWithValue
  pageStatus: PageStatus
  txOverview: SavingsDialogTxOverview
  actionsContext: InjectedActionsContext
}

export function useSavingsDepositDialog({
  savingsToken,
  initialToken,
}: UseSavingsDepositDialogParams): UseSavingsDepositDialogResults {
  const chainId = useChainId()
  const savingsInfo = useSavingsInfo({ savingsToken })
  const { tokensInfo, inputTokens } = useSavingsTokens({ chainId })
  const savingsAccounts = useSavingsAccountRepository({ chainId })

  const [pageStatus, setPageStatus] = useState<PageState>('form')

  const form = useForm<AssetInputSchema>({
    resolver: zodResolver(getTransferFromUserFormValidator(tokensInfo, depositValidationIssueToMessage)),
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
  } = useDebouncedFormValues({
    form,
    tokensInfo,
  })

  const objectives: Objective[] = [
    {
      type: 'depositToSavings',
      value: formValues.value,
      token: formValues.token,
      savingsToken,
    },
  ]

  const txOverview = createTxOverview({
    formValues,
    tokensInfo,
    savingsInfo,
    savingsToken,
  })

  const tokenToDeposit: TokenWithValue = {
    token: formValues.token,
    value: formValues.value,
  }
  const actionsEnabled = formValues.value.gt(0) && isFormValid && !isDebouncing

  return {
    selectableAssets: inputTokens,
    assetsFields: getFieldsForTransferFromUserForm({ form, tokensInfo }),
    form,
    objectives,
    tokenToDeposit,
    txOverview,
    pageStatus: {
      state: pageStatus,
      actionsEnabled,
      goToSuccessScreen: () => setPageStatus('success'),
    },
    actionsContext: {
      tokensInfo,
      savingsAccounts,
    },
  }
}
