import { expect, Locator, Page } from '@playwright/test'
import invariant from 'tiny-invariant'

import { BasePageObject } from '@/test/e2e/BasePageObject'
import { isPage } from '@/test/e2e/utils'
import { testIds } from '@/ui/utils/testIds'

import { ActionType } from './logic/types'

export class ActionsPageObject extends BasePageObject {
  constructor(pageOrLocator: Page | Locator) {
    if (isPage(pageOrLocator)) {
      super(pageOrLocator)
      this.region = this.locatePanelByHeader('Actions')
    } else {
      super(pageOrLocator)
    }
  }

  getSettingsDialog(): Locator {
    return this.locateDialogByHeader('Settings')
  }

  getActionButtons({ disabled }: { disabled?: boolean } = {}): Locator {
    return this.region.getByRole('button', { name: actionButtonRegex, disabled })
  }

  // #region actions
  async acceptAllActionsAction(expectedNumberOfActions: number): Promise<void> {
    await this.getActionButtons().first().waitFor({ state: 'visible' }) // waits for any button to appear
    for (let i = 0; i < expectedNumberOfActions; i++) {
      await this.getActionButtons({ disabled: false }).click()
    }
  }

  async acceptNextActionAction(): Promise<void> {
    await this.getActionButtons({ disabled: false }).click()
  }

  async switchPreferPermitsAction(): Promise<void> {
    await this.region.getByTestId(testIds.actions.settings).click()
    const settingsDialog = this.getSettingsDialog()
    await settingsDialog.getByRole('switch', { disabled: false }).click()
    await settingsDialog.getByRole('button').filter({ hasText: 'Close' }).click()
  }
  // #endregion actions

  // #region assertions
  async expectActions(expectedActions: SimplifiedAction[], shortForm = false): Promise<void> {
    await this.expectNextActionEnabled()

    const actionLocators = await this.region.getByTestId(testIds.component.Action.title).all()
    expect(actionLocators.length, 'Number of expected actions does not equal to the number of actual actions').toEqual(
      expectedActions.length,
    )
    for (const [index, actualAction] of actionLocators.entries()) {
      const actualTitle = await actualAction.textContent()
      const expectedAction = expectedActions[index]
      invariant(expectedAction, `Expected action ${actualTitle} not found`)

      expect(actualTitle).toEqual(actionToTitle(expectedAction, shortForm))
    }
  }

  async expectNextActionEnabled(): Promise<void> {
    await expect(this.getActionButtons({ disabled: false })).not.toBeDisabled()
  }

  async expectActionsDisabled(): Promise<void> {
    await expect(this.getActionButtons({ disabled: true })).toBeDisabled()
  }

  async expectNextAction(expectedAction: SimplifiedAction, shortForm = false): Promise<void> {
    await expect(async () => {
      const buttons = await this.getActionButtons().all()
      const titles = await this.region.getByTestId(testIds.component.Action.title).all()
      // when action is complete, the action button is removed from the DOM
      const index = titles.length - buttons.length
      const title = await titles[index]?.textContent()
      expect(title).toEqual(actionToTitle(expectedAction, shortForm))
    }).toPass({ timeout: 10000 })
  }
  // #endregion assertions
}

interface SimplifiedAction {
  type: ActionType
  asset: string
  amount: number
}

function actionToTitle(action: SimplifiedAction, shortForm: boolean): string {
  const prefix = getActionTitlePrefix(action)

  if (shortForm) {
    return `${prefix} ${action.asset}`
  }

  const formatter = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  // this is quite naive and might require improving in the future
  return `${prefix} ${formatter.format(action.amount)} ${action.asset}`
}

const actionVerbs = ['Approve', 'Deposit', 'Withdraw', 'Borrow', 'Permit', 'Repay', 'Enable', 'Disable']
const actionButtonRegex = new RegExp(`^(${actionVerbs.join('|')})$`)

function getActionTitlePrefix(action: SimplifiedAction): string {
  switch (action.type) {
    case 'approve':
      return 'Approve'
    case 'deposit':
      return 'Deposit'
    case 'withdraw':
      return 'Withdraw'
    case 'approveDelegation':
      return 'Approve delegation'
    case 'borrow':
      return 'Borrow'
    case 'permit':
      return 'Permit'
    case 'repay':
      return 'Repay with'
    case 'setUseAsCollateral':
      return '' // not used in collateral dialog tests
    case 'setUserEMode':
      return '' // not used in e-mode dialog tests
    case 'approveExchange':
      return 'Approve exchange'
    case 'exchange':
      return 'Exchange'
  }
}
