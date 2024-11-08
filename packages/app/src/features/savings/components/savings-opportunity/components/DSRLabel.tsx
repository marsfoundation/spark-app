import { SupportedChainId } from '@/config/chain/types'
import { SavingsMetaItem } from '@/features/savings/logic/makeSavingsMeta'
import { Link } from '@/ui/atoms/link/Link'
import { links } from '@/ui/constants/links'
import { SavingsInfoTile } from '../../savings-info-tile/SavingsInfoTile'
import { lastSepolia } from '@/config/chain/constants'

export interface DSRLabelProps {
  originChainId: SupportedChainId
  savingsMetaItem: SavingsMetaItem
}

export function DSRLabel({ originChainId, savingsMetaItem }: DSRLabelProps) {
  return (
    <SavingsInfoTile.Label
      tooltipContent={
        // @TODO: update GnosisDsrDetails
        originChainId === lastSepolia.id ? <GnosisDsrDetails /> : <TooltipContent savingsMetaItem={savingsMetaItem} />
      }
    >
      {savingsMetaItem.rateAcronym}
    </SavingsInfoTile.Label>
  )
}

function TooltipContent({ savingsMetaItem }: { savingsMetaItem: SavingsMetaItem }) {
  const { stablecoin, rateAcronym, rateName } = savingsMetaItem
  const docsLink = rateAcronym === 'DSR' ? links.docs.dsr : links.docs.ssr
  return (
    <p>
      The {rateAcronym}, or {rateName}, represents the current annual interest rate for {stablecoin} deposited into the
      Sky Savings Module. It is determined on-chain by the Sky Ecosystem Governance. Please note that these protocol
      mechanisms are subject to change. Learn more about it{' '}
      <Link to={docsLink} external>
        here
      </Link>
      .
    </p>
  )
}

function GnosisDsrDetails() {
  return (
    <>
      <p>All interest from the xDAI Bridge on the Ethereum mainnet is being redirected to Gnosis sDAI.</p>
      <p>The bridge converts its DAI deposits into Savings DAI on the mainnet, which then accumulates the DSR.</p>
      <p>
        The DSR is set on mainnet by Sky Ecosystem Governance. Keep in mind that these protocol mechanisms are subject
        to change.
      </p>
      <p>
        For more information about DSR, you can visit{' '}
        <Link to={links.docs.dsr} external>
          docs
        </Link>
        .
      </p>
    </>
  )
}
