import { HelpCircle } from 'lucide-react'

import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { USD_MOCK_TOKEN } from '@/domain/types/Token'
import { Tooltip, TooltipContentShort, TooltipTrigger } from '@/ui/atoms/tooltip/Tooltip'
import { Typography } from '@/ui/atoms/typography/Typography'

export interface TileProps {
  icon: string
  title: string
  USDValue: NormalizedUnitNumber
  description?: string
  'data-testid'?: string
}

export function Tile({ icon, title, USDValue, description, 'data-testid': dataTestId }: TileProps) {
  return (
    <div className="flex items-center gap-2 md:gap-3" data-testid={dataTestId}>
      <div className="flex rounded-lg border bg-white/10 p-1.5 lg:rounded-2xl md:rounded-xl lg:p-4 md:p-3">
        <img src={icon} alt={title} className="w-6 lg:w-8 md:w-7" />
      </div>
      <div className="flex flex-col">
        <div className="flex items-center gap-1">
          <Typography variant="prompt">{title}</Typography>
          {description && (
            <Tooltip>
              <TooltipTrigger>
                <HelpCircle size={16} className="text-icon-foreground/50" />
              </TooltipTrigger>
              <TooltipContentShort>{description}</TooltipContentShort>
            </Tooltip>
          )}
        </div>
        <div className="flex gap-1 font-semibold text-base md:gap-2 lg:text-2xl md:text-xl">
          <div className="text-white/80">$</div>
          <div>{USD_MOCK_TOKEN.format(USDValue, { style: 'compact' })}</div>
        </div>
      </div>
    </div>
  )
}
