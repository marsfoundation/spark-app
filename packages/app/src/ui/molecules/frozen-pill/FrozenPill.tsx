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

interface FrozenPillProps {
  'data-testid'?: string
}

export function FrozenPill({ 'data-testid': dataTestId }: FrozenPillProps) {
  return (
    <Tooltip>
      <TooltipTrigger className="flex">
        <IconPill icon={assets.snowflake} className="border-none bg-blue-50" data-testid={dataTestId} />
      </TooltipTrigger>
      <TooltipContent variant="long">
        <TooltipContentLayout>
          <TooltipContentHeader>
            <TooltipContentIcon src={assets.snowflake} />
            <TooltipContentTitle>Frozen asset</TooltipContentTitle>
          </TooltipContentHeader>

          <TooltipContentBody>
            This asset is frozen by Spark community decisions, meaning that further supply / borrow, or rate swap of
            these assets are unavailable. Withdrawals and debt repayments are still allowed.
          </TooltipContentBody>
        </TooltipContentLayout>
      </TooltipContent>
    </Tooltip>
  )
}
