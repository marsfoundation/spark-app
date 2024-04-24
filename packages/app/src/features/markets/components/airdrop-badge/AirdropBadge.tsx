import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { USD_MOCK_TOKEN } from '@/domain/types/Token'
import { assets } from '@/ui/assets'
import { IconPill } from '@/ui/atoms/icon-pill/IconPill'
import { Link } from '@/ui/atoms/link/Link'
import { Tooltip, TooltipContentLong, TooltipTrigger } from '@/ui/atoms/tooltip/Tooltip'
import { TooltipContentLayout } from '@/ui/atoms/tooltip/TooltipContentLayout'
import { links } from '@/ui/constants/links'

interface AirdropBadgeProps {
  value: NormalizedUnitNumber
}

// @todo It should take into consideration other airdrops as well, when SPK is not only one
export function AirdropBadge({ value }: AirdropBadgeProps) {
  return (
    <Tooltip>
      <TooltipTrigger>
        <IconPill icon={assets.sparkIcon} />
      </TooltipTrigger>
      <TooltipContentLong>
        <TooltipContentLayout>
          <TooltipContentLayout.Header>
            <TooltipContentLayout.Icon src={assets.sparkIcon} />
            <TooltipContentLayout.Title>
              Eligible for {USD_MOCK_TOKEN.format(value, { style: 'compact' })} Spark Airdrop
            </TooltipContentLayout.Title>
          </TooltipContentLayout.Header>

          <TooltipContentLayout.Body>
            DAI borrowers with volatile assets and ETH depositors will be eligible for a future ⚡ SPK airdrop. Please
            read the details on the{' '}
            <Link to={links.sparkAirdropFormula} external>
              Maker governance forum
            </Link>
            .
          </TooltipContentLayout.Body>
        </TooltipContentLayout>
      </TooltipContentLong>
    </Tooltip>
  )
}
