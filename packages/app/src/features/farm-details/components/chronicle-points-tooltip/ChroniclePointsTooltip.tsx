import { Info } from '@/ui/molecules/info/Info'

export function ChroniclePointsTooltip() {
  return (
    <Info className="inline-flex flex-col gap-1">
      <div>
        What are Chronicle Points, and how do they work? Chronicle Points will later be claimable for Chronicle tokens
        at a rate of 10 points = 1 CLE token, where the total supply of CLE tokens will be 10 billion.
      </div>
      <div>Chronicle Points are being emitted at a rate of 3.75 billion per year.</div>
    </Info>
  )
}
