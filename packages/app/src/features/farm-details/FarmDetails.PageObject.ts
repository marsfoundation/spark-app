import { BasePageObject } from '@/test/e2e/BasePageObject'
import { AssetsInTests, TOKENS_ON_FORK } from '@/test/e2e/constants'
import { ForkContext } from '@/test/e2e/forking/setupFork'
import { getTokenBalance } from '@/test/e2e/utils'
import { testIds } from '@/ui/utils/testIds'
import { Locator, expect } from '@playwright/test'
import { Address } from 'viem'

export class FarmDetailsPageObject extends BasePageObject {
  // #region locators
  locateTokensToDepositPanel(): Locator {
    return this.locatePanelByHeader('Tokens to deposit')
  }
  // #endregion

  // #region actions
  async clickInfoPanelStakeButtonAction(): Promise<void> {
    await this.page.getByTestId(testIds.farmDetails.infoPanel.stakeButton).click()
  }

  async clickInfoPanelClaimButtonAction(): Promise<void> {
    await this.page.getByTestId(testIds.farmDetails.activeFarmInfoPanel.claimButton).click()
  }
  // #endregion

  // #region assertions
  async expectTokenToDepositBalance(assetName: string, value: string): Promise<void> {
    const panel = this.locateTokensToDepositPanel()
    const row = panel.getByRole('row').filter({ has: this.page.getByRole('cell', { name: assetName, exact: true }) })
    await expect(row.getByRole('cell', { name: value })).toBeVisible()
  }

  async expectStaked({ stake, reward }: { stake: string; reward: string }): Promise<void> {
    await expect(this.page.getByTestId(testIds.farmDetails.activeFarmInfoPanel.staked)).toContainText(stake.toString())
    await expect(this.page.getByTestId(testIds.farmDetails.activeFarmInfoPanel.rewards)).toContainText(
      reward.toString(),
    )
  }

  async expectTokenBalance({
    fork,
    symbol,
    minBalance,
    maxBalance,
    address,
  }: {
    fork: ForkContext
    symbol: AssetsInTests
    minBalance: number
    maxBalance: number
    address: Address
  }): Promise<void> {
    const token: { address: Address; decimals: number } = (TOKENS_ON_FORK as any)[fork.chainId][symbol]
    const balance = await getTokenBalance({
      address,
      forkUrl: fork.forkUrl,
      token,
    })
    expect(balance.toNumber()).toBeGreaterThanOrEqual(minBalance)
    expect(balance.toNumber()).toBeLessThanOrEqual(maxBalance)
  }
  // #endregion
}
