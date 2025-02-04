import { SavingsPageObject } from '@/pages/Savings.PageObject'
import { GNOSIS_DEFAULT_BLOCK_NUMBER } from '@/test/e2e/constants'
import { setup } from '@/test/e2e/setup'
import { test } from '@playwright/test'
import { gnosis } from 'viem/chains'
import { SavingsDialogPageObject } from '../../../common/e2e/SavingsDialog.PageObject'

test.describe('With send mode', () => {
  test('can select only supported assets', async ({ page }) => {
    const testContext = await setup(page, {
      blockchain: {
        chainId: gnosis.id,
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

    const savingsPage = new SavingsPageObject(testContext)
    await savingsPage.clickSendFromAccountButtonAction()

    const sendDialog = new SavingsDialogPageObject({ testContext, type: 'send' })

    await sendDialog.openAssetSelectorAction()
    await sendDialog.expectAssetSelectorOptions(['XDAI'])
  })
})
