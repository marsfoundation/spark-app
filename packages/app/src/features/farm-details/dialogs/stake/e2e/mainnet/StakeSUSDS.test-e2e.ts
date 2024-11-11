import { SavingsDialogPageObject } from '@/features/dialogs/savings/common/e2e/SavingsDialog.PageObject'
import { FarmDetailsPageObject } from '@/features/farm-details/FarmDetails.PageObject'
import { SavingsPageObject } from '@/pages/Savings.PageObject'
import { USDS_ACTIVATED_BLOCK_NUMBER } from '@/test/e2e/constants'
import { setupFork } from '@/test/e2e/forking/setupFork'
import { overrideInfoSkyRouteWithHAR } from '@/test/e2e/info-sky'
import { buildUrl, setup } from '@/test/e2e/setup'
import { test } from '@playwright/test'
import { mainnet } from 'viem/chains'
import { StakeDialogPageObject } from '../../StakeDialog.PageObject'

test.describe('Stake sDAI to SKY farm', () => {
  const fork = setupFork({ blockNumber: USDS_ACTIVATED_BLOCK_NUMBER, chainId: mainnet.id, useTenderlyVnet: true })
  let farmDetailsPage: FarmDetailsPageObject
  let stakeDialog: StakeDialogPageObject

  test.beforeEach(async ({ page }) => {
    await setup(page, fork, {
      initialPage: 'savings',
      account: {
        type: 'connected-random',
        assetBalances: {
          ETH: 1,
          USDS: 1_100,
        },
      },
    })
    await overrideInfoSkyRouteWithHAR({ page, key: '1-sky-farm-with-8_51-apy' })

    // deposit some tokens to sUSDS first so we're able to withdraw them next
    const savingsPage = new SavingsPageObject(page)
    await savingsPage.clickDepositButtonAction('USDS')
    const depositToSavingsDialog = new SavingsDialogPageObject({ page, type: 'deposit' })
    await depositToSavingsDialog.clickMaxAmountAction()
    await depositToSavingsDialog.actionsContainer.acceptAllActionsAction(2)
    await depositToSavingsDialog.clickBackToSavingsButton()
    await page.goto(
      buildUrl('farmDetails', {
        chainId: mainnet.id.toString(),
        address: '0x0650CAF159C5A49f711e8169D4336ECB9b950275',
      }),
    )

    farmDetailsPage = new FarmDetailsPageObject(page)
    await farmDetailsPage.clickInfoPanelStakeButtonAction()
    stakeDialog = new StakeDialogPageObject(page)
    await stakeDialog.selectAssetAction('sUSDS')
    await stakeDialog.fillAmountAction(1_000)
  })

  test('has correct action plan', async () => {
    await stakeDialog.actionsContainer.expectEnabledActionAtIndex(0)
    await stakeDialog.actionsContainer.expectActions([
      { type: 'withdrawFromSavings', savingsAsset: 'sUSDS', asset: 'USDS', mode: 'withdraw' },
      { type: 'approve', asset: 'USDS' },
      { type: 'stake', stakingToken: 'USDS', rewardToken: 'SKY' },
    ])
  })

  test('displays transaction overview', async () => {
    await stakeDialog.expectTransactionOverview({
      estimatedRewards: {
        apy: '780.23%',
        description: 'Earn ~129,451.12 SKY/year',
      },
      route: {
        swaps: [
          {
            tokenAmount: '1,000.00 sUSDS',
            tokenUsdValue: '$1,000.02',
          },
          {
            tokenAmount: '1,000.02 USDS',
            tokenUsdValue: '$1,000.02',
          },
        ],
        final: {
          upperText: 'SKY Farm',
          lowerText: 'Deposited',
        },
      },
      outcome: '1,000.02 USDS',
    })
  })

  test('executes transaction', async () => {
    await stakeDialog.actionsContainer.acceptAllActionsAction(3)

    await stakeDialog.expectSuccessPage()
    await stakeDialog.clickBackToFarmAction()

    await farmDetailsPage.expectTokenToDepositBalance('USDS', '-') // no dust left
    await farmDetailsPage.expectReward({
      reward: '0.01',
      rewardUsd: '<$0.01',
    })
    await farmDetailsPage.expectStaked('1,000.02 USDS')
  })
})
