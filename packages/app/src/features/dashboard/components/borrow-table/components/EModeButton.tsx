import { EModeCategoryId } from '@/domain/e-mode/types'
import { EModeBadge } from '@/ui/molecules/e-mode-badge/EModeBadge'

export interface EModeButtonProps {
  categoryId: EModeCategoryId
  onClick?: () => void
}

export function EModeButton({ categoryId, onClick }: EModeButtonProps) {
  return (
    <button onClick={onClick} className="transition duration-150 hover:brightness-[0.85]">
      <EModeBadge categoryId={categoryId} />
    </button>
  )
}
