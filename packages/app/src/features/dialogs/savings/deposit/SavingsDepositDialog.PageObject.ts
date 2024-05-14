import { expect, Page } from '@playwright/test'

import { testIds } from '@/ui/utils/testIds'

import { DialogPageObject } from '../../common/Dialog.PageObject'

export class SavingsDepositDialogPageObject extends DialogPageObject {
  constructor(page: Page) {
    super(page, /Deposit to Savings/)
  }

  // #region actions
  async clickBackToSavingsButton(): Promise<void> {
    await this.page.getByRole('button', { name: 'Back to Savings' }).click()
    await this.region.waitFor({
      state: 'detached',
    })
  }

  async clickAcknowledgeRisk(): Promise<void> {
    await this.page.getByTestId(testIds.dialog.acknowledgeRiskSwitch).click()
  }
  // #endregion

  // #region assertions
  async expectDiscrepancyWarning(discrepancy: string): Promise<void> {
    await expect(
      this.region.getByText(
        'Market fluctuations can impact your transaction value. The final amount received may be less than the deposit amount by up to ' +
          discrepancy,
      ),
    ).toBeVisible()
  }

  async expectTransactionOverviewToBeVisible(): Promise<void> {
    await expect(this.locatePanelByHeader('Transaction overview')).toBeVisible()
  }
  // #endregion
}
