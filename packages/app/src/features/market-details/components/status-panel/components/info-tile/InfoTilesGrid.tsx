import { cn } from '@/ui/utils/style'

interface InfoTilesGridProps {
  children: React.ReactNode
}

export function InfoTilesGrid({ children }: InfoTilesGridProps) {
  return (
    <div
      className={cn(
        'col-span-3 mt-6 grid grid-cols-1',
        'gap-x-3 gap-y-6 sm:col-span-2 sm:col-start-2',
        'sm:mt-5 sm:grid-cols-3',
      )}
    >
      {children}
    </div>
  )
}
