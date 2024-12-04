import { assets } from '@/ui/assets'
import {
  Tooltip,
  TooltipContent,
  TooltipContentBody,
  TooltipContentHeader,
  TooltipContentIcon,
  TooltipContentLayout,
  TooltipContentTitle,
  TooltipTrigger,
} from '@/ui/atoms/tooltip/Tooltip'

import { IconPill } from '../../atoms/icon-pill/IconPill'

interface PausedPillProps {
  'data-testid'?: string
}

export function PausedPill({ 'data-testid': dataTestId }: PausedPillProps) {
  return (
    <Tooltip>
      <TooltipTrigger className="flex">
        <IconPill icon={assets.pause} className="shrink-0 border-none bg-red-100" data-testid={dataTestId} />
      </TooltipTrigger>
      <TooltipContent variant="long">
        <TooltipContentLayout>
          <TooltipContentHeader>
            <TooltipContentIcon src={assets.pause} />
            <TooltipContentTitle>Paused asset</TooltipContentTitle>
          </TooltipContentHeader>

          <TooltipContentBody>
            This asset is planned to be offboarded due to a Spark community decision.
          </TooltipContentBody>
        </TooltipContentLayout>
      </TooltipContent>
    </Tooltip>
  )
}
