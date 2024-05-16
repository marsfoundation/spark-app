import { test } from '@playwright/test'
import { mainnet } from 'viem/chains'

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
    const fork = setupFork({ blockNumber, chainId: mainnet.id })

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
      await overrideLiFiRoute(page, {
        receiver: account,
        preset: '100-dai-to-sdai',
        expectedBlockNumber: blockNumber,
      })

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
    const fork = setupFork({ blockNumber, chainId: mainnet.id })

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
      await overrideLiFiRoute(page, {
        receiver: account,
        preset: '100-usdc-to-sdai',
        expectedBlockNumber: blockNumber,
      })

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

  test.describe('Slippage', () => {
    const fork = setupFork({ blockNumber, chainId: mainnet.id })

    test('default', async ({ page }) => {
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
      const expectedDefaultSlippage = 0.001

      await overrideLiFiRoute(page, {
        receiver: account,
        preset: '100-usdc-to-sdai',
        expectedBlockNumber: blockNumber,
        expectedParams: {
          slippage: expectedDefaultSlippage,
        },
      })

      const savingsPage = new SavingsPageObject(page)

      await savingsPage.clickDepositButtonAction('USDC')

      const depositDialog = new SavingsDepositDialogPageObject(page)
      const actionsContainer = new ActionsPageObject(depositDialog.locatePanelByHeader('Actions'))

      await actionsContainer.setSlippageAction(expectedDefaultSlippage, 'button')
      await depositDialog.fillAmountAction(100)

      await actionsContainer.expectSlippage(expectedDefaultSlippage)
    })

    test('changes using button', async ({ page }) => {
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
      const newSlippage = 0.005

      await overrideLiFiRoute(page, {
        receiver: account,
        preset: '100-usdc-to-sdai',
        expectedBlockNumber: blockNumber,
        expectedParams: {
          slippage: newSlippage,
        },
      })

      const savingsPage = new SavingsPageObject(page)

      await savingsPage.clickDepositButtonAction('USDC')

      const depositDialog = new SavingsDepositDialogPageObject(page)
      const actionsContainer = new ActionsPageObject(depositDialog.locatePanelByHeader('Actions'))

      await actionsContainer.setSlippageAction(newSlippage, 'button')
      await depositDialog.fillAmountAction(100)

      await actionsContainer.expectSlippage(newSlippage)
    })

    test('changes using custom input', async ({ page }) => {
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
      const newSlippage = 0.007

      await overrideLiFiRoute(page, {
        receiver: account,
        preset: '100-usdc-to-sdai',
        expectedBlockNumber: blockNumber,
        expectedParams: {
          slippage: newSlippage,
        },
      })

      const savingsPage = new SavingsPageObject(page)

      await savingsPage.clickDepositButtonAction('USDC')

      const depositDialog = new SavingsDepositDialogPageObject(page)
      const actionsContainer = new ActionsPageObject(depositDialog.locatePanelByHeader('Actions'))

      await actionsContainer.setSlippageAction(newSlippage, 'input')
      await depositDialog.fillAmountAction(100)

      await actionsContainer.expectSlippage(newSlippage)
    })
  })

  test.describe('Risk warning', () => {
    const fork = setupFork({ blockNumber: 19861465n, chainId: mainnet.id })

    test('displays warning when discrepancy is bigger than 100 DAI', async ({ page }) => {
      const { account } = await setup(page, fork, {
        initialPage: 'savings',
        account: {
          type: 'connected',
          assetBalances: {
            ETH: 1,
            DAI: 10000,
          },
        },
      })

      await overrideLiFiRoute(page, {
        receiver: account,
        preset: '10000-dai-to-sdai',
        expectedBlockNumber: blockNumber,
      })

      const savingsPage = new SavingsPageObject(page)

      await savingsPage.clickDepositButtonAction('DAI')

      const depositDialog = new SavingsDepositDialogPageObject(page)
      await depositDialog.fillAmountAction(10000)

      await depositDialog.expectDiscrepancyWarning('948.48 DAI')
    })

    test('actions stay disabled until risk is acknowledged', async ({ page }) => {
      const { account } = await setup(page, fork, {
        initialPage: 'savings',
        account: {
          type: 'connected',
          assetBalances: {
            ETH: 1,
            DAI: 10000,
          },
        },
      })

      await overrideLiFiRoute(page, {
        receiver: account,
        preset: '10000-dai-to-sdai',
        expectedBlockNumber: blockNumber,
      })

      const savingsPage = new SavingsPageObject(page)

      await savingsPage.clickDepositButtonAction('DAI')

      const depositDialog = new SavingsDepositDialogPageObject(page)
      await depositDialog.fillAmountAction(10000)
      await depositDialog.expectTransactionOverviewToBeVisible() // wait for lifi to load

      const actionsContainer = new ActionsPageObject(depositDialog.locatePanelByHeader('Actions'))
      await actionsContainer.expectActionsDisabled()

      await depositDialog.clickAcknowledgeRisk()
      await actionsContainer.expectNextActionEnabled()
    })
  })
})
