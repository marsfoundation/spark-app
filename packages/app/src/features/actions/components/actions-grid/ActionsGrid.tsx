import { VariantProps, cva } from 'class-variance-authority'
import { ReactNode } from 'react'

export type ActionGridVariant = NonNullable<VariantProps<typeof actionGridVariants>['variant']>

export interface ActionsGridProps {
  children: ReactNode
  variant: ActionGridVariant
}

export function ActionsGrid({ children, variant }: ActionsGridProps) {
  return <div className={actionGridVariants({ variant })}>{children}</div>
}

export const actionGridVariants = cva('grid grid-cols-[auto_1fr_auto]', {
  variants: {
    variant: {
      compact: 'gap-x-6 md:grid-cols-[auto_auto_1fr_auto]',
      extended: 'gap-x-8 md:grid-cols-[auto_auto_auto_1fr_auto]',
    },
  },
})
