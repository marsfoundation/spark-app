import { PotSavingsInfo } from '@/domain/savings-info/potSavingsInfo'
import { NormalizedUnitNumber, Percentage } from '@/domain/types/NumericValues'
import { TokensInfo } from '@/domain/wallet/useTokens/TokenInfo'
import { testAddresses } from '@/test/integration/constants'
import { bigNumberify } from '@/utils/bigNumber'
import { WithClassname, WithTooltipProvider, ZeroAllowanceWagmiDecorator } from '@storybook/decorators'
import { Meta, StoryObj } from '@storybook/react'
import { tokens } from '@storybook/tokens'
import { getMobileStory, getTabletStory } from '@storybook/viewports'
import { useForm } from 'react-hook-form'
import { SavingsWithdrawView, SavingsWithdrawViewProps } from './SavingsWithdrawView'

const dai = tokens.DAI
const sdai = tokens.sDAI
const usds = tokens.USDS
const susds = tokens.sUSDS
const usdc = tokens.USDC
const mockTokensInfo = new TokensInfo(
  [
    { token: dai, balance: NormalizedUnitNumber(100) },
    { token: sdai, balance: NormalizedUnitNumber(100) },
    { token: usds, balance: NormalizedUnitNumber(100) },
    { token: susds, balance: NormalizedUnitNumber(100) },
    { token: usdc, balance: NormalizedUnitNumber(100) },
  ],
  {
    DAI: dai.symbol,
    sDAI: sdai.symbol,
    USDS: usds.symbol,
    sUSDS: susds.symbol,
  },
)
const timestamp = 1000
const mockSavingsDaiInfo = new PotSavingsInfo({
  potParams: {
    dsr: bigNumberify('1000001103127689513476993127'), // 10% / day
    rho: bigNumberify(timestamp),
    chi: bigNumberify('1000000000000000000000000000'), // 1
  },
  currentTimestamp: timestamp + 24 * 60 * 60,
})

const withdrawArgs: Partial<SavingsWithdrawViewProps> = {
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
      isRedeem: false,
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
    skyBadgeToken: tokens.DAI,
    outTokenAmount: NormalizedUnitNumber(925.75),
  },
  actionsContext: { tokensInfo: mockTokensInfo, savingsDaiInfo: mockSavingsDaiInfo },
  savingsType: 'sdai',
}

const sendArgs: Partial<SavingsWithdrawViewProps> = {
  objectives: [
    {
      type: 'withdrawFromSavings',
      token: tokens.DAI,
      amount: NormalizedUnitNumber(1023),
      savingsToken: tokens.sDAI,
      isRedeem: false,
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

export const withdrawDesktop: Story = { args: { ...withdrawArgs } }
export const withdrawMobile = getMobileStory(withdrawDesktop)
export const withdrawTablet = getTabletStory(withdrawDesktop)

export const sendDesktop: Story = {
  args: { ...withdrawArgs, ...sendArgs },
}
export const sendMobile = getMobileStory(sendDesktop)
export const sendTablet = getTabletStory(sendDesktop)
