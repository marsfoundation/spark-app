import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { useEffect, useState } from 'react'
import { Airdrop } from '../../types'

export function useGrowingAirdropAmount(airdrop: Airdrop): NormalizedUnitNumber {
  const [amount, setAmount] = useState(airdrop.tokenReward)

  useEffect(
    function updateAirdropAmount() {
      const interval = setInterval(() => {
        setAmount((currentAmount) => NormalizedUnitNumber(currentAmount.plus(airdrop.tokenRatePerInterval)))
      }, airdrop.refreshIntervalInMs)
      return () => clearInterval(interval)
    },
    [airdrop],
  )

  return amount
}
