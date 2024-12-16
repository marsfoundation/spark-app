import { FarmDetailsPageObject } from '@/features/farm-details/FarmDetails.PageObject'
import { StakeDialogPageObject } from '@/features/farm-details/dialogs/stake/StakeDialog.PageObject'
import { USDS_ACTIVATED_BLOCK_NUMBER } from '@/test/e2e/constants'
import { overrideInfoSkyRouteWithHAR } from '@/test/e2e/info-sky'
import { setup } from '@/test/e2e/setup'
import { TestnetClient } from '@marsfoundation/common-testnets'
import { NormalizedUnitNumber } from '@marsfoundation/common-universal'
import { test } from '@playwright/test'
import { Address } from 'viem'
import { mainnet } from 'viem/chains'
import { ClaimDialogPageObject } from '../../ClaimDialog.PageObject'

test.describe('Claim SKY rewards', () => {
  let farmDetailsPage: FarmDetailsPageObject
  let claimDialog: ClaimDialogPageObject
  let account: Address
  let updateBrowserAndNextBlockTime: (seconds: number) => Promise<void>
  let incrementTime: (seconds: number) => Promise<void>
  let testnetClient: TestnetClient

  test.beforeEach(async ({ page }) => {
    ;({ account, testnetClient, updateBrowserAndNextBlockTime, incrementTime } = await setup(page, {
      blockchain: {
        chainId: mainnet.id,
        blockNumber: USDS_ACTIVATED_BLOCK_NUMBER,
      },
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
    await overrideInfoSkyRouteWithHAR({ page, key: '1-sky-farm-with-8_51-apy' })

    farmDetailsPage = new FarmDetailsPageObject(page)
    await farmDetailsPage.clickInfoPanelStakeButtonAction()
    const stakeDialog = new StakeDialogPageObject(page)
    await stakeDialog.fillAmountAction(10_000)
    await stakeDialog.actionsContainer.acceptAllActionsAction(2, updateBrowserAndNextBlockTime)
    await stakeDialog.clickBackToFarmAction()
    await incrementTime(24 * 60 * 60) // 24 hours
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
        amount: '3,539.65',
        amountUSD: '$213.35',
      },
    })
  })

  test('executes transaction', async () => {
    await claimDialog.actionsContainer.acceptAllActionsAction(1, updateBrowserAndNextBlockTime)

    await claimDialog.expectSuccessPage()
    await claimDialog.clickBackToFarmAction()

    await farmDetailsPage.expectTokenToDepositBalance('USDS', '-')
    await farmDetailsPage.expectReward({
      reward: '0.1',
      rewardUsd: '<$0.01',
    })
    await farmDetailsPage.expectTokenBalance({
      address: account,
      testnetClient,
      symbol: 'SKY',
      balance: NormalizedUnitNumber('3539.85599931941984'),
    })
    await farmDetailsPage.expectStaked({ amount: '10,000.00', asset: 'USDS' })
  })
})
