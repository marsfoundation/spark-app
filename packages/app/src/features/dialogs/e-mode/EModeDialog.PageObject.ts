import { EModeCategoryName } from '@/domain/e-mode/types'
import { testIds } from '@/ui/utils/testIds'
import { Locator, Page, expect } from '@playwright/test'
import { DialogPageObject } from '../common/Dialog.PageObject'

export class EModeDialogPageObject extends DialogPageObject {
  constructor(page: Page) {
    super(page, /.*/)
    this.region = this.locateDialogByHeader('Set E-Mode Category')
  }

  // #region locators
  locateEModeCategoryTile(eModeCategoryName: EModeCategoryName): Locator {
    return this.region.getByRole('button', { name: eModeCategoryName })
  }
  // #endregion locators

  // #region actions
  async clickEModeCategoryTileAction(eModeCategoryName: EModeCategoryName): Promise<void> {
    await this.locateEModeCategoryTile(eModeCategoryName).click()
  }

  async setEModeAction(eModeCategoryName: EModeCategoryName): Promise<void> {
    await this.clickEModeCategoryTileAction(eModeCategoryName)
    await this.acknowledgeIfRiskIsPresent()
    await this.actionsContainer.acceptAllActionsAction(1)
    await this.expectEModeSuccessPage(eModeCategoryName)
    await this.viewInDashboardAction()
  }
  // #endregion actions

  // #region assertions
  async expectEModeSuccessPage(eModeCategoryName: EModeCategoryName): Promise<void> {
    await expect(this.page.getByTestId(testIds.component.SuccessViewContent)).toContainText('Congrats! All done!')
    await expect(this.page.getByTestId(testIds.dialog.success)).toContainText(eModeCategoryName)
    await expect(this.page.getByTestId(testIds.dialog.success)).toContainText('Option activated')
  }
  // #endregion assertions
}
