import { ReactNode } from 'react'
import { gnosis, mainnet } from 'viem/chains'

import { SupportedChainId } from '@/config/chain/types'
import { Link } from '@/ui/atoms/link/Link'
import { links } from '@/ui/constants/links'

import { SavingsInfoTile } from '../../savings-info-tile/SavingsInfoTile'

export interface APYLabelProps {
  chainId: SupportedChainId
}

export function APYLabel({ chainId }: APYLabelProps) {
  return <SavingsInfoTile.Label tooltipContent={chainIdToApyDetails[chainId]}>APY</SavingsInfoTile.Label>
}

const chainIdToApyDetails: Record<SupportedChainId, ReactNode> = {
  [mainnet.id]: (
    <>
      <p>This represents the current annual interest rate for DAI deposited into the DSR.</p>
      <p>
        The DSR is set on-chain by MakerDAO and can be adjusted through MakerDAO's governance mechanisms. Keep in mind
        that these protocol mechanisms are subject to change.
      </p>
      <p>
        For more information about DSR, you can visit{' '}
        <Link to={links.docs.dsr} external>
          docs
        </Link>
        .
      </p>
    </>
  ),
  [gnosis.id]: (
    <>
      <p>All interest from the xDAI Bridge on the Ethereum mainnet is being redirected to Gnosis sDAI.</p>
      <p>
        The bridge converts its DAI deposits into Savings DAI on the mainnet, which then accumulates the DSR. The DSR
        (Dai Savings Rate) is the payout rate provided by the Maker Protocol to its depositors.
      </p>
      <p>
        The DSR is set on mainnet by MakerDAO and can be adjusted through MakerDAO's governance mechanisms. Keep in mind
        that these protocol mechanisms are subject to change.
      </p>
    </>
  ),
}
