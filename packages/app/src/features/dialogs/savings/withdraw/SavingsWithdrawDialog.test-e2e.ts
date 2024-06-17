import { ActionsPageObject } from '@/features/actions/ActionsContainer.PageObject'
import { SavingsPageObject } from '@/pages/Savings.PageObject'
import { LIFI_TEST_USER_PRIVATE_KEY, overrideLiFiRouteWithHAR } from '@/test/e2e/lifi'
import { setup } from '@/test/e2e/setup'
import { setupFork } from '@/test/e2e/setupFork'
import { test } from '@playwright/test'
import { gnosis, mainnet } from 'viem/chains'
import { SavingsDialogPageObject } from '../common/e2e/SavingsDialog.PageObject'

test.describe('Savings withdraw dialog', () => {
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

      const withdrawDialog = new SavingsDialogPageObject({ page, type: 'withdraw' })
      await withdrawDialog.fillAmountAction(1000)

      const actionsContainer = new ActionsPageObject(withdrawDialog.locatePanelByHeader('Actions'))
      await actionsContainer.acceptAllActionsAction(2)
      await withdrawDialog.clickBackToSavingsButton()

      await savingsPage.expectCurrentWorth('1,163.09')
      await savingsPage.expectCashInWalletAssetBalance('XDAI', '1,101.50')
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

      const withdrawDialog = new SavingsDialogPageObject({ page, type: 'withdraw' })
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
    const blockNumber = 20090065n
    const fork = setupFork({
      blockNumber,
      chainId: mainnet.id,
      simulationDateOverride: new Date('2024-09-04T10:21:19Z'),
    })

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
        key: '9198.753133685380130125-sdai-to-10000-usdt',
      })

      const savingsPage = new SavingsPageObject(page)

      await savingsPage.clickWithdrawButtonAction()

      const depositDialog = new SavingsDialogPageObject({ page, type: 'withdraw' })
      await depositDialog.selectAssetAction('USDT')
      await depositDialog.fillAmountAction(10000)

      await depositDialog.expectDiscrepancyWarning('198.82 DAI')
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
        key: '9198.753133685380130125-sdai-to-10000-usdt',
      })

      const savingsPage = new SavingsPageObject(page)

      await savingsPage.clickWithdrawButtonAction()

      const depositDialog = new SavingsDialogPageObject({ page, type: 'withdraw' })
      await depositDialog.selectAssetAction('USDT')
      await depositDialog.fillAmountAction(10000)
      await depositDialog.expectTransactionOverviewToBeVisible() // wait for lifi to load

      const actionsContainer = new ActionsPageObject(depositDialog.locatePanelByHeader('Actions'))
      await actionsContainer.expectActionsDisabled()

      await depositDialog.clickAcknowledgeRisk()
      await actionsContainer.expectNextActionEnabled()
    })
  })

  test.describe('Miscellaneous', () => {
    test.describe('Mainnet', () => {
      const blockNumber = 20025677n
      const fork = setupFork({ blockNumber, chainId: mainnet.id })

      test('can switch between tokens', async ({ page }) => {
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
          key: 'mainnet-withdraw-switch-tokens',
        })

        const savingsPage = new SavingsPageObject(page)

        await savingsPage.clickWithdrawButtonAction()

        const depositDialog = new SavingsDialogPageObject({ page, type: 'withdraw' })
        const actionsContainer = new ActionsPageObject(depositDialog.locatePanelByHeader('Actions'))

        await depositDialog.fillAmountAction(1000)
        await actionsContainer.expectEnabledActionAtIndex(0)
        await actionsContainer.expectActions([{ type: 'nativeSDaiWithdraw', asset: 'DAI' }])

        await depositDialog.selectAssetAction('USDC')
        await depositDialog.fillAmountAction(1000)
        await actionsContainer.expectEnabledActionAtIndex(0)
        await actionsContainer.expectActions([
          { type: 'approve', asset: 'sDAI' },
          { type: 'nativeSDaiWithdraw', asset: 'USDC' },
        ])

        await depositDialog.selectAssetAction('USDT')
        await depositDialog.fillAmountAction(1000)
        await actionsContainer.expectEnabledActionAtIndex(0)
        await actionsContainer.expectActions([
          { type: 'approve', asset: 'sDAI' },
          { type: 'exchange', inputAsset: 'sDAI', outputAsset: 'USDT' },
        ])

        await depositDialog.selectAssetAction('DAI')
        await depositDialog.fillAmountAction(1000)
        await actionsContainer.expectEnabledActionAtIndex(0)
        await actionsContainer.expectActions([{ type: 'nativeSDaiWithdraw', asset: 'DAI' }])
      })
    })

    test.describe('Gnosis', () => {
      const blockNumber = 34309540n
      const fork = setupFork({ blockNumber, chainId: gnosis.id })

      test('can switch between tokens', async ({ page }) => {
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
          key: 'gnosis-withdraw-switch-tokens',
        })

        const savingsPage = new SavingsPageObject(page)

        await savingsPage.clickWithdrawButtonAction()

        const depositDialog = new SavingsDialogPageObject({ page, type: 'withdraw' })
        const actionsContainer = new ActionsPageObject(depositDialog.locatePanelByHeader('Actions'))

        await depositDialog.fillAmountAction(1000)
        await actionsContainer.expectEnabledActionAtIndex(0)
        await actionsContainer.expectActions([
          { type: 'approve', asset: 'sDAI' },
          { type: 'exchange', inputAsset: 'sDAI', outputAsset: 'XDAI' },
        ])

        await depositDialog.selectAssetAction('USDC')
        await depositDialog.fillAmountAction(1000)
        await actionsContainer.expectEnabledActionAtIndex(0)
        await actionsContainer.expectActions([
          { type: 'approve', asset: 'sDAI' },
          { type: 'exchange', inputAsset: 'sDAI', outputAsset: 'USDC' },
        ])

        await depositDialog.selectAssetAction('USDT')
        await depositDialog.fillAmountAction(1000)
        await actionsContainer.expectEnabledActionAtIndex(0)
        await actionsContainer.expectActions([
          { type: 'approve', asset: 'sDAI' },
          { type: 'exchange', inputAsset: 'sDAI', outputAsset: 'USDT' },
        ])

        await depositDialog.selectAssetAction('XDAI')
        await depositDialog.fillAmountAction(1000)
        await actionsContainer.expectEnabledActionAtIndex(0)
        await actionsContainer.expectActions([
          { type: 'approve', asset: 'sDAI' },
          { type: 'exchange', inputAsset: 'sDAI', outputAsset: 'XDAI' },
        ])
      })
    })
  })
})
