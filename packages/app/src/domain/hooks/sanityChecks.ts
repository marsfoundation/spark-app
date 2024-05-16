import invariant from 'tiny-invariant'
import { Address, zeroAddress } from 'viem'

import { NATIVE_ASSET_MOCK_ADDRESS } from '@/config/consts'

/**
 * Do basic sanity checks when sending txs.
 * These checks should never fail in real life scenario but it's the final line of defense against bugs in the app.
 */
export function sanityCheckTx(tx: { address?: Address; value?: bigint }): void {
  invariant(tx.address, 'Address is required')
  invariant(
    tx.address.toLowerCase() !== NATIVE_ASSET_MOCK_ADDRESS.toLowerCase(),
    'Cannot interact with ETH mock address',
  )
  invariant(tx.address !== zeroAddress, 'Cannot interact with zero address')
}
