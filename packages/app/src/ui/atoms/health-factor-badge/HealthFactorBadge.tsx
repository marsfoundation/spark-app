import BigNumber from 'bignumber.js'
import { cva } from 'class-variance-authority'

import { formatHealthFactor } from '@/domain/common/format'
import { healthFactorToRiskLevel } from '@/domain/common/risk'
import { cn } from '@/ui/utils/style'
import { testIds } from '@/ui/utils/testIds'

import { Typography } from '../typography/Typography'

interface HealthFactorBadgeProps {
  hf: BigNumber | undefined
  className?: string
}

const badgeVariants = cva('rounded-[8px] border px-4 py-1', {
  variants: {
    variant: {
      liquidation: 'border-product-red/30 bg-product-red/15 text-product-red',
      risky: 'border-product-red/30 bg-product-red/15 text-product-red',
      moderate: 'border-product-orange/30 bg-product-orange/15 text-product-orange',
      healthy: 'border-product-green/30 bg-product-green/15 text-product-green',
      'no debt': 'border-product-green/30 bg-product-green/15 text-product-green',
      unknown: 'bg-white/20',
    },
  },
})

export function HealthFactorBadge({ hf, className }: HealthFactorBadgeProps) {
  const riskLevel = healthFactorToRiskLevel(hf)

  return (
    <div className={cn(badgeVariants({ variant: riskLevel }), className)}>
      <Typography variant="span" data-testid={testIds.component.HealthFactorBadge.value}>
        {formatHealthFactor(hf)}
      </Typography>
    </div>
  )
}
