import { test } from '@playwright/test'

import { ActionsPageObject } from '@/features/actions/ActionsContainer.PageObject'
import { SavingsPageObject } from '@/pages/Savings.PageObject'
import { overrideLiFiRoute } from '@/test/e2e/lifi'
import { setup } from '@/test/e2e/setup'
import { setupFork } from '@/test/e2e/setupFork'

import { SavingsDepositDialogPageObject } from './SavingsDepositDialog.PageObject'

// Block number has to be as close as possible to the block number when query was executed
const blockNumber = 19519583n

test.describe('Savings deposit dialog', () => {
  // The tests here are not independent.
  // My guess is that reverting to snapshots in tenderly does not work properly - but for now couldn't debug that.
  // For now tests use different forks.
  test.describe('DAI', () => {
    const fork = setupFork(blockNumber)

    test('wraps DAI', async ({ page }) => {
      const { account } = await setup(page, fork, {
        initialPage: 'savings',
        account: {
          type: 'connected',
          assetBalances: {
            ETH: 1,
            DAI: 100,
          },
        },
      })
      await overrideLiFiRoute(page, account, '100-dai-to-sdai', blockNumber)

      const savingsPage = new SavingsPageObject(page)

      await savingsPage.clickStartSavingButtonAction()

      const depositDialog = new SavingsDepositDialogPageObject(page)
      await depositDialog.fillAmountAction(100)

      const actionsContainer = new ActionsPageObject(depositDialog.locatePanelByHeader('Actions'))
      await actionsContainer.acceptAllActionsAction(2)
      await depositDialog.clickBackToSavingsButton()

      await savingsPage.expectCurrentWorth('105.3742')
    })
  })

  test.describe('USDC', () => {
    const fork = setupFork(blockNumber)

    test('wraps USDC', async ({ page }) => {
      const { account } = await setup(page, fork, {
        initialPage: 'savings',
        account: {
          type: 'connected',
          assetBalances: {
            ETH: 1,
            USDC: 100,
          },
        },
      })
      await overrideLiFiRoute(page, account, '100-usdc-to-sdai', blockNumber)

      const savingsPage = new SavingsPageObject(page)

      await savingsPage.clickDepositButtonAction('USDC')

      const depositDialog = new SavingsDepositDialogPageObject(page)
      await depositDialog.fillAmountAction(100)

      const actionsContainer = new ActionsPageObject(depositDialog.locatePanelByHeader('Actions'))
      await actionsContainer.acceptAllActionsAction(2)
      await depositDialog.clickBackToSavingsButton()

      await savingsPage.expectCurrentWorth('105.3563')
    })
  })
})
