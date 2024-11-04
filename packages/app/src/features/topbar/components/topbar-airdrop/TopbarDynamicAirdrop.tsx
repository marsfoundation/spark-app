import { useState } from 'react'
import { Airdrop } from './TopbarAirdrop'
import { TopbarAirdropDropdown } from './TopbarAirdropDropdown'

interface TopbarDynamicAirdropProps {
  airdrop: Airdrop
}
export function TopbarDynamicAirdrop({ airdrop }: TopbarDynamicAirdropProps) {
  const [enableCounter, setEnableCounter] = useState(false)
  const amount = useGrowingAirdropAmount(airdrop, enableCounter)
  const isGrowing = airdrop.tokenRatePerSecond.gt(0)

  return (
    <TopbarAirdropDropdown
      amount={amount}
      precision={airdrop.tokenRatePrecision}
      isGrowing={isGrowing}
      setEnableCounter={setEnableCounter}
    />
  )
}
