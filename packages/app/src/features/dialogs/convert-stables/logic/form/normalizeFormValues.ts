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
  const from = tokensInfo.findOneTokenBySymbol(formValues.symbol1)
  const to = tokensInfo.findOneTokenBySymbol(formValues.symbol2)
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
