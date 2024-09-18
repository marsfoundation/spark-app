import BigNumber from 'bignumber.js'
import { cva } from 'class-variance-authority'

import { formatHealthFactor } from '@/domain/common/format'
import { healthFactorToRiskLevel, riskLevelToTitle } from '@/domain/common/risk'
import { Typography } from '@/ui/atoms/typography/Typography'

export interface RiskIndicatorProps {
  healthFactor: BigNumber
}

const badgeVariants = cva('rounded-lg p-2.5 text-xs', {
  variants: {
    variant: {
      liquidation: 'bg-product-red/10 text-product-red',
      risky: 'bg-product-red/10 text-product-red',
      moderate: 'bg-product-orange/10 text-product-orange',
      healthy: 'bg-product-green/10 text-product-green',
      'no debt': 'bg-product-green/10 text-product-green',
      unknown: '',
    },
  },
})

export function RiskIndicator({ healthFactor, ...props }: RiskIndicatorProps) {
  const riskLevel = healthFactorToRiskLevel(healthFactor)

  return (
    <div className="flex flex-col items-center gap-1" {...props}>
      <div
        className={badgeVariants({
          variant: riskLevel,
        })}
      >
        {riskLevelToTitle[riskLevel]}
      </div>
      <Typography variant="prompt">{formatHealthFactor(healthFactor)}</Typography>
    </div>
  )
}
