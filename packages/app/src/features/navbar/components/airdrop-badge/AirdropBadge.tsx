import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { AirdropInfo } from '../../types'
import { AirdropBadgeLayout } from './AirdropBadgeLayout'
import { DynamicAirdropBadge } from './DynamicAirdropBadge'

export function AirdropBadge({ airdrop, isLoading, isError }: AirdropInfo) {
  if (isError) {
    return null
  }

  if (isLoading) {
    return <AirdropBadgeLayout amount={NormalizedUnitNumber(0)} isLoading />
  }

  if (!airdrop) {
    return <AirdropBadgeLayout amount={NormalizedUnitNumber(0)} />
  }

  return <DynamicAirdropBadge airdrop={airdrop} />
}
