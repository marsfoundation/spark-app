import { Locator, Page, expect } from '@playwright/test'

import { ActionsPageObject } from '@/features/actions/ActionsContainer.PageObject'
import { BasePageObject } from '@/test/e2e/BasePageObject'
import { TestTokenWithValue, expectAssets } from '@/test/e2e/assertions'
import { ForkContext } from '@/test/e2e/setupFork'
import { calculateAssetsWorth, isPage } from '@/test/e2e/utils'
import { testIds } from '@/ui/utils/testIds'

export class DialogPageObject extends BasePageObject {
  public readonly actionsContainer: ActionsPageObject
  constructor(pageOrLocator: Page | Locator, header: RegExp) {
    if (isPage(pageOrLocator)) {
      super(pageOrLocator)
      this.region = this.locateDialogByHeader(header)
    } else {
      super(pageOrLocator)
    }
    this.actionsContainer = new ActionsPageObject(this.locatePanelByHeader('Actions'))
  }

  getDialog(): Locator {
    return this.region
  }

  // #region actions
  async selectAssetAction(asset: string): Promise<void> {
    const selector = this.region.getByTestId(testIds.component.AssetSelector)
    await this.selectOptionByLabelAction(selector, asset)
  }

  async fillAmountAction(amount: number): Promise<void> {
    await this.region.getByRole('textbox').fill(amount.toString())
  }

  async clickMaxAmountAction(): Promise<void> {
    await this.region.getByRole('button', { name: 'MAX' }).click()
  }

  async viewInDashboardAction(): Promise<void> {
    await this.region.getByRole('button', { name: 'View in dashboard' }).click()
    await this.region.waitFor({
      state: 'detached',
    })
  }

  // #endregion actions

  // #region assertions
  async expectSuccessPage(
    tokenWithValue: TestTokenWithValue[],
    fork: ForkContext,
    assetWorthOverrides?: Record<string, number>,
  ): Promise<void> {
    await expect(this.region.getByText('Congrats! All done!')).toBeVisible()

    const transformed = tokenWithValue.reduce((acc, { asset, amount: value }) => ({ ...acc, [asset]: value }), {})

    const { assetsWorth } = await calculateAssetsWorth(fork.forkUrl, transformed)
    const mergedAssetsWorth = { ...assetsWorth, ...assetWorthOverrides }

    const summary = await this.region.getByTestId(testIds.dialog.success).textContent()
    expectAssets(summary!, tokenWithValue, mergedAssetsWorth)
  }

  async expectRiskLevelBefore(riskLevel: string): Promise<void> {
    await expect(this.region.getByTestId(testIds.dialog.healthFactor.before)).toContainText(riskLevel)
  }

  async expectRiskLevelAfter(riskLevel: string): Promise<void> {
    await expect(this.region.getByTestId(testIds.dialog.healthFactor.after)).toContainText(riskLevel)
  }

  async expectHealthFactorBefore(healthFactor: string): Promise<void> {
    await expect(this.region.getByTestId(testIds.dialog.healthFactor.before)).toContainText(healthFactor)
  }

  async expectHealthFactorAfter(healthFactor: string): Promise<void> {
    await expect(this.region.getByTestId(testIds.dialog.healthFactor.after)).toContainText(healthFactor)
  }

  async expectSelectedAsset(asset: string): Promise<void> {
    await expect(this.region.getByTestId(testIds.component.AssetSelector)).toHaveText(asset)
  }

  async expectDialogHeader(header: string): Promise<void> {
    await expect(this.region.getByRole('heading').first()).toHaveText(header)
  }

  async expectAssetInputError(error: string): Promise<void> {
    await expect(this.page.getByTestId(testIds.component.AssetInput.error)).toHaveText(error)
  }

  async expectAlertMessage(message: string): Promise<void> {
    await expect(this.page.getByTestId(testIds.component.Alert.message)).toHaveText(message)
  }

  async expectHealthFactorBeforeVisible(): Promise<void> {
    await expect(this.region.getByTestId(testIds.dialog.healthFactor.before)).toBeVisible()
  }

  async expectHealthFactorAfterVisible(): Promise<void> {
    await expect(this.region.getByTestId(testIds.dialog.healthFactor.after)).toBeVisible()
  }

  async expectHealthFactorVisible(): Promise<void> {
    await expect(this.region.getByTestId(testIds.dialog.healthFactor.after)).toBeVisible()
    await expect(this.region.getByTestId(testIds.dialog.healthFactor.before)).toBeVisible()
  }

  async expectHealthFactorNotVisible(): Promise<void> {
    await expect(this.region.getByTestId(testIds.dialog.healthFactor.after)).not.toBeVisible()
    await expect(this.region.getByTestId(testIds.dialog.healthFactor.before)).not.toBeVisible()
  }
  // #endregion
}
