import { Objective } from '@/features/actions/logic/types'

import { MarketInfo } from '@/domain/market-info/marketInfo'
import { DialogFormNormalizedData } from '../../common/logic/form'

export interface CreateWithdrawObjectivesParams {
  formValues: DialogFormNormalizedData
  marketInfo: MarketInfo
}

export function createWithdrawObjectives(formValues: DialogFormNormalizedData): Objective[] {
  const withdrawAll = formValues.isMaxSelected && formValues.position.collateralBalance.eq(formValues.value)

  return [
    {
      type: 'withdraw',
      reserve: formValues.reserve,
      value: formValues.value,
      all: withdrawAll,
    },
  ]
}
