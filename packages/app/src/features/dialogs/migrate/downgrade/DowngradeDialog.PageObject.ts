import { testIds } from '@/ui/utils/testIds'
import { Page, expect } from '@playwright/test'
import { DialogPageObject } from '../../common/Dialog.PageObject'

export class DowngradeDialogPageObject extends DialogPageObject {
  constructor(page: Page) {
    super(page, /Downgrade/)
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
  async expectDowngradeSuccessPage({
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
