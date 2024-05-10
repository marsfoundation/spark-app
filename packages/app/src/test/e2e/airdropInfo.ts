import { Page } from '@playwright/test'
import { Address } from 'viem'

export async function overrideAirdropInfoRoute(page: Page, account: Address): Promise<void> {
  const endpoint = matchUrl(`${airdropApi.endpoint}${account}/`)
  await page.route(endpoint, async (route) => {
    await route.fulfill({
      json: airdropApi.response,
    })
  })
}

function matchUrl(expectedUrl: string): (actualUrl: URL) => boolean {
  return (url: URL) => `${url.protocol}//${url.host}${url.pathname}` === expectedUrl
}

const airdropApi = {
  endpoint: 'https://spark-api.blockanalitica.com/api/airdrop/',
  response: {
    token_reward: '3733867.039334103969968393',
  },
}
