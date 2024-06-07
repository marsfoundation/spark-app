import { Page, expect } from '@playwright/test'

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
        `Market fluctuations can impact your transaction value. The final amount received may be less than the deposit amount by up to ${discrepancy}`,
      ),
    ).toBeVisible()
  }

  async expectTransactionOverviewToBeVisible(): Promise<void> {
    await expect(this.locatePanelByHeader('Transaction overview')).toBeVisible()
  }

  async expectTransactionOverview(transactionOverview: TransactionOverview): Promise<void> {
    const panel = this.locatePanelByHeader('Transaction overview')
    await expect(panel).toBeVisible()

    for (const [index, [label, value]] of transactionOverview.entries()) {
      const row = panel.getByTestId(testIds.dialog.depositSavings.transactionDetailsRow(index))
      await expect(row).toBeVisible()
      await expect(row).toContainText(label)
      await expect(row).toContainText(value)
    }
  }

  async expectToUseLifiSwap(lifiSwapParams: LifiSwapParams): Promise<void> {
    const exchangeRow = this.locatePanelByHeader('Actions').getByTestId(
      testIds.actions.flavours.exchangeActionRow.wrapper,
    )

    await expect(exchangeRow).toBeVisible()
    await expect(exchangeRow).toContainText(lifiSwapParams.title)
    await expect(exchangeRow.getByTestId(testIds.actions.flavours.exchangeActionRow.lifiBadge)).toBeVisible()
    await expect(exchangeRow.getByTestId(testIds.actions.flavours.exchangeActionRow.fee)).toHaveText(lifiSwapParams.fee)
    await expect(exchangeRow.getByTestId(testIds.actions.flavours.exchangeActionRow.slippage)).toHaveText(
      lifiSwapParams.slippage,
    )
    await expect(exchangeRow.getByTestId(testIds.actions.flavours.exchangeActionRow.finalDAIAmount)).toContainText(
      lifiSwapParams.finalDAIAmount,
    )
    await expect(exchangeRow.getByTestId(testIds.actions.flavours.exchangeActionRow.finalSDAIAmount)).toHaveText(
      lifiSwapParams.finalSDAIAmount,
    )
  }
  // #endregion
}

interface LifiSwapParams {
  title: string
  slippage: string
  fee: string
  finalSDAIAmount: string
  finalDAIAmount: string
}

type TransactionOverview = [string, string][]
