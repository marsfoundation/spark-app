import { getChainConfigEntry } from '@/config/chain'
import { paths } from '@/config/paths'
import { generatePath } from 'react-router-dom'
import { useChainId } from 'wagmi'
import { FarmTileProps } from '../components/farm-tile/FarmTile'
import { useFarmsInfo } from './useFarmsInfo'

export interface UseFarmsResult {
  farms: FarmTileProps[]
  activeFarms: FarmTileProps[]
}

export function useFarms(): UseFarmsResult {
  const { farmsInfo } = useFarmsInfo()
  const chainId = useChainId()

  const farmConfigs = getChainConfigEntry(chainId).farms
  const allFarms = farmConfigs.map((farmConfig, index) => ({
    farmConfig,
    farmInfo: farmsInfo[index]!,
    farmLink: generatePath(paths.farmDetails, { chainId: chainId.toString(), farm: farmConfig.address }),
  }))

  const activeFarms = allFarms.filter((farm) => farm.farmInfo.deposit.gt(0))
  const farms = allFarms.filter((farm) => farm.farmInfo.deposit.eq(0))

  return {
    farms,
    activeFarms,
  }
}
