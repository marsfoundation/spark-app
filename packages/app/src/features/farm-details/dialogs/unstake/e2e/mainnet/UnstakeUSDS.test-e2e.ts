import { FarmDetailsPageObject } from '@/features/farm-details/FarmDetails.PageObject'
import { USDS_ACTIVATED_BLOCK_NUMBER } from '@/test/e2e/constants'
import { setupFork } from '@/test/e2e/forking/setupFork'
import { overrideInfoSkyRouteWithHAR } from '@/test/e2e/info-sky'
import { setup } from '@/test/e2e/setup'
import { test } from '@playwright/test'
import { mainnet } from 'viem/chains'
import { StakeDialogPageObject } from '../../../stake/StakeDialog.PageObject'
import { UnstakeDialogPageObject } from '../../UnstakeDialog.PageObject'

test.describe('Unstake USDS from SKY farm', () => {
  const fork = setupFork({ blockNumber: USDS_ACTIVATED_BLOCK_NUMBER, chainId: mainnet.id, useTenderlyVnet: true })
  let farmDetailsPage: FarmDetailsPageObject
  let unstakeDialog: UnstakeDialogPageObject
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
          DAI: 10_000,
          USDS: 10_000,
        },
      },
    })
    await overrideInfoSkyRouteWithHAR({ page, key: '2-sky-farm-with-12_07-apy' })

    farmDetailsPage = new FarmDetailsPageObject(page)
    await farmDetailsPage.clickInfoPanelStakeButtonAction()
    stakeDialog = new StakeDialogPageObject(page)

    await stakeDialog.selectAssetAction('DAI')
    await stakeDialog.fillAmountAction(10_000)
    await stakeDialog.actionsContainer.acceptAllActionsAction(4)

    await stakeDialog.clickBackToFarmAction()

    await fork.progressSimulation(page, 24 * 60 * 60) // 24 hours
    await page.reload()

    await farmDetailsPage.clickInfoPanelUnstakeButtonAction()
    unstakeDialog = new UnstakeDialogPageObject(page)

    await unstakeDialog.selectAssetAction('USDS')
    await unstakeDialog.fillAmountAction(5_000)
  })

  test('has exit farm switch hidden', async () => {
    await unstakeDialog.expectExitFarmSwitchToBeHidden()
  })

  test('has correct action plan', async () => {
    await unstakeDialog.actionsContainer.expectActions([
      { type: 'unstake', stakingToken: 'USDS', rewardToken: 'SKY', exit: false },
    ])
  })

  test('displays transaction overview', async () => {
    await unstakeDialog.expectTransactionOverview({
      route: {
        swaps: [
          {
            tokenAmount: '5,000.00 USDS',
            tokenUsdValue: '$5,000.00',
          },
        ],
        farm: {
          upperText: 'SKY Farm',
          lowerText: 'Deposited',
        },
      },
      outcome: '5,000.00 USDS worth $5,000.00',
    })
  })

  test('executes transaction', async () => {
    await unstakeDialog.actionsContainer.acceptAllActionsAction(1)

    await unstakeDialog.expectSuccessPage()
    await unstakeDialog.clickBackToFarmAction()

    await farmDetailsPage.expectTokenToDepositBalance('USDS', '15,000.00')
    await farmDetailsPage.expectTokenToDepositBalance('DAI', '-')
    await farmDetailsPage.expectReward({
      reward: '3,539',
      rewardUsd: '$235',
    })
    await farmDetailsPage.expectStaked('5,000.00 USDS')
  })
})
