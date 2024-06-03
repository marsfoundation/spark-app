import { Page } from '@playwright/test'

export interface OverrideLiFiRouteWithHAROptions {
  page: Page
  key: string
  update?: boolean
}
export async function overrideLiFiRouteWithHAR({ page, key, update }: OverrideLiFiRouteWithHAROptions): Promise<void> {
  await page.routeFromHAR(`src/test/e2e/hars/${key}/main.har`, {
    url: 'https://li.quest/**/*',
    update,
  })
}

export const LIFI_TEST_USER_PRIVATE_KEY = '0x3bbbecd9e46fb806696ec2e75bcdad290158609fd4eefb3eaa8c9010ee87fc4d'
