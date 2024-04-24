import { lendingPoolAddress } from '@/config/contracts-generated'
import { useContractAddress } from '@/domain/hooks/useContractAddress'
import { Objective } from '@/features/actions/logic/types'

import { DialogFormNormalizedData } from '../../common/logic/form'

export function useCreateObjectives(formValues: DialogFormNormalizedData): Objective[] {
  const lendingPool = useContractAddress(lendingPoolAddress)
  return [
    {
      type: 'deposit',
      token: formValues.reserve.token,
      value: formValues.value,
      lendingPool,
    },
  ]
}
