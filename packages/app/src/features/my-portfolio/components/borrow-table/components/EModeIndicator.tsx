import { EModeCategoryId } from '@/domain/e-mode/types'
import { Button } from '@/ui/atoms/new/button/Button'

import { EModeBadge } from '@/ui/molecules/e-mode-badge/EModeBadge'
import { testIds } from '@/ui/utils/testIds'
import { useBreakpoint } from '@/ui/utils/useBreakpoint'

interface EModeIndicatorProps {
  eModeCategoryId: EModeCategoryId
  onButtonClick: () => void
}

export function EModeIndicator({ eModeCategoryId, onButtonClick }: EModeIndicatorProps) {
  const isNotMobile = useBreakpoint('sm')
  return (
    <div className="flex w-full items-center justify-between gap-2">
      <EModeBadge categoryId={eModeCategoryId} />
      <Button size="s" variant="tertiary" onClick={onButtonClick} data-testid={testIds.component.EModeButton}>
        {isNotMobile && 'Change'} E-Mode
      </Button>
    </div>
  )
}
