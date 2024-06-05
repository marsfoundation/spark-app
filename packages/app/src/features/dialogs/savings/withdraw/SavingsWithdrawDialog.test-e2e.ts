import { test } from '@playwright/test'
import { gnosis, mainnet } from 'viem/chains'

import { ActionsPageObject } from '@/features/actions/ActionsContainer.PageObject'
import { SavingsPageObject } from '@/pages/Savings.PageObject'
import { LIFI_TEST_USER_PRIVATE_KEY, overrideLiFiRouteWithHAR } from '@/test/e2e/lifi'
import { setup } from '@/test/e2e/setup'
import { setupFork } from '@/test/e2e/setupFork'

import { SavingsWithdrawDialogPageObject } from './SavingsWithdrawDialog.PageObject'

test.describe('Savings withdraw dialog', () => {
  test.describe('DAI', () => {
    // Block number has to be as close as possible to the block number when query was executed
    const blockNumber = 19990800n
    const fork = setupFork({ blockNumber, chainId: mainnet.id })

    test('unwraps sDAI to DAI', async ({ page }) => {
      await setup(page, fork, {
        initialPage: 'savings',
        account: {
          type: 'connected',
          assetBalances: {
            ETH: 1,
            sDAI: 1000,
          },
          privateKey: LIFI_TEST_USER_PRIVATE_KEY,
        },
      })
      await overrideLiFiRouteWithHAR({
        page,
        key: 'sdai-to-1000-dai',
      })

      const savingsPage = new SavingsPageObject(page)

      await savingsPage.clickWithdrawButtonAction()

      const withdrawDialog = new SavingsWithdrawDialogPageObject(page)
      await withdrawDialog.fillAmountAction(1000)

      const actionsContainer = new ActionsPageObject(withdrawDialog.locatePanelByHeader('Actions'))
      await actionsContainer.acceptAllActionsAction(2)
      await withdrawDialog.clickBackToSavingsButton()

      await savingsPage.expectCurrentWorth('84.64')
      await savingsPage.expectCashInWalletAssetBalance('DAI', '1,001.50')
    })
  })

  test.describe('Max DAI', () => {
    const blockNumber = 19990836n
    const fork = setupFork({ blockNumber, chainId: mainnet.id })

    test('unwraps all sDAI to DAI', async ({ page }) => {
      await setup(page, fork, {
        initialPage: 'savings',
        account: {
          type: 'connected',
          assetBalances: {
            ETH: 1,
            sDAI: 1000,
          },
          privateKey: LIFI_TEST_USER_PRIVATE_KEY,
        },
      })
      await overrideLiFiRouteWithHAR({
        page,
        key: '1000-sdai-to-dai',
      })

      const savingsPage = new SavingsPageObject(page)

      await savingsPage.clickWithdrawButtonAction()

      const withdrawDialog = new SavingsWithdrawDialogPageObject(page)
      await withdrawDialog.clickMaxAmountAction()

      const actionsContainer = new ActionsPageObject(withdrawDialog.locatePanelByHeader('Actions'))
      await actionsContainer.acceptAllActionsAction(2)
      await withdrawDialog.clickBackToSavingsButton()

      await savingsPage.expectCashInWalletAssetBalance('DAI', '1,086.07')
    })
  })

  test.describe('xDAI', () => {
    const blockNumber = 34227971n
    const fork = setupFork({ blockNumber, chainId: gnosis.id })

    test('unwraps sDAI to xDAI', async ({ page }) => {
      await setup(page, fork, {
        initialPage: 'savings',
        account: {
          type: 'connected',
          assetBalances: {
            XDAI: 100,
            sDAI: 2000,
          },
          privateKey: LIFI_TEST_USER_PRIVATE_KEY,
        },
      })
      await overrideLiFiRouteWithHAR({
        page,
        key: 'sdai-to-1000-xdai',
      })

      const savingsPage = new SavingsPageObject(page)

      await savingsPage.clickWithdrawButtonAction()

      const withdrawDialog = new SavingsWithdrawDialogPageObject(page)
      await withdrawDialog.fillAmountAction(1000)

      const actionsContainer = new ActionsPageObject(withdrawDialog.locatePanelByHeader('Actions'))
      await actionsContainer.acceptAllActionsAction(2)
      await withdrawDialog.clickBackToSavingsButton()

      await savingsPage.expectCurrentWorth('1,163.09')
      await savingsPage.expectCashInWalletAssetBalance('XDAI', '1,101.50')
    })
  })

  test.describe('USDC', () => {
    const blockNumber = 19990874n
    const fork = setupFork({ blockNumber, chainId: mainnet.id })

    test('unwraps sDAI to USDC', async ({ page }) => {
      await setup(page, fork, {
        initialPage: 'savings',
        account: {
          type: 'connected',
          assetBalances: {
            ETH: 1,
            sDAI: 1000,
          },
          privateKey: LIFI_TEST_USER_PRIVATE_KEY,
        },
      })
      await overrideLiFiRouteWithHAR({
        page,
        key: 'sdai-to-1000-usdc',
      })

      const savingsPage = new SavingsPageObject(page)

      await savingsPage.clickWithdrawButtonAction()

      const withdrawDialog = new SavingsWithdrawDialogPageObject(page)
      await withdrawDialog.selectAssetAction('USDC')
      await withdrawDialog.fillAmountAction(1000)

      const actionsContainer = new ActionsPageObject(withdrawDialog.locatePanelByHeader('Actions'))
      await actionsContainer.acceptAllActionsAction(2)
      await withdrawDialog.clickBackToSavingsButton()

      await savingsPage.expectCurrentWorth('83.04')
      await savingsPage.expectCashInWalletAssetBalance('USDC', '1,002.30')
    })
  })

  test.describe('Max USDC', () => {
    const blockNumber = 19990888n
    const fork = setupFork({ blockNumber, chainId: mainnet.id })

    test('unwraps all sDAI to USDC', async ({ page }) => {
      await setup(page, fork, {
        initialPage: 'savings',
        account: {
          type: 'connected',
          assetBalances: {
            ETH: 1,
            sDAI: 1000,
          },
          privateKey: LIFI_TEST_USER_PRIVATE_KEY,
        },
      })
      await overrideLiFiRouteWithHAR({
        page,
        key: '1000-sdai-to-usdc',
      })

      const savingsPage = new SavingsPageObject(page)

      await savingsPage.clickWithdrawButtonAction()

      const withdrawDialog = new SavingsWithdrawDialogPageObject(page)
      await withdrawDialog.selectAssetAction('USDC')
      await withdrawDialog.clickMaxAmountAction()

      const actionsContainer = new ActionsPageObject(withdrawDialog.locatePanelByHeader('Actions'))
      await actionsContainer.acceptAllActionsAction(2)
      await withdrawDialog.clickBackToSavingsButton()

      await savingsPage.expectCashInWalletAssetBalance('USDC', '1,085.21')
    })
  })

  test.describe('USDC on Gnosis', () => {
    const blockNumber = 34228121n
    const fork = setupFork({ blockNumber, chainId: gnosis.id })

    test('unwraps sDAI to USDC', async ({ page }) => {
      await setup(page, fork, {
        initialPage: 'savings',
        account: {
          type: 'connected',
          assetBalances: {
            XDAI: 100,
            sDAI: 1000,
          },
          privateKey: LIFI_TEST_USER_PRIVATE_KEY,
        },
      })
      await overrideLiFiRouteWithHAR({
        page,
        key: 'sdai-to-1000-gnosis-usdc',
      })

      const savingsPage = new SavingsPageObject(page)

      await savingsPage.clickWithdrawButtonAction()

      const withdrawDialog = new SavingsWithdrawDialogPageObject(page)
      await withdrawDialog.selectAssetAction('USDC')
      await withdrawDialog.fillAmountAction(1000)

      const actionsContainer = new ActionsPageObject(withdrawDialog.locatePanelByHeader('Actions'))
      await actionsContainer.acceptAllActionsAction(2)
      await withdrawDialog.clickBackToSavingsButton()

      await savingsPage.expectCurrentWorth('78.20')
      await savingsPage.expectCashInWalletAssetBalance('USDC', '1,001.56')
    })
  })

  test.describe('Risk warning', () => {
    const blockNumber = 19990930n
    const fork = setupFork({ blockNumber, chainId: mainnet.id })

    test('displays warning when discrepancy is bigger than 100 DAI', async ({ page }) => {
      await setup(page, fork, {
        initialPage: 'savings',
        account: {
          type: 'connected',
          assetBalances: {
            ETH: 1,
            sDAI: 100000,
          },
          privateKey: LIFI_TEST_USER_PRIVATE_KEY,
        },
      })

      await overrideLiFiRouteWithHAR({
        page,
        key: '10277.276260680656857010-sdai-to-10000-dai',
      })

      const savingsPage = new SavingsPageObject(page)

      await savingsPage.clickWithdrawButtonAction()

      const depositDialog = new SavingsWithdrawDialogPageObject(page)
      await depositDialog.fillAmountAction(10000)

      await depositDialog.expectDiscrepancyWarning('1,165.75 DAI')
    })

    test('actions stay disabled until risk is acknowledged', async ({ page }) => {
      await setup(page, fork, {
        initialPage: 'savings',
        account: {
          type: 'connected',
          assetBalances: {
            ETH: 1,
            sDAI: 100000,
          },
          privateKey: LIFI_TEST_USER_PRIVATE_KEY,
        },
      })

      await overrideLiFiRouteWithHAR({
        page,
        key: '10277.276260680656857010-sdai-to-10000-dai',
      })

      const savingsPage = new SavingsPageObject(page)

      await savingsPage.clickWithdrawButtonAction()

      const depositDialog = new SavingsWithdrawDialogPageObject(page)
      await depositDialog.fillAmountAction(10000)
      await depositDialog.expectTransactionOverviewToBeVisible() // wait for lifi to load

      const actionsContainer = new ActionsPageObject(depositDialog.locatePanelByHeader('Actions'))
      await actionsContainer.expectActionsDisabled()

      await depositDialog.clickAcknowledgeRisk()
      await actionsContainer.expectNextActionEnabled()
    })
  })
})
