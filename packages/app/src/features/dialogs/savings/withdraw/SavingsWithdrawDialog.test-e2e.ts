import { ActionsPageObject } from '@/features/actions/ActionsContainer.PageObject'
import { SavingsPageObject } from '@/pages/Savings.PageObject'
import { DEFAULT_BLOCK_NUMBER } from '@/test/e2e/constants'
import { LIFI_TEST_USER_PRIVATE_KEY, overrideLiFiRouteWithHAR } from '@/test/e2e/lifi'
import { setup } from '@/test/e2e/setup'
import { setupFork } from '@/test/e2e/setupFork'
import { test } from '@playwright/test'
import { gnosis, mainnet } from 'viem/chains'
import { SavingsWithdrawDialogPageObject } from './SavingsWithdrawDialog.PageObject'

test.describe('Savings withdraw dialog', () => {
  test.describe('DAI', () => {
    const fork = setupFork({ blockNumber: DEFAULT_BLOCK_NUMBER, chainId: mainnet.id })

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

      const savingsPage = new SavingsPageObject(page)

      await savingsPage.clickWithdrawButtonAction()

      const withdrawDialog = new SavingsWithdrawDialogPageObject(page)
      await withdrawDialog.fillAmountAction(1000)

      const actionsContainer = new ActionsPageObject(withdrawDialog.locatePanelByHeader('Actions'))
      await actionsContainer.acceptAllActionsAction(1)
      await withdrawDialog.clickBackToSavingsButton()

      await savingsPage.expectCurrentWorth('71.5')
      await savingsPage.expectCashInWalletAssetBalance('DAI', '1,000.00')
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

      const savingsPage = new SavingsPageObject(page)

      await savingsPage.clickWithdrawButtonAction()

      const withdrawDialog = new SavingsWithdrawDialogPageObject(page)
      await withdrawDialog.clickMaxAmountAction()

      const actionsContainer = new ActionsPageObject(withdrawDialog.locatePanelByHeader('Actions'))
      await actionsContainer.acceptAllActionsAction(1)
      await withdrawDialog.clickBackToSavingsButton()

      await savingsPage.expectCashInWalletAssetBalance('DAI', '1,086.94')
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
    const blockNumber = 20073952n
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
        key: '9198.753133685380130125-sdai-to-10000-usdc',
      })

      const savingsPage = new SavingsPageObject(page)

      await savingsPage.clickWithdrawButtonAction()

      const depositDialog = new SavingsWithdrawDialogPageObject(page)
      await depositDialog.selectAssetAction('USDC')
      await depositDialog.fillAmountAction(10000)

      await depositDialog.expectDiscrepancyWarning('189.30 DAI')
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
        key: '9198.753133685380130125-sdai-to-10000-usdc',
      })

      const savingsPage = new SavingsPageObject(page)

      await savingsPage.clickWithdrawButtonAction()

      const depositDialog = new SavingsWithdrawDialogPageObject(page)
      await depositDialog.selectAssetAction('USDC')
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

        const depositDialog = new SavingsWithdrawDialogPageObject(page)
        const actionsContainer = new ActionsPageObject(depositDialog.locatePanelByHeader('Actions'))

        await depositDialog.fillAmountAction(1000)
        await actionsContainer.expectNextActionEnabled()
        await actionsContainer.expectActions([{ type: 'nativeSDaiWithdraw', asset: 'DAI', amount: 1000 }], true)

        await depositDialog.selectAssetAction('USDC')
        await depositDialog.fillAmountAction(1000)
        await actionsContainer.expectNextActionEnabled()
        await actionsContainer.expectActions(
          [
            { type: 'approve', asset: 'sDAI', amount: 1000 },
            { type: 'exchange', inputAsset: 'sDAI', outputAsset: 'USDC', amount: 1000 },
          ],
          true,
        )

        await depositDialog.selectAssetAction('USDT')
        await depositDialog.fillAmountAction(1000)
        await actionsContainer.expectNextActionEnabled()
        await actionsContainer.expectActions(
          [
            { type: 'approve', asset: 'sDAI', amount: 1000 },
            { type: 'exchange', inputAsset: 'sDAI', outputAsset: 'USDT', amount: 1000 },
          ],
          true,
        )

        await depositDialog.selectAssetAction('DAI')
        await depositDialog.fillAmountAction(1000)
        await actionsContainer.expectNextActionEnabled()
        await actionsContainer.expectActions([{ type: 'nativeSDaiWithdraw', asset: 'DAI', amount: 1000 }], true)
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

        const depositDialog = new SavingsWithdrawDialogPageObject(page)
        const actionsContainer = new ActionsPageObject(depositDialog.locatePanelByHeader('Actions'))

        await depositDialog.fillAmountAction(1000)
        await actionsContainer.expectNextActionEnabled()
        await actionsContainer.expectActions(
          [
            { type: 'approve', asset: 'sDAI', amount: 1000 },
            { type: 'exchange', inputAsset: 'sDAI', outputAsset: 'XDAI', amount: 1000 },
          ],
          true,
        )

        await depositDialog.selectAssetAction('USDC')
        await depositDialog.fillAmountAction(1000)
        await actionsContainer.expectNextActionEnabled()
        await actionsContainer.expectActions(
          [
            { type: 'approve', asset: 'sDAI', amount: 1000 },
            { type: 'exchange', inputAsset: 'sDAI', outputAsset: 'USDC', amount: 1000 },
          ],
          true,
        )

        await depositDialog.selectAssetAction('USDT')
        await depositDialog.fillAmountAction(1000)
        await actionsContainer.expectNextActionEnabled()
        await actionsContainer.expectActions(
          [
            { type: 'approve', asset: 'sDAI', amount: 1000 },
            { type: 'exchange', inputAsset: 'sDAI', outputAsset: 'USDT', amount: 1000 },
          ],
          true,
        )

        await depositDialog.selectAssetAction('XDAI')
        await depositDialog.fillAmountAction(1000)
        await actionsContainer.expectNextActionEnabled()
        await actionsContainer.expectActions(
          [
            { type: 'approve', asset: 'sDAI', amount: 1000 },
            { type: 'exchange', inputAsset: 'sDAI', outputAsset: 'XDAI', amount: 1000 },
          ],
          true,
        )
      })
    })
  })
})
