import { Objective } from '@/features/actions/logic/types'

import { EasyBorrowFormNormalizedData } from './types'

export function useCreateObjectives(formValues: EasyBorrowFormNormalizedData): Objective[] {
  return [...createDepositObjectives(formValues), ...createBorrowObjectives(formValues)]
}

function createDepositObjectives(formValues: EasyBorrowFormNormalizedData): Objective[] {
  return formValues.deposits
    .filter((deposit) => deposit.value.gt(0))
    .map((deposit): Objective => {
      return {
        type: 'deposit',
        token: deposit.reserve.token,
        value: deposit.value,
      }
    })
}

function createBorrowObjectives(formValues: EasyBorrowFormNormalizedData): Objective[] {
  return formValues.borrows.map((borrow): Objective => {
    return {
      type: 'borrow',
      token: borrow.reserve.token,
      value: borrow.value,
    }
  })
}
