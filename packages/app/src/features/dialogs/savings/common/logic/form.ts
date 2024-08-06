import { UseFormReturn } from 'react-hook-form'

import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'
import { TokensInfo } from '@/domain/wallet/useTokens/TokenInfo'
import { AssetInputSchema } from '@/features/dialogs/common/logic/form'
import { useDebounce } from '@/utils/useDebounce'

export interface SavingsDialogFormNormalizedData {
  token: Token
  value: NormalizedUnitNumber
  isMaxSelected: boolean
}

export function normalizeDialogFormValues(
  asset: AssetInputSchema,
  tokensInfo: TokensInfo,
): SavingsDialogFormNormalizedData {
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

function getNormalizedDialogFormValuesKey(values: SavingsDialogFormNormalizedData): string {
  return [values.token.address, values.value.toFixed(), values.isMaxSelected].join('-')
}

export interface UseDebouncedDialogFormValuesArgs {
  form: UseFormReturn<AssetInputSchema>
  tokensInfo: TokensInfo
}
export interface UseDebouncedDialogFormValuesResult {
  debouncedFormValues: SavingsDialogFormNormalizedData
  isFormValid: boolean
  isDebouncing: boolean
}
export function useDebouncedDialogFormValues({
  form,
  tokensInfo,
}: UseDebouncedDialogFormValuesArgs): UseDebouncedDialogFormValuesResult {
  const formValues = normalizeDialogFormValues(form.watch(), tokensInfo)
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
