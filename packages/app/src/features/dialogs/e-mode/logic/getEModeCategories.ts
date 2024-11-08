import { eModeCategoryIdToName } from '@/domain/e-mode/constants'
import { EModeCategoryId, EModeCategoryName } from '@/domain/e-mode/types'
import { MarketInfo } from '@/domain/market-info/marketInfo'

import { EModeCategory } from '../types'

export function getEModeCategories(
  marketInfo: MarketInfo,
  selectedEModeCategoryId: EModeCategoryId,
  setSelectedEModeCategoryId: (id: EModeCategoryId) => void,
): Record<EModeCategoryName, EModeCategory> {
  const reserves = marketInfo.userPositions.map((position) => position.reserve)

  const currentEModeCategoryId = marketInfo.userConfiguration.eModeState.enabled
    ? marketInfo.userConfiguration.eModeState.category.id
    : 0

  function getEModeCategory(eModeCategoryId: EModeCategoryId): EModeCategory {
    return {
      name: eModeCategoryIdToName[eModeCategoryId],
      tokens: reserves
        .filter((reserve) => (eModeCategoryId === 0 ? true : eModeCategoryId === reserve.eModes[0]?.category.id))
        .map((reserve) => reserve.token),
      isActive: currentEModeCategoryId === eModeCategoryId,
      isSelected: selectedEModeCategoryId === eModeCategoryId,
      onSelect: () => setSelectedEModeCategoryId(eModeCategoryId),
    }
  }

  return {
    'No E-Mode': getEModeCategory(0),
    'ETH Correlated': getEModeCategory(1),
    Stablecoins: getEModeCategory(2),
  }
}
