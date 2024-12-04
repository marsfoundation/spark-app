import { assets } from '@/ui/assets'
import { IconPill } from '@/ui/atoms/icon-pill/IconPill'
import { Link } from '@/ui/atoms/link/Link'
import {
  Tooltip,
  TooltipContent,
  TooltipContentBody,
  TooltipContentHeader,
  TooltipContentIcon,
  TooltipContentLayout,
  TooltipContentTitle,
  TooltipTrigger,
} from '@/ui/atoms/new/tooltip/Tooltip'
import { links } from '@/ui/constants/links'

interface AirdropBadgeProps {
  'data-testid'?: string
}

export function AirdropBadge({ 'data-testid': dataTestId }: AirdropBadgeProps) {
  return (
    <Tooltip>
      <TooltipTrigger>
        <IconPill icon={assets.sparkIcon} data-testid={dataTestId} />
      </TooltipTrigger>
      <TooltipContent variant="long">
        <TooltipContentLayout>
          <TooltipContentHeader>
            <TooltipContentIcon src={assets.sparkIcon} />
            <TooltipContentTitle>Eligible for Spark Airdrop</TooltipContentTitle>
          </TooltipContentHeader>

          <TooltipContentBody>
            DAI borrowers with volatile assets and ETH depositors will be eligible for a future ⚡&nbsp;SPK airdrop.
            Please read the details on the{' '}
            <Link to={links.docs.sparkAirdrop} external>
              Spark Docs
            </Link>
            .
          </TooltipContentBody>
        </TooltipContentLayout>
      </TooltipContent>
    </Tooltip>
  )
}
