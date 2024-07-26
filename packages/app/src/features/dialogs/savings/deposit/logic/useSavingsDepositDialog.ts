import { TokenWithBalance, TokenWithValue } from '@/domain/common/types'
import { useMarketInfo } from '@/domain/market-info/useMarketInfo'
import { useSavingsInfo } from '@/domain/savings-info/useSavingsInfo'
import { Token } from '@/domain/types/Token'
import { useMarketWalletInfo } from '@/domain/wallet/useMarketWalletInfo'
import { Objective } from '@/features/actions/logic/types'
import { AssetInputSchema, useDebouncedDialogFormValues } from '@/features/dialogs/common/logic/form'
import { FormFieldsForDialog, PageState, PageStatus } from '@/features/dialogs/common/types'
import { useSavingsTokens } from '@/features/savings/logic/useSavingsTokens'
import { assert } from '@/utils/assert'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { UseFormReturn, useForm } from 'react-hook-form'
import { useChainId } from 'wagmi'
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
  const { marketInfo } = useMarketInfo()
  const { savingsInfo } = useSavingsInfo()
  assert(savingsInfo, 'Savings info is not available')
  const walletInfo = useMarketWalletInfo()
  const chainId = useChainId()

  const { savingsEnterTokens: depositOptions } = useSavingsTokens()

  const [pageStatus, setPageStatus] = useState<PageState>('form')

  const form = useForm<AssetInputSchema>({
    resolver: zodResolver(getSavingsDepositDialogFormValidator(walletInfo)),
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
    marketInfo,
  })

  const objectives = createObjectives({
    formValues,
    marketInfo,
    chainId,
  })
  const txOverview = createTxOverview({
    formValues,
    marketInfo,
    savingsInfo,
  })

  const tokenToDeposit: TokenWithValue = {
    token: formValues.token,
    value: formValues.value,
  }
  const actionsEnabled = formValues.value.gt(0) && isFormValid && !isDebouncing

  return {
    selectableAssets: depositOptions,
    assetsFields: getFormFieldsForDepositDialog(form, marketInfo, walletInfo),
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
