import { VariantProps, cva } from 'class-variance-authority'

export function DetailsGridItem({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between sm:flex-col sm:items-start sm:justify-normal" role="listitem">
      {children}
    </div>
  )
}

const titleVariants = cva('text-sm leading-none sm:text-xs', {
  variants: {
    variant: {
      gray: 'text-white/50',
      blue: 'text-product-blue',
      green: 'text-product-green',
      orange: 'text-product-orange',
    },
  },
  defaultVariants: {
    variant: 'gray',
  },
})

function Title({ children, variant }: { children: React.ReactNode } & VariantProps<typeof titleVariants>) {
  return <p className={titleVariants({ variant })}>{children}</p>
}

function Value({ children }: { children: React.ReactNode }) {
  return <p className="flex min-h-[26px] items-center gap-2 text-sm leading-none sm:text-base">{children}</p>
}

DetailsGridItem.Title = Title
DetailsGridItem.Value = Value
