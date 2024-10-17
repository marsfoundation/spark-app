import { Info } from '@/ui/molecules/info/Info'
import { cn } from '@/ui/utils/style'

export function ChroniclePointsTooltip({ className }: { className?: string }) {
  return (
    <Info className={cn('inline-flex flex-col gap-1', className)}>
      <div>
        Chronicle Points will later be claimable for Chronicle tokens at a rate of 10 points = 1 CLE token, where the
        total supply of CLE tokens will be 10 billion.
      </div>
      <div>Chronicle Points are being emitted at a rate of 3.75 billion per year.</div>
    </Info>
  )
}
