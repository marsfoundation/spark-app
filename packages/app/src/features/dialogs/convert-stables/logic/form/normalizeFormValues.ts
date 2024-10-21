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
  const inToken = tokensInfo.findOneTokenBySymbol(formValues.inTokenSymbol)
  const outToken = tokensInfo.findOneTokenBySymbol(formValues.outTokenSymbol)
  const amount = NormalizedUnitNumber(formValues.amount === '' ? '0' : formValues.amount)

  return {
    inToken,
    outToken,
    amount,
  }
}

export function getNormalizedFormValuesKey(values: NormalizedConvertStablesFormValues): string {
  return [values.inToken.address, values.outToken.address, values.amount.toFixed()].join('-')
}
