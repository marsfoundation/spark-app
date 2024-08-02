import { eModeCategoryIdToName } from '@/domain/e-mode/constants'
import { EModeCategoryId, EModeCategoryName } from '@/domain/e-mode/types'
import { MarketInfo, Reserve } from '@/domain/market-info/marketInfo'

import { Token } from '@/domain/types/Token'
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
      tokens: createEModeCategoryTokens(reserves, marketInfo, eModeCategoryId),
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

function createEModeCategoryTokens(
  reserves: Reserve[],
  marketInfo: MarketInfo,
  eModeCategoryId: EModeCategoryId,
): Token[] {
  return reserves
    .filter((reserve) => {
      if (reserve.token.symbol === marketInfo.sDAI.symbol) {
        return false
      }
      if (eModeCategoryId === 0) {
        return true
      }
      return eModeCategoryId === reserve.eModeCategory?.id
    })
    .map((reserve) => reserve.token)
}
