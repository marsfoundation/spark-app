import { ActionsPageObject } from '@/features/actions/ActionsContainer.PageObject'
import { SavingsPageObject } from '@/pages/Savings.PageObject'
import { DEFAULT_BLOCK_NUMBER, GNOSIS_DEFAULT_BLOCK_NUMBER, PSM_ACTIONS_DEPLOYED } from '@/test/e2e/constants'
import { setupFork } from '@/test/e2e/forking/setupFork'
import { setup } from '@/test/e2e/setup'
import { test } from '@playwright/test'
import { gnosis, mainnet } from 'viem/chains'
import { SavingsDialogPageObject } from '../common/e2e/SavingsDialog.PageObject'

test.describe('Savings withdraw dialog', () => {
  test.describe('Mainnet', () => {
    const fork = setupFork({
      blockNumber: PSM_ACTIONS_DEPLOYED,
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
            sDAI: 1000,
          },
        },
      })

      const savingsPage = new SavingsPageObject(page)

      await savingsPage.clickWithdrawButtonAction()

      const withdrawalDialog = new SavingsDialogPageObject({ page, type: 'withdraw' })
      const actionsContainer = new ActionsPageObject(withdrawalDialog.locatePanelByHeader('Actions'))

      await withdrawalDialog.fillAmountAction(1000)
      await actionsContainer.expectEnabledActionAtIndex(0)
      await actionsContainer.expectActions([{ type: 'daiFromSDaiWithdraw', asset: 'DAI', mode: 'withdraw' }])

      await withdrawalDialog.selectAssetAction('USDC')
      await withdrawalDialog.fillAmountAction(1000)
      await actionsContainer.expectEnabledActionAtIndex(0)
      await actionsContainer.expectActions([
        { type: 'approve', asset: 'sDAI' },
        { type: 'usdcFromSDaiWithdraw', asset: 'USDC', mode: 'withdraw' },
      ])

      await withdrawalDialog.selectAssetAction('DAI')
      await withdrawalDialog.fillAmountAction(1000)
      await actionsContainer.expectEnabledActionAtIndex(0)
      await actionsContainer.expectActions([{ type: 'daiFromSDaiWithdraw', asset: 'DAI', mode: 'withdraw' }])
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
            sDAI: 10_000,
          },
        },
      })

      savingsPage = new SavingsPageObject(page)
      await savingsPage.clickSendButtonAction()

      sendDialog = new SavingsDialogPageObject({ page, type: 'send' })
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
            sDAI: 10_000,
          },
        },
      })

      savingsPage = new SavingsPageObject(page)
      await savingsPage.clickSendButtonAction()

      sendDialog = new SavingsDialogPageObject({ page, type: 'send' })
    })

    test('can select only supported assets', async () => {
      await sendDialog.openAssetSelectorAction()
      await sendDialog.expectAssetSelectorOptions(['XDAI'])
    })
  })
})
