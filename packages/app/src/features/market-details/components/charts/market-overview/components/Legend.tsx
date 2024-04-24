import { formatPercentage } from '@/domain/common/format'
import { NormalizedUnitNumber, Percentage } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'

interface LegendProps {
  token: Token
  total: NormalizedUnitNumber
  utilized: NormalizedUnitNumber
  utilizationRate: Percentage
}

export function Legend({ token, total, utilized, utilizationRate }: LegendProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <p className="text-xs leading-none text-zinc-600">Utilization rate</p>
      <p className="text-xl font-semibold leading-none text-sky-950">{formatPercentage(utilizationRate)}</p>
      <p className="text-xs leading-none text-zinc-600">
        {token.formatUSD(utilized, { compact: true })} of {token.formatUSD(total, { compact: true })}
      </p>
    </div>
  )
}
