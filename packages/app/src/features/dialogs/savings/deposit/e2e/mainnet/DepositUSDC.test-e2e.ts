import { ActionsPageObject } from '@/features/actions/ActionsContainer.PageObject'
import { SavingsPageObject } from '@/pages/Savings.PageObject'
import { USDS_ACTIVATED_BLOCK_NUMBER } from '@/test/e2e/constants'
import { setupFork } from '@/test/e2e/forking/setupFork'
import { setup } from '@/test/e2e/setup'
import { test } from '@playwright/test'
import { mainnet } from 'viem/chains'
import { SavingsDialogPageObject } from '../../../common/e2e/SavingsDialog.PageObject'

test.describe('Deposit USDC', () => {
  const fork = setupFork({ blockNumber: USDS_ACTIVATED_BLOCK_NUMBER, chainId: mainnet.id, useTenderlyVnet: true })
  let savingsPage: SavingsPageObject
  let depositDialog: SavingsDialogPageObject

  test.beforeEach(async ({ page }) => {
    await setup(page, fork, {
      initialPage: 'savings',
      account: {
        type: 'connected-random',
        assetBalances: {
          ETH: 1,
          USDC: 10_000,
        },
      },
    })

    savingsPage = new SavingsPageObject(page)
    await savingsPage.clickDepositButtonAction('USDC')

    depositDialog = new SavingsDialogPageObject({ page, type: 'deposit' })
    await depositDialog.fillAmountAction(10_000)
  })

  test.describe('To sUSDS', () => {
    test('uses PSM actions native deposit', async () => {
      await depositDialog.actionsContainer.expectActions([
        { type: 'approve', asset: 'USDC' },
        { type: 'depositToSavings', asset: 'USDC', savingsAsset: 'sUSDS' },
      ])
    })

    test('displays transaction overview', async () => {
      await depositDialog.expectNativeRouteTransactionOverview({
        apy: {
          value: '6.25%',
          description: '~625.00 USDS per year',
        },
        routeItems: [
          {
            tokenAmount: '20,000.00 USDC',
            tokenUsdValue: '$10,000.00',
          },
          {
            tokenAmount: '10,000.00 USDS',
            tokenUsdValue: '$10,000.00',
          },
          {
            tokenAmount: '9,999.77 sUSDS',
            tokenUsdValue: '$10,000.00',
          },
        ],
        outcome: '9,999.77 sUSDS worth $10,000.00',
        badgeToken: 'USDC',
      })
    })

    test('executes deposit', async () => {
      const actionsContainer = new ActionsPageObject(depositDialog.locatePanelByHeader('Actions'))
      await actionsContainer.acceptAllActionsAction(2)

      await depositDialog.expectSuccessPage()
      await depositDialog.clickBackToSavingsButton()

      await savingsPage.expectSavingsUSDSBalance({ sUsdsBalance: '9,999.77 sUSDS', estimatedUsdsValue: '10,000' })
      await savingsPage.expectStablecoinsInWalletAssetBalance('USDC', '-')
    })
  })

  test.describe('To sDAI', () => {
    test.beforeEach(async () => {
      await depositDialog.clickUpgradeSwitch()
    })

    test('uses PSM actions native deposit', async () => {
      await depositDialog.actionsContainer.expectActions([
        { type: 'approve', asset: 'USDC' },
        { type: 'depositToSavings', asset: 'USDC', savingsAsset: 'sDAI' },
      ])
    })

    test('displays transaction overview', async () => {
      await depositDialog.expectNativeRouteTransactionOverview({
        apy: {
          value: '6.00%',
          description: '~600.00 DAI per year',
        },
        routeItems: [
          {
            tokenAmount: '10,000.00 USDC',
            tokenUsdValue: '$10,000.00',
          },
          {
            tokenAmount: '10,000.00 DAI',
            tokenUsdValue: '$10,000.00',
          },
          {
            tokenAmount: '9,020.46 sDAI',
            tokenUsdValue: '$10,000.00',
          },
        ],
        outcome: '9,020.46 sDAI worth $10,000.00',
        badgeToken: 'USDC',
      })
    })

    test('executes deposit', async () => {
      const actionsContainer = new ActionsPageObject(depositDialog.locatePanelByHeader('Actions'))
      await actionsContainer.acceptAllActionsAction(2)

      await depositDialog.expectSuccessPage()
      await depositDialog.clickBackToSavingsButton()

      await savingsPage.expectSavingsDAIBalance({ sDaiBalance: '9,020.46 sDAI', estimatedDaiValue: '10,000' })
      await savingsPage.expectStablecoinsInWalletAssetBalance('USDC', '-')
    })
  })
})
