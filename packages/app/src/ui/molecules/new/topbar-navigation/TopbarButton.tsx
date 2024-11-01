import { cn } from '@/ui/utils/style'
import { VariantProps, cva } from 'class-variance-authority'
import { cloneElement, forwardRef } from 'react'
import { NavLink, To, useMatch } from 'react-router-dom'

const buttonVariants = cva(
  cn(
    'typography-label-4 inline-flex h-10 flex-nowrap items-center',
    'group gap-2 rounded-sm border border-primary bg-primary px-4 py-3',
    'border-solid border-opacity-40 shadow-xs transition-colors',
    'focus-visible:outline-none focus-visible:ring-1 ',
  ),
  {
    variants: {
      type: {
        savings: cn(
          'active:border-reskin-page-savings hover:border-reskin-page-savings/40',
          'hover:shadow-reskin-page-savings/15 focus-visible:ring-reskin-page-savings',
        ),
        farms: cn(
          'active:border-reskin-page-farm hover:border-reskin-page-farms/40',
          'hover:shadow-reskin-page-farms/15 focus-visible:ring-reskin-page-farms',
        ),
        borrow: cn(
          'active:border-reskin-page-borrow hover:border-reskin-page-borrow/40',
          'hover:shadow-reskin-page-borrow/15 focus-visible:ring-reskin-page-borrow',
        ),
      },
      isActive: {
        false: '',
      },
      isHighlighted: {
        false: '',
      },
    },
    compoundVariants: [
      { type: 'savings', isHighlighted: true, class: 'border-reskin-page-savings/40 shadow-reskin-page-savings/15' },
      { type: 'farms', isHighlighted: true, class: 'border-reskin-page-farms/40 shadow-reskin-page-farms/15' },
      { type: 'borrow', isHighlighted: true, class: 'border-reskin-page-borrow/40 shadow-reskin-page-borrow/15' },
      { type: 'savings', isActive: true, class: 'border-reskin-page-savings' },
      { type: 'farms', isActive: true, class: 'border-reskin-page-farms' },
      { type: 'borrow', isActive: true, class: 'border-reskin-page-borrow' },
    ],
    defaultVariants: {
      isActive: false,
      isHighlighted: false,
    },
  },
)

type ButtonType = NonNullable<VariantProps<typeof buttonVariants>['type']>

export interface TopbarButtonProps {
  postfixSlot?: React.JSX.Element
  prefixIcon?: React.JSX.Element
  className?: string
  active?: boolean
  highlighted?: boolean
  label: string
  to?: To
  onClick?: React.MouseEventHandler<HTMLElement>
  type?: ButtonType
}

export const TopbarButton = forwardRef<HTMLAnchorElement | HTMLButtonElement, TopbarButtonProps>(
  ({ postfixSlot, prefixIcon, className: _className, label, to, type, active, highlighted, onClick, ...rest }, ref) => {
    const isActive = !!useMatch(`${to}/*`) || active

    const className = buttonVariants({ type, isActive, isHighlighted: highlighted })

    const content = (
      <>
        {prefixIcon}
        {label}
        {postfixSlot &&
          cloneElement(postfixSlot, {
            className: 'icon-xs transition-colors group-hover:text-secondary',
          })}
      </>
    )

    if (to) {
      return (
        <NavLink
          to={to}
          className={className}
          onClick={onClick}
          ref={ref as React.ForwardedRef<HTMLAnchorElement>}
          {...rest}
        >
          {content}
        </NavLink>
      )
    }

    return (
      <button
        type="button"
        className={className}
        onClick={onClick}
        ref={ref as React.ForwardedRef<HTMLButtonElement>}
        {...rest}
      >
        {content}
      </button>
    )
  },
)
