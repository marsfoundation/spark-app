import { ActionsPageObject } from '@/features/actions/ActionsContainer.PageObject'
import { SavingsPageObject } from '@/pages/Savings.PageObject'
import { LIFI_TEST_USER_PRIVATE_KEY, overrideLiFiRouteWithHAR } from '@/test/e2e/lifi'
import { setup } from '@/test/e2e/setup'
import { setupFork } from '@/test/e2e/setupFork'
import { test } from '@playwright/test'
import { gnosis, mainnet } from 'viem/chains'
import { SavingsDialogPageObject } from '../common/e2e/SavingsDialog.PageObject'

test.describe('Savings deposit dialog', () => {
  test.describe('Slippage', () => {
    const blockNumber = 20089938n
    const fork = setupFork({ blockNumber, chainId: mainnet.id })

    test('default', async ({ page }) => {
      await setup(page, fork, {
        initialPage: 'savings',
        account: {
          type: 'connected',
          assetBalances: {
            ETH: 1,
            USDT: 100,
          },
          privateKey: LIFI_TEST_USER_PRIVATE_KEY,
        },
      })
      const expectedDefaultSlippage = 0.001

      await overrideLiFiRouteWithHAR({
        page,
        key: '100-usdt-to-sdai-slippage-0.001',
      })

      const savingsPage = new SavingsPageObject(page)

      await savingsPage.clickDepositButtonAction('USDT')

      const depositDialog = new SavingsDialogPageObject({ page, type: 'deposit' })
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
            USDT: 100,
          },
          privateKey: LIFI_TEST_USER_PRIVATE_KEY,
        },
      })
      const newSlippage = 0.005

      await overrideLiFiRouteWithHAR({
        page,
        key: '100-usdt-to-sdai-slippage-0.005',
      })

      const savingsPage = new SavingsPageObject(page)

      await savingsPage.clickDepositButtonAction('USDT')

      const depositDialog = new SavingsDialogPageObject({ page, type: 'deposit' })
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
            USDT: 100,
          },
          privateKey: LIFI_TEST_USER_PRIVATE_KEY,
        },
      })
      const newSlippage = 0.007

      await overrideLiFiRouteWithHAR({
        page,
        key: '100-usdt-to-sdai-slippage-0.007',
      })

      const savingsPage = new SavingsPageObject(page)

      await savingsPage.clickDepositButtonAction('USDT')

      const depositDialog = new SavingsDialogPageObject({ page, type: 'deposit' })
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
              USDT: 100,
            },
            privateKey: LIFI_TEST_USER_PRIVATE_KEY,
          },
        })
        const newSlippage = 0.5
        const expectedDefaultSlippage = 0.001

        await overrideLiFiRouteWithHAR({
          page,
          key: '100-usdt-to-sdai-slippage-0.001',
        })

        const savingsPage = new SavingsPageObject(page)

        await savingsPage.clickDepositButtonAction('USDT')

        const depositDialog = new SavingsDialogPageObject({ page, type: 'deposit' })
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
              USDT: 100,
            },
            privateKey: LIFI_TEST_USER_PRIVATE_KEY,
          },
        })
        const newSlippage = 0
        const expectedDefaultSlippage = 0.001

        await overrideLiFiRouteWithHAR({
          page,
          key: '100-usdt-to-sdai-slippage-0.001',
        })

        const savingsPage = new SavingsPageObject(page)

        await savingsPage.clickDepositButtonAction('USDT')

        const depositDialog = new SavingsDialogPageObject({ page, type: 'deposit' })
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
              USDT: 100,
            },
            privateKey: LIFI_TEST_USER_PRIVATE_KEY,
          },
        })
        const expectedDefaultSlippage = 0.001

        await overrideLiFiRouteWithHAR({
          page,
          key: '100-usdt-to-sdai-slippage-0.001',
        })

        const savingsPage = new SavingsPageObject(page)

        await savingsPage.clickDepositButtonAction('USDT')

        const depositDialog = new SavingsDialogPageObject({ page, type: 'deposit' })
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

      const depositDialog = new SavingsDialogPageObject({ page, type: 'deposit' })
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

      const depositDialog = new SavingsDialogPageObject({ page, type: 'deposit' })
      await depositDialog.fillAmountAction(10000)
      await depositDialog.expectTransactionOverviewToBeVisible() // wait for lifi to load

      const actionsContainer = new ActionsPageObject(depositDialog.locatePanelByHeader('Actions'))
      await actionsContainer.expectDisabledActionAtIndex(0)

      await depositDialog.clickAcknowledgeRisk()
      await actionsContainer.expectEnabledActionAtIndex(0)
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

        const depositDialog = new SavingsDialogPageObject({ page, type: 'deposit' })
        const actionsContainer = new ActionsPageObject(depositDialog.locatePanelByHeader('Actions'))

        await depositDialog.fillAmountAction(100)
        await actionsContainer.expectEnabledActionAtIndex(0)
        await actionsContainer.expectActions([
          { type: 'approve', asset: 'DAI' },
          { type: 'daiToSDaiDeposit', asset: 'DAI' },
        ])

        await depositDialog.selectAssetAction('USDC')
        await depositDialog.fillAmountAction(100)
        await actionsContainer.expectEnabledActionAtIndex(0)
        await actionsContainer.expectActions([
          { type: 'approve', asset: 'USDC' },
          { type: 'usdcToSDaiDeposit', asset: 'USDC' },
        ])

        await depositDialog.selectAssetAction('USDT')
        await depositDialog.fillAmountAction(100)
        await actionsContainer.expectEnabledActionAtIndex(0)
        await actionsContainer.expectActions([
          { type: 'approve', asset: 'USDT' },
          { type: 'exchange', inputAsset: 'USDT', outputAsset: 'sDAI' },
        ])

        await depositDialog.selectAssetAction('DAI')
        await depositDialog.fillAmountAction(100)
        await actionsContainer.expectEnabledActionAtIndex(0)
        await actionsContainer.expectActions([
          { type: 'approve', asset: 'DAI' },
          { type: 'daiToSDaiDeposit', asset: 'DAI' },
        ])
      })
    })

    test.describe('Gnosis', () => {
      const blockNumber = 34309540n
      const fork = setupFork({
        blockNumber,
        chainId: gnosis.id,
        simulationDateOverride: new Date('2024-06-19T10:21:19Z'),
      })

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

        const depositDialog = new SavingsDialogPageObject({ page, type: 'deposit' })
        const actionsContainer = new ActionsPageObject(depositDialog.locatePanelByHeader('Actions'))

        await depositDialog.fillAmountAction(100)
        await actionsContainer.expectEnabledActionAtIndex(0)
        await actionsContainer.expectActions([{ type: 'xDaiToSDaiDeposit', asset: 'XDAI' }])

        await depositDialog.selectAssetAction('USDC')
        await depositDialog.fillAmountAction(100)
        await actionsContainer.expectEnabledActionAtIndex(0)
        await actionsContainer.expectActions([
          { type: 'approve', asset: 'USDC' },
          { type: 'exchange', inputAsset: 'USDC', outputAsset: 'sDAI' },
        ])

        await depositDialog.selectAssetAction('USDT')
        await depositDialog.fillAmountAction(100)
        await actionsContainer.expectEnabledActionAtIndex(0)
        await actionsContainer.expectActions([
          { type: 'approve', asset: 'USDT' },
          { type: 'exchange', inputAsset: 'USDT', outputAsset: 'sDAI' },
        ])

        await depositDialog.selectAssetAction('XDAI')
        await depositDialog.fillAmountAction(100)
        await actionsContainer.expectEnabledActionAtIndex(0)
        await actionsContainer.expectActions([{ type: 'xDaiToSDaiDeposit', asset: 'XDAI' }])
      })
    })
  })
})
