import { Token } from '@/domain/types/Token'
import { TokenIcon } from '@/ui/atoms/token-icon/TokenIcon'
import { cn } from '@/ui/utils/style'
import { cva } from 'class-variance-authority'

interface IconStackProps {
  items: (string | Token)[]
  subIcon?: string
  maxIcons?: number
  size?: 'base' | 'm' | 'lg'
  stackingOrder?: 'first-on-top' | 'last-on-top'
  className?: string
  iconBorder?: 'white' | 'transparent'
  iconClassName?: string
}

export function IconStack({
  items,
  subIcon,
  maxIcons = Number.MAX_SAFE_INTEGER,
  size = 'base',
  stackingOrder = 'last-on-top',
  className,
  iconBorder,
  iconClassName,
}: IconStackProps) {
  if (maxIcons + 1 === items.length) {
    // let's make sure we show +2 minimum
    maxIcons = items.length
  }

  const slicedItems = items.slice(0, maxIcons)
  const omittedLength = items.length - slicedItems.length

  return (
    <div className="relative isolate w-fit">
      <div className={cn(stackVariants({ size }), className)}>
        {slicedItems.map((item, index, items) => {
          const style = stackingOrder === 'first-on-top' ? { zIndex: items.length - index } : undefined
          const commonProps = {
            className: cn(iconVariants({ size, border: iconBorder }), iconClassName),
            style,
          }

          return typeof item === 'string' ? (
            <img src={item} key={index} {...commonProps} />
          ) : (
            <TokenIcon token={item} key={index} {...commonProps} />
          )
        })}
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
      {subIcon && <img src={subIcon} className={cn(subIconVariants({ size, border: iconBorder }), iconClassName)} />}
    </div>
  )
}

const iconVariants = cva('rounded-full', {
  variants: {
    size: {
      base: 'size-6',
      m: 'size-6 md:size-8',
      lg: 'size-10',
    },
    border: {
      white: 'border-base-white',
      transparent: 'border-transparent',
    },
  },
  compoundVariants: [
    {
      border: ['white', 'transparent'],
      className: 'box-content',
    },
    {
      border: ['white', 'transparent'],
      size: 'base',
      className: 'border-2',
    },
    {
      border: ['white', 'transparent'],
      size: 'm',
      className: 'border-[2.5px]',
    },
    {
      border: ['white', 'transparent'],
      size: 'lg',
      className: 'border-[3px]',
    },
  ],
})

const subIconVariants = cva('absolute right-0 bottom-0 translate-x-[15%] translate-y-[15%] rounded-full', {
  variants: {
    size: {
      base: 'size-3',
      m: 'size-3 md:size-4',
      lg: 'size-5',
    },
    border: {
      white: 'border-base-white',
      transparent: 'border-transparent',
    },
  },
  compoundVariants: [
    {
      border: ['white', 'transparent'],
      className: 'box-content',
    },
    {
      border: ['white', 'transparent'],
      size: 'base',
      className: 'border',
    },
    {
      border: ['white', 'transparent'],
      size: 'm',
      className: 'border-[1.25px]',
    },
    {
      border: ['white', 'transparent'],
      size: 'lg',
      className: 'border-[1.5px]',
    },
  ],
})

const stackVariants = cva('isolate flex flex-row', {
  variants: {
    size: {
      base: '-space-x-2',
      m: '-space-x-2 md:-space-x-2.5',
      lg: '-space-x-3',
    },
  },
})
