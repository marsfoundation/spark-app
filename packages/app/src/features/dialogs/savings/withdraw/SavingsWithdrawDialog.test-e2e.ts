import { test } from '@playwright/test'

import { ActionsPageObject } from '@/features/actions/ActionsContainer.PageObject'
import { SavingsPageObject } from '@/pages/Savings.PageObject'
import { overrideLiFiRoute } from '@/test/e2e/lifi'
import { setup } from '@/test/e2e/setup'
import { setupFork } from '@/test/e2e/setupFork'

import { SavingsWithdrawDialogPageObject } from './SavingsWithdrawDialog.PageObject'

// Block number has to be as close as possible to the block number when query was executed
const blockNumber = 19532848n

test.describe('Savings withdraw dialog', () => {
  test.describe('DAI', () => {
    const fork = setupFork(blockNumber)

    test('unwraps sDAI to DAI', async ({ page }) => {
      const { account } = await setup(page, fork, {
        initialPage: 'savings',
        account: {
          type: 'connected',
          assetBalances: {
            ETH: 1,
            sDAI: 1000,
          },
        },
      })
      await overrideLiFiRoute(page, account, 'sdai-to-100-dai', blockNumber)

      const savingsPage = new SavingsPageObject(page)

      await savingsPage.clickWithdrawButtonAction()

      const withdrawDialog = new SavingsWithdrawDialogPageObject(page)
      await withdrawDialog.fillAmountAction(100)

      const actionsContainer = new ActionsPageObject(withdrawDialog.locatePanelByHeader('Actions'))
      await actionsContainer.acceptAllActionsAction(2)
      await withdrawDialog.clickBackToSavingsButton()

      await savingsPage.expectCurrentWorth('991.352')
      await savingsPage.expectCashInWalletAssetBalance('DAI', '100.55')
    })

    test.describe('on fork', () => {
      const blockNumber = 19609252n
      const fork = setupFork(blockNumber)

      test('unwraps ALL sDAI to DAI', async ({ page }) => {
        const { account } = await setup(page, fork, {
          initialPage: 'savings',
          account: {
            type: 'connected',
            assetBalances: {
              ETH: 1,
              sDAI: 100,
            },
          },
        })
        await overrideLiFiRoute(page, account, '100-sdai-to-dai', blockNumber)

        const savingsPage = new SavingsPageObject(page)

        await savingsPage.clickWithdrawButtonAction()

        const withdrawDialog = new SavingsWithdrawDialogPageObject(page)
        await withdrawDialog.clickMaxAmountAction()

        const actionsContainer = new ActionsPageObject(withdrawDialog.locatePanelByHeader('Actions'))
        await actionsContainer.acceptAllActionsAction(2)
        await withdrawDialog.clickBackToSavingsButton()

        await savingsPage.expectCashInWalletAssetBalance('DAI', '106.94')
      })
    })
  })

  test.describe('USDC', () => {
    const fork = setupFork(blockNumber)

    test('unwraps sDAI to USDC', async ({ page }) => {
      const { account } = await setup(page, fork, {
        initialPage: 'savings',
        account: {
          type: 'connected',
          assetBalances: {
            ETH: 1,
            sDAI: 1000,
          },
        },
      })
      await overrideLiFiRoute(page, account, 'sdai-to-100-usdc', blockNumber)

      const savingsPage = new SavingsPageObject(page)

      await savingsPage.clickWithdrawButtonAction()

      const withdrawDialog = new SavingsWithdrawDialogPageObject(page)
      await withdrawDialog.selectAssetAction('USDC')
      await withdrawDialog.fillAmountAction(100)

      const actionsContainer = new ActionsPageObject(withdrawDialog.locatePanelByHeader('Actions'))
      await actionsContainer.acceptAllActionsAction(2)
      await withdrawDialog.clickBackToSavingsButton()

      await savingsPage.expectCurrentWorth('991.375')
      await savingsPage.expectCashInWalletAssetBalance('USDC', '100.54')
    })

    test.describe('on fork', () => {
      const blockNumber = 19609941n
      const fork = setupFork(blockNumber)

      test('unwraps ALL sDAI to USDC', async ({ page }) => {
        const { account } = await setup(page, fork, {
          initialPage: 'savings',
          account: {
            type: 'connected',
            assetBalances: {
              ETH: 1,
              sDAI: 100,
            },
          },
        })
        await overrideLiFiRoute(page, account, '100-sdai-to-usdc', blockNumber)

        const savingsPage = new SavingsPageObject(page)

        await savingsPage.clickWithdrawButtonAction()

        const withdrawDialog = new SavingsWithdrawDialogPageObject(page)
        await withdrawDialog.selectAssetAction('USDC')
        await withdrawDialog.clickMaxAmountAction()

        const actionsContainer = new ActionsPageObject(withdrawDialog.locatePanelByHeader('Actions'))
        await actionsContainer.acceptAllActionsAction(2)
        await withdrawDialog.clickBackToSavingsButton()

        await savingsPage.expectCashInWalletAssetBalance('USDC', '107.35')
      })
    })
  })
})
