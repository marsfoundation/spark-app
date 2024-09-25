import { FarmDetailsPageObject } from '@/features/farm-details/FarmDetails.PageObject'
import { USDS_ACTIVATED_BLOCK_NUMBER } from '@/test/e2e/constants'
import { setupFork } from '@/test/e2e/forking/setupFork'
import { overrideInfoSkyRouteWithHAR } from '@/test/e2e/info-sky'
import { setup } from '@/test/e2e/setup'
import { test } from '@playwright/test'
import { mainnet } from 'viem/chains'
import { StakeDialogPageObject } from '../../StakeDialog.PageObject'

test.describe('Stake sDAI to SKY farm', () => {
  const fork = setupFork({ blockNumber: USDS_ACTIVATED_BLOCK_NUMBER, chainId: mainnet.id, useTenderlyVnet: true })
  let farmDetailsPage: FarmDetailsPageObject
  let stakeDialog: StakeDialogPageObject

  test.beforeEach(async ({ page }) => {
    await setup(page, fork, {
      initialPage: 'farmDetails',
      initialPageParams: {
        chainId: mainnet.id.toString(),
        address: '0x0650CAF159C5A49f711e8169D4336ECB9b950275',
      },
      account: {
        type: 'connected-random',
        assetBalances: {
          ETH: 1,
          sDAI: 1_000,
        },
      },
    })
    await overrideInfoSkyRouteWithHAR({ page, key: '2-sky-farm-with-12_07-apy' })

    farmDetailsPage = new FarmDetailsPageObject(page)
    await farmDetailsPage.clickInfoPanelStakeButtonAction()
    stakeDialog = new StakeDialogPageObject(page)
    await stakeDialog.selectAssetAction('sDAI')
    await stakeDialog.fillAmountAction(1_000)
  })

  test('has correct action plan', async () => {
    await stakeDialog.actionsContainer.expectEnabledActionAtIndex(0)
    await stakeDialog.actionsContainer.expectActions([
      { type: 'approve', asset: 'sDAI' },
      { type: 'withdrawFromSavings', savingsAsset: 'sDAI', asset: 'USDS', mode: 'withdraw' },
      { type: 'approve', asset: 'USDS' },
      { type: 'stake', stakingToken: 'USDS', rewardToken: 'SKY' },
    ])
  })

  test('displays transaction overview', async () => {
    await stakeDialog.expectTransactionOverview({
      estimatedRewards: {
        apy: '861.72%',
        description: 'Earn ~143,505.01 SKY/year',
      },
      route: {
        swaps: [
          {
            tokenAmount: '1,000.00 sDAI',
            tokenUsdValue: '$1,108.59',
          },
          {
            tokenAmount: '1,108.59 USDS',
            tokenUsdValue: '$1,108.59',
          },
        ],
        final: {
          upperText: 'SKY Farm',
          lowerText: 'Staked',
        },
      },
      outcome: '1,108.59 USDS ($1,108.59) staked in SKY Farm',
    })
  })

  test('executes transaction', async () => {
    await stakeDialog.actionsContainer.acceptAllActionsAction(4)

    await stakeDialog.expectSuccessPage()
    await stakeDialog.clickBackToFarmAction()

    await farmDetailsPage.expectTokenToDepositBalance('sDAI', '-')
    await farmDetailsPage.expectTokenToDepositBalance('USDS', '-') // no dust left
    await farmDetailsPage.expectStaked({
      stake: '1,108.59 USDS',
      reward: '0.01',
    })
  })
})
