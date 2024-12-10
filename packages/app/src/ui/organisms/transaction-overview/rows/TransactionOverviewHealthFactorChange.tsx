import { formatHealthFactor } from '@/domain/common/format'
import { healthFactorToRiskLevel, riskLevelToStateVariant, riskLevelToTitle } from '@/domain/common/risk'
import { Badge } from '@/ui/atoms/badge/Badge'
import { HorizontalScroll } from '@/ui/atoms/horizontal-scroll/HorizontalScroll'
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
    return <HealthFactorBadge healthFactor={updatedHealthFactor} data-testid={testIds.dialog.healthFactor.after} />
  }

  if (currentHealthFactor !== undefined) {
    return (
      <HorizontalScroll>
        <div className="flex items-center gap-2.5">
          <HealthFactorBadge healthFactor={currentHealthFactor} data-testid={testIds.dialog.healthFactor.before} />
          {updatedHealthFactor && (
            <>
              <MoveRightIcon className="icon-xxs icon-secondary" />
              <HealthFactorBadge healthFactor={updatedHealthFactor} data-testid={testIds.dialog.healthFactor.after} />
            </>
          )}
        </div>
      </HorizontalScroll>
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
    // @todo: split health factor and risk level test ids
    <div className="flex items-center gap-1.5" data-testid={dataTestId}>
      <Badge appearance="solid" size="xs" variant={riskLevelToStateVariant[riskLevel]}>
        {title}
      </Badge>
      <div className="typography-label-2 text-primary">{formatHealthFactor(healthFactor)}</div>
    </div>
  )
}
