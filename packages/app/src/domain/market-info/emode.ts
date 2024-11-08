import { assert } from '@/utils/assert'

import { Percentage } from '../types/NumericValues'
import { AaveFormattedReserve } from './aave-data-layer/query'
import { EModeCategories, EModeState } from './marketInfo'
import { parseRawPercentage } from './math'

// The easiest way to get information eMode categories is to extract and reconstruct it from the reserves
export function extractEmodeInfoFromReserves(reserves: AaveFormattedReserve[]): EModeCategories {
  const emodeCategories: EModeCategories = {}

  for (const reserve of reserves) {
    if (!reserve.eModes?.length) {
      continue
    }

    for (const eMode of reserve.eModes) {
      if (eMode.id === 0 || emodeCategories[eMode.id]) {
        continue
      }

      emodeCategories[eMode.id] = {
        id: eMode.id,
        name: eMode.eMode.label,
        ltv: parseRawPercentage(eMode.eMode.ltv),
        liquidationBonus: Percentage(
          parseRawPercentage(eMode.eMode.liquidationBonus, { allowMoreThan1: true }).minus(1),
        ),
        liquidationThreshold: parseRawPercentage(eMode.eMode.liquidationThreshold),
      }
    }
  }

  return emodeCategories
}

export function determineEModeState(userEmodeCategoryId: number, emodeCategories: EModeCategories): EModeState {
  if (userEmodeCategoryId === 0) {
    return { enabled: false }
  }
  const userCategory = emodeCategories[userEmodeCategoryId]
  assert(userCategory, 'User emode category not found')

  return { enabled: true, category: userCategory }
}
