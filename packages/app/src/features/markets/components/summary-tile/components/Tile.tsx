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
}

export function Tile({ icon, title, USDValue, description }: TileProps) {
  return (
    <div className="flex items-center gap-2 md:gap-3">
      <div className="flex rounded-lg border bg-white p-1.5 md:rounded-xl md:p-3 lg:rounded-2xl lg:p-4">
        <img src={icon} alt={title} className="w-6 md:w-7 lg:w-8" />
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
        <div className="flex gap-1 md:gap-2">
          <p className="text-base font-semibold text-black/30 md:text-xl lg:text-2xl">$</p>
          <p className="text-base font-semibold text-black md:text-xl lg:text-2xl">
            {USD_MOCK_TOKEN.format(USDValue, { style: 'compact' })}
          </p>
        </div>
      </div>
    </div>
  )
}
