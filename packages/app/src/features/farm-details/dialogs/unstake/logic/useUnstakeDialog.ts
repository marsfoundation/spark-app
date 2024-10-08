import { TokenWithBalance, TokenWithValue } from '@/domain/common/types'
import { Farm } from '@/domain/farms/types'
import { useFarmsInfo } from '@/domain/farms/useFarmsInfo'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'
import { UnstakeObjective } from '@/features/actions/flavours/unstake/types'
import { InjectedActionsContext, Objective } from '@/features/actions/logic/types'
import { AssetInputSchema } from '@/features/dialogs/common/logic/form'
import { useDebouncedFormValues } from '@/features/dialogs/common/logic/transfer-from-user/form'
import { FormFieldsForDialog, PageState, PageStatus } from '@/features/dialogs/common/types'
import { calculateReward } from '@/features/farm-details/logic/calculateReward'
import { assert, raise } from '@/utils/assert'
import { useTimestamp } from '@/utils/useTimestamp'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { UseFormReturn, useForm } from 'react-hook-form'
import { TxOverview, createTxOverview } from './createTxOverview'
import { getFormFieldsForUnstakeDialog } from './getFormFieldsForUnstakeDialog'
import { useFarmExitTokens } from './useFarmExitTokens'
import { getUnstakeDialogFormValidator } from './validation'

export interface UseStakeDialogParams {
  farm: Farm
  initialToken: Token
}

export interface UseUnstakeDialogResult {
  selectableAssets: TokenWithBalance[]
  assetsFields: FormFieldsForDialog
  form: UseFormReturn<AssetInputSchema>
  objectives: Objective[]
  outcomeToken: TokenWithValue
  pageStatus: PageStatus
  txOverview: TxOverview
  exitFarmSwitchInfo: ExitFarmSwitchInfo
  actionsContext: InjectedActionsContext
}

export interface ExitFarmSwitchInfo {
  showSwitch: boolean
  checked: boolean
  onSwitch: () => void
  reward: TokenWithValue
}

export function useUnstakeDialog({ farm, initialToken }: UseStakeDialogParams): UseUnstakeDialogResult {
  const { timestamp, updateTimestamp } = useTimestamp()
  useEffect(() => {
    updateTimestamp()
  }, [updateTimestamp])
  const [pageStatus, setPageStatus] = useState<PageState>('form')
  const farmsInfo = useFarmsInfo()
  const { tokensInfo, exitTokens } = useFarmExitTokens(farm)
  const [exitFarmSwitchChecked, setExitFarmSwitchChecked] = useState(false)

  assert(exitTokens[0], 'There should be at least one exit token')

  const form = useForm<AssetInputSchema>({
    resolver: zodResolver(getUnstakeDialogFormValidator(farm, tokensInfo)),
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
      farm: farm.blockchainInfo.address,
      token: formValues.token,
      amount: formValues.value,
      exit: exitFarmSwitchChecked,
    },
  ]

  const earnedRewards = calculateReward({
    earned: farm.blockchainInfo.earned,
    staked: farm.blockchainInfo.staked,
    rewardRate: farm.blockchainInfo.rewardRate,
    earnedTimestamp: farm.blockchainInfo.earnedTimestamp,
    periodFinish: farm.blockchainInfo.periodFinish,
    timestampInMs: timestamp * 1000,
    totalSupply: farm.blockchainInfo.totalSupply,
  })

  const txOverview = createTxOverview({
    farm,
    formValues,
    isExiting: exitFarmSwitchChecked,
    earnedRewards,
  })

  const outcomeTokenRouteItem =
    txOverview.status === 'success'
      ? txOverview.routeToOutcomeToken.at(-1) ?? raise('Route should be defined')
      : undefined

  const outcomeToken = {
    token: outcomeTokenRouteItem?.token ?? farm.blockchainInfo.stakingToken,
    value: outcomeTokenRouteItem?.value ?? NormalizedUnitNumber(0),
  }

  const actionsEnabled = formValues.value.gt(0) && isFormValid && !isDebouncing
  const canClaim = farm.blockchainInfo.earned.gt(0) || farm.blockchainInfo.rewardRate.gt(0)

  return {
    selectableAssets: exitTokens,
    assetsFields: getFormFieldsForUnstakeDialog({ form, tokensInfo, farm }),
    form,
    objectives,
    outcomeToken,
    txOverview,
    pageStatus: {
      state: pageStatus,
      actionsEnabled,
      goToSuccessScreen: () => setPageStatus('success'),
    },
    exitFarmSwitchInfo: {
      showSwitch: formValues.isMaxSelected && canClaim,
      onSwitch: () => setExitFarmSwitchChecked((exitFarmSwitchChecked) => !exitFarmSwitchChecked),
      checked: exitFarmSwitchChecked,
      reward: {
        token: farm.blockchainInfo.rewardToken, // @todo: figure out formatting without price, wait for price
        value: earnedRewards,
      },
    },
    actionsContext: {
      tokensInfo,
      farmsInfo,
    },
  }
}
