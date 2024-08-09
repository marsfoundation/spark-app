import { Objective } from '@/features/actions/logic/types'

import { DialogFormNormalizedData } from '../../common/logic/form'

export function useCreateObjectives(formValues: DialogFormNormalizedData): Objective[] {
  return [
    {
      type: 'deposit',
      token: formValues.reserve.token,
      value: formValues.value,
    },
  ]
}
