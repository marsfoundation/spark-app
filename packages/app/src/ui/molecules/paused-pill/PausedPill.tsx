import { assets } from '@/ui/assets'
import { Tooltip, TooltipContent, TooltipContentLayout, TooltipTrigger } from '@/ui/atoms/tooltip/Tooltip'

import { IconPill } from '../../atoms/icon-pill/IconPill'

interface PausedPillProps {
  'data-testid'?: string
}

export function PausedPill({ 'data-testid': dataTestId }: PausedPillProps) {
  return (
    <Tooltip>
      <TooltipTrigger className="flex">
        <IconPill
          icon={assets.pause}
          className="shrink-0 border-none bg-system-error-primary"
          data-testid={dataTestId}
        />
      </TooltipTrigger>
      <TooltipContent variant="long">
        <TooltipContentLayout>
          <TooltipContentLayout.Header>
            <TooltipContentLayout.Icon src={assets.pause} />
            <TooltipContentLayout.Title>Paused asset</TooltipContentLayout.Title>
          </TooltipContentLayout.Header>

          <TooltipContentLayout.Body>
            This asset is planned to be offboarded due to a Spark community decision.
          </TooltipContentLayout.Body>
        </TooltipContentLayout>
      </TooltipContent>
    </Tooltip>
  )
}
