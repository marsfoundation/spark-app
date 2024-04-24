import { Token } from '@/domain/types/Token'
import { Objective } from '@/features/actions/logic/types'

export function createCollateralObjectives(token: Token, useAsCollateral: boolean): Objective[] {
  return [
    {
      type: 'setUseAsCollateral',
      token,
      useAsCollateral,
    },
  ]
}
