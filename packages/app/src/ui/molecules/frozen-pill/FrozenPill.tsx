import { assets } from '@/ui/assets'
import { Tooltip, TooltipContentLong, TooltipTrigger } from '@/ui/atoms/tooltip/Tooltip'
import { TooltipContentLayout } from '@/ui/atoms/tooltip/TooltipContentLayout'

import { IconPill } from '../../atoms/icon-pill/IconPill'

interface FrozenPillProps {
  'data-testid'?: string
}

export function FrozenPill({ 'data-testid': dataTestId }: FrozenPillProps) {
  return (
    <Tooltip>
      <TooltipTrigger className="flex">
        <IconPill icon={assets.snowflake} className="border-none bg-blue-50" data-testid={dataTestId} />
      </TooltipTrigger>
      <TooltipContentLong>
        <TooltipContentLayout>
          <TooltipContentLayout.Header>
            <TooltipContentLayout.Icon src={assets.snowflake} />
            <TooltipContentLayout.Title>Frozen asset</TooltipContentLayout.Title>
          </TooltipContentLayout.Header>

          <TooltipContentLayout.Body>
            This asset is frozen by Last community decisions, meaning that further supply / borrow, or rate swap of
            these assets are unavailable. Withdrawals and debt repayments are still allowed.
          </TooltipContentLayout.Body>
        </TooltipContentLayout>
      </TooltipContentLong>
    </Tooltip>
  )
}
