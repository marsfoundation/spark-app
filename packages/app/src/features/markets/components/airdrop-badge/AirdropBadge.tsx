import { assets } from '@/ui/assets'
import { IconPill } from '@/ui/atoms/icon-pill/IconPill'
import { Link } from '@/ui/atoms/link/Link'
import { Tooltip, TooltipContentLong, TooltipTrigger } from '@/ui/atoms/tooltip/Tooltip'
import { TooltipContentLayout } from '@/ui/atoms/tooltip/TooltipContentLayout'
import { links } from '@/ui/constants/links'

export function AirdropBadge() {
  return (
    <Tooltip>
      <TooltipTrigger>
        <IconPill icon={assets.sparkIcon} />
      </TooltipTrigger>
      <TooltipContentLong>
        <TooltipContentLayout>
          <TooltipContentLayout.Header>
            <TooltipContentLayout.Icon src={assets.sparkIcon} />
            <TooltipContentLayout.Title>Eligible for Spark Airdrop</TooltipContentLayout.Title>
          </TooltipContentLayout.Header>

          <TooltipContentLayout.Body>
            DAI borrowers with volatile assets and ETH depositors will be eligible for a future ⚡ SPK airdrop. Please
            read the details on the{' '}
            <Link to={links.docs.sparkAirdrop} external>
              Spark Docs
            </Link>
            .
          </TooltipContentLayout.Body>
        </TooltipContentLayout>
      </TooltipContentLong>
    </Tooltip>
  )
}
