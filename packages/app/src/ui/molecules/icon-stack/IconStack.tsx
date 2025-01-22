import { cn } from '@/ui/utils/style'
import { cva } from 'class-variance-authority'

interface IconStackProps {
  paths: string[]
  maxIcons?: number
  size?: 'base' | 'lg'
  stackingOrder?: 'first-on-top' | 'last-on-top'
  iconBorder?: { borderColorClass: string }
  className?: string
}

export function IconStack({
  paths: srcs,
  maxIcons = Number.MAX_SAFE_INTEGER,
  size = 'base',
  stackingOrder = 'last-on-top',
  iconBorder,
  className,
}: IconStackProps) {
  if (maxIcons + 1 === srcs.length) {
    // let's make sure we show +2 minimum
    maxIcons = srcs.length
  }

  const slicedIcons = srcs.slice(0, maxIcons)
  const omittedLength = srcs.length - slicedIcons.length

  return (
    <div className={cn(stackVariants({ size }), className)}>
      {slicedIcons.map((src, index, srcs) => (
        <img
          key={index}
          src={src}
          className={cn(
            iconVariants({ size, iconBorder: iconBorder !== undefined }),
            iconBorder ? iconBorder.borderColorClass : '',
          )}
          style={stackingOrder === 'first-on-top' ? { zIndex: srcs.length - index } : undefined}
        />
      ))}
      {omittedLength > 0 && (
        <div
          className={cn(
            'flex items-center justify-center rounded-full bg-primary-600 text-primary-inverse',
            size === 'base' ? 'typography-label-4' : 'typography-label-2',
            iconVariants({ size }),
          )}
        >
          +{omittedLength}
        </div>
      )}
    </div>
  )
}

const iconVariants = cva('rounded-full', {
  variants: {
    size: {
      base: 'size-6',
      lg: 'size-10',
    },
    iconBorder: {
      true: 'box-content border-2',
    },
  },
})

const stackVariants = cva('isolate flex flex-row', {
  variants: {
    size: {
      base: '-space-x-2',
      lg: '-space-x-3',
    },
  },
})
