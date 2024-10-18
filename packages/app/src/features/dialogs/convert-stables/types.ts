import { TokenWithBalance } from '@/domain/common/types'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'
import { TokenSymbol } from '@/domain/types/TokenSymbol'

export interface ConvertStablesFormFields {
  selectedAssetFrom: TokenWithBalance
  selectedAssetTo: TokenWithBalance
  assetFromOptions: TokenWithBalance[]
  assetToOptions: TokenWithBalance[]
  changeAssetFrom: (newSymbol: TokenSymbol) => void
  changeAssetTo: (newSymbol: TokenSymbol) => void
  maxSelectedFieldName: string
}

export interface NormalizedConvertStablesFormValues {
  from: Token
  to: Token
  amount: NormalizedUnitNumber
}
