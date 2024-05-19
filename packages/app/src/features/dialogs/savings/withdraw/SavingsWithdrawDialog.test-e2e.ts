import { test } from '@playwright/test'
import { gnosis, mainnet } from 'viem/chains'

import { LIFI_DEFAULT_FEE_INTEGRATOR_KEY, LIFI_WAIVED_FEE_INTEGRATOR_KEY } from '@/domain/exchanges/evaluateSwap'
import { defaultExchangeMaxSlippage } from '@/domain/state/actions-settings'
import { ActionsPageObject } from '@/features/actions/ActionsContainer.PageObject'
import { SavingsPageObject } from '@/pages/Savings.PageObject'
import { overrideLiFiRoute } from '@/test/e2e/lifi'
import { setup } from '@/test/e2e/setup'
import { setupFork } from '@/test/e2e/setupFork'

import { SavingsWithdrawDialogPageObject } from './SavingsWithdrawDialog.PageObject'

test.describe('Savings withdraw dialog', () => {
  test.describe('DAI', () => {
    // Block number has to be as close as possible to the block number when query was executed
    const blockNumber = 19532848n
    const fork = setupFork({ blockNumber, chainId: mainnet.id })

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
      await overrideLiFiRoute(page, {
        receiver: account,
        preset: 'sdai-to-100-dai',
        expectedBlockNumber: blockNumber,
        expectedParams: {
          slippage: defaultExchangeMaxSlippage,
          integrator: LIFI_WAIVED_FEE_INTEGRATOR_KEY,
        },
      })

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
      const fork = setupFork({ blockNumber, chainId: mainnet.id })

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
        await overrideLiFiRoute(page, {
          receiver: account,
          preset: '100-sdai-to-dai',
          expectedBlockNumber: blockNumber,
          expectedParams: {
            slippage: defaultExchangeMaxSlippage,
            integrator: LIFI_WAIVED_FEE_INTEGRATOR_KEY,
          },
        })

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

  test.describe('xDAI', () => {
    const blockNumber = 33976095n
    const fork = setupFork({ blockNumber, chainId: gnosis.id })

    test('unwraps sDAI to xDAI', async ({ page }) => {
      const { account } = await setup(page, fork, {
        initialPage: 'savings',
        account: {
          type: 'connected',
          assetBalances: {
            XDAI: 100,
            sDAI: 1000,
          },
        },
      })
      await overrideLiFiRoute(page, {
        receiver: account,
        preset: 'sdai-to-100-xdai',
        expectedBlockNumber: blockNumber,
        expectedParams: {
          slippage: defaultExchangeMaxSlippage,
          integrator: LIFI_WAIVED_FEE_INTEGRATOR_KEY,
        },
      })

      const savingsPage = new SavingsPageObject(page)

      await savingsPage.clickWithdrawButtonAction()

      const withdrawDialog = new SavingsWithdrawDialogPageObject(page)
      await withdrawDialog.fillAmountAction(100)

      const actionsContainer = new ActionsPageObject(withdrawDialog.locatePanelByHeader('Actions'))
      await actionsContainer.acceptAllActionsAction(2)
      await withdrawDialog.clickBackToSavingsButton()

      await savingsPage.expectCurrentWorth('977.124814')
      await savingsPage.expectCashInWalletAssetBalance('XDAI', '200.15')
    })
  })

  test.describe('USDC', () => {
    const blockNumber = 19532848n
    const fork = setupFork({ blockNumber, chainId: mainnet.id })

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
      await overrideLiFiRoute(page, {
        receiver: account,
        preset: 'sdai-to-100-usdc',
        expectedBlockNumber: blockNumber,
        expectedParams: {
          slippage: defaultExchangeMaxSlippage,
          integrator: LIFI_WAIVED_FEE_INTEGRATOR_KEY,
        },
      })

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
      const fork = setupFork({ blockNumber, chainId: mainnet.id })

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
        await overrideLiFiRoute(page, {
          receiver: account,
          preset: '100-sdai-to-usdc',
          expectedBlockNumber: blockNumber,
          expectedParams: {
            slippage: defaultExchangeMaxSlippage,
            integrator: LIFI_WAIVED_FEE_INTEGRATOR_KEY,
          },
        })

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

  test.describe('USDC on Gnosis', () => {
    const blockNumber = 33988883n
    const fork = setupFork({ blockNumber, chainId: gnosis.id })

    test('unwraps sDAI to USDC', async ({ page }) => {
      const { account } = await setup(page, fork, {
        initialPage: 'savings',
        account: {
          type: 'connected',
          assetBalances: {
            XDAI: 100,
            sDAI: 1000,
          },
        },
      })
      await overrideLiFiRoute(page, {
        receiver: account,
        preset: 'sdai-to-100-usdc-on-gnosis',
        expectedBlockNumber: blockNumber,
        expectedParams: {
          slippage: defaultExchangeMaxSlippage,
          integrator: LIFI_DEFAULT_FEE_INTEGRATOR_KEY,
        },
      })

      const savingsPage = new SavingsPageObject(page)

      await savingsPage.clickWithdrawButtonAction()

      const withdrawDialog = new SavingsWithdrawDialogPageObject(page)
      await withdrawDialog.selectAssetAction('USDC')
      await withdrawDialog.fillAmountAction(100)

      const actionsContainer = new ActionsPageObject(withdrawDialog.locatePanelByHeader('Actions'))
      await actionsContainer.acceptAllActionsAction(2)
      await withdrawDialog.clickBackToSavingsButton()

      await savingsPage.expectCurrentWorth('977.402830')
      await savingsPage.expectCashInWalletAssetBalance('USDC', '100.15')
    })
  })

  test.describe('Risk warning', () => {
    const blockNumber = 19862032n
    const fork = setupFork({ blockNumber, chainId: mainnet.id })

    test('displays warning when discrepancy is bigger than 100 DAI', async ({ page }) => {
      const { account } = await setup(page, fork, {
        initialPage: 'savings',
        account: {
          type: 'connected',
          assetBalances: {
            ETH: 1,
            sDAI: 100000,
          },
        },
      })

      await overrideLiFiRoute(page, {
        receiver: account,
        preset: 'sdai-to-10000-dai',
        expectedBlockNumber: blockNumber,
        expectedParams: {
          slippage: defaultExchangeMaxSlippage,
          integrator: LIFI_WAIVED_FEE_INTEGRATOR_KEY,
        },
      })

      const savingsPage = new SavingsPageObject(page)

      await savingsPage.clickWithdrawButtonAction()

      const depositDialog = new SavingsWithdrawDialogPageObject(page)
      await depositDialog.fillAmountAction(10000)

      await depositDialog.expectDiscrepancyWarning('1,175.07 DAI')
    })

    test('actions stay disabled until risk is acknowledged', async ({ page }) => {
      const { account } = await setup(page, fork, {
        initialPage: 'savings',
        account: {
          type: 'connected',
          assetBalances: {
            ETH: 1,
            sDAI: 100000,
          },
        },
      })

      await overrideLiFiRoute(page, {
        receiver: account,
        preset: 'sdai-to-10000-dai',
        expectedBlockNumber: blockNumber,
        expectedParams: {
          slippage: defaultExchangeMaxSlippage,
          integrator: LIFI_WAIVED_FEE_INTEGRATOR_KEY,
        },
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
