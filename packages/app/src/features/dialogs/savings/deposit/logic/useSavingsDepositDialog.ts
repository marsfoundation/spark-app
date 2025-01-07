import { TokenWithBalance, TokenWithValue } from '@/domain/common/types'
import { useSavingsDaiInfo } from '@/domain/savings-info/useSavingsDaiInfo'
import { useSavingsUsdsInfo } from '@/domain/savings-info/useSavingsUsdsInfo'
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
import { determineApyImprovement } from '@/features/savings/logic/determineApyImprovement'
import { zodResolver } from '@hookform/resolvers/zod'
import { assert, Percentage, raise } from '@marsfoundation/common-universal'
import { useState } from 'react'
import { UseFormReturn, useForm } from 'react-hook-form'
import { useChainId } from 'wagmi'
import { SavingsDialogTxOverview } from '../../common/types'
import { createTxOverview } from './createTxOverview'
import { createObjectives } from './objectives'
import { depositValidationIssueToMessage } from './validation'

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
  savingsUsdsSwitchInfo: SavingsUsdsSwitchInfo
  actionsContext: InjectedActionsContext
}

export interface SavingsUsdsSwitchInfo {
  showSwitch: boolean
  checked: boolean
  apyImprovement?: Percentage
  onSwitch: () => void
}

export function useSavingsDepositDialog({
  initialToken,
}: UseSavingsDepositDialogParams): UseSavingsDepositDialogResults {
  const chainId = useChainId()
  const { savingsDaiInfo } = useSavingsDaiInfo({ chainId })
  const { savingsUsdsInfo } = useSavingsUsdsInfo({ chainId })
  assert(savingsDaiInfo || savingsUsdsInfo, 'Neither sDai nor sUSDS is supported')

  const { tokensInfo, inputTokens } = useSavingsTokens({ chainId })

  const [pageStatus, setPageStatus] = useState<PageState>('form')
  const [upgradeSwitchChecked, setUpgradeSwitchChecked] = useState(true)

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

  const savingsType = (() => {
    if (savingsDaiInfo && !savingsUsdsInfo) {
      return 'sdai'
    }
    if (!savingsDaiInfo && savingsUsdsInfo) {
      return 'susds'
    }
    // both are defined

    if (formValues.token.symbol === tokensInfo.USDS?.symbol) {
      return 'susds' // do not handle case of downgrading sUSDS to DAI
    }

    return upgradeSwitchChecked ? 'susds' : 'sdai'
  })()
  const showUpgradeSwitch = !!savingsDaiInfo && !!savingsUsdsInfo && formValues.token.symbol !== tokensInfo.USDS?.symbol

  const objectives = createObjectives({
    formValues,
    tokensInfo,
    type: savingsType,
  })
  const txOverview = createTxOverview({
    formValues,
    tokensInfo,
    savingsInfo: (savingsType === 'sdai' ? savingsDaiInfo : savingsUsdsInfo) ?? raise('Cannot find savings info'),
    type: savingsType,
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
    savingsUsdsSwitchInfo: {
      showSwitch: showUpgradeSwitch,
      checked: upgradeSwitchChecked,
      apyImprovement: determineApyImprovement({ savingsUsdsInfo, savingsDaiInfo }),
      onSwitch: () => setUpgradeSwitchChecked((upgradeSwitchChecked) => !upgradeSwitchChecked),
    },
    actionsContext: {
      tokensInfo,
      savingsUsdsInfo: savingsUsdsInfo ?? undefined,
    },
  }
}
