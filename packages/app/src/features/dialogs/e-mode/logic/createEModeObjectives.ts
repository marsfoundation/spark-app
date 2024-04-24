import { EModeCategoryId } from '@/domain/e-mode/types'
import { Objective } from '@/features/actions/logic/types'

export function createEModeObjectives(
  userEModeCategoryId: EModeCategoryId,
  selectedEModeCategoryId: EModeCategoryId,
): Objective[] | undefined {
  if (userEModeCategoryId === selectedEModeCategoryId) {
    return undefined
  }
  return [
    {
      type: 'setUserEMode',
      eModeCategoryId: selectedEModeCategoryId,
    },
  ]
}
