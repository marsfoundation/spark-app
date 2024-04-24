import { Objective } from '@/features/actions/logic/types'

import { DialogFormNormalizedData } from '../../common/logic/form'

interface CreateWithdrawObjectivesOptions {
  all?: boolean
}

export function createWithdrawObjectives(
  formValues: DialogFormNormalizedData,
  { all = false }: CreateWithdrawObjectivesOptions = {},
): Objective[] {
  return [
    {
      type: 'withdraw',
      reserve: formValues.reserve,
      value: formValues.value,
      all,
    },
  ]
}
