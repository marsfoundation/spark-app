import { InfoIcon } from 'lucide-react'

import { Tooltip, TooltipContentShort, TooltipTrigger } from '@/ui/atoms/tooltip/Tooltip'
import { cn } from '@/ui/utils/style'

interface InfoProps {
  size?: number
  children: React.ReactNode
  className?: string
}

function Info({ children, size = 14, className }: InfoProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <InfoIcon size={size} className={cn('text-basics-dark-grey/50', className)} />
      </TooltipTrigger>
      <TooltipContentShort>{children}</TooltipContentShort>
    </Tooltip>
  )
}

export { Info, type InfoProps }
