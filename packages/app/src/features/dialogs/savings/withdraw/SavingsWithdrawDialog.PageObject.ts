import { Page } from '@playwright/test'

import { DialogPageObject } from '../../common/Dialog.PageObject'

export class SavingsWithdrawDialogPageObject extends DialogPageObject {
  constructor(page: Page) {
    super(page, /Withdraw from Savings/)
  }

  // #region actions
  async clickBackToSavingsButton(): Promise<void> {
    await this.page.getByRole('button', { name: 'Back to Savings' }).click()
    await this.region.waitFor({
      state: 'detached',
    })
  }
  // #endregion
}
