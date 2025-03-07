import { assets } from '@/ui/assets'
import { Tooltip, TooltipContent, TooltipContentLayout, TooltipTrigger } from '@/ui/atoms/tooltip/Tooltip'
import { IconPill } from '../../atoms/icon-pill/IconPill'

interface FrozenPillProps {
  'data-testid'?: string
}

export function FrozenPill({ 'data-testid': dataTestId }: FrozenPillProps) {
  return (
    <Tooltip>
      <TooltipTrigger className="flex">
        <IconPill icon={assets.snowflake} className="border-none bg-brand-primary" data-testid={dataTestId} />
      </TooltipTrigger>
      <TooltipContent variant="long">
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
      </TooltipContent>
    </Tooltip>
  )
}
