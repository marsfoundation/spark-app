import { cn } from '@/ui/utils/style'

interface IconPillProps {
  icon: string
  className?: string
}

export function IconPill({ icon, className }: IconPillProps) {
  return (
    <div className={cn('inline-flex shrink-0 rounded-lg border border-zinc-300 p-1', className)}>
      <img src={icon} className="h-4 w-4 lg:h-4 md:h-3 lg:w-4 md:w-3" />
    </div>
  )
}
