import { testIds } from '@/ui/utils/testIds'
import { Locator, Page, expect } from '@playwright/test'
import { TestContext } from './setup'

/**
 * BasePageObject is a class that contains common selectors and actions that are shared across the whole app.
 */
export class BasePageObject {
  protected readonly testContext: TestContext<any>
  protected readonly page: Page
  protected region: Locator

  constructor(testContext: TestContext<any>, locator?: Locator) {
    this.testContext = testContext
    this.page = testContext.page
    if (locator) {
      this.region = locator
    } else {
      this.region = this.page.locator('body')
    }
  }

  // #region locators
  locatePanelByHeader(title: string | RegExp): Locator {
    return this.region
      .locator('section')
      .filter({ has: this.page.getByRole('heading', { name: title }) })
      .last() // @note: ensures that you get most nested panel (we can't filter for immediate children)
  }

  locateDialogByHeader(title: string | RegExp): Locator {
    return this.page.getByRole('dialog').filter({ has: this.page.getByRole('heading', { name: title }) })
  }

  locateAnyDialog(): Locator {
    return this.page.getByRole('dialog')
  }

  locateNotificationByMessage(message: string): Locator {
    return this.page.locator('.toast-notifications').getByRole('status').getByText(message)
  }
  // #endregion

  // #region actions
  async selectOptionByLabelAction(selector: Locator, label: string): Promise<void> {
    // @note raddix selector options are rendered outside the container holding selector
    const locateSelectOptionByLabel = (label: string): Locator => {
      return this.page.getByRole('listbox').getByText(label, { exact: true })
    }

    const currentlySelected = await selector.textContent()
    if (currentlySelected === label) {
      return
    }

    await selector.click()
    await locateSelectOptionByLabel(label).click()
  }

  closeDialog(): Promise<void> {
    return this.page.keyboard.press('Escape')
  }

  async clickAcknowledgeRisk(): Promise<void> {
    await this.page.getByTestId(testIds.component.RiskAcknowledgement.switch).click()
  }

  async acknowledgeIfRiskIsPresent(): Promise<void> {
    const riskAcknowledgement = this.page.getByTestId(testIds.component.RiskAcknowledgement.switch)
    if (await riskAcknowledgement.isVisible()) {
      await riskAcknowledgement.click()
    }
  }
  // #endregion

  // #region assertions
  async expectNotification(message: string): Promise<void> {
    await expect(this.locateNotificationByMessage(message)).toBeVisible()
  }

  async expectLiquidationRiskWarning(explanation: string): Promise<void> {
    await expect(this.page.getByTestId(testIds.component.RiskAcknowledgement.explanation)).toHaveText(explanation)
  }

  async expectLiquidationRiskWarningNotVisible(): Promise<void> {
    await expect(this.page.getByTestId(testIds.component.RiskAcknowledgement.explanation)).not.toBeVisible()
  }
  // #endregion
}
