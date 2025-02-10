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
import { FormFieldsForDialog, PageState, PageStatus } from '@/features/dialogs/common/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { raise } from '@marsfoundation/common-universal'
import { useState } from 'react'
import { UseFormReturn, useForm } from 'react-hook-form'
import { useChainId } from 'wagmi'
import { SavingsDialogTxOverview } from '../../common/types'
import { createTxOverview } from './createTxOverview'
import { useDepositToSavingsValidator } from './useDepositToSavingsValidator'

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
  underlyingToken: Token
}

export function useSavingsDepositDialog({
  savingsToken,
  initialToken,
}: UseSavingsDepositDialogParams): UseSavingsDepositDialogResults {
  const chainId = useChainId()
  const chainConfig = getChainConfigEntry(chainId)
  const { tokensInfo } = useTokensInfo({ tokens: chainConfig.extraTokens, chainId })
  const selectedAccountConfig =
    chainConfig.savings?.accounts?.find((account) => account.savingsToken === savingsToken.symbol) ??
    raise('Savings account is not found')
  const supportedStablecoins = selectedAccountConfig.supportedStablecoins.map((symbol) =>
    tokensInfo.findOneTokenWithBalanceBySymbol(symbol),
  )
  const savingsAccounts = useSavingsAccountRepository({ chainId })
  const savingsAccount = savingsAccounts.findOneBySavingsToken(savingsToken)

  const [pageStatus, setPageStatus] = useState<PageState>('form')

  const validator = useDepositToSavingsValidator({
    chainId,
    tokensInfo,
    savingsAccount,
  })
  const form = useForm<AssetInputSchema>({
    resolver: zodResolver(validator),
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
    savingsAccount,
  })

  const tokenToDeposit: TokenWithValue = {
    token: formValues.token,
    value: formValues.value,
  }
  const actionsEnabled = formValues.value.gt(0) && isFormValid && !isDebouncing

  return {
    selectableAssets: supportedStablecoins,
    assetsFields: getFieldsForTransferFromUserForm({ form, tokensInfo }),
    underlyingToken: savingsAccount.underlyingToken,
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
