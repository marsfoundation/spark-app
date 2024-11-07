import { VariantProps, cva } from 'class-variance-authority'
import { cn } from '../utils/style'

const layoutVariants = cva('flex w-full flex-col gap-6', {
  variants: {
    // @todo: we need to remove this compact variant in the end
    // since we need to have consistent layout across all pages.
    // this was to simply adjustment before new designs were complete
    compact: {
      true: 'mx-auto max-w-5xl',
    },
  },
  defaultVariants: {
    compact: false,
  },
})

export interface PageLayoutProps extends VariantProps<typeof layoutVariants> {
  children: React.ReactNode
  className?: string
}

export function PageLayout({ children, className, compact }: PageLayoutProps) {
  return <div className={cn(layoutVariants({ compact }), className)}>{children}</div>
}
