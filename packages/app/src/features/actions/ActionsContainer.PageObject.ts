import { Locator, Page, expect } from '@playwright/test'

import { formatPercentage } from '@/domain/common/format'
import { Percentage } from '@/domain/types/NumericValues'
import { BasePageObject } from '@/test/e2e/BasePageObject'
import { ForkContext } from '@/test/e2e/forking/setupFork'
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

  locateActionAtIndex(index: number): Locator {
    return this.region.getByTestId(testIds.actions.row(index))
  }

  // #region actions
  async acceptAllActionsAction(expectedNumberOfActions: number, forkContext?: ForkContext): Promise<void> {
    for (let index = 0; index < expectedNumberOfActions; index++) {
      const row = this.region.getByTestId(testIds.actions.row(index))

      await row.getByRole('button', { name: actionButtonRegex }).click()
      // @note: we are setting block timestamp of the next tx (especially after executing all txs)
      if (forkContext?.isVnet) {
        await expect(row.getByRole('button', { name: actionButtonRegex })).not.toBeVisible()
        await forkContext.progressSimulation(this.page, 5)
      }
    }
  }

  async acceptActionAtIndex(index: number, forkContext?: ForkContext): Promise<void> {
    const row = this.region.getByTestId(testIds.actions.row(index))
    await row.getByRole('button', { name: actionButtonRegex }).click()
    // @note: we are setting block timestamp of the next tx (especially after executing all txs)
    if (forkContext?.isVnet) {
      await expect(row.getByRole('button', { name: actionButtonRegex })).not.toBeVisible()
      await forkContext.progressSimulation(this.page, 5)
    }
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
  async expectActions(actions: SimplifiedAction[]): Promise<void> {
    for (const [index, expectedAction] of actions.entries()) {
      await this.expectActionAtIndex(index, expectedAction)
    }

    await expect(this.region.getByTestId(testIds.actions.row(actions.length))).toBeHidden() // this ensures that there are no more rows
  }

  async expectDisabledActions(actions: SimplifiedAction[]): Promise<void> {
    for (const [index, expectedAction] of actions.entries()) {
      await this.expectActionAtIndex(index, expectedAction)
      await this.expectDisabledActionAtIndex(index)
    }

    await expect(this.region.getByTestId(testIds.actions.row(actions.length))).toBeHidden() // this ensures that there are no more rows
  }

  async expectActionAtIndex(index: number, expectedAction: SimplifiedAction): Promise<void> {
    const row = this.locateActionAtIndex(index)
    await expect(row).toContainText(actionToTitle(expectedAction))
  }

  async expectEnabledActionAtIndex(index: number, expectedAction?: SimplifiedAction): Promise<void> {
    if (expectedAction) {
      await this.expectActionAtIndex(index, expectedAction)
    }

    const row = this.locateActionAtIndex(index)
    await expect(row.getByRole('button', { name: actionButtonRegex, disabled: false })).toBeVisible()
  }

  async expectDisabledActionAtIndex(index: number): Promise<void> {
    const row = this.locateActionAtIndex(index)
    await expect(row.getByRole('button', { name: actionButtonRegex, disabled: true })).toBeVisible()
  }

  async expectExtendedActions(actions: SimplifiedExtendedAction[]): Promise<void> {
    for (const [index, expectedAction] of actions.entries()) {
      await this.expectExtendedActionAtIndex(index, expectedAction)
    }

    await expect(this.locateActionAtIndex(actions.length)).toBeHidden() // this ensures that there are no more rows
  }

  async expectExtendedActionAtIndex(index: number, expectedAction: SimplifiedExtendedAction): Promise<void> {
    const row = this.locateActionAtIndex(index)
    await expect(row).toContainText(extendedActionToTitle(expectedAction))
  }
  // #endregion assertions
}

type BaseAction = {
  asset: string
}

type SimplifiedWithdrawAction = BaseAction & {
  type: 'daiFromSDaiWithdraw' | 'usdcFromSDaiWithdraw' | 'xDaiFromSDaiWithdraw'
  mode: 'send' | 'withdraw'
}

type SimplifiedGenericAction = BaseAction & {
  type: Exclude<
    ActionType,
    | 'exchange'
    | 'daiFromSDaiWithdraw'
    | 'usdcFromSDaiWithdraw'
    | 'xDaiFromSDaiWithdraw'
    | 'depositToSavings'
    | 'setUserEMode'
  >
}

type SimplifiedSetUserEModeAction = {
  type: 'setUserEMode'
  eModeCategoryId: number
}

type SimplifiedMakerStableToSavingsAction = BaseAction & {
  type: 'depositToSavings'
  savingsAsset: string
}

type SimplifiedAction =
  | SimplifiedGenericAction
  | SimplifiedWithdrawAction
  | SimplifiedMakerStableToSavingsAction
  | SimplifiedSetUserEModeAction

function actionToTitle(action: SimplifiedAction): string {
  switch (action.type) {
    case 'approve':
      return `Approve ${action.asset}`
    case 'deposit':
      return `Deposit ${action.asset}`
    case 'withdraw':
      return `Withdraw ${action.asset}`
    case 'approveDelegation':
      return `Approve delegation ${action.asset}`
    case 'borrow':
      return `Borrow ${action.asset}`
    case 'permit':
      return `Permit ${action.asset}`
    case 'repay':
      return `Repay with ${action.asset}`
    case 'setUseAsCollateral':
      return '' // not used in collateral dialog tests
    case 'setUserEMode':
      return action.eModeCategoryId === 0 ? 'Disable E-Mode' : 'Enable E-Mode'
    case 'depositToSavings':
      return `Convert ${action.asset} to ${action.savingsAsset}`
    case 'daiFromSDaiWithdraw':
    case 'usdcFromSDaiWithdraw':
    case 'xDaiFromSDaiWithdraw':
      return `Convert sDAI to ${action.asset}${action.mode === 'send' ? ' and send' : ''}`
    case 'claimRewards':
      return 'Claim'
  }
}

const actionVerbs = [
  'Approve',
  'Deposit',
  'Withdraw',
  'Send',
  'Borrow',
  'Permit',
  'Repay',
  'Enable',
  'Disable',
  'Convert',
  'Claim',
]
const actionButtonRegex = new RegExp(`^(${actionVerbs.join('|')})$`)

type SimplifiedExtendedAction =
  | { type: 'approve'; asset: string; amount: number }
  | { type: 'permit'; asset: string; amount: number }
  | { type: 'deposit'; asset: string; amount: number }
  | { type: 'borrow'; asset: string; amount: number }

function extendedActionToTitle(action: SimplifiedExtendedAction): string {
  const formatter = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  const amountFormatted = formatter.format(action.amount)

  switch (action.type) {
    case 'approve':
      return `Approve ${amountFormatted} ${action.asset}`
    case 'deposit':
      return `Deposit ${amountFormatted} ${action.asset}`
    case 'borrow':
      return `Borrow ${amountFormatted} ${action.asset}`
    case 'permit':
      return `Permit ${amountFormatted} ${action.asset}`
  }
}
