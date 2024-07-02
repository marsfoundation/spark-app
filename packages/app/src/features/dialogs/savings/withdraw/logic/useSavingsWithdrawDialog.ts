import { getChainConfigEntry } from '@/config/chain'
import { TokenWithBalance, TokenWithValue } from '@/domain/common/types'
import { useConditionalFreeze } from '@/domain/hooks/useConditionalFreeze'
import { RiskAcknowledgementInfo } from '@/domain/liquidation-risk-warning/types'
import { useMarketInfo } from '@/domain/market-info/useMarketInfo'
import { useSavingsInfo } from '@/domain/savings-info/useSavingsInfo'
import { makeAssetsInWalletList } from '@/domain/savings/makeAssetsInWalletList'
import { useWalletInfo } from '@/domain/wallet/useWalletInfo'
import { Objective } from '@/features/actions/logic/types'
import { AssetInputSchema, useDebouncedDialogFormValues } from '@/features/dialogs/common/logic/form'
import { FormFieldsForDialog, PageState, PageStatus } from '@/features/dialogs/common/types'
import { assert } from '@/utils/assert'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { UseFormReturn, useForm } from 'react-hook-form'
import { useChainId } from 'wagmi'
import { SavingsDialogTxOverview } from '../../common/types'
import { Mode, SendModeExtension } from '../types'
import { createMakerTxOverview, createTxOverview } from './createTxOverview'
import { generateWarning } from './generateWarning'
import { getFormFieldsForWithdrawDialog } from './getFormFieldsForWithdrawDialog'
import { createObjectives } from './objectives'
import { useSendModeExtension } from './useSendModeExtension'
import { useWithdrawFromSavings } from './useWithdrawFromSavings'
import { getSavingsWithdrawDialogFormValidator } from './validation'

export interface UseSavingsWithdrawDialogResults {
  selectableAssets: TokenWithBalance[]
  assetsFields: FormFieldsForDialog
  form: UseFormReturn<AssetInputSchema>
  objectives: Objective[]
  tokenToWithdraw: TokenWithValue
  pageStatus: PageStatus
  txOverview: SavingsDialogTxOverview
  riskAcknowledgement: RiskAcknowledgementInfo
  sendModeExtension?: SendModeExtension
}

export function useSavingsWithdrawDialog(mode: Mode): UseSavingsWithdrawDialogResults {
  const { marketInfo } = useMarketInfo()
  const { savingsInfo } = useSavingsInfo()
  assert(savingsInfo, 'Savings info is not available')
  const walletInfo = useWalletInfo()
  const chainId = useChainId()

  const [pageState, setPageState] = useState<PageState>('form')

  const { assets: withdrawOptions } = makeAssetsInWalletList({
    walletInfo,
    nativeRouteOptions: { shouldFilterNativeRoutes: mode === 'send', chainId },
  })
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

  const useNativeRoutes = getChainConfigEntry(chainId).savingsNativeRouteTokens.includes(formValues.token.symbol)

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
    savingsInfo,
    chainId,
  })
  const txOverview = useNativeRoutes
    ? createMakerTxOverview({
        formValues,
        marketInfo,
        savingsInfo,
        walletInfo,
      })
    : createTxOverview({
        formValues,
        marketInfo,
        walletInfo,
        savingsInfo,
        swapInfo,
      })
  const tokenToWithdraw = useConditionalFreeze<TokenWithValue>(
    {
      token: formValues.token,
      value: txOverview.status === 'success' ? txOverview.outTokenAmount : formValues.value,
    },
    pageState === 'success',
  )

  const { warning } = generateWarning({
    swapInfo,
    inputValues: formValues,
    marketInfo,
    savingsInfo,
  })
  const [riskAcknowledged, setRiskAcknowledged] = useState(false)

  const sendModeExtension = useSendModeExtension({ mode })

  const actionsEnabled =
    ((formValues.value.gt(0) && isFormValid) || formValues.isMaxSelected) &&
    !isDebouncing &&
    (!warning || riskAcknowledged) &&
    (sendModeExtension?.enableActions ?? true)

  return {
    selectableAssets: withdrawOptions,
    assetsFields: getFormFieldsForWithdrawDialog({ form, marketInfo, sDaiWithBalance }),
    form,
    objectives,
    tokenToWithdraw,
    pageStatus: {
      state: pageState,
      actionsEnabled,
      goToSuccessScreen: () => setPageState('success'),
    },
    txOverview,
    riskAcknowledgement: {
      onStatusChange: setRiskAcknowledged,
      warning,
    },
    sendModeExtension,
  }
}
