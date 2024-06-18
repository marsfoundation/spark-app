import { WithClassname, WithTooltipProvider, ZeroAllowanceWagmiDecorator } from '@storybook/decorators'
import { Meta, StoryObj } from '@storybook/react'
import { tokens } from '@storybook/tokens'
import { fakeBigInt } from '@storybook/utils'
import { getMobileStory, getTabletStory } from '@storybook/viewports'
import { useForm } from 'react-hook-form'

import { BaseUnitNumber, NormalizedUnitNumber, Percentage } from '@/domain/types/NumericValues'
import { ExchangeObjective } from '@/features/actions/flavours/exchange/types'

import { testAddresses } from '@/test/integration/constants'
import { SavingsDepositView } from './SavingsDepositView'

const meta: Meta<typeof SavingsDepositView> = {
  title: 'Features/Dialogs/Views/Savings/Deposit',
  component: (args) => {
    const form = useForm() as any
    return <SavingsDepositView {...args} form={form} />
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
      changeAsset: () => {},
    },
    objectives: [
      {
        type: 'exchange',
        swapParams: {
          fromToken: tokens.USDC,
          toToken: tokens.sDAI,
          type: 'direct',
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
            fromToken: tokens.USDC.address,
            toToken: tokens.sDAI.address,
            type: 'direct',
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
      } satisfies ExchangeObjective,
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
      exchangeRatioToToken: tokens.DAI,
      sDaiToken: tokens.sDAI,
      exchangeRatioFromToken: tokens.USDC,
      exchangeRatio: NormalizedUnitNumber(0.9996),
      sDaiBalanceBefore: NormalizedUnitNumber(5000),
      sDaiBalanceAfter: NormalizedUnitNumber(10000),
      outTokenAmount: NormalizedUnitNumber(5000),
    },
    riskAcknowledgement: {
      onStatusChange: () => {},
      warning: undefined,
    },
  },
}

export default meta
type Story = StoryObj<typeof SavingsDepositView>

export const DesktopLiFi: Story = {
  name: 'LiFi (Desktop)',
}
export const MobileLiFi: Story = {
  ...getMobileStory(DesktopLiFi),
  name: 'LiFi (Mobile)',
}
export const TabletLiFi: Story = {
  ...getTabletStory(DesktopLiFi),
  name: 'LiFi (Tablet)',
}

export const DesktopMaker: Story = {
  name: 'Maker (Desktop)',
  args: {
    assetsFields: {
      selectedAsset: {
        token: tokens.DAI,
        balance: NormalizedUnitNumber(50000),
        value: '2000',
      },
      changeAsset: () => {},
    },
    txOverview: {
      type: 'maker',
      status: 'success',
      APY: Percentage(0.05),
      daiEarnRate: NormalizedUnitNumber(542),
      route: [
        { token: tokens.DAI, value: NormalizedUnitNumber(1300.74), usdValue: NormalizedUnitNumber(1300.74) },
        { token: tokens.sDAI, value: NormalizedUnitNumber(925.75), usdValue: NormalizedUnitNumber(1300.74) },
      ],
      makerBadgeToken: tokens.DAI,
      outTokenAmount: NormalizedUnitNumber(925.75),
    },
    objectives: [
      {
        type: 'nativeDaiDeposit',
        dai: tokens.DAI,
        sDai: tokens.sDAI,
        value: NormalizedUnitNumber(1300.74),
      },
    ],
  },
}
export const MobileMaker: Story = {
  ...getMobileStory(DesktopMaker),
  name: 'Maker (Mobile)',
}
export const TabletMaker: Story = {
  ...getTabletStory(DesktopMaker),
  name: 'Maker (Tablet)',
}
export const Desktop: Story = {}
export const Mobile: Story = getMobileStory(Desktop)
export const Tablet: Story = getTabletStory(Desktop)

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
