import BigNumber from 'bignumber.js'

import { assets } from '@/ui/assets'
import { testIds } from '@/ui/utils/testIds'

import { RiskIndicator } from './RiskIndicator'
import { TransactionOverviewDetailsItem } from './TransactionOverviewDetailsItem'

interface HealthFactorChangeProps {
  currentHealthFactor?: BigNumber
  updatedHealthFactor?: BigNumber
}

export function HealthFactorChange({ currentHealthFactor, updatedHealthFactor }: HealthFactorChangeProps) {
  if (currentHealthFactor === undefined && updatedHealthFactor !== undefined) {
    return (
      <TransactionOverviewDetailsItem label="Health factor">
        <RiskIndicator healthFactor={updatedHealthFactor} data-testid={testIds.dialog.healthFactor.after} />
      </TransactionOverviewDetailsItem>
    )
  }

  if (currentHealthFactor !== undefined) {
    return (
      <TransactionOverviewDetailsItem label="Health factor">
        <div className="flex flex-row items-center gap-2">
          <RiskIndicator healthFactor={currentHealthFactor} data-testid={testIds.dialog.healthFactor.before} />
          {updatedHealthFactor && (
            <>
              <img src={assets.arrowRight} />
              <RiskIndicator healthFactor={updatedHealthFactor} data-testid={testIds.dialog.healthFactor.after} />
            </>
          )}
        </div>
      </TransactionOverviewDetailsItem>
    )
  }

  return null
}
