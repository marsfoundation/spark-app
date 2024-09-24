import { TokenWithBalance, TokenWithValue } from '@/domain/common/types'
import { Farm } from '@/domain/farms/types'
import { useFarmsInfo } from '@/domain/farms/useFarmsInfo'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'
import { UnstakeObjective } from '@/features/actions/flavours/unstake/types'
import { InjectedActionsContext, Objective } from '@/features/actions/logic/types'
import { AssetInputSchema } from '@/features/dialogs/common/logic/form'
import { useDebouncedFormValues } from '@/features/dialogs/common/logic/transfer-from-user/form'
import { getTransferFromUserFormValidator } from '@/features/dialogs/common/logic/transfer-from-user/validation'
import { FormFieldsForDialog, PageState, PageStatus } from '@/features/dialogs/common/types'
import { assert, raise } from '@/utils/assert'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { UseFormReturn, useForm } from 'react-hook-form'
import { TxOverview, createTxOverview } from './createTxOverview'
import { getFormFieldsForUnstakeDialog } from './getFormFieldsForUnstakeDialog'
import { useFarmExitTokens } from './useFarmExitTokens'
import { getUnstakeDialogFormValidator, validationIssueToMessage } from './validation'

export interface UseStakeDialogParams {
  farm: Farm
  initialToken: Token
}

export interface UseUnstakeDialogResult {
  selectableAssets: TokenWithBalance[]
  assetsFields: FormFieldsForDialog
  form: UseFormReturn<AssetInputSchema>
  objectives: Objective[]
  stakedToken: TokenWithValue
  pageStatus: PageStatus
  txOverview: TxOverview
  actionsContext: InjectedActionsContext
}

export function useUnstakeDialog({ farm, initialToken }: UseStakeDialogParams): UseUnstakeDialogResult {
  const [pageStatus, setPageStatus] = useState<PageState>('form')
  const { farmsInfo } = useFarmsInfo()
  const { tokensInfo, exitTokens } = useFarmExitTokens(farm)
  assert(exitTokens[0], 'There should be at least one exit token')

  const form = useForm<AssetInputSchema>({
    resolver: zodResolver(getUnstakeDialogFormValidator(farm)),
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

  const objectives: UnstakeObjective[] = [
    {
      type: 'unstake',
      farm: farm.address,
      token: formValues.token,
      amount: formValues.value,
      exit: false,
    },
  ]

  const txOverview = createTxOverview({
    farm,
    formValues,
  })

  const stakingTokenRouteItem =
    txOverview.status === 'success'
      ? txOverview.routeToStakingToken.at(-1) ?? raise('Route should be defined')
      : undefined

  const stakedToken = {
    token: farm.stakingToken,
    value: stakingTokenRouteItem?.value ?? NormalizedUnitNumber(0),
  }

  const actionsEnabled = formValues.value.gt(0) && isFormValid && !isDebouncing

  return {
    selectableAssets: exitTokens,
    assetsFields: getFormFieldsForUnstakeDialog({ form, tokensInfo, farm }),
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
      farmsInfo,
    },
  }
}
