import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useRef, useState } from 'react'
import { useForm, UseFormReturn } from 'react-hook-form'
import invariant from 'tiny-invariant'
import { useAccount } from 'wagmi'

import { getChainConfigEntry } from '@/config/chain'
import { TokenWithValue } from '@/domain/common/types'
import { useConditionalFreeze } from '@/domain/hooks/useConditionalFreeze'
import { useAaveDataLayer } from '@/domain/market-info/aave-data-layer/useAaveDataLayer'
import { LiquidationDetails } from '@/domain/market-info/getLiquidationDetails'
import { UserPositionSummary } from '@/domain/market-info/marketInfo'
import { updatePositionSummary } from '@/domain/market-info/updatePositionSummary'
import { useMarketInfo } from '@/domain/market-info/useMarketInfo'
import { Percentage } from '@/domain/types/NumericValues'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { useWalletInfo } from '@/domain/wallet/useWalletInfo'
import { Objective } from '@/features/actions/logic/types'

import { getBorrowableAssets, getDepositableAssets, imputeNativeAsset, sortByDecreasingBalances } from './assets'
import {
  FormFieldsForAssetClass,
  getDefaultFormValues,
  setDesiredLoanToValue,
  useFormFieldsForAssetClass,
} from './form/form'
import { normalizeFormValues } from './form/normalization'
import { EasyBorrowFormSchema, getEasyBorrowFormValidator } from './form/validation'
import { ExistingPosition, PageState, PageStatus } from './types'
import { useCreateObjectives } from './useCreateObjectives'
import { useLiquidationDetails } from './useLiquidationDetails'

export interface UseEasyBorrowResults {
  pageStatus: PageStatus

  form: UseFormReturn<EasyBorrowFormSchema>
  updatedPositionSummary: UserPositionSummary
  assetsToBorrowFields: FormFieldsForAssetClass
  assetsToDepositFields: FormFieldsForAssetClass
  setDesiredLoanToValue: (desiredLtv: Percentage) => void

  actions: Objective[]

  tokensToBorrow: TokenWithValue[]
  tokensToDeposit: TokenWithValue[]
  alreadyDeposited: ExistingPosition
  alreadyBorrowed: ExistingPosition
  liquidationDetails?: LiquidationDetails

  assetToBorrow: {
    symbol: TokenSymbol
    borrowRate: Percentage
  }
  guestMode: boolean

  healthFactorPanelRef: React.RefObject<HTMLDivElement>
}

