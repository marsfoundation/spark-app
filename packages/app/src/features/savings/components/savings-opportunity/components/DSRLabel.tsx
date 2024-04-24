import { Link } from '@/ui/atoms/link/Link'
import { links } from '@/ui/constants/links'

import { SavingsInfoTile } from '../../savings-info-tile/SavingsInfoTile'

export function DSRLabel() {
  return (
    <SavingsInfoTile.Label
      tooltipContent={
        <>
          <p>This represents the current annual interest rate for DAI deposited into the DSR.</p>
          <p>
            The DSR is set on-chain by MakerDAO and can be adjusted through MakerDAO's governance mechanisms. Keep in
            mind that these protocol mechanisms are subject to change.
          </p>
          <p>
            For more information about DSR, you can visit{' '}
            <Link to={links.docs.dsr} external>
              docs
            </Link>
            .
          </p>
        </>
      }
    >
      DSR
    </SavingsInfoTile.Label>
  )
}
