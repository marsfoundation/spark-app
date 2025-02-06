import { getChainConfigEntry } from '@/config/chain'
import { TokenWithBalance, TokenWithValue } from '@/domain/common/types'
import { useSavingsAccountRepository } from '@/domain/savings/useSavingsAccountRepository'
import { Token } from '@/domain/types/Token'
import { useTokensInfo } from '@/domain/wallet/useTokens/useTokensInfo'
import { InjectedActionsContext, Objective } from '@/features/actions/logic/types'
import { AssetInputSchema } from '@/features/dialogs/common/logic/form'
import {
  getFieldsForTransferFromUserForm,
  useDebouncedFormValues,
} from '@/features/dialogs/common/logic/transfer-from-user/form'
import { getTransferFromUserFormValidator } from '@/features/dialogs/common/logic/transfer-from-user/validation'
import { FormFieldsForDialog, PageState, PageStatus } from '@/features/dialogs/common/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { raise } from '@marsfoundation/common-universal'
import { useState } from 'react'
import { UseFormReturn, useForm } from 'react-hook-form'
import { useChainId } from 'wagmi'
import { SavingsDialogTxOverview } from '../../common/types'
import { createTxOverview } from './createTxOverview'
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
  const chainConfig = getChainConfigEntry(chainId)
  const { tokensInfo } = useTokensInfo({ tokens: chainConfig.extraTokens, chainId })
  const selectedAccount =
    chainConfig.savings?.accounts?.find((account) => account.savingsToken === savingsToken.symbol) ??
    raise('Savings account is not found')
  const supportedStablecoins = selectedAccount.supportedStablecoins.map((symbol) =>
    tokensInfo.findOneTokenWithBalanceBySymbol(symbol),
  )
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
    savingsAccount: savingsAccounts.findOneBySavingsToken(savingsToken),
  })

  const tokenToDeposit: TokenWithValue = {
    token: formValues.token,
    value: formValues.value,
  }
  const actionsEnabled = formValues.value.gt(0) && isFormValid && !isDebouncing

  return {
    selectableAssets: supportedStablecoins,
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
