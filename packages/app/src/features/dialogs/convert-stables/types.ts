import { TokenWithBalance } from '@/domain/common/types'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'
import { TokenSymbol } from '@/domain/types/TokenSymbol'

export interface ConvertStablesFormFields {
  selectedAsset1: TokenWithBalance
  selectedAsset2: TokenWithBalance
  asset1Options: TokenWithBalance[]
  asset2Options: TokenWithBalance[]
  changeAsset1: (newSymbol: TokenSymbol) => void
  changeAsset2: (newSymbol: TokenSymbol) => void
  maxSelectedFieldName: string
}

export interface NormalizedConvertStablesFormValues {
  from: Token
  to: Token
  amount: NormalizedUnitNumber
}
