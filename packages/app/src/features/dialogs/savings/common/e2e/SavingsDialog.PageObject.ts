import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { getBalance, getTokenBalance } from '@/test/e2e/utils'
import { testIds } from '@/ui/utils/testIds'
import { Page, expect } from '@playwright/test'
import { Address } from 'viem'
import { DialogPageObject } from '../../../common/Dialog.PageObject'

export class SavingsDialogPageObject extends DialogPageObject {
  private readonly type: 'deposit' | 'withdraw' | 'send'

  constructor({ page, type }: { page: Page; type: 'deposit' | 'withdraw' | 'send' }) {
    super(
      page,
      new RegExp(`${type === 'deposit' ? 'Deposit to' : type === 'send' ? 'Send from' : 'Withdraw from'} Savings`),
    )
    this.type = type
  }

  // #region actions
  async clickBackToSavingsButton(): Promise<void> {
    await this.page.getByRole('button', { name: 'Back to Savings' }).click()
    await this.region.waitFor({
      state: 'detached',
    })
  }

  async fillReceiverAction(receiver: string): Promise<void> {
    await this.region.getByTestId(testIds.component.AddressInput.input).fill(receiver)
  }

  // #endregion actions

  // #region assertions
  async expectDiscrepancyWarning(discrepancy: string): Promise<void> {
    const explanation =
      this.type === 'deposit'
        ? 'The final amount received may be less than the deposit amount by up to'
        : 'You may be charged more than the withdraw amount by up to'
    await expect(
      this.region.getByText(`Market fluctuations can impact your transaction value. ${explanation} ${discrepancy}`),
    ).toBeVisible()
  }

  async expectTransactionOverviewToBeVisible(): Promise<void> {
    await expect(this.locatePanelByHeader('Transaction overview')).toBeVisible()
  }

  async expectAssetSelectorOptions(options: string[]): Promise<void> {
    const selectorOptions = await this.page.getByTestId(testIds.component.AssetSelector.option).all()
    expect(selectorOptions).toHaveLength(options.length)
    for (const option of selectorOptions) {
      await expect(option).toContainText(options.shift()!)
    }
  }

  async expectTransactionOverview(transactionOverview: TransactionOverview): Promise<void> {
    const panel = this.locatePanelByHeader('Transaction overview')
    await expect(panel).toBeVisible()

    for (const [index, [label, value]] of transactionOverview.entries()) {
      const row = panel.getByTestId(testIds.dialog.depositSavings.transactionDetailsRow(index))
      await expect(row).toBeVisible()
      await expect(row).toContainText(label)
      await expect(row).toContainText(value)
    }
  }

  async expectNativeRouteTransactionOverview(transactionOverview: NativeRouteTransactionOverview): Promise<void> {
    const panel = this.locatePanelByHeader('Transaction overview')
    await expect(panel).toBeVisible()
    const txOverviewTestIds = testIds.dialog.savings.nativeRouteTransactionOverview

    const apyValue = panel.getByTestId(txOverviewTestIds.apy.value)
    const apyDescription = panel.getByTestId(txOverviewTestIds.apy.description)
    await expect(apyValue).toContainText(transactionOverview.apy.value)
    await expect(apyDescription).toContainText(transactionOverview.apy.description)

    for (const [index, { tokenAmount: tokenWithAmount, tokenUsdValue }] of transactionOverview.routeItems.entries()) {
      const routeItem = panel.getByTestId(txOverviewTestIds.routeItem.tokenWithAmount(index))
      const routeItemUSD = panel.getByTestId(txOverviewTestIds.routeItem.tokenUsdValue(index))
      await expect(routeItem).toContainText(tokenWithAmount)
      await expect(routeItemUSD).toContainText(tokenUsdValue)
    }

    const makerBadge = panel.getByTestId(txOverviewTestIds.makerBadge)
    await expect(makerBadge).toContainText(
      `Powered by Maker. No slippage & fees for ${transactionOverview.badgeToken}.`,
    )

    const outcome = panel.getByTestId(txOverviewTestIds.outcome)
    await expect(outcome).toContainText(transactionOverview.outcome)
  }

  async expectSuccessPage(): Promise<void> {
    // for now we only check if the success message is visible
    await expect(this.page.getByText('Congrats! All done!')).toBeVisible()
  }

  async expectAddressInputError(error: string): Promise<void> {
    await expect(this.page.getByTestId(testIds.component.AddressInput.error)).toHaveText(error)
  }

  async expectReceiverIsSmartContractWarning(): Promise<void> {
    await expect(this.page.getByTestId(testIds.dialog.savings.send.addressIsSmartContractWarning)).toBeVisible()
  }

  async expectReceiverBalance({
    forkUrl,
    receiver,
    balanceBefore,
    withdrawalAmount,
  }: {
    forkUrl: string
    receiver: Address
    balanceBefore: NormalizedUnitNumber
    withdrawalAmount: number
  }): Promise<void> {
    const currentBalance = await getBalance({ forkUrl, address: receiver })
    expect(currentBalance.isEqualTo(balanceBefore.plus(NormalizedUnitNumber(withdrawalAmount)))).toBe(true)
  }

  async expectReceiverTokenBalance({
    forkUrl,
    receiver,
    token,
    tokenBalanceBefore,
    withdrawalAmount,
  }: {
    forkUrl: string
    receiver: Address
    token: { address: Address; decimals: number }
    tokenBalanceBefore: NormalizedUnitNumber
    withdrawalAmount: number
  }): Promise<void> {
    const currentTokenBalance = await getTokenBalance({ forkUrl, address: receiver, token })
    expect(currentTokenBalance.isEqualTo(tokenBalanceBefore.plus(NormalizedUnitNumber(withdrawalAmount)))).toBe(true)
  }
  // #endregion assertions
}

type TransactionOverview = [string, string][]

interface NativeRouteTransactionOverview {
  apy: {
    value: string
    description: string
  }
  routeItems: {
    tokenAmount: string
    tokenUsdValue: string
  }[]
  outcome: string
  badgeToken: string
}
