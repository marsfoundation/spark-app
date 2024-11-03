import { formatHealthFactor } from '@/domain/common/format'
import { healthFactorToRiskLevel, riskLevelToStateVariant, riskLevelToTitle } from '@/domain/common/risk'
import { Badge } from '@/ui/atoms/new/badge/Badge'
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
      <div className="flex items-center gap-2.5">
        <HealthFactorBadge healthFactor={currentHealthFactor} data-testid={testIds.dialog.healthFactor.before} />
        {updatedHealthFactor && (
          <>
            <MoveRightIcon className="icon-xxs text-secondary" />
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

function HealthFactorBadge({ healthFactor, 'data-testid': dataTestId }: HealthFactorBadgeProps) {
  const riskLevel = healthFactorToRiskLevel(healthFactor)
  const title = riskLevelToTitle[riskLevel]

  return (
    <div className="flex items-center gap-1.5">
      <Badge appearance="solid" size="xs" variant={riskLevelToStateVariant[riskLevel]}>
        {title}
      </Badge>
      <div className="typography-label-4 text-primary" data-testid={dataTestId}>
        {formatHealthFactor(healthFactor)}
      </div>
    </div>
  )
}
