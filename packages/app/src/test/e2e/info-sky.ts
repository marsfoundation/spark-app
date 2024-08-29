import { Page } from '@playwright/test'

export interface OverrideInfoSkyRouteWithHAROptions {
  page: Page
  key: string
  update?: boolean
}
export async function overrideInfoSkyRouteWithHAR({
  page,
  key,
  update,
}: OverrideInfoSkyRouteWithHAROptions): Promise<void> {
  await page.routeFromHAR(`src/test/e2e/hars/${key}/main.har`, {
    url: /info-sky/,
    update,
  })
}
