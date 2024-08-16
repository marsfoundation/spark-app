import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'
import { Objective } from '@/features/actions/logic/types'

export interface CreateUpgradeObjectivesParams {
  fromToken: Token
  toToken: Token
  amount: NormalizedUnitNumber
}

export function createUpgradeObjectives({ fromToken, toToken, amount }: CreateUpgradeObjectivesParams): Objective[] {
  return [
    {
      type: 'upgrade',
      fromToken,
      toToken,
      amount,
    },
  ]
}
