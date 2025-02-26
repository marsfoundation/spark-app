import { TestContext } from '@/test/e2e/setup'
import { DialogPageObject } from '../common/Dialog.PageObject'

export class ClaimSparkRewardsDialogPageObject extends DialogPageObject {
  constructor(testContext: TestContext) {
    super({ testContext, header: /Claim/ })
  }

  // #region actions

  async clickCloseButtonAction(): Promise<void> {
    await this.page.getByRole('button', { name: 'Close' }).click()
  }
  // #endregion
}
