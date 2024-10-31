import { assets } from '@/ui/assets'
import { IconPill } from '@/ui/atoms/icon-pill/IconPill'
import { Link } from '@/ui/atoms/link/Link'
import { Tooltip, TooltipContentLong, TooltipTrigger } from '@/ui/atoms/tooltip/Tooltip'
import { TooltipContentLayout } from '@/ui/atoms/tooltip/TooltipContentLayout'
import { links } from '@/ui/constants/links'

interface AirdropBadgeProps {
  'data-testid'?: string
}

export function AirdropBadge({ 'data-testid': dataTestId }: AirdropBadgeProps) {
  return (
    <Tooltip>
      <TooltipTrigger>
        <IconPill icon={assets.lastLogo} data-testid={dataTestId} />
      </TooltipTrigger>
      <TooltipContentLong>
        <TooltipContentLayout>
          <TooltipContentLayout.Header>
            <TooltipContentLayout.Icon src={assets.lastLogo} />
            <TooltipContentLayout.Title>Eligible for LAST points</TooltipContentLayout.Title>
          </TooltipContentLayout.Header>

          <TooltipContentLayout.Body>
            DAI borrowers with volatile assets and ETH depositors will be eligible for a future LAST points airdrop.
            Please read the details on the{' '}
            <Link to={links.docs.sparkAirdrop} external>
              Last Docs
            </Link>
            .
          </TooltipContentLayout.Body>
        </TooltipContentLayout>
      </TooltipContentLong>
    </Tooltip>
  )
}
