import { HelpCircle } from 'lucide-react'

import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { USD_MOCK_TOKEN } from '@/domain/types/Token'
import { Tooltip, TooltipContentShort, TooltipTrigger } from '@/ui/atoms/tooltip/Tooltip'
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
          <div className="typography-label-6 text-secondary drop-shadow-[0_2px_2px_white]">{title}</div>
          {description && (
            <Tooltip>
              <TooltipTrigger>
                <HelpCircle size={16} className="text-icon-foreground/50" />
              </TooltipTrigger>
              <TooltipContentShort>{description}</TooltipContentShort>
            </Tooltip>
          )}
        </div>
        <div className="typography-heading-3 text-primary">
          ${USD_MOCK_TOKEN.format(USDValue, { style: 'compact' })}
        </div>
      </div>
    </div>
  )
}
