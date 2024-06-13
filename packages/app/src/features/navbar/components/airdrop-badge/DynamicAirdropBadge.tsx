import { useState } from 'react'
import { useGrowingAirdropAmount } from '../../logic/use-airdrop-info/useGrowingAirdropAmount'
import { Airdrop } from '../../types'
import { AirdropBadgeLayout } from './AirdropBadgeLayout'

interface AirdropBadgeDynamicProps {
  airdrop: Airdrop
}
export function DynamicAirdropBadge({ airdrop }: AirdropBadgeDynamicProps) {
  const [enableCounter, setEnableCounter] = useState(false)
  const amount = useGrowingAirdropAmount(airdrop, enableCounter)
  const isGrowing = airdrop.tokenRatePerSecond.gt(0)

  return (
    <AirdropBadgeLayout
      amount={amount}
      precision={airdrop.tokenRatePrecision}
      isGrowing={isGrowing}
      setEnableCounter={setEnableCounter}
    />
  )
}
