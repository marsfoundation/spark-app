import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { useEffect, useState } from 'react'
import { Airdrop } from '../../types'
import { AirdropBadgeLayout } from './AirdropBadgeLayout'

const REFRESH_INTERVAL = 100

interface AirdropBadgeDynamicProps {
  airdrop: Airdrop
}
export function AirdropBadgeDynamic({ airdrop }: AirdropBadgeDynamicProps) {
  const [amount, setAmount] = useState(airdrop.tokenReward)

  useEffect(
    function updateAirdropAmount() {
      const interval = setInterval(() => {
        setAmount((prevAmount) => {
          const toAdd = airdrop.tokenRate.dividedBy(1000 / REFRESH_INTERVAL)
          return NormalizedUnitNumber(prevAmount.plus(toAdd))
        })
      }, REFRESH_INTERVAL)
      return () => clearInterval(interval)
    },
    [airdrop],
  )

  return <AirdropBadgeLayout amount={amount} />
}
