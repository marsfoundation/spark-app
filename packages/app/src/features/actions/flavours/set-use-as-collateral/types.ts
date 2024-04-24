import { Token } from '@/domain/types/Token'

export interface SetUseAsCollateralObjective {
  type: 'setUseAsCollateral'
  token: Token
  useAsCollateral: boolean
}

export interface SetUseAsCollateralAction {
  type: 'setUseAsCollateral'
  token: Token
  useAsCollateral: boolean
}
