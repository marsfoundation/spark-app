import { Page, expect } from '@playwright/test'

import { ActionsPageObject } from '@/features/actions/ActionsContainer.PageObject'
import { testIds } from '@/ui/utils/testIds'

import { CollateralSetting } from '../collateral/types'
import { DialogPageObject } from '../common/Dialog.PageObject'

export class CollateralDialogPageObject extends DialogPageObject {
  constructor(page: Page) {
    super(page, /.*/)
    this.region = this.locateDialogByHeader('Collateral')
  }

  // #region actions
  async setUseAsCollateralAction(assetName: string, setting: CollateralSetting): Promise<void> {
    const actionsContainer = new ActionsPageObject(this.locatePanelByHeader('Actions'))
    await actionsContainer.acceptAllActionsAction(1)

    // assertion used for waiting
    if (setting === 'enabled') {
      await this.expectSetUseAsCollateralSuccessPage(assetName, 'enabled')
    } else {
      await this.expectSetUseAsCollateralSuccessPage(assetName, 'disabled')
    }
  }
  // #endregion actions

  // #region assertions
  async expectSetUseAsCollateralSuccessPage(assetName: string, setting: CollateralSetting): Promise<void> {
    await expect(this.region.getByRole('heading', { name: 'Congrats, all done!!' })).toBeVisible()
    await expect(this.region.getByTestId(testIds.dialog.success)).toContainText(assetName)
    await expect(this.region.getByTestId(testIds.dialog.success)).toContainText(`Collateral ${setting}`)
  }
  // #endregion assertions
}
