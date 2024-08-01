import { TokenWithBalance, TokenWithValue } from '@/domain/common/types'
import { useConditionalFreeze } from '@/domain/hooks/useConditionalFreeze'
import { useMarketInfo } from '@/domain/market-info/useMarketInfo'
import { useSavingsDaiInfo } from '@/domain/savings-info/useSavingsDaiInfo'
import { useSavingsTokens } from '@/domain/savings/useSavingsTokens'
import { useMarketWalletInfo } from '@/domain/wallet/useMarketWalletInfo'
import { Objective } from '@/features/actions/logic/types'
import { AssetInputSchema, useDebouncedDialogFormValues } from '@/features/dialogs/common/logic/form'
import { FormFieldsForDialog, PageState, PageStatus } from '@/features/dialogs/common/types'
import { assert } from '@/utils/assert'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { UseFormReturn, useForm } from 'react-hook-form'
import { useChainId } from 'wagmi'
import { SavingsDialogTxOverview } from '../../common/types'
import { Mode, SendModeExtension } from '../types'
import { createTxOverview } from './createTxOverview'
import { getFormFieldsForWithdrawDialog } from './getFormFieldsForWithdrawDialog'
import { createObjectives } from './objectives'
import { useSendModeExtension } from './useSendModeExtension'
import { getSavingsWithdrawDialogFormValidator } from './validation'

export interface UseSavingsWithdrawDialogResults {
  selectableAssets: TokenWithBalance[]
  assetsFields: FormFieldsForDialog
  form: UseFormReturn<AssetInputSchema>
  objectives: Objective[]
  tokenToWithdraw: TokenWithValue
  pageStatus: PageStatus
  txOverview: SavingsDialogTxOverview
  sendModeExtension?: SendModeExtension
}

export function useSavingsWithdrawDialog(mode: Mode): UseSavingsWithdrawDialogResults {
  const { marketInfo } = useMarketInfo()
  const { savingsDaiInfo } = useSavingsDaiInfo()
  assert(savingsDaiInfo, 'Savings info is not available')
  const walletInfo = useMarketWalletInfo()
  const chainId = useChainId()

  const [pageState, setPageState] = useState<PageState>('form')

  const sendModeExtension = useSendModeExtension({ mode, marketInfo })

  const { inputTokens } = useSavingsTokens()

  const sDaiWithBalance: TokenWithBalance = {
    token: marketInfo.sDAI,
    balance: walletInfo.findWalletBalanceForToken(marketInfo.sDAI),
  }

  const form = useForm<AssetInputSchema>({
    resolver: zodResolver(getSavingsWithdrawDialogFormValidator(sDaiWithBalance)),
    defaultValues: {
      symbol: marketInfo.DAI.symbol,
      value: '',
      isMaxSelected: false,
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
    walletInfo,
    savingsInfo: savingsDaiInfo,
    chainId,
    receiver: sendModeExtension?.receiver,
    mode,
  })
  const txOverview = createTxOverview({
    formValues,
    marketInfo,
    savingsInfo: savingsDaiInfo,
    walletInfo,
  })
  const tokenToWithdraw = useConditionalFreeze<TokenWithValue>(
    {
      token: formValues.token,
      value: txOverview.status === 'success' ? txOverview.outTokenAmount : formValues.value,
    },
    pageState === 'success',
  )

  const actionsEnabled =
    ((formValues.value.gt(0) && isFormValid) || formValues.isMaxSelected) &&
    !isDebouncing &&
    (sendModeExtension?.enableActions ?? true)

  return {
    selectableAssets: inputTokens,
    assetsFields: getFormFieldsForWithdrawDialog({ form, marketInfo, sDaiWithBalance }),
    form,
    objectives,
    tokenToWithdraw,
    pageStatus: {
      state: pageState,
      actionsEnabled,
      goToSuccessScreen: () => setPageState('success'),
    },
    txOverview,
    sendModeExtension,
  }
}
