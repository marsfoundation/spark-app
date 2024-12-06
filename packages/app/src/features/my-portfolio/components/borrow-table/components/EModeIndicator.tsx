import { EModeCategoryId } from '@/domain/e-mode/types'
import { Button } from '@/ui/atoms/button/Button'
import { EModeBadge } from '@/ui/molecules/e-mode-badge/EModeBadge'
import { testIds } from '@/ui/utils/testIds'

interface EModeIndicatorProps {
  eModeCategoryId: EModeCategoryId
  onButtonClick: () => void
}

export function EModeIndicator({ eModeCategoryId, onButtonClick }: EModeIndicatorProps) {
  return (
    <div className="flex w-full items-center justify-between">
      <EModeBadge categoryId={eModeCategoryId} />
      <Button
        size="s"
        spacing="s"
        variant="tertiary"
        onClick={onButtonClick}
        data-testid={testIds.component.EModeButton}
      >
        <span className="hidden sm:inline">Change</span> E-Mode
      </Button>
    </div>
  )
}
