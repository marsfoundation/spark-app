import { AirdropInfo } from '../../types'
import { AirdropBadgeLayout } from './AirdropBadgeLayout'
import { DynamicAirdropBadge } from './DynamicAirdropBadge'

export function AirdropBadge({ airdrop, isLoading, isError }: AirdropInfo) {
  if (isError) {
    return null
  }

  if (isLoading) {
    return <AirdropBadgeLayout isLoading />
  }

  if (!airdrop) {
    return <AirdropBadgeLayout />
  }

  return <DynamicAirdropBadge airdrop={airdrop} />
}
