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
  const { symbol1, symbol2 } = form.watch()
  const selectedAsset1 = tokensInfo.findOneTokenWithBalanceBySymbol(symbol1)
  const selectedAsset2 = tokensInfo.findOneTokenWithBalanceBySymbol(symbol2)

  const allStables = psmStables.map((symbol) => tokensInfo.findTokenWithBalanceBySymbol(symbol)).filter(Boolean)
  const asset1Options = allStables.filter(({ token }) => token.symbol !== selectedAsset1.token.symbol)
  const asset2Options = allStables.filter(
    ({ token }) => token.symbol !== selectedAsset2.token.symbol && token.symbol !== selectedAsset1.token.symbol,
  )

  function changeAsset1(newSymbol: TokenSymbol): void {
    if (newSymbol === symbol2) {
      form.setValue('symbol2', symbol1)
    }
    form.setValue('symbol1', newSymbol)
    form.setValue('amount', '')
    form.setValue('isMaxSelected', false)
    form.clearErrors()
  }

  function changeAsset2(newSymbol: TokenSymbol): void {
    form.setValue('symbol1', newSymbol)
    form.setValue('amount', '')
    form.setValue('isMaxSelected', false)
    form.clearErrors()
  }

  return {
    selectedAsset1,
    selectedAsset2,
    asset1Options,
    asset2Options,
    changeAsset1,
    changeAsset2,
    maxSelectedFieldName: 'isMaxSelected',
  }
}
