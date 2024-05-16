import { zeroAddress } from 'viem'

import { NATIVE_ASSET_MOCK_ADDRESS } from '@/config/consts'

import { sanityCheckTx } from './sanityChecks'

describe(sanityCheckTx.name, () => {
  it('throws when address is on a black list', () => {
    expect(() => sanityCheckTx({ address: NATIVE_ASSET_MOCK_ADDRESS, value: 0n })).toThrow('Cannot interact')
    expect(() => sanityCheckTx({ address: zeroAddress, value: 0n })).toThrow('Cannot interact')
  })
})
