import { FarmDetailsPageObject } from '@/features/farm-details/FarmDetails.PageObject'
import { StakeDialogPageObject } from '@/features/farm-details/dialogs/stake/StakeDialog.PageObject'
import { USDS_ACTIVATED_BLOCK_NUMBER } from '@/test/e2e/constants'
import { setupFork } from '@/test/e2e/forking/setupFork'
import { overrideInfoSkyRouteWithHAR } from '@/test/e2e/info-sky'
import { setup } from '@/test/e2e/setup'
import { test } from '@playwright/test'
import { Address } from 'viem'
import { mainnet } from 'viem/chains'
import { ClaimDialogPageObject } from '../../ClaimDialog.PageObject'

test.describe('Claim SKY rewards', () => {
  const fork = setupFork({ blockNumber: USDS_ACTIVATED_BLOCK_NUMBER, chainId: mainnet.id, useTenderlyVnet: true })
  let farmDetailsPage: FarmDetailsPageObject
  let claimDialog: ClaimDialogPageObject
  let account: Address

  test.beforeEach(async ({ page }) => {
    ;({ account } = await setup(page, fork, {
      initialPage: 'farmDetails',
      initialPageParams: {
        chainId: mainnet.id.toString(),
        address: '0x0650CAF159C5A49f711e8169D4336ECB9b950275',
      },
      account: {
        type: 'connected-random',
        assetBalances: {
          ETH: 1,
          USDS: 10_000,
        },
      },
    }))
    await overrideInfoSkyRouteWithHAR({ page, key: '2-sky-farm-with-12_07-apy' })

    farmDetailsPage = new FarmDetailsPageObject(page)
    await farmDetailsPage.clickInfoPanelStakeButtonAction()
    const stakeDialog = new StakeDialogPageObject(page)
    await stakeDialog.fillAmountAction(10_000)
    await stakeDialog.actionsContainer.acceptAllActionsAction(2)
    await stakeDialog.clickBackToFarmAction()
    await fork.progressSimulation(page, 24 * 60 * 60) // 24 hours
    await page.reload()

    await farmDetailsPage.clickInfoPanelClaimButtonAction()
    claimDialog = new ClaimDialogPageObject(page)
  })

  test('has correct action plan', async () => {
    await claimDialog.actionsContainer.expectEnabledActionAtIndex(0)
    await claimDialog.actionsContainer.expectActions([{ type: 'claimFarmRewards', asset: 'SKY' }])
  })

  test('displays transaction overview', async () => {
    await claimDialog.expectTransactionOverview({
      reward: {
        token: {
          symbol: 'SKY',
          description: 'SKY Governance Token',
        },
        // amount is imprecise because of timing issues in e2e tests
        amount: '3,539',
        amountUSD: '~$235',
      },
    })
  })

  test('executes transaction', async () => {
    await claimDialog.actionsContainer.acceptAllActionsAction(1)

    await claimDialog.expectSuccessPage()
    await claimDialog.clickBackToFarmAction()

    await farmDetailsPage.expectTokenToDepositBalance('USDS', '-')
    await farmDetailsPage.expectReward({
      reward: '0',
      rewardUsd: '$0.00',
    })
    await farmDetailsPage.expectTokenBalance({
      address: account,
      fork,
      symbol: 'SKY',
      minBalance: 3_525,
      maxBalance: 3_545,
    })
    await farmDetailsPage.expectStaked('10,000.00 USDS')
  })
})
