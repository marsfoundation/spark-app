import { Page } from '@playwright/test'

export interface OverrideLiFiRouteWithHAROptions {
  page: Page
  key: string
  update: boolean
}
export async function overrideLiFiRouteWithHAR({ page, key, update }: OverrideLiFiRouteWithHAROptions): Promise<void> {
  await page.routeFromHAR(`src/test/e2e/hars/${key}/main.har`, {
    url: 'https://li.quest/**/*',
    update,
  })
}
