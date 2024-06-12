import { ActionsPageObject } from '@/features/actions/ActionsContainer.PageObject'
import { SavingsPageObject } from '@/pages/Savings.PageObject'
import { DEFAULT_BLOCK_NUMBER } from '@/test/e2e/constants'
import { LIFI_TEST_USER_PRIVATE_KEY, overrideLiFiRouteWithHAR } from '@/test/e2e/lifi'
import { setup } from '@/test/e2e/setup'
import { setupFork } from '@/test/e2e/setupFork'
import { test } from '@playwright/test'
import { gnosis, mainnet } from 'viem/chains'
import { SavingsDepositDialogPageObject } from './SavingsDepositDialog.PageObject'

test.describe('Savings deposit dialog', () => {
  // The tests here are not independent.
  // My guess is that reverting to snapshots in tenderly does not work properly - but for now couldn't debug that.
  // For now tests use different forks.
  test.describe('DAI', () => {
    const fork = setupFork({ blockNumber: DEFAULT_BLOCK_NUMBER, chainId: mainnet.id })

    test('wraps DAI', async ({ page }) => {
      await setup(page, fork, {
        initialPage: 'savings',
        account: {
          type: 'connected',
          assetBalances: {
            ETH: 1,
            DAI: 100,
          },
          privateKey: LIFI_TEST_USER_PRIVATE_KEY,
        },
      })

      const savingsPage = new SavingsPageObject(page)

      await savingsPage.clickStartSavingButtonAction()

      const depositDialog = new SavingsDepositDialogPageObject(page)
      await depositDialog.fillAmountAction(100)

      const actionsContainer = new ActionsPageObject(depositDialog.locatePanelByHeader('Actions'))
      await actionsContainer.acceptAllActionsAction(2)
      await depositDialog.clickBackToSavingsButton()

      await savingsPage.expectCurrentWorth('100')
    })
  })

  test.describe('xDAI', () => {
    // Block number has to be as close as possible to the block number when query was executed
    const blockNumber = 34227645n
    const fork = setupFork({ blockNumber, chainId: gnosis.id })

    test('wraps xDAI', async ({ page }) => {
      await setup(page, fork, {
        initialPage: 'savings',
        account: {
          type: 'connected',
          assetBalances: {
            XDAI: 1000,
          },
          privateKey: LIFI_TEST_USER_PRIVATE_KEY,
        },
      })
      await overrideLiFiRouteWithHAR({
        page,
        key: '100-xdai-to-sdai',
      })

      const savingsPage = new SavingsPageObject(page)

      await savingsPage.clickStartSavingButtonAction()

      const depositDialog = new SavingsDepositDialogPageObject(page)
      await depositDialog.fillAmountAction(100)

      const actionsContainer = new ActionsPageObject(depositDialog.locatePanelByHeader('Actions'))
      await actionsContainer.acceptAllActionsAction(1)
      await depositDialog.clickBackToSavingsButton()

      await savingsPage.expectCurrentWorth('99.00')
    })
  })

  test.describe('USDC', () => {
    const blockNumber = 19990683n
    const fork = setupFork({ blockNumber, chainId: mainnet.id })

    test('wraps USDC', async ({ page }) => {
      await setup(page, fork, {
        initialPage: 'savings',
        account: {
          type: 'connected',
          assetBalances: {
            ETH: 1,
            USDC: 100,
          },
          privateKey: LIFI_TEST_USER_PRIVATE_KEY,
        },
      })
      await overrideLiFiRouteWithHAR({
        page,
        key: '100-usdc-to-sdai',
      })

      const savingsPage = new SavingsPageObject(page)

      await savingsPage.clickDepositButtonAction('USDC')

      const depositDialog = new SavingsDepositDialogPageObject(page)
      await depositDialog.fillAmountAction(100)

      const actionsContainer = new ActionsPageObject(depositDialog.locatePanelByHeader('Actions'))
      await actionsContainer.acceptAllActionsAction(2)
      await depositDialog.clickBackToSavingsButton()

      await savingsPage.expectCurrentWorth('99.85')
    })
  })

  test.describe('USDC on Gnosis', () => {
    // Block number has to be as close as possible to the block number when query was executed
    const blockNumber = 34227645n
    const fork = setupFork({ blockNumber, chainId: gnosis.id })

    test('wraps USDC', async ({ page }) => {
      await setup(page, fork, {
        initialPage: 'savings',
        account: {
          type: 'connected',
          assetBalances: {
            XDAI: 1000,
            USDC: 100,
          },
          privateKey: LIFI_TEST_USER_PRIVATE_KEY,
        },
      })
      await overrideLiFiRouteWithHAR({
        page,
        key: '100-gnosis-usdc-to-sdai',
      })

      const savingsPage = new SavingsPageObject(page)

      await savingsPage.clickDepositButtonAction('USDC')

      const depositDialog = new SavingsDepositDialogPageObject(page)
      await depositDialog.fillAmountAction(100)

      const actionsContainer = new ActionsPageObject(depositDialog.locatePanelByHeader('Actions'))
      await actionsContainer.acceptAllActionsAction(2)
      await depositDialog.clickBackToSavingsButton()

      await savingsPage.expectCurrentWorth('99.83')
    })
  })

  test.describe('Slippage', () => {
    const blockNumber = 19519583n
    const fork = setupFork({ blockNumber, chainId: mainnet.id })

    test('default', async ({ page }) => {
      await setup(page, fork, {
        initialPage: 'savings',
        account: {
          type: 'connected',
          assetBalances: {
            ETH: 1,
            USDC: 100,
          },
          privateKey: LIFI_TEST_USER_PRIVATE_KEY,
        },
      })
      const expectedDefaultSlippage = 0.001

      await overrideLiFiRouteWithHAR({
        page,
        key: '100-usdc-to-sdai-slippage-0.001',
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
      await setup(page, fork, {
        initialPage: 'savings',
        account: {
          type: 'connected',
          assetBalances: {
            ETH: 1,
            USDC: 100,
          },
          privateKey: LIFI_TEST_USER_PRIVATE_KEY,
        },
      })
      const newSlippage = 0.005

      await overrideLiFiRouteWithHAR({
        page,
        key: '100-usdc-to-sdai-slippage-0.005',
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
      await setup(page, fork, {
        initialPage: 'savings',
        account: {
          type: 'connected',
          assetBalances: {
            ETH: 1,
            USDC: 100,
          },
          privateKey: LIFI_TEST_USER_PRIVATE_KEY,
        },
      })
      const newSlippage = 0.007

      await overrideLiFiRouteWithHAR({
        page,
        key: '100-usdc-to-sdai-slippage-0.007',
      })

      const savingsPage = new SavingsPageObject(page)

      await savingsPage.clickDepositButtonAction('USDC')

      const depositDialog = new SavingsDepositDialogPageObject(page)
      const actionsContainer = new ActionsPageObject(depositDialog.locatePanelByHeader('Actions'))

      await actionsContainer.setSlippageAction(newSlippage, 'input')
      await depositDialog.fillAmountAction(100)

      await actionsContainer.expectSlippage(newSlippage)
    })

    test.describe('Validation', () => {
      test('reverts to default if value is bigger than max', async ({ page }) => {
        await setup(page, fork, {
          initialPage: 'savings',
          account: {
            type: 'connected',
            assetBalances: {
              ETH: 1,
              USDC: 100,
            },
            privateKey: LIFI_TEST_USER_PRIVATE_KEY,
          },
        })
        const newSlippage = 0.5
        const expectedDefaultSlippage = 0.001

        await overrideLiFiRouteWithHAR({
          page,
          key: '100-usdc-to-sdai-slippage-0.001',
        })

        const savingsPage = new SavingsPageObject(page)

        await savingsPage.clickDepositButtonAction('USDC')

        const depositDialog = new SavingsDepositDialogPageObject(page)
        const actionsContainer = new ActionsPageObject(depositDialog.locatePanelByHeader('Actions'))

        await actionsContainer.openSettingsDialogAction()
        await actionsContainer.fillSlippageAction(newSlippage)

        await actionsContainer.expectSlippageValidationError('Value has to be greater than 0 and less than 50')

        await actionsContainer.closeSettingsDialogAction()

        await depositDialog.fillAmountAction(100)

        await actionsContainer.expectSlippage(expectedDefaultSlippage)
      })

      test('reverts to default if value is 0', async ({ page }) => {
        await setup(page, fork, {
          initialPage: 'savings',
          account: {
            type: 'connected',
            assetBalances: {
              ETH: 1,
              USDC: 100,
            },
            privateKey: LIFI_TEST_USER_PRIVATE_KEY,
          },
        })
        const newSlippage = 0
        const expectedDefaultSlippage = 0.001

        await overrideLiFiRouteWithHAR({
          page,
          key: '100-usdc-to-sdai-slippage-0.001',
        })

        const savingsPage = new SavingsPageObject(page)

        await savingsPage.clickDepositButtonAction('USDC')

        const depositDialog = new SavingsDepositDialogPageObject(page)
        const actionsContainer = new ActionsPageObject(depositDialog.locatePanelByHeader('Actions'))

        await actionsContainer.openSettingsDialogAction()
        await actionsContainer.fillSlippageAction(newSlippage)

        await actionsContainer.expectSlippageValidationError('Value has to be greater than 0 and less than 50')

        await actionsContainer.closeSettingsDialogAction()

        await depositDialog.fillAmountAction(100)

        await actionsContainer.expectSlippage(expectedDefaultSlippage)
      })

      test('reverts to default if value is empty', async ({ page }) => {
        await setup(page, fork, {
          initialPage: 'savings',
          account: {
            type: 'connected',
            assetBalances: {
              ETH: 1,
              USDC: 100,
            },
            privateKey: LIFI_TEST_USER_PRIVATE_KEY,
          },
        })
        const expectedDefaultSlippage = 0.001

        await overrideLiFiRouteWithHAR({
          page,
          key: '100-usdc-to-sdai-slippage-0.001',
        })

        const savingsPage = new SavingsPageObject(page)

        await savingsPage.clickDepositButtonAction('USDC')

        const depositDialog = new SavingsDepositDialogPageObject(page)
        const actionsContainer = new ActionsPageObject(depositDialog.locatePanelByHeader('Actions'))

        await actionsContainer.openSettingsDialogAction()
        // input something to trigger switch from button
        await actionsContainer.fillSlippageAction(0.001)
        await actionsContainer.fillSlippageAction('')

        await actionsContainer.expectSlippageValidationError('Value has to be greater than 0 and less than 50')

        await actionsContainer.closeSettingsDialogAction()

        await depositDialog.fillAmountAction(100)

        await actionsContainer.expectSlippage(expectedDefaultSlippage)
      })
    })
  })

  test.describe('Risk warning', () => {
    const blockNumber = 19861465n
    const fork = setupFork({ blockNumber, chainId: mainnet.id })

    test('displays warning when discrepancy is bigger than 100 DAI', async ({ page }) => {
      await setup(page, fork, {
        initialPage: 'savings',
        account: {
          type: 'connected',
          assetBalances: {
            ETH: 1,
            USDT: 10000,
          },
          privateKey: LIFI_TEST_USER_PRIVATE_KEY,
        },
      })

      await overrideLiFiRouteWithHAR({
        page,
        key: '10000-usdt-to-8320.604955114542838902-sdai',
      })

      const savingsPage = new SavingsPageObject(page)

      await savingsPage.clickDepositButtonAction('USDT')

      const depositDialog = new SavingsDepositDialogPageObject(page)
      await depositDialog.fillAmountAction(10000)

      await depositDialog.expectDiscrepancyWarning('948.48 DAI')
    })

    test('actions stay disabled until risk is acknowledged', async ({ page }) => {
      await setup(page, fork, {
        initialPage: 'savings',
        account: {
          type: 'connected',
          assetBalances: {
            ETH: 1,
            USDT: 10000,
          },
          privateKey: LIFI_TEST_USER_PRIVATE_KEY,
        },
      })

      await overrideLiFiRouteWithHAR({
        page,
        key: '10000-usdt-to-8320.604955114542838902-sdai',
      })

      const savingsPage = new SavingsPageObject(page)

      await savingsPage.clickDepositButtonAction('USDT')

      const depositDialog = new SavingsDepositDialogPageObject(page)
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
      const blockNumber = 20025569n
      const fork = setupFork({ blockNumber, chainId: mainnet.id })

      test('can switch between tokens', async ({ page }) => {
        await setup(page, fork, {
          initialPage: 'savings',
          account: {
            type: 'connected',
            assetBalances: {
              ETH: 1,
              DAI: 100,
              USDC: 100,
              USDT: 100,
            },
            privateKey: LIFI_TEST_USER_PRIVATE_KEY,
          },
        })
        await overrideLiFiRouteWithHAR({
          page,
          key: 'mainnet-deposit-switch-tokens',
        })

        const savingsPage = new SavingsPageObject(page)

        await savingsPage.clickDepositButtonAction('DAI')

        const depositDialog = new SavingsDepositDialogPageObject(page)
        const actionsContainer = new ActionsPageObject(depositDialog.locatePanelByHeader('Actions'))

        await depositDialog.fillAmountAction(100)
        await actionsContainer.expectNextActionEnabled()
        await actionsContainer.expectActions(
          [
            { type: 'approve', asset: 'DAI', amount: 100 },
            { type: 'nativeSDaiDeposit', asset: 'DAI', amount: 100 },
          ],
          true,
        )

        await depositDialog.selectAssetAction('USDC')
        await depositDialog.fillAmountAction(100)
        await actionsContainer.expectNextActionEnabled()
        await actionsContainer.expectActions(
          [
            { type: 'approve', asset: 'USDC', amount: 100 },
            { type: 'exchange', inputAsset: 'USDC', outputAsset: 'sDAI', amount: 100 },
          ],
          true,
        )

        await depositDialog.selectAssetAction('USDT')
        await depositDialog.fillAmountAction(100)
        await actionsContainer.expectNextActionEnabled()
        await actionsContainer.expectActions(
          [
            { type: 'approve', asset: 'USDT', amount: 100 },
            { type: 'exchange', inputAsset: 'USDT', outputAsset: 'sDAI', amount: 100 },
          ],
          true,
        )

        await depositDialog.selectAssetAction('DAI')
        await depositDialog.fillAmountAction(100)
        await actionsContainer.expectNextActionEnabled()
        await actionsContainer.expectActions(
          [
            { type: 'approve', asset: 'DAI', amount: 100 },
            { type: 'nativeSDaiDeposit', asset: 'DAI', amount: 100 },
          ],
          true,
        )
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
              XDAI: 200,
              USDC: 100,
              USDT: 100,
            },
            privateKey: LIFI_TEST_USER_PRIVATE_KEY,
          },
        })
        await overrideLiFiRouteWithHAR({
          page,
          key: 'gnosis-deposit-switch-tokens',
        })

        const savingsPage = new SavingsPageObject(page)

        await savingsPage.clickDepositButtonAction('XDAI')

        const depositDialog = new SavingsDepositDialogPageObject(page)
        const actionsContainer = new ActionsPageObject(depositDialog.locatePanelByHeader('Actions'))

        await depositDialog.fillAmountAction(100)
        await actionsContainer.expectNextActionEnabled()
        await actionsContainer.expectActions(
          [{ type: 'exchange', inputAsset: 'XDAI', outputAsset: 'sDAI', amount: 100 }],
          true,
        )

        await depositDialog.selectAssetAction('USDC')
        await depositDialog.fillAmountAction(100)
        await actionsContainer.expectNextActionEnabled()
        await actionsContainer.expectActions(
          [
            { type: 'approve', asset: 'USDC', amount: 100 },
            { type: 'exchange', inputAsset: 'USDC', outputAsset: 'sDAI', amount: 100 },
          ],
          true,
        )

        await depositDialog.selectAssetAction('USDT')
        await depositDialog.fillAmountAction(100)
        await actionsContainer.expectNextActionEnabled()
        await actionsContainer.expectActions(
          [
            { type: 'approve', asset: 'USDT', amount: 100 },
            { type: 'exchange', inputAsset: 'USDT', outputAsset: 'sDAI', amount: 100 },
          ],
          true,
        )

        await depositDialog.selectAssetAction('XDAI')
        await depositDialog.fillAmountAction(100)
        await actionsContainer.expectNextActionEnabled()
        await actionsContainer.expectActions(
          [{ type: 'exchange', inputAsset: 'XDAI', outputAsset: 'sDAI', amount: 100 }],
          true,
        )
      })
    })
  })
})
