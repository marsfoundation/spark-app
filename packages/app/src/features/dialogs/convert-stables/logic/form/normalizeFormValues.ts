import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { TokensInfo } from '@/domain/wallet/useTokens/TokenInfo'
import { NormalizedConvertStablesFormValues } from '../../types'
import type { ConvertStablesFormSchema } from './schema'

export interface NormalizeFormValuesParams {
  formValues: ConvertStablesFormSchema
  tokensInfo: TokensInfo
}

export function normalizeFormValues({
  formValues,
  tokensInfo,
}: NormalizeFormValuesParams): NormalizedConvertStablesFormValues {
  const from = tokensInfo.findOneTokenBySymbol(formValues.symbolFrom)
  const to = tokensInfo.findOneTokenBySymbol(formValues.symbolTo)
  const amount = NormalizedUnitNumber(formValues.amount === '' ? '0' : formValues.amount)

  return {
    from,
    to,
    amount,
  }
}

export function getNormalizedFormValuesKey(values: NormalizedConvertStablesFormValues): string {
  return [values.from.address, values.to.address, values.amount.toFixed()].join('-')
}
