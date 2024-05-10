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

import { getFormFieldsForWithdrawDialog } from './form'
import { getSDaiWithBalance } from './getSDaiWithBalance'
import { createObjectives } from './objectives'
import { RiskAcknowledgementInfo, useRiskAcknowledgement } from './useRiskAcknowledgement'
import { useSwap } from './useSwap'
import { SavingsDialogTxOverview, useTxOverview } from './useTransactionOverview'
import { getSavingsWithdrawDialogFormValidator } from './validation'

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

  const riskAcknowledgement = useRiskAcknowledgement({
    swapInfo,
    marketInfo,
    potParams: makerInfo.potParameters,
    inputValues: formValues,
  })

  return {
    selectableAssets: withdrawOptions,
    assetsFields: getFormFieldsForWithdrawDialog({ form, marketInfo, sDaiWithBalance }),
    form,
    objectives,
    tokenToWithdraw,
    pageStatus: {
      state: pageStatus,
      actionsEnabled:
        ((formValues.value.gt(0) && isFormValid) || formValues.isMaxSelected) &&
        !isDebouncing &&
        riskAcknowledgement.isRiskAcknowledgedOrNotRequired,
      goToSuccessScreen: () => setPageStatus('success'),
    },
    txOverview,
    riskAcknowledgement,
  }
}
