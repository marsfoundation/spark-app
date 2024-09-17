import { UseFormReturn } from 'react-hook-form'

import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'
import { TokensInfo } from '@/domain/wallet/useTokens/TokenInfo'
import { AssetInputSchema } from '@/features/dialogs/common/logic/form'
import { useDebounce } from '@/utils/useDebounce'

export interface TokenWithBalanceFormNormalizedData {
  token: Token
  value: NormalizedUnitNumber
  isMaxSelected: boolean
}

export function normalizeFormValues(
  asset: AssetInputSchema,
  tokensInfo: TokensInfo,
): TokenWithBalanceFormNormalizedData {
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

function getNormalizedFormValuesKey(values: TokenWithBalanceFormNormalizedData): string {
  return [values.token.address, values.value.toFixed(), values.isMaxSelected].join('-')
}

export interface UseDebouncedFormValuesArgs {
  form: UseFormReturn<AssetInputSchema>
  tokensInfo: TokensInfo
}
export interface UseDebouncedFormValuesResult {
  debouncedFormValues: TokenWithBalanceFormNormalizedData
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
