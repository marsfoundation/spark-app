import { expect, Locator } from '@playwright/test'

import { BasePageObject } from '@/test/e2e/BasePageObject'

export class NavbarPageObject extends BasePageObject {
  // #region locators
  locateAirdropBadge(): Locator {
    return this.page.getByRole('navigation').getByRole('button').first()
  }

  locateAirdropPreciseAmount(): Locator {
    return this.page.getByRole('tooltip').getByText('SPK').first()
  }
  // #endregion

  // #region actions
  async hoverOverAirdropBadge(): Promise<void> {
    await this.locateAirdropBadge().hover()
  }
  // #endregion

  // #region assertions
  async expectAirdropCompactValue(value: string): Promise<void> {
    await expect(this.locateAirdropBadge()).toHaveText(value)
  }

  async expectAirdropPreciseValue(value: string): Promise<void> {
    await expect(this.locateAirdropPreciseAmount()).toHaveText(value)
  }
  // #endregion
}
