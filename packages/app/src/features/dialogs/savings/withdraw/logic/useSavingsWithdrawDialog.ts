import { TokenWithBalance, TokenWithValue } from '@/domain/common/types'
import { useConditionalFreeze } from '@/domain/hooks/useConditionalFreeze'
import { useSavingsDaiInfo } from '@/domain/savings-info/useSavingsDaiInfo'
import { useSavingsUsdsInfo } from '@/domain/savings-info/useSavingsUsdsInfo'
import { useSavingsTokens } from '@/domain/savings/useSavingsTokens'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { TokensInfo } from '@/domain/wallet/useTokens/TokenInfo'
import { InjectedActionsContext, Objective } from '@/features/actions/logic/types'
import { AssetInputSchema } from '@/features/dialogs/common/logic/form'
import { useDebouncedFormValues } from '@/features/dialogs/common/logic/transfer-from-user/form'
import { FormFieldsForDialog, PageState, PageStatus } from '@/features/dialogs/common/types'
import { assert, raise } from '@/utils/assert'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { UseFormReturn, useForm } from 'react-hook-form'
import { useChainId } from 'wagmi'
import { SavingsDialogTxOverview } from '../../common/types'
import { Mode, SavingsType, SendModeExtension } from '../types'
import { createObjectives } from './createObjectives'
import { createTxOverview } from './createTxOverview'
import { getFormFieldsForWithdrawDialog } from './getFormFieldsForWithdrawDialog'
import { useSendModeExtension } from './useSendModeExtension'
import { getSavingsWithdrawDialogFormValidator } from './validation'

export interface UseSavingsWithdrawDialogParams {
  mode: Mode
  savingsType: 'sdai' | 'susds'
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
  savingsType,
}: UseSavingsWithdrawDialogParams): UseSavingsWithdrawDialogResults {
  const chainId = useChainId()
  const { tokensInfo, inputTokens, sdaiWithBalance, susdsWithBalance } = useSavingsTokens({ chainId })

  const { savingsDaiInfo } = useSavingsDaiInfo({ chainId })
  const { savingsUsdsInfo } = useSavingsUsdsInfo({ chainId })

  const savingsInfo =
    (savingsType === 'sdai' ? savingsDaiInfo : savingsUsdsInfo) ??
    raise(`Savings info is not available for ${savingsType}`)
  assert(savingsDaiInfo || savingsUsdsInfo, 'Savings info is not available')

  const [pageState, setPageState] = useState<PageState>('form')
  const sendModeExtension = useSendModeExtension({ mode, tokensInfo })
  const savingsTokenWithBalance =
    (savingsType === 'sdai' ? sdaiWithBalance : susdsWithBalance) ??
    raise(`Savings token balance is not available for ${savingsType}`)
  const defaultWithdrawToken = savingsType === 'sdai' ? tokensInfo.DAI : tokensInfo.USDS

  const form = useForm<AssetInputSchema>({
    resolver: zodResolver(getSavingsWithdrawDialogFormValidator({ savingsTokenWithBalance })),
    defaultValues: {
      symbol: defaultWithdrawToken?.symbol,
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
    selectableAssets: filterInputTokens({ inputTokens, savingsType, tokensInfo }),
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
      savingsDaiInfo: savingsDaiInfo ?? undefined,
      savingsUsdsInfo: savingsUsdsInfo ?? undefined,
    },
    sendModeExtension,
  }
}

interface FilterInputTokensParams {
  inputTokens: TokenWithBalance[]
  savingsType: SavingsType
  tokensInfo: TokensInfo
}
function filterInputTokens({ inputTokens, savingsType, tokensInfo }: FilterInputTokensParams): TokenWithBalance[] {
  if (savingsType === 'sdai') {
    return inputTokens
  }

  return inputTokens.filter(({ token }) => [tokensInfo.USDS?.symbol, TokenSymbol('USDC')].includes(token.symbol))
}
