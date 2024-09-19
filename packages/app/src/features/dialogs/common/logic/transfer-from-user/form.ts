import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { TokensInfo } from '@/domain/wallet/useTokens/TokenInfo'
import { AssetInputSchema } from '@/features/dialogs/common/logic/form'
import { useDebounce } from '@/utils/useDebounce'
import { UseFormReturn } from 'react-hook-form'
import { FormFieldsForDialog } from '../../types'

export interface TransferFromUserFormNormalizedData {
  token: Token
  value: NormalizedUnitNumber
  isMaxSelected: boolean
}

export function normalizeFormValues(
  asset: AssetInputSchema,
  tokensInfo: TokensInfo,
): TransferFromUserFormNormalizedData {
  const value = NormalizedUnitNumber(asset.value === '' ? '0' : asset.value)
  const token = tokensInfo.findOneTokenBySymbol(asset.symbol)

  return {
    token,
    value,
    isMaxSelected: asset.isMaxSelected,
  }
}

export function isMaxValue(value: string, maxValue: NormalizedUnitNumber): boolean {
  const normalizedValue = NormalizedUnitNumber(value === '' ? '0' : value)
  return normalizedValue.eq(maxValue)
}

function getNormalizedFormValuesKey(values: TransferFromUserFormNormalizedData): string {
  return [values.token.address, values.value.toFixed(), values.isMaxSelected].join('-')
}

export interface UseDebouncedFormValuesArgs {
  form: UseFormReturn<AssetInputSchema>
  tokensInfo: TokensInfo
}
export interface UseDebouncedFormValuesResult {
  debouncedFormValues: TransferFromUserFormNormalizedData
  isFormValid: boolean
  isDebouncing: boolean
}
export function useDebouncedFormValues({ form, tokensInfo }: UseDebouncedFormValuesArgs): UseDebouncedFormValuesResult {
  const formValues = normalizeFormValues(form.watch(), tokensInfo)
  const isFormValid = form.formState.isValid
  const { debouncedValue, isDebouncing } = useDebounce(
    { formValues, isFormValid },
    getNormalizedFormValuesKey(formValues) + isFormValid.toString(),
  )

  return {
    debouncedFormValues: debouncedValue.formValues,
    isFormValid: debouncedValue.isFormValid,
    isDebouncing,
  }
}

export interface GetFieldsForTransferFromUserFormParams {
  form: UseFormReturn<AssetInputSchema>
  tokensInfo: TokensInfo
}

// @note: Can be used for dialogs where input is token and max value is token balance
export function getFieldsForTransferFromUserForm({
  form,
  tokensInfo,
}: GetFieldsForTransferFromUserFormParams): FormFieldsForDialog {
  // eslint-disable-next-line func-style
  const changeAsset = (newSymbol: TokenSymbol): void => {
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
