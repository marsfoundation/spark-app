import { cn } from '@/ui/utils/style'
import { VariantProps, cva } from 'class-variance-authority'
import { CheckIcon, LoaderIcon } from 'lucide-react'

const networkStatusBadgeVariants = cva('flex w-fit items-center gap-0.5 rounded-full py-[3px] pr-1.5 pl-1', {
  variants: {
    status: {
      connected: 'bg-system-success-primary text-system-success-secondary',
      pending: 'bg-brand-secondary text-brand-secondary',
    },
  },
})

export interface NetworkStatusBadgeProps {
  status: NonNullable<VariantProps<typeof networkStatusBadgeVariants>['status']>
}

export function NetworkStatusBadge({ status }: NetworkStatusBadgeProps) {
  const [Icon, text] = status === 'connected' ? [CheckIcon, 'Connected'] : [LoaderIcon, 'Confirm in wallet']

  return (
    <div className={networkStatusBadgeVariants({ status })}>
      <Icon className={cn('icon-xxs', status === 'pending' && 'animate-[spin_2s_linear_infinite]')} />
      <div className="typography-label-4">{text}</div>
    </div>
  )
}
