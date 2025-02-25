import { expect } from 'earl'
import { getRandomChainId } from './getRandomChainId.js'

const MAX_CHAIN_ID = 0xffffffff // 2^32-1

describe(getRandomChainId.name, () => {
  it('generates a random chainId for arbitrum', () => {
    const chainId = getRandomChainId()

    expect(chainId.toString()).toMatchRegex(/^7357[0-9]+$/)
    expect(chainId).toBeLessThan(MAX_CHAIN_ID)
  })
})
