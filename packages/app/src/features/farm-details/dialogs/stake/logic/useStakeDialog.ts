import { TokenWithBalance, TokenWithValue } from '@/domain/common/types'
import { Farm } from '@/domain/farms/types'
import { useFarmsInfo } from '@/domain/farms/useFarmsInfo'
import { useSavingsDaiInfo } from '@/domain/savings-info/useSavingsDaiInfo'
import { useSavingsUsdsInfo } from '@/domain/savings-info/useSavingsUsdsInfo'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'
import { StakeObjective } from '@/features/actions/flavours/stake/types'
import { InjectedActionsContext, Objective } from '@/features/actions/logic/types'
import { AssetInputSchema } from '@/features/dialogs/common/logic/form'
import {
  getFieldsForTransferFromUserForm,
  useDebouncedFormValues,
} from '@/features/dialogs/common/logic/transfer-from-user/form'
import { getTransferFromUserFormValidator } from '@/features/dialogs/common/logic/transfer-from-user/validation'
import { FormFieldsForDialog, PageState, PageStatus } from '@/features/dialogs/common/types'
import { assert, raise } from '@/utils/assert'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { UseFormReturn, useForm } from 'react-hook-form'
import { TxOverview, createTxOverview } from './createTxOverview'
import { useFarmEntryTokens } from './useFarmEntryTokens'
import { validationIssueToMessage } from './validation'

export interface UseStakeDialogParams {
  farm: Farm
  initialToken: Token
}

export interface UseStakeDialogResult {
  selectableAssets: TokenWithBalance[]
  assetsFields: FormFieldsForDialog
  form: UseFormReturn<AssetInputSchema>
  objectives: Objective[]
  stakedToken: TokenWithValue
  sacrificesYield: boolean
  pageStatus: PageStatus
  txOverview: TxOverview
  actionsContext: InjectedActionsContext
}

export function useStakeDialog({ farm, initialToken }: UseStakeDialogParams): UseStakeDialogResult {
  const [pageStatus, setPageStatus] = useState<PageState>('form')
  const { farmsInfo } = useFarmsInfo()
  const { tokensInfo, entryTokens } = useFarmEntryTokens(farm)
  assert(entryTokens[0], 'There should be at least one entry token')
  const { savingsDaiInfo } = useSavingsDaiInfo()
  const { savingsUsdsInfo } = useSavingsUsdsInfo()
  assert(savingsDaiInfo && savingsUsdsInfo, 'Savings dai and usds info is required for stake dialog')

  const form = useForm<AssetInputSchema>({
    resolver: zodResolver(getTransferFromUserFormValidator(tokensInfo, validationIssueToMessage)),
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
  })

  const sacrificesYield =
    formValues.token.symbol === tokensInfo.sDAI?.symbol || formValues.token.symbol === tokensInfo.sUSDS?.symbol

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
    selectableAssets: entryTokens,
    assetsFields: getFieldsForTransferFromUserForm({ form, tokensInfo }),
    form,
    objectives,
    stakedToken,
    sacrificesYield,
    txOverview,
    pageStatus: {
      state: pageStatus,
      actionsEnabled,
      goToSuccessScreen: () => setPageStatus('success'),
    },
    actionsContext: {
      tokensInfo,
      farmsInfo,
      savingsDaiInfo,
      savingsUsdsInfo,
    },
  }
}
