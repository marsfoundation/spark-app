import { HelpCircle } from 'lucide-react'

import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { USD_MOCK_TOKEN } from '@/domain/types/Token'
import { Tooltip, TooltipContentShort, TooltipTrigger } from '@/ui/atoms/tooltip/Tooltip'
import { Typography } from '@/ui/atoms/typography/Typography'
import { testIds } from '@/ui/utils/testIds'

export interface TileProps {
  icon: string
  title: string
  USDValue: NormalizedUnitNumber
  description?: string
  index: number
}

export function Tile({ icon, title, USDValue, description, index }: TileProps) {
  return (
    <div className="flex items-center gap-2 md:gap-3">
      <div className="flex rounded-lg border bg-white p-1.5 lg:rounded-2xl md:rounded-xl lg:p-4 md:p-3">
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
              <TooltipContentShort data-testid={testIds.markets.summary.tile.description(index)}>
                {description}
              </TooltipContentShort>
            </Tooltip>
          )}
        </div>
        <div className="flex gap-1 font-semibold text-base md:gap-2 lg:text-2xl md:text-xl">
          <div className="text-black/30 ">$</div>
          <div className=" text-black" data-testid={testIds.markets.summary.tile.value(index)}>
            {USD_MOCK_TOKEN.format(USDValue, { style: 'compact' })}
          </div>
        </div>
      </div>
    </div>
  )
}
