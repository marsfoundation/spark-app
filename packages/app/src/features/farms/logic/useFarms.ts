import { useFarmsInfo } from '@/domain/farms/useFarmsInfo'
import { useChainId } from 'wagmi'
import { FarmTileProps } from '../components/farm-tile/FarmTile'
import { getFarmTileProps } from './getFarmTileData'

export interface UseFarmsResult {
  activeFarms: FarmTileProps[]
  inactiveFarms: FarmTileProps[]
}

export function useFarms(): UseFarmsResult {
  const { farmsInfo } = useFarmsInfo()
  const chainId = useChainId()

  const activeFarms = farmsInfo.getActiveFarms().map((farm) => getFarmTileProps({ farm, chainId }))
  const inactiveFarms = farmsInfo.getInactiveFarms().map((farm) => getFarmTileProps({ farm, chainId }))

  return {
    activeFarms,
    inactiveFarms,
  }
}
