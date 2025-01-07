import { SavingsPageObject } from '@/pages/Savings.PageObject'
import { DEFAULT_BLOCK_NUMBER } from '@/test/e2e/constants'
import { setup } from '@/test/e2e/setup'
import { test } from '@playwright/test'
import { mainnet } from 'viem/chains'
import { SavingsDialogPageObject } from '../../../common/e2e/SavingsDialog.PageObject'

test.describe('Without send mode', () => {
  let withdrawalDialog: SavingsDialogPageObject
  let savingsPage: SavingsPageObject

  test.beforeEach(async ({ page }) => {
    const testContext = await setup(page, {
      blockchain: {
        chainId: mainnet.id,
        blockNumber: DEFAULT_BLOCK_NUMBER,
      },
      initialPage: 'savings',
      account: {
        type: 'connected-random',
        assetBalances: {
          ETH: 1,
          sDAI: 1000,
        },
      },
    })

    savingsPage = new SavingsPageObject(testContext)
    await savingsPage.clickWithdrawSDaiButtonAction()

    withdrawalDialog = new SavingsDialogPageObject({ testContext, type: 'withdraw' })
  })

  test('can switch between tokens', async () => {
    await withdrawalDialog.fillAmountAction(1000)
    await withdrawalDialog.actionsContainer.expectEnabledActionAtIndex(0)
    await withdrawalDialog.actionsContainer.expectActions([
      { type: 'withdrawFromSavings', asset: 'DAI', savingsAsset: 'sDAI', mode: 'withdraw' },
    ])

    await withdrawalDialog.selectAssetAction('USDC')
    await withdrawalDialog.fillAmountAction(1000)
    await withdrawalDialog.actionsContainer.expectEnabledActionAtIndex(0)
    await withdrawalDialog.actionsContainer.expectActions([
      { type: 'approve', asset: 'sDAI' },
      { type: 'withdrawFromSavings', asset: 'USDC', savingsAsset: 'sDAI', mode: 'withdraw' },
    ])

    await withdrawalDialog.selectAssetAction('DAI')
    await withdrawalDialog.fillAmountAction(1000)
    await withdrawalDialog.actionsContainer.expectEnabledActionAtIndex(0)
    await withdrawalDialog.actionsContainer.expectActions([
      { type: 'withdrawFromSavings', asset: 'DAI', savingsAsset: 'sDAI', mode: 'withdraw' },
    ])
  })

  test('can click max after switching tokens', async () => {
    await withdrawalDialog.expectInputValue('')
    await withdrawalDialog.clickMaxAmountAction()
    await withdrawalDialog.expectInputValue('1125.599162')
    await withdrawalDialog.selectAssetAction('USDC')
    await withdrawalDialog.expectInputValue('')
    await withdrawalDialog.clickMaxAmountAction()
    await withdrawalDialog.expectInputValue('1125.599162')
  })
})

test.describe('With send mode', () => {
  test('can select only supported assets', async ({ page }) => {
    const testContext = await setup(page, {
      blockchain: {
        chainId: mainnet.id,
        blockNumber: DEFAULT_BLOCK_NUMBER,
      },
      initialPage: 'savings',
      account: {
        type: 'connected-random',
        assetBalances: {
          ETH: 1,
          sDAI: 10_000,
        },
      },
    })

    const savingsPage = new SavingsPageObject(testContext)
    await savingsPage.clickSendSDaiButtonAction()

    const sendDialog = new SavingsDialogPageObject({ testContext, type: 'send' })

    await sendDialog.openAssetSelectorAction()
    await sendDialog.expectAssetSelectorOptions(['DAI', 'USDC', 'USDS'])
  })
})
