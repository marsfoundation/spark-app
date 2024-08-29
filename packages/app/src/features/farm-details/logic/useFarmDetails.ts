import { NotFoundError } from '@/domain/errors/not-found'
import { Farm } from '@/domain/farms/types'
import { useFarmsInfo } from '@/domain/farms/useFarmsInfo'
import { raise } from '@/utils/assert'
import { FarmHistoryItem } from './historic/types'
import { useFarmHistoricData } from './historic/useFarmHistoricData'
import { useFarmDetailsParams } from './useFarmDetailsParams'

export interface UseFarmDetailsResult {
  farm: Farm
  farmHistoricData: FarmHistoryItem[]
}

export function useFarmDetails(): UseFarmDetailsResult {
  const { address: farmAddress, chainId } = useFarmDetailsParams()
  const { farmsInfo } = useFarmsInfo({ chainId })
  const farm = farmsInfo.findFarmByAddress(farmAddress) ?? raise(new NotFoundError())
  const { farmHistoricData } = useFarmHistoricData({ chainId, farmAddress })

  return {
    farm,
    farmHistoricData,
  }
}
