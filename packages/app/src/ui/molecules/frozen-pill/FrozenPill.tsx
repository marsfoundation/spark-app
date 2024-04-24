import { assets } from '@/ui/assets'
import { Tooltip, TooltipContentLong, TooltipTrigger } from '@/ui/atoms/tooltip/Tooltip'
import { TooltipContentLayout } from '@/ui/atoms/tooltip/TooltipContentLayout'

import { IconPill } from '../../atoms/icon-pill/IconPill'

export function FrozenPill() {
  return (
    <Tooltip>
      <TooltipTrigger className="flex">
        <IconPill icon={assets.snowflake} className="border-none bg-blue-50" />
      </TooltipTrigger>
      <TooltipContentLong>
        <TooltipContentLayout>
          <TooltipContentLayout.Header>
            <TooltipContentLayout.Icon src={assets.snowflake} />
            <TooltipContentLayout.Title>Frozen asset</TooltipContentLayout.Title>
          </TooltipContentLayout.Header>

          <TooltipContentLayout.Body>
            This asset is frozen by Spark community decisions, meaning that further supply / borrow, or rate swap of
            these assets are unavailable. Withdrawals and debt repayments are still allowed.
          </TooltipContentLayout.Body>
        </TooltipContentLayout>
      </TooltipContentLong>
    </Tooltip>
  )
}
