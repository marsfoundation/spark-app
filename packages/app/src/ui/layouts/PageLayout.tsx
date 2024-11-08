import { cn } from '../utils/style'

export interface PageLayoutProps {
  children: React.ReactNode
  className?: string
}

export function PageLayout({ children, className }: PageLayoutProps) {
  return <div className={cn('flex w-full flex-col gap-6', className)}>{children}</div>
}
