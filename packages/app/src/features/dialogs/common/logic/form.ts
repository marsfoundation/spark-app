import { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'

import { MarketInfo, Reserve, UserPosition } from '@/domain/market-info/marketInfo'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { TokensInfo } from '@/domain/wallet/useTokens/TokenInfo'
import { useDebounce } from '@/utils/useDebounce'
import { FormFieldsForDialog } from '../types'

export const AssetInputSchema = z.object({
  symbol: z.string().transform(TokenSymbol),
  value: z.string().refine(
    (data) => {
      const value = Number.parseFloat(data)
      return data === '' || !Number.isNaN(value)
    },
    {
      message: 'Value must be a valid number',
    },
  ),
  isMaxSelected: z.boolean().default(false),
})
export type AssetInputSchema = z.infer<typeof AssetInputSchema>

export interface DialogFormNormalizedData {
  position: UserPosition
  reserve: Reserve
  token: Token
  value: NormalizedUnitNumber
  isMaxSelected: boolean
}

export function normalizeDialogFormValues(asset: AssetInputSchema, marketInfo: MarketInfo): DialogFormNormalizedData {
  const token = marketInfo.findOneTokenBySymbol(asset.symbol)
  const position = marketInfo.findOnePositionBySymbol(asset.symbol)
  const value = NormalizedUnitNumber(asset.value === '' ? '0' : asset.value)

  return {
    position,
    reserve: position.reserve,
    token,
    value,
    isMaxSelected: asset.isMaxSelected,
  }
}

export function isMaxValue(value: string, maxValue: NormalizedUnitNumber): boolean {
  const normalizedValue = NormalizedUnitNumber(value === '' ? '0' : value)
  return normalizedValue.eq(maxValue)
}

function getNormalizedDialogFormValuesKey(values: DialogFormNormalizedData): string {
  return [values.token.address, values.value.toFixed(), values.isMaxSelected].join('-')
}

export interface UseDebouncedDialogFormValuesArgs {
  form: UseFormReturn<AssetInputSchema>
  marketInfo: MarketInfo
  capValue?: NormalizedUnitNumber
}
export interface UseDebouncedDialogFormValuesResult {
  debouncedFormValues: DialogFormNormalizedData
  isFormValid: boolean
  isDebouncing: boolean
}
export function useDebouncedDialogFormValues({
  form,
  marketInfo,
}: UseDebouncedDialogFormValuesArgs): UseDebouncedDialogFormValuesResult {
  const formValues = normalizeDialogFormValues(form.watch(), marketInfo)
  const isFormValid = form.formState.isValid
  const { debouncedValue, isDebouncing } = useDebounce(
    { formValues, isFormValid },
    getNormalizedDialogFormValuesKey(formValues) + isFormValid.toString(),
  )

  return {
    debouncedFormValues: debouncedValue.formValues,
    isFormValid: debouncedValue.isFormValid,
    isDebouncing,
  }
}

export interface GetFormFieldsForAssetBalanceInputDialogParams {
  form: UseFormReturn<AssetInputSchema>
  tokensInfo: TokensInfo
  singleAsset?: boolean
}

// @note: Can be used for dialogs where input is token and max value is token balance
export function getFormFieldsForAssetBalanceDialog({
  form,
  tokensInfo,
  singleAsset,
}: GetFormFieldsForAssetBalanceInputDialogParams): FormFieldsForDialog {
  const changeAsset = singleAsset
    ? undefined
    : (newSymbol: TokenSymbol): void => {
        form.setValue('symbol', newSymbol)
        form.setValue('value', '')
        form.clearErrors()
      }

  const { symbol, value } = form.getValues()
  const { token, balance } = tokensInfo.findOneTokenWithBalanceBySymbol(symbol)

  return {
    selectedAsset: {
      value,
      token,
      balance,
    },
    maxSelectedFieldName: 'isMaxSelected',
    changeAsset,
    maxValue: balance,
  }
}
