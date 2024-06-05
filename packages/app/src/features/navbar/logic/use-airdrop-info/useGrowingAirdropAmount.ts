import { useEffect, useState } from 'react'
import { Airdrop } from '../../types'
import { calculateNextTickAirdropValue } from './calculateNextTickAirdropValue'

const REFRESH_INTERVAL_MS = 100

export function useGrowingAirdropAmount(airdrop: Airdrop) {
  const [amount, setAmount] = useState(airdrop.tokenReward)

  useEffect(
    function updateAirdropAmount() {
      const interval = setInterval(() => {
        setAmount((currentAmount) =>
          calculateNextTickAirdropValue(currentAmount, airdrop.tokenRatePerSecond, REFRESH_INTERVAL_MS),
        )
      }, REFRESH_INTERVAL_MS)
      return () => clearInterval(interval)
    },
    [airdrop],
  )

  return amount
}
