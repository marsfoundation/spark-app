import { useGrowingAirdropAmount } from '../../logic/use-airdrop-info/useGrowingAirdropAmount'
import { Airdrop } from '../../types'
import { AirdropBadgeLayout } from './AirdropBadgeLayout'

interface AirdropBadgeDynamicProps {
  airdrop: Airdrop
}
export function DynamicAirdropBadge({ airdrop }: AirdropBadgeDynamicProps) {
  const amount = useGrowingAirdropAmount(airdrop)
  return <AirdropBadgeLayout amount={amount} precision={airdrop.tokenRatePrecision} />
}
