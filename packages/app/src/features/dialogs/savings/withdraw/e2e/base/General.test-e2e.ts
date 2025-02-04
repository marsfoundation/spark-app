import { SavingsPageObject } from '@/pages/Savings.PageObject'
import { BASE_DEFAULT_BLOCK_NUMBER } from '@/test/e2e/constants'
import { setup } from '@/test/e2e/setup'
import { test } from '@playwright/test'
import { base } from 'viem/chains'
import { SavingsDialogPageObject } from '../../../common/e2e/SavingsDialog.PageObject'

test.describe('Without send mode', () => {
  test('can switch between tokens', async ({ page }) => {
    const testContext = await setup(page, {
      blockchain: {
        chainId: base.id,
        blockNumber: BASE_DEFAULT_BLOCK_NUMBER,
      },
      initialPage: 'savings',
      account: {
        type: 'connected-random',
        assetBalances: {
          ETH: 1,
          sUSDS: 1000,
        },
      },
    })

    const savingsPage = new SavingsPageObject(testContext)

    await savingsPage.clickWithdrawFromAccountButtonAction()

    const withdrawalDialog = new SavingsDialogPageObject({ testContext, type: 'withdraw' })

    await withdrawalDialog.fillAmountAction(1000)
    await withdrawalDialog.actionsContainer.expectEnabledActionAtIndex(0)
    await withdrawalDialog.actionsContainer.expectActions([
      { type: 'approve', asset: 'sUSDS' },
      { type: 'withdrawFromSavings', asset: 'USDS', savingsAsset: 'sUSDS', mode: 'withdraw' },
    ])

    await withdrawalDialog.selectAssetAction('USDC')
    await withdrawalDialog.fillAmountAction(1000)
    await withdrawalDialog.actionsContainer.expectEnabledActionAtIndex(0)
    await withdrawalDialog.actionsContainer.expectActions([
      { type: 'approve', asset: 'sUSDS' },
      { type: 'withdrawFromSavings', asset: 'USDC', savingsAsset: 'sUSDS', mode: 'withdraw' },
    ])

    await withdrawalDialog.selectAssetAction('USDS')
    await withdrawalDialog.fillAmountAction(1000)
    await withdrawalDialog.actionsContainer.expectEnabledActionAtIndex(0)
    await withdrawalDialog.actionsContainer.expectActions([
      { type: 'approve', asset: 'sUSDS' },
      { type: 'withdrawFromSavings', asset: 'USDS', savingsAsset: 'sUSDS', mode: 'withdraw' },
    ])
  })
})

test.describe('With send mode', () => {
  test('can select only supported assets', async ({ page }) => {
    const testContext = await setup(page, {
      blockchain: {
        chainId: base.id,
        blockNumber: BASE_DEFAULT_BLOCK_NUMBER,
      },
      initialPage: 'savings',
      account: {
        type: 'connected-random',
        assetBalances: {
          USDS: 100,
          sUSDS: 10_000,
        },
      },
    })

    const savingsPage = new SavingsPageObject(testContext)
    await savingsPage.clickSendFromAccountButtonAction()

    const sendDialog = new SavingsDialogPageObject({ testContext, type: 'send' })

    await sendDialog.openAssetSelectorAction()
    await sendDialog.expectAssetSelectorOptions(['USDS', 'USDC'])
  })
})
