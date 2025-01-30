import { TokenWithBalance, TokenWithValue } from '@/domain/common/types'
import { useConditionalFreeze } from '@/domain/hooks/useConditionalFreeze'
import { useSavingsTokens } from '@/domain/savings/useSavingsTokens'
import { Token } from '@/domain/types/Token'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { TokensInfo } from '@/domain/wallet/useTokens/TokenInfo'
import { InjectedActionsContext, Objective } from '@/features/actions/logic/types'
import { AssetInputSchema } from '@/features/dialogs/common/logic/form'
import { useDebouncedFormValues } from '@/features/dialogs/common/logic/transfer-from-user/form'
import { FormFieldsForDialog, PageState, PageStatus } from '@/features/dialogs/common/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { UseFormReturn, useForm } from 'react-hook-form'
import { useChainId } from 'wagmi'
import { useSavingsInfo } from '../../common/logic/useSavingsInfo'
import { SavingsDialogTxOverview } from '../../common/types'
import { Mode, SendModeExtension } from '../types'
import { createObjectives } from './createObjectives'
import { createTxOverview } from './createTxOverview'
import { getFormFieldsForWithdrawDialog } from './getFormFieldsForWithdrawDialog'
import { useSendModeExtension } from './useSendModeExtension'
import { getSavingsWithdrawDialogFormValidator } from './validation'

export interface UseSavingsWithdrawDialogParams {
  mode: Mode
  savingsToken: Token
  underlyingToken: Token
}

export interface UseSavingsWithdrawDialogResults {
  selectableAssets: TokenWithBalance[]
  assetsFields: FormFieldsForDialog
  form: UseFormReturn<AssetInputSchema>
  objectives: Objective[]
  tokenToWithdraw: TokenWithValue
  pageStatus: PageStatus
  txOverview: SavingsDialogTxOverview
  actionsContext: InjectedActionsContext
  sendModeExtension?: SendModeExtension
}

export function useSavingsWithdrawDialog({
  mode,
  savingsToken,
  underlyingToken,
}: UseSavingsWithdrawDialogParams): UseSavingsWithdrawDialogResults {
  const chainId = useChainId()
  const savingsInfo = useSavingsInfo({ savingsToken })
  const { tokensInfo, inputTokens } = useSavingsTokens({ chainId })
  const [pageState, setPageState] = useState<PageState>('form')
  const sendModeExtension = useSendModeExtension({ mode, tokensInfo })
  const savingsTokenWithBalance = tokensInfo.findOneTokenWithBalanceBySymbol(savingsToken.symbol)

  const form = useForm<AssetInputSchema>({
    resolver: zodResolver(getSavingsWithdrawDialogFormValidator({ savingsTokenWithBalance })),
    defaultValues: {
      symbol: underlyingToken.symbol,
      value: '',
      isMaxSelected: false,
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

  const objectives = createObjectives({
    formValues,
    receiver: sendModeExtension?.receiver,
    mode,
    savingsTokenWithBalance,
  })
  const txOverview = createTxOverview({
    formValues,
    tokensInfo,
    savingsInfo,
    savingsToken: savingsTokenWithBalance.token,
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
    selectableAssets: filterInputTokens({ inputTokens, savingsToken, tokensInfo }),
    assetsFields: getFormFieldsForWithdrawDialog({ form, tokensInfo, savingsTokenWithBalance }),
    form,
    objectives,
    tokenToWithdraw,
    pageStatus: {
      state: pageState,
      actionsEnabled,
      goToSuccessScreen: () => setPageState('success'),
    },
    txOverview,
    actionsContext: {
      tokensInfo,
      savingsDaiInfo: savingsToken.symbol === TokenSymbol('sDAI') ? savingsInfo : undefined,
      savingsUsdsInfo: savingsToken.symbol === TokenSymbol('sUSDS') ? savingsInfo : undefined,
    },
    sendModeExtension,
  }
}

interface FilterInputTokensParams {
  inputTokens: TokenWithBalance[]
  savingsToken: Token
  tokensInfo: TokensInfo
}
function filterInputTokens({ inputTokens, savingsToken, tokensInfo }: FilterInputTokensParams): TokenWithBalance[] {
  if (savingsToken.symbol === TokenSymbol('sDAI')) {
    return inputTokens
  }

  return inputTokens.filter(({ token }) => [tokensInfo.USDS?.symbol, TokenSymbol('USDC')].includes(token.symbol))
}
