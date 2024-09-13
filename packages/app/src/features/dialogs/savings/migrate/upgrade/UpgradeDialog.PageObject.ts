import { DialogPageObject } from '@/features/dialogs/common/Dialog.PageObject'
import { testIds } from '@/ui/utils/testIds'
import { Page, expect } from '@playwright/test'

export class UpgradeDialogPageObject extends DialogPageObject {
  constructor(page: Page) {
    super(page, /Upgrade/)
  }

  // #region actions
  async clickBackToSavingsButton(): Promise<void> {
    await this.page.getByRole('button', { name: 'Back to Savings' }).click()
    await this.region.waitFor({
      state: 'detached',
    })
  }
  // #endregion actions

  // #region assertions
  async expectUpgradeSuccessPage({
    token,
    amount,
    usdValue,
  }: { token: string; amount: string; usdValue: string }): Promise<void> {
    await expect(this.region.getByText('Congrats! All done!')).toBeVisible()
    const summary = await this.region.getByTestId(testIds.dialog.success).textContent()
    await expect(summary).toMatch(`${token}${amount}${usdValue}`)
  }
  // #endregion assertions
}
