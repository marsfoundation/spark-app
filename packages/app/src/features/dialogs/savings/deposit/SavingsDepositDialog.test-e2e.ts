import { ActionsPageObject } from '@/features/actions/ActionsContainer.PageObject'
import { SavingsPageObject } from '@/pages/Savings.PageObject'
import { PSM_ACTIONS_DEPLOYED } from '@/test/e2e/constants'
import { setupFork } from '@/test/e2e/forking/setupFork'
import { setup } from '@/test/e2e/setup'
import { test } from '@playwright/test'
import { mainnet } from 'viem/chains'
import { SavingsDialogPageObject } from '../common/e2e/SavingsDialog.PageObject'

test.describe('Savings deposit dialog', () => {
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
            DAI: 100,
            USDC: 100,
          },
        },
      })

      const savingsPage = new SavingsPageObject(page)

      await savingsPage.clickDepositButtonAction('DAI')

      const depositDialog = new SavingsDialogPageObject({ page, type: 'deposit' })
      const actionsContainer = new ActionsPageObject(depositDialog.locatePanelByHeader('Actions'))

      await depositDialog.fillAmountAction(100)
      await actionsContainer.expectEnabledActionAtIndex(0)
      await actionsContainer.expectActions([
        { type: 'approve', asset: 'DAI' },
        { type: 'makerStableToSavings', asset: 'DAI' },
      ])

      await depositDialog.selectAssetAction('USDC')
      await depositDialog.fillAmountAction(100)
      await actionsContainer.expectEnabledActionAtIndex(0)
      await actionsContainer.expectActions([
        { type: 'approve', asset: 'USDC' },
        { type: 'usdcToSDaiDeposit', asset: 'USDC' },
      ])

      await depositDialog.selectAssetAction('DAI')
      await depositDialog.fillAmountAction(100)
      await actionsContainer.expectEnabledActionAtIndex(0)
      await actionsContainer.expectActions([
        { type: 'approve', asset: 'DAI' },
        { type: 'makerStableToSavings', asset: 'DAI' },
      ])
    })
  })
})
