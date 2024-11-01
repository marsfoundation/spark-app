import { formatHealthFactor } from '@/domain/common/format'
import { healthFactorToRiskLevel, riskLevelToTitle } from '@/domain/common/risk'
import { cn } from '@/ui/utils/style'
import { testIds } from '@/ui/utils/testIds'
import BigNumber from 'bignumber.js'
import { MoveRightIcon } from 'lucide-react'

export interface TransactionOverviewHealthFactorChangeProps {
  currentHealthFactor?: BigNumber
  updatedHealthFactor?: BigNumber
}

export function TransactionOverviewHealthFactorChange({
  currentHealthFactor,
  updatedHealthFactor,
}: TransactionOverviewHealthFactorChangeProps) {
  if (currentHealthFactor === undefined && updatedHealthFactor !== undefined) {
    return <HealthFactorBadge healthFactor={updatedHealthFactor} />
  }

  if (currentHealthFactor !== undefined) {
    return (
      <div className="flex items-center gap-2">
        <HealthFactorBadge healthFactor={currentHealthFactor} data-testid={testIds.dialog.healthFactor.before} />
        {updatedHealthFactor && (
          <>
            <MoveRightIcon size={12} className="text-secondary" />
            <HealthFactorBadge healthFactor={updatedHealthFactor} data-testid={testIds.dialog.healthFactor.after} />
          </>
        )}
      </div>
    )
  }

  return null
}

interface HealthFactorBadgeProps {
  healthFactor: BigNumber
  'data-testid'?: string
}

// @todo: extract and reuse in other places
function HealthFactorBadge({ healthFactor, 'data-testid': dataTestId }: HealthFactorBadgeProps) {
  const riskLevel = healthFactorToRiskLevel(healthFactor)
  const title = riskLevelToTitle[riskLevel]

  return (
    <div className="flex items-center gap-1.5">
      <div
        className={cn(
          'typography-label-5 rounded-full px-2 py-1 text-primary-inverse',
          // @todo: fix color palette
          riskLevel === 'risky' && 'bg-reskin-error-600',
          riskLevel === 'moderate' && 'bg-reskin-warning-600',
          riskLevel === 'healthy' && 'bg-reskin-success-600',
        )}
        data-testid={dataTestId}
      >
        {title}
      </div>
      <div className="typography-label-4 text-primary">{formatHealthFactor(healthFactor)}</div>
    </div>
  )
}
