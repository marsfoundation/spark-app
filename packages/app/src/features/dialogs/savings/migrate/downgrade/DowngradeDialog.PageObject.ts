import { DialogPageObject } from '@/features/dialogs/common/Dialog.PageObject'
import { testIds } from '@/ui/utils/testIds'
import { Page, expect } from '@playwright/test'

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
  async expectTransactionOverview(transactionOverview: DowngradeTxOverview): Promise<void> {
    const panel = this.locatePanelByHeader('Transaction overview')
    await expect(panel).toBeVisible()
    const savingsTxOverviewTestIds = testIds.dialog.savings.transactionOverview
    const txOverviewTestIds = testIds.dialog.transactionOverview

    for (const [index, { tokenAmount: tokenWithAmount, tokenUsdValue }] of transactionOverview.routeItems.entries()) {
      const routeItem = panel.getByTestId(txOverviewTestIds.routeItem.tokenWithAmount(index))
      const routeItemUSD = panel.getByTestId(txOverviewTestIds.routeItem.tokenUsdValue(index))
      await expect(routeItem).toContainText(tokenWithAmount)
      await expect(routeItemUSD).toContainText(tokenUsdValue)
    }

    const skyBadge = this.page.getByTestId(txOverviewTestIds.skyBadge)
    await expect(skyBadge).toContainText(
      `Powered by Sky (prev. MakerDAO). No slippage & fees for ${transactionOverview.badgeToken}.`,
    )

    const outcome = panel.getByTestId(savingsTxOverviewTestIds.outcome)
    await expect(outcome).toContainText(transactionOverview.outcome)
  }

  async expectDowngradeSuccessPage({
    token,
    amount,
    usdValue,
  }: { token: string; amount: string; usdValue: string }): Promise<void> {
    await expect(this.region.getByText('Congrats, all done!')).toBeVisible()
    const summary = await this.region.getByTestId(testIds.dialog.success).textContent()
    await expect(summary).toMatch(`${token}${amount}${usdValue}`)
  }
  // #endregion assertions
}

interface DowngradeTxOverview {
  routeItems: {
    tokenAmount: string
    tokenUsdValue: string
  }[]
  outcome: string
  badgeToken: string
}
