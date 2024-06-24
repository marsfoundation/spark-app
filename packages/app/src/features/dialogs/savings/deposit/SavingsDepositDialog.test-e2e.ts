import { ActionsPageObject } from '@/features/actions/ActionsContainer.PageObject'
import { SavingsPageObject } from '@/pages/Savings.PageObject'
import { LIFI_TEST_USER_PRIVATE_KEY, overrideLiFiRouteWithHAR } from '@/test/e2e/lifi'
import { setup } from '@/test/e2e/setup'
import { setupFork } from '@/test/e2e/setupFork'
import { test } from '@playwright/test'
import { gnosis, mainnet } from 'viem/chains'
import { SavingsDialogPageObject } from '../common/e2e/SavingsDialog.PageObject'

test.describe('Savings deposit dialog', () => {
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
