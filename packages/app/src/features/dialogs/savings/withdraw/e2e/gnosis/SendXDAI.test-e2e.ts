import { SavingsPageObject } from '@/pages/Savings.PageObject'
import { GNOSIS_DEFAULT_BLOCK_NUMBER } from '@/test/e2e/constants'
import { setup } from '@/test/e2e/setup'
import { randomAddress } from '@/test/utils/addressUtils'
import { test } from '@playwright/test'
import { gnosis } from 'viem/chains'
import { SavingsDialogPageObject } from '../../../common/e2e/SavingsDialog.PageObject'

test.describe('Send XDAI on Gnosis', () => {
  let savingsPage: SavingsPageObject
  let sendDialog: SavingsDialogPageObject
  const receiver = randomAddress('bob')
  const amount = 7000

  test.beforeEach(async ({ page }) => {
    const testContext = await setup(page, {
      blockchain: {
        chain: gnosis,
        blockNumber: GNOSIS_DEFAULT_BLOCK_NUMBER,
      },
      initialPage: 'savings',
      account: {
        type: 'connected-random',
        assetBalances: {
          XDAI: 100,
          sDAI: 10_000,
        },
      },
    })

    savingsPage = new SavingsPageObject(testContext)
    await savingsPage.clickSendSDaiButtonAction()

    sendDialog = new SavingsDialogPageObject({ testContext, type: 'send' })
    await sendDialog.fillAmountAction(amount)
    await sendDialog.fillReceiverAction(receiver)
  })

  test('uses native sDai withdraw and send', async () => {
    await sendDialog.actionsContainer.expectActions([
      { type: 'approve', asset: 'sDAI' },
      { type: 'withdrawFromSavings', asset: 'XDAI', savingsAsset: 'sDAI', mode: 'send' },
    ])
  })

  test('displays transaction overview', async () => {
    await sendDialog.expectNativeRouteTransactionOverview({
      routeItems: [
        {
          tokenAmount: '6,434.95 sDAI',
          tokenUsdValue: '$7,000.00',
        },
        {
          tokenAmount: '7,000.00 XDAI',
          tokenUsdValue: '$7,000.00',
        },
      ],
      outcome: '7,000.00 XDAI',
      outcomeUsd: '$7,000.00',
    })
  })

  test('executes send', async () => {
    await sendDialog.expectReceiverBalance({
      receiver,
      expectedBalance: 0,
    })

    await sendDialog.actionsContainer.acceptAllActionsAction(2)
    await sendDialog.expectSuccessPage()

    await sendDialog.expectReceiverBalance({
      receiver,
      expectedBalance: amount,
    })

    await sendDialog.clickBackToSavingsButton()
    await savingsPage.expectSavingsDaiBalance({ sdaiBalance: '3,565.05 sDAI', estimatedDaiValue: '3,878.094168' })
    await savingsPage.expectStablecoinsInWalletAssetBalance('XDAI', '100')
  })
})
