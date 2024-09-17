import { TokenWithBalance, TokenWithValue } from '@/domain/common/types'
import { Farm } from '@/domain/farms/types'
import { Token } from '@/domain/types/Token'
import { StakeObjective } from '@/features/actions/flavours/stake/types'
import { InjectedActionsContext, Objective } from '@/features/actions/logic/types'
import { useDebouncedFormValues } from '@/features/dialogs/common/logic/asset-balance/form'
import { getTokenWithBalanceFormValidator } from '@/features/dialogs/common/logic/asset-balance/validation'
import { AssetInputSchema, getFormFieldsForAssetBalanceDialog } from '@/features/dialogs/common/logic/form'
import { FormFieldsForDialog, PageState, PageStatus } from '@/features/dialogs/common/types'
import { assert, raise } from '@/utils/assert'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { UseFormReturn, useForm } from 'react-hook-form'
import { TxOverview, createTxOverview } from './createTxOverview'
import { getStakedToken } from './getStakedToken'
import { useFarmEntryTokens } from './useFarmEntryTokens'
import { validationIssueToMessage } from './validation'

export interface UseStakeDialogParams {
  farm: Farm
  initialToken?: Token
}

export interface UseStakeDialogResult {
  selectableAssets: TokenWithBalance[]
  assetsFields: FormFieldsForDialog
  form: UseFormReturn<AssetInputSchema>
  objectives: Objective[]
  stakedToken: TokenWithValue
  pageStatus: PageStatus
  txOverview: TxOverview
  actionsContext: InjectedActionsContext
}

export function useStakeDialog({ farm, initialToken }: UseStakeDialogParams): UseStakeDialogResult {
  const [pageStatus, setPageStatus] = useState<PageState>('form')
  const { tokensInfo, entryTokens } = useFarmEntryTokens(farm)
  assert(entryTokens[0], 'There should be at least one entry token')

  const form = useForm<AssetInputSchema>({
    resolver: zodResolver(getTokenWithBalanceFormValidator(tokensInfo, validationIssueToMessage)),
    defaultValues: {
      symbol: initialToken ? initialToken.symbol : entryTokens[0].token.symbol,
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

  const objectives: StakeObjective[] = [
    {
      type: 'stake',
      amount: formValues.value,
      token: formValues.token,
      farm: farm.address,
    },
  ]

  const txOverview = createTxOverview({
    farm,
    formValues,
    tokensInfo,
  })

  const stakedToken = getStakedToken(
    farm.stakingToken,
    txOverview.status === 'success'
      ? txOverview.routeToStakingToken.at(-1) ?? raise('Route should be defined')
      : undefined,
  )

  const actionsEnabled = formValues.value.gt(0) && isFormValid && !isDebouncing

  return {
    selectableAssets: entryTokens,
    assetsFields: getFormFieldsForAssetBalanceDialog({ form, tokensInfo }),
    form,
    objectives,
    stakedToken,
    txOverview,
    pageStatus: {
      state: pageStatus,
      actionsEnabled,
      goToSuccessScreen: () => setPageStatus('success'),
    },
    actionsContext: {
      tokensInfo,
    },
  }
}
