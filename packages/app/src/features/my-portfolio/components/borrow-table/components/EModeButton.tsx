import { EModeCategoryId } from '@/domain/e-mode/types'
import { EModeBadge } from '@/ui/molecules/e-mode-badge/EModeBadge'
import { testIds } from '@/ui/utils/testIds'

export interface EModeButtonProps {
  categoryId: EModeCategoryId
  onClick?: () => void
  disabled?: boolean
}

export function EModeButton({ categoryId, onClick, disabled = false }: EModeButtonProps) {
  return (
    <button
      onClick={onClick}
      className="transition duration-150 hover:brightness-[0.85]"
      data-testid={testIds.component.EModeButton}
      disabled={disabled}
    >
      <EModeBadge categoryId={categoryId} />
    </button>
  )
}
