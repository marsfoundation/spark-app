import { Locator, expect } from '@playwright/test'

import { BasePageObject } from '@/test/e2e/BasePageObject'
import { testIds } from '@/ui/utils/testIds'

export class NavbarPageObject extends BasePageObject {
  // #region locators
  locateAirdropBadge(): Locator {
    return this.page.getByTestId(testIds.navbar.airdropBadge)
  }

  locateAirdropPreciseAmount(): Locator {
    return this.page.getByRole('tooltip').getByText('SPK').first()
  }

  locateSavingsLink(): Locator {
    return this.page.getByRole('link', { name: 'Cash & Savings' })
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
    await expect(this.locateAirdropPreciseAmount()).toHaveText(new RegExp(`^${value}*`))
  }

  async expectAirdropBadgeNotVisible(): Promise<void> {
    await expect(this.locateAirdropBadge()).not.toBeVisible()
  }

  async expectSavingsLinkVisible(): Promise<void> {
    await expect(this.locateSavingsLink()).toBeVisible()
  }
  // #endregion
}
