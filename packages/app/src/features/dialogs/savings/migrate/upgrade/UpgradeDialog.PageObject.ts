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
  async expectTransactionOverview(transactionOverview: UpgradeTxOverview): Promise<void> {
    const panel = this.locatePanelByHeader('Transaction overview')
    await expect(panel).toBeVisible()
    const txOverviewTestIds = testIds.dialog.savings.transactionOverview

    if (transactionOverview.apyChange) {
      const currentApyValue = panel.getByTestId(txOverviewTestIds.apyChange.before)
      const updatedApyValue = panel.getByTestId(txOverviewTestIds.apyChange.after)
      await expect(currentApyValue).toContainText(transactionOverview.apyChange.current)
      await expect(updatedApyValue).toContainText(transactionOverview.apyChange.updated)
    }

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

    const outcome = panel.getByTestId(txOverviewTestIds.outcome)
    await expect(outcome).toContainText(transactionOverview.outcome)
  }

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

interface UpgradeTxOverview {
  apyChange?: {
    current: string
    updated: string
  }
  routeItems: {
    tokenAmount: string
    tokenUsdValue: string
  }[]
  outcome: string
  badgeToken: string
}
