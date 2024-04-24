import { HelpCircle } from 'lucide-react'

import { Tooltip, TooltipContentShort, TooltipTrigger } from '@/ui/atoms/tooltip/Tooltip'

interface InfoProps {
  size?: number
  children: React.ReactNode
}

function Info({ children, size = 14 }: InfoProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <HelpCircle size={size} className="text-basics-dark-grey/50" />
      </TooltipTrigger>
      <TooltipContentShort>{children}</TooltipContentShort>
    </Tooltip>
  )
}

export { Info, type InfoProps }
