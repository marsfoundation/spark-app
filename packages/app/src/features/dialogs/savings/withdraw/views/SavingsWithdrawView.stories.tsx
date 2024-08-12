import { NormalizedUnitNumber, Percentage } from '@/domain/types/NumericValues'
import { testAddresses } from '@/test/integration/constants'
import { WithClassname, WithTooltipProvider, ZeroAllowanceWagmiDecorator } from '@storybook/decorators'
import { Meta, StoryObj } from '@storybook/react'
import { tokens } from '@storybook/tokens'
import { getMobileStory, getTabletStory } from '@storybook/viewports'
import { useForm } from 'react-hook-form'
import { SavingsWithdrawView, SavingsWithdrawViewProps } from './SavingsWithdrawView'

const nativeWithdrawArgs: Partial<SavingsWithdrawViewProps> = {
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
      type: 'withdrawFromSavings',
      token: tokens.DAI,
      amount: NormalizedUnitNumber(1023),
      savingsToken: tokens.sDAI,
      isMax: false,
      mode: 'withdraw',
    },
  ],
  txOverview: {
    baseStable: tokens.DAI,
    status: 'success',
    APY: Percentage(0.05),
    stableEarnRate: NormalizedUnitNumber(542),
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
      type: 'withdrawFromSavings',
      token: tokens.DAI,
      amount: NormalizedUnitNumber(1023),
      savingsToken: tokens.sDAI,
      isMax: false,
      receiver: testAddresses.alice,
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

export const nativeWithdrawDesktop: Story = { args: { ...nativeWithdrawArgs } }
export const nativeWithdrawMobile = getMobileStory(nativeWithdrawDesktop)
export const nativeWithdrawTablet = getTabletStory(nativeWithdrawDesktop)

export const nativeWithdrawSendModeDesktop: Story = {
  args: { ...nativeWithdrawArgs, ...nativeWithdrawSendModeArgs },
}
export const nativeWithdrawSendModeMobile = getMobileStory(nativeWithdrawSendModeDesktop)
export const nativeWithdrawSendModeTablet = getTabletStory(nativeWithdrawSendModeDesktop)
