import { DialogPageObject, TxOverviewWithRoute } from '@/features/dialogs/common/Dialog.PageObject'
import { TestContext } from '@/test/e2e/setup'
import { testIds } from '@/ui/utils/testIds'
import { expect } from '@playwright/test'

export class UpgradeDialogPageObject extends DialogPageObject {
  constructor(testContext: TestContext) {
    super({
      testContext,
      header: /Upgrade/,
    })
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
  async expectTransactionOverview(transactionOverview: UpgradeTxOverview): Promise<void> {
    const panel = this.locatePanelByHeader('Transaction overview')
    await expect(panel).toBeVisible()
    const savingsTxOverviewTestIds = testIds.dialog.savings.transactionOverview

    if (transactionOverview.apyChange) {
      const currentApyValue = panel.getByTestId(savingsTxOverviewTestIds.apyChange.before)
      const updatedApyValue = panel.getByTestId(savingsTxOverviewTestIds.apyChange.after)
      await expect(currentApyValue).toContainText(transactionOverview.apyChange.current)
      await expect(updatedApyValue).toContainText(transactionOverview.apyChange.updated)
    }

    await this.expectTransactionOverviewRoute(transactionOverview.routeItems)
    if (transactionOverview.badgeTokens) {
      await this.expectSkyBadgeForTokens(transactionOverview.badgeTokens)
    }
    await this.expectOutcomeText(transactionOverview.outcome)
  }

  async expectUpgradeSuccessPage({
    token,
    amount,
    usdValue,
  }: { token: string; amount: string; usdValue: string }): Promise<void> {
    await expect(this.region.getByText('Congrats, all done!')).toBeVisible()
    const summary = await this.region.getByTestId(testIds.dialog.success).textContent()
    expect(summary).toMatch(`${token}${amount}${usdValue}`)
  }
  // #endregion assertions
}

interface UpgradeTxOverview extends TxOverviewWithRoute {
  apyChange?: {
    current: string
    updated: string
  }
}
