import { cn } from '@/ui/utils/style'

export function StoryGrid({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('grid w-fit items-center justify-items-center gap-x-12 gap-y-4 bg-primary p-6', className)}>
      {children}
    </div>
  )
}

function GridLabel({ children }: { children: React.ReactNode }) {
  return <div className="typography-label-6 text-reskin-neutral-500">{children}</div>
}

StoryGrid.Label = GridLabel
