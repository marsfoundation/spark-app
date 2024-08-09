import { Objective } from '@/features/actions/logic/types'

import { DialogFormNormalizedData } from '../../common/logic/form'

export interface CreateBorrowActionsParams {
  formValues: DialogFormNormalizedData
}
export function createBorrowObjectives(formValues: DialogFormNormalizedData): Objective[] {
  return [
    {
      type: 'borrow',
      token: formValues.reserve.token,
      value: formValues.value,
    },
  ]
}
