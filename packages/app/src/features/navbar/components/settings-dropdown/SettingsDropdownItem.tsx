import { cva, VariantProps } from 'class-variance-authority'
import { ComponentProps } from 'react'

import { DropdownMenuItem } from '@/ui/atoms/dropdown/DropdownMenu'
import { cn } from '@/ui/utils/style'
import { useBreakpoint } from '@/ui/utils/useBreakpoint'

export interface SettingsDropdownItemProps extends ComponentProps<typeof DropdownMenuItem> {
  children: React.ReactNode
  variant?: VariantProps<typeof settingsDropdownItemVariants>['variant']
}

function SettingsDropdownItem({ children, variant, ...rest }: SettingsDropdownItemProps) {
  const isMobile = !useBreakpoint('lg')

  if (isMobile) {
    return (
      <div className={cn(settingsDropdownItemVariants({ variant }))} {...(rest as any)}>
        <div className="flex flex-col gap-1">{children}</div>
      </div>
    )
  }

  return (
    <DropdownMenuItem className={cn(settingsDropdownItemVariants({ variant }))} {...rest}>
      <div className="flex flex-col gap-1">{children}</div>
    </DropdownMenuItem>
  )
}

const settingsDropdownItemVariants = cva('group min-w-[240px] last:mb-0', {
  variants: {
    variant: {
      default: 'cursor-pointer',
      footnote: 'py-1',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

function SettingsDropdownItemTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-row items-center gap-2.5 font-semibold lg:gap-1 lg:font-normal group-hover:text-nav-primary lg:text-basics-dark-grey lg:text-xs">
      {children}
    </div>
  )
}

function SettingsDropdownItemContent({ children }: { children: React.ReactNode }) {
  return <div className="hidden font-semibold text-basics-black first:block lg:block">{children}</div>
}

SettingsDropdownItem.Title = SettingsDropdownItemTitle
SettingsDropdownItem.Content = SettingsDropdownItemContent

export { SettingsDropdownItem }
