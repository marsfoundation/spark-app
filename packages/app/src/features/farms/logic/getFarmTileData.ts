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
    apy: farm.apiDetails.data?.apy,
    detailsLink: generatePath(paths.farmDetails, {
      chainId: chainId.toString(),
      address: farm.blockchainDetails.address,
    }),
    entryAssetsGroup: farm.blockchainDetails.entryAssetsGroup,
    rewardTokenSymbol: farm.blockchainDetails.rewardToken.symbol,
    stakingToken: farm.blockchainDetails.stakingToken,
    staked: farm.blockchainDetails.staked,
    isPointsFarm: farm.blockchainDetails.rewardType === 'points',
  }
}
