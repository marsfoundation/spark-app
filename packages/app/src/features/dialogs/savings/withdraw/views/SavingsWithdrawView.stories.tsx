import { WithClassname, WithTooltipProvider, ZeroAllowanceWagmiDecorator } from '@storybook/decorators'
import { Meta, StoryObj } from '@storybook/react'
import { tokens } from '@storybook/tokens'
import { fakeBigInt } from '@storybook/utils'
import { getMobileStory, getTabletStory } from '@storybook/viewports'
import { useForm } from 'react-hook-form'

import { BaseUnitNumber, NormalizedUnitNumber, Percentage } from '@/domain/types/NumericValues'

import { testAddresses } from '@/test/integration/constants'
import { SavingsWithdrawView } from './SavingsWithdrawView'

const meta: Meta<typeof SavingsWithdrawView> = {
  title: 'Features/Dialogs/Views/Savings/Withdraw',
  component: (args) => {
    const form = useForm() as any
    return <SavingsWithdrawView {...args} form={form} />
  },
  decorators: [ZeroAllowanceWagmiDecorator(), WithClassname('max-w-xl'), WithTooltipProvider()],
  args: {
    selectableAssets: [
      {
        token: tokens.USDC,
        balance: NormalizedUnitNumber(50000),
      },
      {
        token: tokens.ETH,
        balance: NormalizedUnitNumber(1),
      },
    ],
    assetsFields: {
      selectedAsset: {
        token: tokens.USDC,
        balance: NormalizedUnitNumber(50000),
        value: '2000',
      },
      maxValue: NormalizedUnitNumber(5000),
      changeAsset: () => {},
    },
    objectives: [
      {
        type: 'exchange',
        swapParams: {
          fromToken: tokens.sDAI,
          toToken: tokens.USDC,
          type: 'reverse',
          value: NormalizedUnitNumber(5000),
          meta: {
            fee: Percentage(0),
            integratorKey: 'spark_waivefee',
            maxSlippage: Percentage(0.005),
          },
        },
        swapInfo: {
          status: 'success',
          data: {
            fromToken: tokens.sDAI.address,
            toToken: tokens.USDC.address,
            type: 'reverse',
            txRequest: {
              data: '0x',
              from: testAddresses.bob,
              gasLimit: fakeBigInt,
              gasPrice: fakeBigInt,
              to: testAddresses.alice,
              value: fakeBigInt,
            },
            estimate: {
              feeCostsUSD: NormalizedUnitNumber(0),
              fromAmount: BaseUnitNumber(5000),
              toAmount: BaseUnitNumber(5000),
              toAmountMin: BaseUnitNumber(5000),
            },
          },
        },
      },
    ],
    pageStatus: {
      state: 'form',
      actionsEnabled: true,
      goToSuccessScreen: () => {},
    },
    txOverview: {
      type: 'lifi',
      status: 'success',
      showExchangeRate: true,
      APY: Percentage(0.05),
      exchangeRatioToToken: tokens.USDC,
      sDaiToken: tokens.sDAI,
      exchangeRatioFromToken: tokens.DAI,
      exchangeRatio: NormalizedUnitNumber(1.004),
      sDaiBalanceBefore: NormalizedUnitNumber(10000),
      sDaiBalanceAfter: NormalizedUnitNumber(5000),
      outTokenAmount: NormalizedUnitNumber(5000),
    },
    riskAcknowledgement: {
      onStatusChange: () => {},
      warning: undefined,
    },
  },
}

export default meta
type Story = StoryObj<typeof SavingsWithdrawView>

export const Desktop: Story = {}
export const Mobile = getMobileStory(Desktop)
export const Tablet = getTabletStory(Desktop)

export const LoadingTxOverview: Story = {
  args: {
    txOverview: {
      type: 'lifi',
      status: 'loading',
      showExchangeRate: true,
    },
  },
}
export const MobileLoadingTxOverview = getMobileStory(LoadingTxOverview)
export const TabletLoadingTxOverview = getTabletStory(LoadingTxOverview)

export const NoTxOverview: Story = {
  args: {
    txOverview: {
      type: 'lifi',
      status: 'no-overview',
      showExchangeRate: true,
    },
  },
}
export const MobileNoTxOverview = getMobileStory(NoTxOverview)
export const TabletNoTxOverview = getTabletStory(NoTxOverview)
