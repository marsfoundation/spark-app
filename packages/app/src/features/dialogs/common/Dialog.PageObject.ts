import { Locator, expect } from '@playwright/test'

import { ActionsPageObject } from '@/features/actions/ActionsContainer.PageObject'
import { BasePageObject } from '@/test/e2e/BasePageObject'
import { TestTokenWithValue, expectAssets } from '@/test/e2e/assertions'
import { TestContext } from '@/test/e2e/setup'
import { testIds } from '@/ui/utils/testIds'

export interface DialogPageObjectParams {
  testContext: TestContext
  header: RegExp
}

export class DialogPageObject extends BasePageObject {
  public readonly actionsContainer: ActionsPageObject
  constructor({ testContext, header }: DialogPageObjectParams) {
    super(testContext)
    this.region = this.locateDialogByHeader(header)
    this.actionsContainer = new ActionsPageObject(testContext, this.locatePanelByHeader('Actions'))
  }

  getDialog(): Locator {
    return this.region
  }

  // #region actions
  async selectAssetAction(asset: string): Promise<void> {
    const selector = this.region.getByTestId(testIds.component.AssetSelector.trigger)
    await this.selectOptionByLabelAction(selector, asset)
  }

  async openAssetSelectorAction(): Promise<void> {
    const selector = this.region.getByTestId(testIds.component.AssetSelector.trigger)
    await selector.click()
  }

  async fillAmountAction(amount: number): Promise<void> {
    await this.region.getByTestId(testIds.component.AssetInput.input).fill(amount.toString())
  }

  async clickMaxAmountAction(): Promise<void> {
    await this.region.getByRole('button', { name: 'MAX' }).click()
  }

  async viewInMyPortfolioAction(): Promise<void> {
    const successViewContent = this.page.getByTestId(testIds.component.SuccessView.content)
    await successViewContent.getByRole('button', { name: 'View in portfolio' }).click()
    await successViewContent.waitFor({
      state: 'detached',
    })
  }

  // #endregion actions

  // #region assertions
  async expectSuccessPage({
    tokenWithValue,
  }: {
    tokenWithValue: TestTokenWithValue[]
  }): Promise<void> {
    await expect(this.region.getByText('Congrats, all done!')).toBeVisible()
    const summary = await this.region.getByTestId(testIds.dialog.success).textContent()
    expectAssets(summary!, tokenWithValue)
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
    await expect(this.region.getByTestId(testIds.component.AssetSelector.trigger)).toHaveText(asset)
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

  async expectInputValue(value: string): Promise<void> {
    await expect(this.region.getByRole('textbox')).toHaveValue(value)
  }

  async expectMaxButtonDisabled(): Promise<void> {
    await expect(this.region.getByRole('button', { name: 'MAX' })).toBeDisabled()
  }

  async expectTransactionOverviewRoute(route: { tokenAmount: string; tokenUsdValue: string }[]): Promise<void> {
    for (const [index, { tokenAmount: tokenWithAmount, tokenUsdValue }] of route.entries()) {
      const routeItem = this.page.getByTestId(testIds.dialog.transactionOverview.routeItem.tokenWithAmount(index))
      const routeItemUSD = this.page.getByTestId(testIds.dialog.transactionOverview.routeItem.tokenUsdValue(index))
      await expect(routeItem).toContainText(tokenWithAmount)
      await expect(routeItemUSD).toContainText(tokenUsdValue)
    }
  }

  async expectSkyBadgeForTokens(tokens: string): Promise<void> {
    const skyBadge = this.page.getByTestId(testIds.dialog.transactionOverview.skyBadge)
    await expect(skyBadge).toContainText(`Powered by Sky (prev. MakerDAO). No slippage & fees for ${tokens}.`)
  }

  async expectOutcomeText(text: string): Promise<void> {
    const outcome = this.page.getByTestId(testIds.dialog.transactionOverview.outcome)
    await expect(outcome).toContainText(text)
  }

  async expectOutcomeUsdText(text: string): Promise<void> {
    const outcome = this.page.getByTestId(testIds.dialog.transactionOverview.outcomeUsd)
    await expect(outcome).toContainText(text)
  }
  // #endregion
}

export interface TxOverviewWithRoute {
  routeItems: {
    tokenAmount: string
    tokenUsdValue: string
  }[]
  outcome: string
  outcomeUsd?: string
  badgeTokens?: string
}
