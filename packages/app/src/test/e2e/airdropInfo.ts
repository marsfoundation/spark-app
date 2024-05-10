import { Page } from '@playwright/test'
import { Address } from 'viem'

export interface OverrideAirdropInfoRouteOptions {
  account: Address
  shouldFail?: boolean
  noAirdrop?: boolean
}

export async function overrideAirdropInfoRoute(
  page: Page,
  { account, shouldFail, noAirdrop }: OverrideAirdropInfoRouteOptions,
): Promise<void> {
  const endpoint = matchUrl(`${airdropApi.endpoint}${account}/`)
  await page.route(endpoint, async (route) => {
    await route.fulfill(getMockResponse(shouldFail, noAirdrop))
  })
}

function matchUrl(expectedUrl: string): (actualUrl: URL) => boolean {
  return (url: URL) => `${url.protocol}//${url.host}${url.pathname}` === expectedUrl
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function getMockResponse(shouldFail?: boolean, noAirdrop?: boolean) {
  if (shouldFail) {
    return { status: 500 }
  }
  return { json: noAirdrop ? airdropApi.emptyResponse : airdropApi.response }
}

const airdropApi = {
  endpoint: 'https://spark-api.blockanalitica.com/api/airdrop/',
  response: {
    token_reward: '3733867.039334103969968393',
  },
  emptyResponse: {},
}
