import { ActionsPageObject } from '@/features/actions/ActionsContainer.PageObject'
import { SavingsPageObject } from '@/pages/Savings.PageObject'
import { LIFI_TEST_USER_PRIVATE_KEY, overrideLiFiRouteWithHAR } from '@/test/e2e/lifi'
import { setup } from '@/test/e2e/setup'
import { setupFork } from '@/test/e2e/setupFork'
import { test } from '@playwright/test'
import { gnosis, mainnet } from 'viem/chains'
import { SavingsDialogPageObject } from '../common/e2e/SavingsDialog.PageObject'

test.describe('Savings withdraw dialog', () => {
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

      const withdrawalDialog = new SavingsDialogPageObject({ page, type: 'withdraw' })
      await withdrawalDialog.selectAssetAction('USDT')
      await withdrawalDialog.fillAmountAction(10000)

      await withdrawalDialog.expectDiscrepancyWarning('198.82 DAI')
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

      const withdrawalDialog = new SavingsDialogPageObject({ page, type: 'withdraw' })
      await withdrawalDialog.selectAssetAction('USDT')
      await withdrawalDialog.fillAmountAction(10000)
      await withdrawalDialog.expectTransactionOverviewToBeVisible() // wait for lifi to load

      const actionsContainer = new ActionsPageObject(withdrawalDialog.locatePanelByHeader('Actions'))
      await actionsContainer.expectDisabledActionAtIndex(0)

      await withdrawalDialog.clickAcknowledgeRisk()
      await actionsContainer.expectEnabledActionAtIndex(0)
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

        const withdrawalDialog = new SavingsDialogPageObject({ page, type: 'withdraw' })
        const actionsContainer = new ActionsPageObject(withdrawalDialog.locatePanelByHeader('Actions'))

        await withdrawalDialog.fillAmountAction(1000)
        await actionsContainer.expectEnabledActionAtIndex(0)
        await actionsContainer.expectActions([{ type: 'daiFromSDaiWithdraw', asset: 'DAI' }])

        await withdrawalDialog.selectAssetAction('USDC')
        await withdrawalDialog.fillAmountAction(1000)
        await actionsContainer.expectEnabledActionAtIndex(0)
        await actionsContainer.expectActions([
          { type: 'approve', asset: 'sDAI' },
          { type: 'usdcFromSDaiWithdraw', asset: 'USDC' },
        ])

        await withdrawalDialog.selectAssetAction('USDT')
        await withdrawalDialog.fillAmountAction(1000)
        await actionsContainer.expectEnabledActionAtIndex(0)
        await actionsContainer.expectActions([
          { type: 'approve', asset: 'sDAI' },
          { type: 'exchange', inputAsset: 'sDAI', outputAsset: 'USDT' },
        ])

        await withdrawalDialog.selectAssetAction('DAI')
        await withdrawalDialog.fillAmountAction(1000)
        await actionsContainer.expectEnabledActionAtIndex(0)
        await actionsContainer.expectActions([{ type: 'daiFromSDaiWithdraw', asset: 'DAI' }])
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

        const withdrawalDialog = new SavingsDialogPageObject({ page, type: 'withdraw' })
        const actionsContainer = new ActionsPageObject(withdrawalDialog.locatePanelByHeader('Actions'))

        await withdrawalDialog.fillAmountAction(1000)
        await actionsContainer.expectEnabledActionAtIndex(0)
        await actionsContainer.expectActions([
          { type: 'approve', asset: 'sDAI' },
          { type: 'xDaiFromSDaiWithdraw', asset: 'XDAI' },
        ])

        await withdrawalDialog.selectAssetAction('USDC')
        await withdrawalDialog.fillAmountAction(1000)
        await actionsContainer.expectEnabledActionAtIndex(0)
        await actionsContainer.expectActions([
          { type: 'approve', asset: 'sDAI' },
          { type: 'exchange', inputAsset: 'sDAI', outputAsset: 'USDC' },
        ])

        await withdrawalDialog.selectAssetAction('USDT')
        await withdrawalDialog.fillAmountAction(1000)
        await actionsContainer.expectEnabledActionAtIndex(0)
        await actionsContainer.expectActions([
          { type: 'approve', asset: 'sDAI' },
          { type: 'exchange', inputAsset: 'sDAI', outputAsset: 'USDT' },
        ])

        await withdrawalDialog.selectAssetAction('XDAI')
        await withdrawalDialog.fillAmountAction(1000)
        await actionsContainer.expectEnabledActionAtIndex(0)
        await actionsContainer.expectActions([
          { type: 'approve', asset: 'sDAI' },
          { type: 'xDaiFromSDaiWithdraw', asset: 'XDAI' },
        ])
      })
    })
  })
})
