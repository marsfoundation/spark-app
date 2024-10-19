import { ActionsPageObject } from '@/features/actions/ActionsContainer.PageObject'
import { SavingsPageObject } from '@/pages/Savings.PageObject'
import { DEFAULT_BLOCK_NUMBER, GNOSIS_DEFAULT_BLOCK_NUMBER, LITE_PSM_ACTIONS_OPERABLE } from '@/test/e2e/constants'
import { setupFork } from '@/test/e2e/forking/setupFork'
import { setup } from '@/test/e2e/setup'
import { test } from '@playwright/test'
import { base, gnosis, mainnet } from 'viem/chains'
import { SavingsDialogPageObject } from '../common/e2e/SavingsDialog.PageObject'

test.describe('Savings deposit dialog', () => {
  test.describe('Mainnet', () => {
    const fork = setupFork({
      blockNumber: LITE_PSM_ACTIONS_OPERABLE,
      chainId: mainnet.id,
      useTenderlyVnet: true,
    })

    test('can switch between tokens', async ({ page }) => {
      await setup(page, fork, {
        initialPage: 'savings',
        account: {
          type: 'connected-random',
          assetBalances: {
            ETH: 1,
            DAI: 1000,
            USDC: 1000,
          },
        },
      })

      const savingsPage = new SavingsPageObject(page)

      await savingsPage.clickStartSavingButtonAction()

      const depositDialog = new SavingsDialogPageObject({ page, type: 'deposit' })
      const actionsContainer = new ActionsPageObject(depositDialog.locatePanelByHeader('Actions'))

      await depositDialog.fillAmountAction(1000)
      await actionsContainer.expectEnabledActionAtIndex(0)
      await actionsContainer.expectActions([
        { type: 'approve', asset: 'DAI' },
        { type: 'depositToSavings', asset: 'DAI', savingsAsset: 'sDAI' },
      ])

      await depositDialog.selectAssetAction('USDC')
      await depositDialog.fillAmountAction(1000)
      await actionsContainer.expectEnabledActionAtIndex(0)
      await actionsContainer.expectActions([
        { type: 'approve', asset: 'USDC' },
        { type: 'depositToSavings', asset: 'USDC', savingsAsset: 'sDAI' },
      ])

      await depositDialog.selectAssetAction('DAI')
      await depositDialog.fillAmountAction(1000)
      await actionsContainer.expectEnabledActionAtIndex(0)
      await actionsContainer.expectActions([
        { type: 'approve', asset: 'DAI' },
        { type: 'depositToSavings', asset: 'DAI', savingsAsset: 'sDAI' },
      ])
    })
  })

  test.describe('Base', () => {
    const fork = setupFork({
      chainId: base.id,
    })

    test('can switch between tokens', async ({ page }) => {
      await setup(page, fork, {
        initialPage: 'savings',
        account: {
          type: 'connected-random',
          assetBalances: {
            ETH: 1,
            USDS: 2000,
            USDC: 1000,
          },
        },
      })

      const savingsPage = new SavingsPageObject(page)

      await savingsPage.clickStartSavingButtonAction()

      const depositDialog = new SavingsDialogPageObject({ page, type: 'deposit' })
      const actionsContainer = new ActionsPageObject(depositDialog.locatePanelByHeader('Actions'))

      await depositDialog.fillAmountAction(1000)
      await actionsContainer.expectEnabledActionAtIndex(0)
      await actionsContainer.expectActions([
        { type: 'approve', asset: 'USDS' },
        { type: 'depositToSavings', asset: 'USDS', savingsAsset: 'sUSDS' },
      ])

      await depositDialog.selectAssetAction('USDC')
      await depositDialog.fillAmountAction(1000)
      await actionsContainer.expectEnabledActionAtIndex(0)
      await actionsContainer.expectActions([
        { type: 'approve', asset: 'USDC' },
        { type: 'depositToSavings', asset: 'USDC', savingsAsset: 'sUSDS' },
      ])

      await depositDialog.selectAssetAction('USDS')
      await depositDialog.fillAmountAction(1000)
      await actionsContainer.expectEnabledActionAtIndex(0)
      await actionsContainer.expectActions([
        { type: 'approve', asset: 'USDS' },
        { type: 'depositToSavings', asset: 'USDS', savingsAsset: 'sUSDS' },
      ])
    })
  })
})

test.describe('Savings withdraw dialog send mode', () => {
  test.describe('Mainnet', () => {
    const fork = setupFork({ blockNumber: DEFAULT_BLOCK_NUMBER, chainId: mainnet.id, useTenderlyVnet: true })
    let savingsPage: SavingsPageObject
    let sendDialog: SavingsDialogPageObject

    test.beforeEach(async ({ page }) => {
      await setup(page, fork, {
        initialPage: 'savings',
        account: {
          type: 'connected-random',
          assetBalances: {
            ETH: 1,
            DAI: 10_000,
          },
        },
      })

      savingsPage = new SavingsPageObject(page)
      await savingsPage.clickStartSavingButtonAction()

      sendDialog = new SavingsDialogPageObject({ page, type: 'deposit' })
    })

    test('can select only supported assets', async () => {
      await sendDialog.openAssetSelectorAction()
      await sendDialog.expectAssetSelectorOptions(['DAI', 'USDC'])
    })
  })

  test.describe('Gnosis', () => {
    const fork = setupFork({ blockNumber: GNOSIS_DEFAULT_BLOCK_NUMBER, chainId: gnosis.id, useTenderlyVnet: true })
    let savingsPage: SavingsPageObject
    let sendDialog: SavingsDialogPageObject

    test.beforeEach(async ({ page }) => {
      await setup(page, fork, {
        initialPage: 'savings',
        account: {
          type: 'connected-random',
          assetBalances: {
            XDAI: 100,
          },
        },
      })

      savingsPage = new SavingsPageObject(page)
      await savingsPage.clickStartSavingButtonAction()

      sendDialog = new SavingsDialogPageObject({ page, type: 'deposit' })
    })

    test('can select only supported assets', async () => {
      await sendDialog.openAssetSelectorAction()
      await sendDialog.expectAssetSelectorOptions(['XDAI'])
    })
  })

  test.describe('Base', () => {
    const fork = setupFork({ chainId: base.id })
    let savingsPage: SavingsPageObject
    let sendDialog: SavingsDialogPageObject

    test.beforeEach(async ({ page }) => {
      await setup(page, fork, {
        initialPage: 'savings',
        account: {
          type: 'connected-random',
          assetBalances: {
            USDS: 100,
          },
        },
      })

      savingsPage = new SavingsPageObject(page)
      await savingsPage.clickStartSavingButtonAction()

      sendDialog = new SavingsDialogPageObject({ page, type: 'deposit' })
    })

    test('can select only supported assets', async () => {
      await sendDialog.openAssetSelectorAction()
      await sendDialog.expectAssetSelectorOptions(['USDC', 'USDS'])
    })
  })
})
