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
    for (let index = 0; index < expectedNumberOfActions; index++) {
      const row = this.region.getByTestId(testIds.actions.row(index))

      await row.getByRole('button', { name: actionButtonRegex }).click()
    }
    await expect(this.region.getByRole('button', { name: actionButtonRegex })).toBeHidden()
  }

  // async acceptNextActionAction(index: number): Promise<void> {
  //   await this.locateActionButtons({ disabled: false }).click()
  // }

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
      const row = this.region.getByTestId(testIds.actions.row(index))
      await expect(row).toContainText(actionToTitle(expectedAction))
    }

    await expect(this.region.getByTestId(testIds.actions.row(actions.length))).toBeHidden() // this ensures that there are no more rows
  }

  async expectNextActionEnabled(): Promise<void> {
    await expect(this.locateActionButtons({ disabled: false })).toBeVisible()
  }

  async expectActionsDisabled(): Promise<void> {
    await expect(this.locateActionButtons({ disabled: false })).not.toBeVisible()
  }

  // async expectNextAction(action: SimplifiedAction): Promise<void> {
  //   await this._expectNextAction({ action, shortForm: true })
  // }

  // private async _expectNextAction(params: ExpectedAction): Promise<void> {
  //   await expect(async () => {
  //     const buttons = await this.locateActionButtons().all()
  //     const titles = await this.region.getByTestId(testIds.component.Action.title).all()
  //     // when action is complete, the action button is removed from the DOM
  //     const index = titles.length - buttons.length
  //     const title = await titles[index]?.textContent()
  //     expect(title).toEqual(actionToTitle(params))
  //   }).toPass({ timeout: 10000 })
  // }

  async expectSlippage(slippage: number): Promise<void> {
    await expect(this.region.getByTestId(testIds.actions.flavours.exchangeActionRow.slippage)).toHaveText(
      formatPercentage(Percentage(slippage), { minimumFractionDigits: 1 }),
    )
  }

  async expectSlippageValidationError(error: string): Promise<void> {
    await expect(this.locateSettingsDialog().getByTestId(testIds.actions.settings.slippage.error)).toHaveText(error)
  }
  // #endregion assertions
}

// type ExpectedAction =
//   | { action: SimplifiedAction; shortForm: true }
//   | { action: SimplifiedActionWithAmount; shortForm: false }

// type SimplifiedActionWithAmount = SimplifiedAction & { amount: number }

type SimplifiedAction =
  | {
      type: Exclude<ActionType, 'exchange'>
      asset: string
    }
  | {
      type: 'exchange'
      inputAsset: string
      outputAsset: string
    }

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
      return '' // not used in e-mode dialog tests
    case 'approveExchange':
      return `Approve exchange ${action.asset}`
    case 'exchange':
      return `Convert ${action.inputAsset} to ${action.outputAsset}`
    case 'nativeSDaiDeposit':
      return `Wrap ${action.asset} into sDAI`
    case 'nativeSDaiWithdraw':
      return `Unwrap ${action.asset} from sDAI`
  }
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
