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
  const { inTokenSymbol, outTokenSymbol } = form.watch()
  const selectedAssetIn = tokensInfo.findOneTokenWithBalanceBySymbol(inTokenSymbol)
  const selectedAssetOut = tokensInfo.findOneTokenWithBalanceBySymbol(outTokenSymbol)

  const allStables = psmStables.map((symbol) => tokensInfo.findTokenWithBalanceBySymbol(symbol)).filter(Boolean)
  const assetInOptions = allStables.filter(({ token }) => token.symbol !== selectedAssetIn.token.symbol)
  const assetOutOptions = allStables.filter(
    ({ token }) => token.symbol !== selectedAssetOut.token.symbol && token.symbol !== selectedAssetIn.token.symbol,
  )

  function changeAssetIn(newSymbol: TokenSymbol): void {
    if (newSymbol === outTokenSymbol) {
      form.setValue('outTokenSymbol', inTokenSymbol)
    }
    form.setValue('inTokenSymbol', newSymbol)
    form.setValue('amount', '')
    form.setValue('isMaxSelected', false)
    form.clearErrors()
  }

  function changeAssetOut(newSymbol: TokenSymbol): void {
    form.setValue('outTokenSymbol', newSymbol)
    form.clearErrors()
  }

  return {
    selectedAssetIn,
    selectedAssetOut,
    assetInOptions,
    assetOutOptions,
    changeAssetIn,
    changeAssetOut,
    maxSelectedFieldName: 'isMaxSelected',
  }
}
