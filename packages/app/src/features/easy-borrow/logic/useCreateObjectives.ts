import { lendingPoolAddress } from '@/config/contracts-generated'
import { useContractAddress } from '@/domain/hooks/useContractAddress'
import { CheckedAddress } from '@/domain/types/CheckedAddress'
import { Objective } from '@/features/actions/logic/types'

import { EasyBorrowFormNormalizedData } from './types'

export function useCreateObjectives(formValues: EasyBorrowFormNormalizedData): Objective[] {
  const lendingPool = useContractAddress(lendingPoolAddress)

  return [...createDepositObjectives(formValues, lendingPool), ...createBorrowObjectives(formValues)]
}

function createDepositObjectives(formValues: EasyBorrowFormNormalizedData, lendingPool: CheckedAddress): Objective[] {
  return formValues.deposits
    .filter((deposit) => deposit.value.gt(0))
    .map((deposit): Objective => {
      return {
        type: 'deposit',
        token: deposit.reserve.token,
        value: deposit.value,
        lendingPool,
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
