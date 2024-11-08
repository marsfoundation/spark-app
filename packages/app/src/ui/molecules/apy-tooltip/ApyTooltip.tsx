import { ReactNode } from 'react'

// import { Link } from '@/ui/atoms/link/Link'
// import { links } from '@/ui/constants/links'

import { Info } from '../info/Info'

interface ApyTooltipProps {
  children: ReactNode
  variant: 'supply' | 'borrow'
}

export function ApyTooltip({ children, variant }: ApyTooltipProps) {
  return (
    <div className="flex items-center gap-0.5">
      {children}
      <Info>{variantToText[variant]}</Info>
    </div>
  )
}

const variantToText: Record<ApyTooltipProps['variant'], ReactNode> = {
  supply: (
    <>
      <p>
        The APY for supplying assets on Last is a dynamic metric that adjusts based on the utilization rate of each
        reserve pool.
      </p>
      <p>
        As the utilization rate fluctuates, the interest rates offered to suppliers also change accordingly. This means
        that the APY for supplying assets is responsive to market conditions and can vary based on the demand for
        borrowing within each pool.
      </p>
      {/* <p>
        <Link to={links.docs.supplying} external>
          Learn more
        </Link>
        .
      </p> */}
    </>
  ),
  borrow: (
    <>
      <p>
        The interest rate for borrowing on Last is a live metric that adjusts with each block confirmation, reflecting
        the most recent data based on the token pool's utilization rate.
      </p>
      <p>
        This, in turn, affects the APY for borrowers, as it influences the nominal interest rate applied to their loans.
      </p>
      {/* <p> This doesn't apply to DAI as Sky Ecosystem Governance defines the borrowing rate.</p>
      <p>
        <Link to={links.docs.borrowing} external>
          Learn more
        </Link>
        .
      </p> */}
    </>
  ),
}
