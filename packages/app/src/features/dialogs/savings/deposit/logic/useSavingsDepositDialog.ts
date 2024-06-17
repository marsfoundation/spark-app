import { assert } from '@/utils/assert'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { UseFormReturn, useForm } from 'react-hook-form'

import { TokenWithBalance, TokenWithValue } from '@/domain/common/types'
import { useMarketInfo } from '@/domain/market-info/useMarketInfo'
import { useSavingsInfo } from '@/domain/savings-info/useSavingsInfo'
import { makeAssetsInWalletList } from '@/domain/savings/makeAssetsInWalletList'
import { Token } from '@/domain/types/Token'
import { useWalletInfo } from '@/domain/wallet/useWalletInfo'
import { Objective } from '@/features/actions/logic/types'
import { RiskWarning } from '@/features/dialogs/common/components/risk-acknowledgement/RiskAcknowledgement'
import { AssetInputSchema, useDebouncedDialogFormValues } from '@/features/dialogs/common/logic/form'
import { FormFieldsForDialog, PageState, PageStatus } from '@/features/dialogs/common/types'

import { getChainConfigEntry } from '@/config/chain'
import { useChainId } from 'wagmi'
import { SavingsDialogTxOverview } from '../../common/types'
import { createMakerTxOverview, createTxOverview } from './createTxOverview'
import { getFormFieldsForDepositDialog } from './form'
import { generateWarning } from './generateWarning'
import { createObjectives } from './objectives'
import { useDepositIntoSavings } from './useDepositIntoSavings'
import { getSavingsDepositDialogFormValidator } from './validation'

export interface UseSavingsDepositDialogParams {
  initialToken: Token
}

export interface RiskAcknowledgementInfo {
  onStatusChange: (acknowledged: boolean) => void
  warning?: RiskWarning
}

export interface UseSavingsDepositDialogResults {
  selectableAssets: TokenWithBalance[]
  assetsFields: FormFieldsForDialog
  form: UseFormReturn<AssetInputSchema>
  objectives: Objective[]
  tokenToDeposit: TokenWithValue
  pageStatus: PageStatus
  txOverview: SavingsDialogTxOverview
  riskAcknowledgement: RiskAcknowledgementInfo
}

export function useSavingsDepositDialog({
  initialToken,
}: UseSavingsDepositDialogParams): UseSavingsDepositDialogResults {
  const { marketInfo } = useMarketInfo()
  const { savingsInfo } = useSavingsInfo()
  assert(savingsInfo, 'Savings info is not available')
  const walletInfo = useWalletInfo()
  const chainId = useChainId()

  const { assets: depositOptions } = makeAssetsInWalletList({ walletInfo })

  const [pageStatus, setPageStatus] = useState<PageState>('form')

  const form = useForm<AssetInputSchema>({
    resolver: zodResolver(getSavingsDepositDialogFormValidator(walletInfo)),
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
  } = useDebouncedDialogFormValues({
    form,
    marketInfo,
  })

  const useNativeRoutes = getChainConfigEntry(chainId).savingsNativeRouteTokens.includes(formValues.token.symbol)

  const { swapInfo, swapParams } = useDepositIntoSavings({
    formValues,
    marketInfo,
    enabled: !useNativeRoutes,
  })

  const { warning } = generateWarning({
    swapInfo,
    inputValues: formValues,
    marketInfo,
    savingsInfo,
  })
  const [riskAcknowledged, setRiskAcknowledged] = useState(false)

  const objectives = createObjectives({
    swapInfo,
    swapParams,
    formValues,
    marketInfo,
    savingsInfo,
    chainId,
  })
  const txOverview = useNativeRoutes
    ? createMakerTxOverview({
        formValues,
        marketInfo,
        savingsInfo,
      })
    : createTxOverview({
        marketInfo,
        savingsInfo,
        swapInfo,
        walletInfo,
        swapParams,
      })

  const tokenToDeposit: TokenWithValue = {
    token: formValues.token,
    value: formValues.value,
  }
  const actionsEnabled = formValues.value.gt(0) && isFormValid && !isDebouncing && (!warning || riskAcknowledged)

  return {
    selectableAssets: depositOptions,
    assetsFields: getFormFieldsForDepositDialog(form, marketInfo, walletInfo),
    form,
    objectives,
    tokenToDeposit,
    txOverview,
    pageStatus: {
      state: pageStatus,
      actionsEnabled,
      goToSuccessScreen: () => setPageStatus('success'),
    },
    riskAcknowledgement: {
      onStatusChange: setRiskAcknowledged,
      warning,
    },
  }
}
