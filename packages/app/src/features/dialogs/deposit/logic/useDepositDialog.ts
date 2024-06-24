import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { UseFormReturn, useForm } from 'react-hook-form'

import { getNativeAssetInfo } from '@/config/chain/utils/getNativeAssetInfo'
import { TokenWithBalance, TokenWithValue } from '@/domain/common/types'
import { useAaveDataLayer } from '@/domain/market-info/aave-data-layer/useAaveDataLayer'
import { updatePositionSummary } from '@/domain/market-info/updatePositionSummary'
import { useMarketInfo } from '@/domain/market-info/useMarketInfo'
import { Token } from '@/domain/types/Token'
import { useWalletInfo } from '@/domain/wallet/useWalletInfo'
import { Objective } from '@/features/actions/logic/types'

import { EPOCH_LENGTH } from '@/domain/market-info/consts'
import { AssetInputSchema, useDebouncedDialogFormValues } from '../../common/logic/form'
import { FormFieldsForDialog, PageState, PageStatus } from '../../common/types'
import { getDepositOptions } from './assets'
import { getCollateralType } from './collateralization'
import { getDepositDialogFormValidator, getFormFieldsForDepositDialog } from './form'
import { PositionOverview } from './types'
import { useCreateObjectives } from './useCreateObjectives'

export interface UseDepositDialogOptions {
  initialToken: Token
}

export interface UseDepositDialogResult {
  depositableAssets: TokenWithBalance[]
  assetsToDepositFields: FormFieldsForDialog
  tokenToDeposit: TokenWithValue
  objectives: Objective[]
  pageStatus: PageStatus
  form: UseFormReturn<AssetInputSchema>
  currentPositionOverview: PositionOverview
  updatedPositionOverview?: PositionOverview
}

export function useDepositDialog({ initialToken }: UseDepositDialogOptions): UseDepositDialogResult {
  const { aaveData } = useAaveDataLayer()
  const { marketInfo } = useMarketInfo()
  const { marketInfo: marketInfoIn1Epoch } = useMarketInfo({ timeAdvance: EPOCH_LENGTH })
  const walletInfo = useWalletInfo()
  const nativeAssetInfo = getNativeAssetInfo(marketInfo.chainId)

  const [pageStatus, setPageStatus] = useState<PageState>('form')

  const form = useForm<AssetInputSchema>({
    resolver: zodResolver(getDepositDialogFormValidator(walletInfo, marketInfo)),
    defaultValues: {
      symbol: initialToken.symbol,
      value: '',
    },
    mode: 'onChange',
  })
  const assetsToDepositFields = getFormFieldsForDepositDialog({
    form,
    marketInfo: marketInfoIn1Epoch,
    walletInfo,
  })
  const {
    debouncedFormValues: tokenToDeposit,
    isDebouncing,
    isFormValid,
  } = useDebouncedDialogFormValues({
    form,
    marketInfo,
  })

  const depositableAssets = getDepositOptions({
    token: initialToken,
    marketInfo,
    walletInfo,
    nativeAssetInfo,
  })

  const collateralType = getCollateralType({
    position: tokenToDeposit.position,
    summary: marketInfo.userPositionSummary,
    userConfiguration: marketInfo.userConfiguration,
  })

  const currentPositionOverview = {
    healthFactor: marketInfo.userPositionSummary.healthFactor,
    collateralization: collateralType,
    supplyAPY: tokenToDeposit.reserve.supplyAPY,
  }
  const updatedUserSummary = updatePositionSummary({
    deposits: [tokenToDeposit],
    marketInfo,
    aaveData,
    nativeAssetInfo,
  })
  const updatedPositionOverview = tokenToDeposit.value.eq(0)
    ? undefined
    : {
        ...currentPositionOverview,
        healthFactor: updatedUserSummary.healthFactor,
      }

  const objectives = useCreateObjectives(tokenToDeposit)

  return {
    depositableAssets,
    assetsToDepositFields,
    tokenToDeposit,
    objectives,
    pageStatus: {
      state: pageStatus,
      actionsEnabled: tokenToDeposit.value.gt(0) && isFormValid && !isDebouncing,
      goToSuccessScreen: () => setPageStatus('success'),
    },
    form,
    currentPositionOverview,
    updatedPositionOverview,
  }
}
