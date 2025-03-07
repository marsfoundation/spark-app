import { expect } from 'earl'
import { http, createPublicClient } from 'viem'
import { mainnet } from 'viem/chains'
import { extractUrlFromClient } from './extractUrlFromClient.js'

describe(extractUrlFromClient.name, () => {
  it('extracts url from public client', () => {
    const sampleUrl = 'http://example.com'

    const publicClient = createPublicClient({
      chain: mainnet,
      transport: http(sampleUrl),
    })

    expect(extractUrlFromClient(publicClient)).toEqual(sampleUrl)
  })
})
