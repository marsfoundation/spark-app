import { Locator, expect } from '@playwright/test'

import { BasePageObject } from '@/test/e2e/BasePageObject'
import { testIds } from '@/ui/utils/testIds'

export class PageNotSupportedWarningPageObject extends BasePageObject {
  // #region locators
  locateSwitchNetworkButton(): Locator {
    return this.page.getByTestId(testIds.component.SwitchNotSupportedNetworkButton)
  }
  // #endregion

  // #region actions
  // #endregion

  // #region assertions
  async expectSwitchNetworkVisible(): Promise<void> {
    await expect(this.locateSwitchNetworkButton()).toBeVisible()
  }

  async expectSwitchNetworkNotVisible(): Promise<void> {
    await expect(this.locateSwitchNetworkButton()).not.toBeVisible()
  }
  // #endregion
}
