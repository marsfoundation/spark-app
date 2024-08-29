import { paths } from '@/config/paths'
import { Farm } from '@/domain/farms/types'
import { generatePath } from 'react-router-dom'
import { FarmTileProps } from '../components/farm-tile/FarmTile'

export interface GetFarmTileDataParams {
  farm: Farm
  chainId: number
}
export function getFarmTileProps({ farm, chainId }: GetFarmTileDataParams): FarmTileProps {
  return {
    apy: farm.apy,
    detailsLink: generatePath(paths.farmDetails, { chainId: chainId.toString(), address: farm.address }),
    entryAssetsGroup: farm.entryAssetsGroup,
    rewardToken: farm.rewardToken,
    stakingToken: farm.stakingToken,
    staked: farm.staked,
  }
}
