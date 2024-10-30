import { cn } from '@/ui/utils/style'

interface IconPillProps {
  icon: string
  className?: string
  'data-testid'?: string
}

export function IconPill({ icon, className, 'data-testid': dataTestId }: IconPillProps) {
  return (
    <div
      className={cn('inline-flex shrink-0 rounded-lg border border-white/20 p-1', className)}
      data-testid={dataTestId}
    >
      <img src={icon} className="h-4 w-4 lg:h-4 md:h-3 lg:w-4 md:w-3" />
    </div>
  )
}
