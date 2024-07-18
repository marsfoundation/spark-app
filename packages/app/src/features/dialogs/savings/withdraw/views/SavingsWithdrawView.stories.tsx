import { BaseUnitNumber, NormalizedUnitNumber, Percentage } from '@/domain/types/NumericValues'
import { testAddresses } from '@/test/integration/constants'
import { WithClassname, WithTooltipProvider, ZeroAllowanceWagmiDecorator } from '@storybook/decorators'
import { Meta, StoryObj } from '@storybook/react'
import { tokens } from '@storybook/tokens'
import { fakeBigInt } from '@storybook/utils'
import { getMobileStory, getTabletStory } from '@storybook/viewports'
import { useForm } from 'react-hook-form'
import { SavingsWithdrawView, SavingsWithdrawViewProps } from './SavingsWithdrawView'

const commonArgs: Partial<SavingsWithdrawViewProps> = {
  selectableAssets: [
    {
      token: tokens.DAI,
      balance: NormalizedUnitNumber(2000),
    },
    {
      token: tokens.USDC,
      balance: NormalizedUnitNumber(50000),
    },
    {
      token: tokens.USDT,
      balance: NormalizedUnitNumber(300),
    },
  ],
  pageStatus: {
    state: 'form',
    actionsEnabled: true,
    goToSuccessScreen: () => {},
  },
  riskAcknowledgement: {
    onStatusChange: () => {},
    warning: undefined,
  },
}

const lifiWithdrawArgs: Partial<SavingsWithdrawViewProps> = {
  assetsFields: {
    selectedAsset: {
      token: tokens.USDT,
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
        toToken: tokens.USDT,
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
  txOverview: {
    type: 'lifi',
    status: 'success',
    showExchangeRate: true,
    APY: Percentage(0.05),
    exchangeRatioToToken: tokens.USDT,
    sDaiToken: tokens.sDAI,
    exchangeRatioFromToken: tokens.DAI,
    exchangeRatio: NormalizedUnitNumber(1.004),
    sDaiBalanceBefore: NormalizedUnitNumber(10000),
    sDaiBalanceAfter: NormalizedUnitNumber(5000),
    outTokenAmount: NormalizedUnitNumber(5000),
  },
}

const nativeWithdrawArgs: Partial<SavingsWithdrawViewProps> = {
  assetsFields: {
    selectedAsset: {
      token: tokens.DAI,
      balance: NormalizedUnitNumber(50000),
      value: '2000',
    },
    maxValue: NormalizedUnitNumber(5000),
    changeAsset: () => {},
  },
  objectives: [
    {
      type: 'daiFromSDaiWithdraw',
      dai: tokens.DAI,
      value: NormalizedUnitNumber(1023),
      sDai: tokens.sDAI,
      method: 'withdraw',
      mode: 'withdraw',
    },
  ],
  txOverview: {
    dai: tokens.DAI,
    type: 'maker',
    status: 'success',
    APY: Percentage(0.05),
    daiEarnRate: NormalizedUnitNumber(542),
    route: [
      { token: tokens.sDAI, value: NormalizedUnitNumber(925.75), usdValue: NormalizedUnitNumber(1300.74) },
      { token: tokens.DAI, value: NormalizedUnitNumber(1300.74), usdValue: NormalizedUnitNumber(1300.74) },
    ],
    makerBadgeToken: tokens.DAI,
    outTokenAmount: NormalizedUnitNumber(925.75),
  },
}

const nativeWithdrawSendModeArgs: Partial<SavingsWithdrawViewProps> = {
  objectives: [
    {
      type: 'daiFromSDaiWithdraw',
      dai: tokens.DAI,
      value: NormalizedUnitNumber(1023),
      sDai: tokens.sDAI,
      method: 'withdraw',
      receiver: testAddresses.alice,
      reserveAddresses: [tokens.DAI.address, tokens.USDC.address],
      mode: 'send',
    },
  ],
  sendModeExtension: {
    receiverForm: {} as any,
    receiver: testAddresses.alice,
    showReceiverIsSmartContractWarning: false,
    blockExplorerAddressLink: `https://etherscan.io/address/${testAddresses.alice}`,
    enableActions: true,
  },
}

const meta: Meta<typeof SavingsWithdrawView> = {
  title: 'Features/Dialogs/Views/Savings/Withdraw',
  component: (args) => {
    const form = useForm() as any
    return args.sendModeExtension ? (
      <SavingsWithdrawView
        {...args}
        form={form}
        sendModeExtension={{ ...args.sendModeExtension, receiverForm: form }}
      />
    ) : (
      <SavingsWithdrawView {...args} form={form} />
    )
  },
  decorators: [ZeroAllowanceWagmiDecorator(), WithClassname('max-w-xl'), WithTooltipProvider()],
}

export default meta
type Story = StoryObj<typeof SavingsWithdrawView>

export const lifiWithdrawDesktop: Story = { args: { ...commonArgs, ...lifiWithdrawArgs } }
export const lifiWithdrawMobile = getMobileStory(lifiWithdrawDesktop)
export const lifiWithdrawTablet = getTabletStory(lifiWithdrawDesktop)

export const nativeWithdrawDesktop: Story = { args: { ...commonArgs, ...nativeWithdrawArgs } }
export const nativeWithdrawMobile = getMobileStory(nativeWithdrawDesktop)
export const nativeWithdrawTablet = getTabletStory(nativeWithdrawDesktop)

export const nativeWithdrawSendModeDesktop: Story = {
  args: { ...commonArgs, ...nativeWithdrawArgs, ...nativeWithdrawSendModeArgs },
}
export const nativeWithdrawSendModeMobile = getMobileStory(nativeWithdrawSendModeDesktop)
export const nativeWithdrawSendModeTablet = getTabletStory(nativeWithdrawSendModeDesktop)

export const LoadingTxOverview: Story = {
  args: {
    ...commonArgs,
    ...lifiWithdrawArgs,
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
    ...commonArgs,
    ...lifiWithdrawArgs,
    txOverview: {
      type: 'lifi',
      status: 'no-overview',
      showExchangeRate: true,
    },
  },
}
export const MobileNoTxOverview = getMobileStory(NoTxOverview)
export const TabletNoTxOverview = getTabletStory(NoTxOverview)
