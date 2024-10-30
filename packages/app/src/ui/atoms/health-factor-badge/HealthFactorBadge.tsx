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

const badgeVariants = cva('rounded-md px-4 py-1', {
  variants: {
    variant: {
      liquidation: 'bg-product-red',
      risky: 'bg-product-red',
      moderate: 'bg-product-orange',
      healthy: 'bg-product-green',
      'no debt': 'bg-product-green',
      unknown: 'bg-white/20',
    },
  },
})

export function HealthFactorBadge({ hf, className }: HealthFactorBadgeProps) {
  const riskLevel = healthFactorToRiskLevel(hf)

  return (
    <div className={cn(badgeVariants({ variant: riskLevel }), className)}>
      <Typography variant="span" className="text-white" data-testid={testIds.component.HealthFactorBadge.value}>
        {formatHealthFactor(hf)}
      </Typography>
    </div>
  )
}
