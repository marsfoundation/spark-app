import { HelpCircle } from 'lucide-react'

import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { USD_MOCK_TOKEN } from '@/domain/types/Token'
import { Tooltip, TooltipContentShort, TooltipTrigger } from '@/ui/atoms/tooltip/Tooltip'
import { cn } from '@/ui/utils/style'
import { ComponentType } from 'react'

export interface TileProps {
  icon: ComponentType<{ className?: string }>
  title: string
  USDValue: NormalizedUnitNumber
  description?: string
  'data-testid'?: string
}

export function Tile({ icon: Icon, title, USDValue, description, 'data-testid': dataTestId }: TileProps) {
  return (
    <div className="flex items-center gap-2 md:gap-3" data-testid={dataTestId}>
      <div className="flex rounded-full bg-white p-1.5 lg:p-4 md:p-3">
        <Icon className="h-6 w-6 text-reskin-orange-400 lg:h-8 md:h-7 lg:w-8 md:w-7" />
      </div>
      <div className="flex flex-col">
        <div className="flex items-center gap-1">
          <div
            className={cn(
              'typography-label-6 relative text-secondary',
              'before:-z-10 before:absolute before:inset-0',
              'before:bg-reskin-base-white/60 before:blur-xs',
            )}
          >
            {title}
          </div>
          {description && (
            <Tooltip>
              <TooltipTrigger>
                <HelpCircle size={16} className="text-icon-foreground/50" />
              </TooltipTrigger>
              <TooltipContentShort>{description}</TooltipContentShort>
            </Tooltip>
          )}
        </div>
        <div
          className={cn(
            'typography-heading-3 relative text-primary',
            'before:-z-10 before:absolute before:inset-0',
            'before:bg-reskin-base-white/60 before:blur-sm',
          )}
        >
          ${USD_MOCK_TOKEN.format(USDValue, { style: 'compact' })}
        </div>
      </div>
    </div>
  )
}
