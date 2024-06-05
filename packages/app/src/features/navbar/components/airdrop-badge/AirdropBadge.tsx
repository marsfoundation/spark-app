import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { AirdropInfo } from '../../types'
import { AirdropBadgeDynamic } from './AirdropBadgeDynamic'
import { AirdropBadgeLayout } from './AirdropBadgeLayout'

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

  return <AirdropBadgeDynamic airdrop={airdrop} />
}
