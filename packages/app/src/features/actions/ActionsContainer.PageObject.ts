import { assert } from '@/utils/assert'
import { Locator, Page, expect } from '@playwright/test'

import { formatPercentage } from '@/domain/common/format'
import { Percentage } from '@/domain/types/NumericValues'
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

  locateSettingsDialog(): Locator {
    return this.locateDialogByHeader('Settings')
  }

  locateActionButtons({ disabled }: { disabled?: boolean } = {}): Locator {
    return this.region.getByRole('button', { name: actionButtonRegex, disabled })
  }

  // #region actions
  async acceptAllActionsAction(expectedNumberOfActions: number): Promise<void> {
    await this.locateActionButtons().first().waitFor({ state: 'visible' }) // waits for any button to appear
    for (let i = 0; i < expectedNumberOfActions; i++) {
      await this.locateActionButtons({ disabled: false }).click()
    }
  }

  async acceptNextActionAction(): Promise<void> {
    await this.locateActionButtons({ disabled: false }).click()
  }

  async switchPreferPermitsAction(): Promise<void> {
    await this.region.getByTestId(testIds.actions.settings.dialog).click()
    const settingsDialog = this.locateSettingsDialog()
    await settingsDialog.getByRole('switch', { disabled: false }).click()
    await settingsDialog.getByRole('button').filter({ hasText: 'Close' }).click()
  }

  async setSlippageAction(slippage: number, type: 'button' | 'input'): Promise<void> {
    await this.region.getByTestId(testIds.actions.settings.dialog).click()
    const settingsDialog = this.locateSettingsDialog()
    if (type === 'button') {
      await settingsDialog
        .getByRole('button', { name: formatPercentage(Percentage(slippage), { minimumFractionDigits: 0 }) })
        .click()
    } else {
      await settingsDialog.getByRole('textbox').fill(formatPercentage(Percentage(slippage), { skipSign: true }))
    }
    await settingsDialog.getByRole('button').filter({ hasText: 'Close' }).click()
  }

  async openSettingsDialogAction(): Promise<void> {
    await this.region.getByTestId(testIds.actions.settings.dialog).click()
  }

  async closeSettingsDialogAction(): Promise<void> {
    await this.locateSettingsDialog().getByRole('button').filter({ hasText: 'Close' }).click()
  }

  async fillSlippageAction(slippage: string | number): Promise<void> {
    if (typeof slippage === 'number') {
      slippage = formatPercentage(Percentage(slippage), { skipSign: true })
    }
    await this.locateSettingsDialog().getByRole('textbox').fill(slippage)
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
      assert(expectedAction, `Expected action ${actualTitle} not found`)

      expect(actualTitle).toEqual(actionToTitle(expectedAction, shortForm))
    }
  }

  async expectNextActionEnabled(): Promise<void> {
    await expect(this.locateActionButtons({ disabled: false })).toBeVisible()
  }

  async expectActionsDisabled(): Promise<void> {
    await expect(this.locateActionButtons({ disabled: false })).not.toBeVisible()
  }

  async expectNextAction(expectedAction: SimplifiedAction, shortForm = false): Promise<void> {
    await expect(async () => {
      const buttons = await this.locateActionButtons().all()
      const titles = await this.region.getByTestId(testIds.component.Action.title).all()
      // when action is complete, the action button is removed from the DOM
      const index = titles.length - buttons.length
      const title = await titles[index]?.textContent()
      expect(title).toEqual(actionToTitle(expectedAction, shortForm))
    }).toPass({ timeout: 10000 })
  }

  async expectSlippage(slippage: number): Promise<void> {
    await expect(this.region.getByTestId(testIds.actions.slippage)).toHaveText(
      formatPercentage(Percentage(slippage), { minimumFractionDigits: 1 }),
    )
  }

  async expectSlippageValidationError(error: string): Promise<void> {
    await expect(this.locateSettingsDialog().getByTestId(testIds.actions.settings.slippage.error)).toHaveText(error)
  }
  // #endregion assertions
}

type SimplifiedAction =
  | {
      type: Exclude<ActionType, 'exchange'>
      asset: string
      amount: number
    }
  | {
      type: 'exchange'
      inputAsset: string
      outputAsset: string
      amount: number
    }

function actionToTitle(action: SimplifiedAction, shortForm: boolean): string {
  const prefix = getActionTitlePrefix(action)

  if (shortForm) {
    if (action.type === 'exchange') {
      return `${prefix} ${action.inputAsset} to ${action.outputAsset}`
    }

    if (action.type === 'nativeSDaiDeposit') {
      return `${prefix} ${action.asset} into sDAI`
    }

    if (action.type === 'nativeSDaiWithdraw') {
      return `${prefix} sDAI into ${action.asset}`
    }

    return `${prefix} ${action.asset}`
  }

  const formatter = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  // this is quite naive and might require improving in the future
  if (action.type === 'exchange') {
    return `${prefix} ${formatter.format(action.amount)} ${action.inputAsset} to ${action.outputAsset}`
  }

  if (action.type === 'nativeSDaiDeposit') {
    return `${prefix} ${formatter.format(action.amount)} ${action.asset} into sDAI`
  }

  if (action.type === 'nativeSDaiWithdraw') {
    return `${prefix} sDAI into ${formatter.format(action.amount)} ${action.asset}`
  }

  return `${prefix} ${formatter.format(action.amount)} ${action.asset}`
}

const actionVerbs = [
  'Approve',
  'Deposit',
  'Withdraw',
  'Borrow',
  'Permit',
  'Repay',
  'Enable',
  'Disable',
  'Convert',
  'Wrap',
  'Unwrap',
]
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
      return 'Convert'
    case 'nativeSDaiDeposit':
      return 'Wrap'
    case 'nativeSDaiWithdraw':
      return 'Unwrap'
  }
}
