import { assert } from '@/utils/assert'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { UseFormReturn, useForm } from 'react-hook-form'

import { TokenWithBalance, TokenWithValue } from '@/domain/common/types'
import { useConditionalFreeze } from '@/domain/hooks/useConditionalFreeze'
import { useMarketInfo } from '@/domain/market-info/useMarketInfo'
import { useSavingsInfo } from '@/domain/savings-info/useSavingsInfo'
import { makeAssetsInWalletList } from '@/domain/savings/makeAssetsInWalletList'
import { useWalletInfo } from '@/domain/wallet/useWalletInfo'
import { Objective } from '@/features/actions/logic/types'
import { RiskWarning } from '@/features/dialogs/common/components/risk-acknowledgement/RiskAcknowledgement'
import { AssetInputSchema, useDebouncedDialogFormValues } from '@/features/dialogs/common/logic/form'
import { FormFieldsForDialog, PageState, PageStatus } from '@/features/dialogs/common/types'

import { useOriginChainId } from '@/domain/hooks/useOriginChainId'
import { mainnet } from 'viem/chains'
import { SavingsDialogTxOverview, createTxOverview } from './createTxOverview'
import { getFormFieldsForWithdrawDialog } from './form'
import { generateWarning } from './generateWarning'
import { createObjectives } from './objectives'
import { useWithdrawFromSavings } from './useWithdrawFromSavings'
import { getSavingsWithdrawDialogFormValidator } from './validation'

export interface RiskAcknowledgementInfo {
  onStatusChange: (acknowledged: boolean) => void
  warning?: RiskWarning
}
export interface UseSavingsWithdrawDialogResults {
  selectableAssets: TokenWithBalance[]
  assetsFields: FormFieldsForDialog
  form: UseFormReturn<AssetInputSchema>
  objectives: Objective[]
  tokenToWithdraw: TokenWithValue
  pageStatus: PageStatus
  txOverview: SavingsDialogTxOverview | undefined
  riskAcknowledgement: RiskAcknowledgementInfo
}

export function useSavingsWithdrawDialog(): UseSavingsWithdrawDialogResults {
  const { marketInfo } = useMarketInfo()
  const { savingsInfo } = useSavingsInfo()
  assert(savingsInfo, 'Savings info is not available')
  const walletInfo = useWalletInfo()
  const originChainId = useOriginChainId()

  const [pageStatus, setPageStatus] = useState<PageState>('form')

  const { assets: withdrawOptions } = makeAssetsInWalletList({ walletInfo })
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

  const useNativeRoutes =
    import.meta.env.VITE_DEV_NATIVE_ROUTES === '1' &&
    originChainId === mainnet.id &&
    formValues.token.address === marketInfo.DAI.address

  const { swapInfo, swapParams } = useWithdrawFromSavings({
    formValues,
    marketInfo,
    walletInfo,
    enabled: !useNativeRoutes,
  })

  const objectives = createObjectives({
    swapInfo,
    swapParams,
    formValues,
    marketInfo,
    walletInfo,
    useNativeRoutes,
  })
  const txOverview = createTxOverview({
    formValues,
    marketInfo,
    walletInfo,
    savingsInfo,
    swapInfo,
    useNativeRoutes,
  })
  const tokenToWithdraw = useConditionalFreeze<TokenWithValue>(
    {
      token: formValues.token,
      value: txOverview?.tokenWithdrew ?? formValues.value,
    },
    pageStatus === 'success',
  )

  const { warning } = generateWarning({
    swapInfo,
    inputValues: formValues,
    marketInfo,
    savingsInfo,
  })
  const [riskAcknowledged, setRiskAcknowledged] = useState(false)

  const actionsEnabled =
    ((formValues.value.gt(0) && isFormValid) || formValues.isMaxSelected) &&
    !isDebouncing &&
    (!warning || riskAcknowledged)

  return {
    selectableAssets: withdrawOptions,
    assetsFields: getFormFieldsForWithdrawDialog({ form, marketInfo, sDaiWithBalance }),
    form,
    objectives,
    tokenToWithdraw,
    pageStatus: {
      state: pageStatus,
      actionsEnabled,
      goToSuccessScreen: () => setPageStatus('success'),
    },
    txOverview,
    riskAcknowledgement: {
      onStatusChange: setRiskAcknowledged,
      warning,
    },
  }
}