export function useEasyBorrow(): UseEasyBorrowResults {
  const account = useAccount()
  const guestMode = !account.address
  const { aaveData } = useAaveDataLayer()
  const { marketInfo } = useMarketInfo()
  const {
    nativeAssetInfo,
    meta: { defaultAssetToBorrow },
  } = getChainConfigEntry(marketInfo.chainId)

  const walletInfo = useWalletInfo()
  const [pageStatus, setPageStatus] = useState<PageState>('form')
  const healthFactorPanelRef = useRef<HTMLDivElement>(null)

  const userPositions = imputeNativeAsset(marketInfo, nativeAssetInfo)
  const alreadyDeposited = useConditionalFreeze(
    {
      tokens: userPositions
        .filter((position) => position.collateralBalance.gt(0))
        .filter((position) => position.reserve.usageAsCollateralEnabledOnUser)
        .map((position) => position.reserve.token),
      totalValueUSD: marketInfo.userPositionSummary.totalCollateralUSD,
    },
    pageStatus === 'confirmation',
  )
  const alreadyBorrowed = useConditionalFreeze(
    {
      tokens: userPositions
        .filter((position) => position.borrowBalance.gt(0))
        .map((position) => position.reserve.token),
      totalValueUSD: marketInfo.userPositionSummary.totalBorrowsUSD,
    },
    pageStatus === 'confirmation',
  )

  const depositableAssets = sortByDecreasingBalances(
    getDepositableAssets(userPositions.map((p) => p.reserve)),
    walletInfo,
  )
  const borrowableAssets = getBorrowableAssets(marketInfo.reserves)

  invariant(depositableAssets.length > 0, 'No depositable assets')
  invariant(borrowableAssets.length === 1, 'No borrowable assets')

  const easyBorrowForm = useForm<EasyBorrowFormSchema>({
    resolver: zodResolver(
      getEasyBorrowFormValidator({
        walletInfo,
        marketInfo,
        aaveData,
        guestMode,
        alreadyDeposited,
        nativeAssetInfo,
      }),
    ),
    defaultValues: getDefaultFormValues(borrowableAssets, depositableAssets),
    mode: 'onChange',
  })
  const assetsToDepositFields = useFormFieldsForAssetClass({
    form: easyBorrowForm,
    marketInfo,
    allPossibleReserves: depositableAssets,
    walletInfo,
    type: 'deposit',
  })
  const assetsToBorrowFields = useFormFieldsForAssetClass({
    form: easyBorrowForm,
    marketInfo,
    allPossibleReserves: borrowableAssets,
    walletInfo,
    type: 'borrow',
  })
  const rawFormValues = easyBorrowForm.watch()

  const formValues = normalizeFormValues(rawFormValues, marketInfo)
  const updatedUserSummary = useConditionalFreeze(
    updatePositionSummary({ ...formValues, marketInfo, aaveData, nativeAssetInfo }),
    pageStatus === 'confirmation',
  )
  const assetsToDepositFieldsFrozen = useConditionalFreeze(assetsToDepositFields, pageStatus === 'confirmation')
  const assetsToBorrowFieldsFrozen = useConditionalFreeze(assetsToBorrowFields, pageStatus === 'confirmation')

  const actions = useCreateObjectives(formValues)

  const tokensToBorrow = formValues.borrows.map((reserveWithValue) => ({
    token: reserveWithValue.reserve.token,
    value: reserveWithValue.value,
  }))
  const tokensToDeposit = formValues.deposits
    .filter((reserveWithValue) => reserveWithValue.value.gt(0))
    .map((reserveWithValue) => ({
      token: reserveWithValue.reserve.token,
      value: reserveWithValue.value,
    }))

  const liquidationDetails = useLiquidationDetails({
    marketInfo,
    tokensToDeposit,
    tokensToBorrow,
    liquidationThreshold: updatedUserSummary.currentLiquidationThreshold,
    freeze: pageStatus === 'confirmation',
  })

  const assetToBorrow = {
    symbol: defaultAssetToBorrow,
    borrowRate: marketInfo.findOneReserveBySymbol(defaultAssetToBorrow).variableBorrowApy,
  }

  useEffect(
    function revalidateFormOnNetworkChange() {
      // eslint-disable-next-line no-console
      easyBorrowForm.trigger().catch(console.error)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [account.chainId],
  )
  useEffect(() => {
    if (pageStatus === 'confirmation') {
      healthFactorPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [pageStatus])

  return {
    form: easyBorrowForm,
    updatedPositionSummary: updatedUserSummary,
    assetsToDepositFields: assetsToDepositFieldsFrozen,
    assetsToBorrowFields: assetsToBorrowFieldsFrozen,
    setDesiredLoanToValue(desiredLtv: Percentage) {
      setDesiredLoanToValue({
        control: easyBorrowForm,
        formValues,
        userPositionSummary: updatedUserSummary,
        desiredLtv,
      })
    },
    pageStatus: {
      state: pageStatus,
      onProceedToForm: () => setPageStatus('form'),
      goToSuccessScreen: () => setPageStatus('success'),
      submitForm: () => setPageStatus('confirmation'),
    },
    actions,
    tokensToBorrow,
    tokensToDeposit,
    alreadyDeposited,
    alreadyBorrowed,
    liquidationDetails,
    assetToBorrow,
    guestMode,
    healthFactorPanelRef,
  }
}
