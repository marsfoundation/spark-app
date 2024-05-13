import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm, UseFormReturn } from 'react-hook-form'
import invariant from 'tiny-invariant'

import { TokenWithBalance, TokenWithValue } from '@/domain/common/types'
import { useConditionalFreeze } from '@/domain/hooks/useConditionalFreeze'
import { useMakerInfo } from '@/domain/maker-info/useMakerInfo'
import { useMarketInfo } from '@/domain/market-info/useMarketInfo'
import { makeAssetsInWalletList } from '@/domain/savings/makeAssetsInWalletList'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { useWalletInfo } from '@/domain/wallet/useWalletInfo'
import { Objective } from '@/features/actions/logic/types'
import { AssetInputSchema, useDebouncedDialogFormValues } from '@/features/dialogs/common/logic/form'
import { FormFieldsForDialog, PageState, PageStatus } from '@/features/dialogs/common/types'

import { RiskAcknowledgementInfo, useRiskAcknowledgement } from '../../common/logic/useRiskAcknowledgement'
import { getFormFieldsForWithdrawDialog } from './form'
import { getSDaiWithBalance } from './getSDaiWithBalance'
import { createObjectives } from './objectives'
import { useSwap } from './useSwap'
import { SavingsDialogTxOverview, useTxOverview } from './useTransactionOverview'
import { getSavingsWithdrawDialogFormValidator } from './validation'
import { WithdrawWarningGenerator } from './warningGenerator'

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
  const { makerInfo } = useMakerInfo()
  invariant(makerInfo, 'Maker info is not available')
  const walletInfo = useWalletInfo()

  const [pageStatus, setPageStatus] = useState<PageState>('form')

  const { assets: withdrawOptions } = makeAssetsInWalletList({ walletInfo })
  const sDaiWithBalance = getSDaiWithBalance(walletInfo)

  const form = useForm<AssetInputSchema>({
    resolver: zodResolver(getSavingsWithdrawDialogFormValidator(sDaiWithBalance)),
    defaultValues: {
      symbol: TokenSymbol('DAI'),
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
  const { swapInfo, swapParams } = useSwap({ formValues, marketInfo, walletInfo })

  const objectives = createObjectives({
    swapInfo,
    swapParams,
  })
  const txOverview = useTxOverview({
    formValues,
    marketInfo,
    walletInfo,
    makerInfo,
    swapInfo,
  })
  const tokenToWithdraw = useConditionalFreeze<TokenWithValue>(
    {
      token: formValues.token,
      value: txOverview?.tokenWithdrew ?? formValues.value,
    },
    pageStatus === 'success',
  )

  const transactionWarningGenerator = new WithdrawWarningGenerator({
    marketInfo,
    potParams: makerInfo.potParameters,
    swapInfo,
    inputValues: formValues,
  })
  const riskAcknowledgement = useRiskAcknowledgement({
    transactionWarningGenerator,
  })

  const actionsEnabled =
    ((formValues.value.gt(0) && isFormValid) || formValues.isMaxSelected) &&
    !isDebouncing &&
    riskAcknowledgement.isRiskAcknowledgedOrNotRequired

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
    riskAcknowledgement,
  }
}
