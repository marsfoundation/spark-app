import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'
import { Objective } from '@/features/actions/logic/types'

export interface CreateUpgradeObjectivesParams {
  type: 'upgrade' | 'downgrade'
  fromToken: Token
  toToken: Token
  amount: NormalizedUnitNumber
}

export function createMigrateObjectives({
  type,
  fromToken,
  toToken,
  amount,
}: CreateUpgradeObjectivesParams): Objective[] {
  return [
    {
      type,
      fromToken,
      toToken,
      amount,
    },
  ]
}
