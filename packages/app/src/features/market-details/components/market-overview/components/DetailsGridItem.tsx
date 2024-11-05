import { VariantProps, cva } from 'class-variance-authority'

export function DetailsGridItem({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between sm:flex-col sm:items-start sm:justify-normal" role="listitem">
      {children}
    </div>
  )
}

const titleVariants = cva('h-3 w-3', {
  variants: {
    variant: {
      gray: 'bg-white/50',
      blue: 'bg-product-blue',
      green: 'bg-product-green',
      orange: 'bg-product-orange',
    },
  },
  defaultVariants: {
    variant: 'gray',
  },
})

function Title({ children, variant }: { children: React.ReactNode } & VariantProps<typeof titleVariants>) {
  return (
    <div className="flex items-center gap-1">
      {variant && <div className={titleVariants({ variant })} />}
      <p className="text-sm leading-none opacity-50 sm:text-xs">{children}</p>
    </div>
  )
}

function Value({ children }: { children: React.ReactNode }) {
  return <p className="flex min-h-[26px] items-center gap-2 text-sm leading-none sm:text-base">{children}</p>
}

DetailsGridItem.Title = Title
DetailsGridItem.Value = Value
