import { assets } from '@/ui/assets'
import { Tooltip, TooltipContentLong, TooltipTrigger } from '@/ui/atoms/tooltip/Tooltip'
import { TooltipContentLayout } from '@/ui/atoms/tooltip/TooltipContentLayout'

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
      <TooltipContentLong>
        <TooltipContentLayout>
          <TooltipContentLayout.Header>
            <TooltipContentLayout.Icon src={assets.pause} />
            <TooltipContentLayout.Title>Paused asset</TooltipContentLayout.Title>
          </TooltipContentLayout.Header>

          <TooltipContentLayout.Body>
            This asset is planned to be offboarded due to a Last community decision.
          </TooltipContentLayout.Body>
        </TooltipContentLayout>
      </TooltipContentLong>
    </Tooltip>
  )
}
