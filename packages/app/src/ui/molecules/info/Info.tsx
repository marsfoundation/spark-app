import { Tooltip, TooltipContent, TooltipTrigger } from '@/ui/atoms/new/tooltip/Tooltip'
import { cn } from '@/ui/utils/style'
import { InfoIcon } from 'lucide-react'

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
      <TooltipContent>{children}</TooltipContent>
    </Tooltip>
  )
}

export { Info, type InfoProps }
