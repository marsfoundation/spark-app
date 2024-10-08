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
    apy: farm.apiInfo.data?.apy,
    detailsLink: generatePath(paths.farmDetails, { chainId: chainId.toString(), address: farm.blockchainInfo.address }),
    entryAssetsGroup: farm.blockchainInfo.entryAssetsGroup,
    rewardToken: farm.blockchainInfo.rewardToken, // @todo: Check if price is not impacting formatting
    stakingToken: farm.blockchainInfo.stakingToken,
    staked: farm.blockchainInfo.staked,
    isPointsFarm: farm.blockchainInfo.rewardType === 'points',
  }
}
