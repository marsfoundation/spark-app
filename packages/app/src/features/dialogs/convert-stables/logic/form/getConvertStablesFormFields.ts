import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { TokensInfo } from '@/domain/wallet/useTokens/TokenInfo'
import { UseFormReturn } from 'react-hook-form'
import { ConvertStablesFormFields } from '../../types'
import { ConvertStablesFormSchema } from './schema'

export interface GetConvertStablesFormFieldsParams {
  form: UseFormReturn<ConvertStablesFormSchema>
  tokensInfo: TokensInfo
  psmStables: TokenSymbol[]
}
export function getConvertStablesFormFields({
  form,
  tokensInfo,
  psmStables,
}: GetConvertStablesFormFieldsParams): ConvertStablesFormFields {
  const { symbolFrom, symbolTo } = form.watch()
  const selectedAssetFrom = tokensInfo.findOneTokenWithBalanceBySymbol(symbolFrom)
  const selectedAssetTo = tokensInfo.findOneTokenWithBalanceBySymbol(symbolTo)

  const allStables = psmStables.map((symbol) => tokensInfo.findTokenWithBalanceBySymbol(symbol)).filter(Boolean)
  const assetFromOptions = allStables.filter(({ token }) => token.symbol !== selectedAssetFrom.token.symbol)
  const assetToOptions = allStables.filter(
    ({ token }) => token.symbol !== selectedAssetTo.token.symbol && token.symbol !== selectedAssetFrom.token.symbol,
  )

  function changeAssetFrom(newSymbol: TokenSymbol): void {
    if (newSymbol === symbolTo) {
      form.setValue('symbolTo', symbolFrom)
    }
    form.setValue('symbolFrom', newSymbol)
    form.setValue('amount', '')
    form.setValue('isMaxSelected', false)
    form.clearErrors()
  }

  function changeAssetTo(newSymbol: TokenSymbol): void {
    form.setValue('symbolTo', newSymbol)
    form.clearErrors()
  }

  return {
    selectedAssetFrom,
    selectedAssetTo,
    assetFromOptions,
    assetToOptions,
    changeAssetFrom,
    changeAssetTo,
    maxSelectedFieldName: 'isMaxSelected',
  }
}
