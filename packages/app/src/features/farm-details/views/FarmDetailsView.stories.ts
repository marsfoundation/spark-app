import { WithTooltipProvider } from '@storybook/decorators'
import { Meta, StoryObj } from '@storybook/react'
import { getMobileStory, getTabletStory } from '@storybook/viewports'
import { withRouter } from 'storybook-addon-remix-react-router'

import { NormalizedUnitNumber, Percentage } from '@/domain/types/NumericValues'

import { CheckedAddress } from '@/domain/types/CheckedAddress'
import { exampleFarmHistoricData } from '@storybook/consts'
import { tokens } from '@storybook/tokens'
import { FarmDetailsView } from './FarmDetailsView'

const meta: Meta<typeof FarmDetailsView> = {
  title: 'Features/FarmDetails/Views/FarmDetailsView',
  component: FarmDetailsView,
  decorators: [WithTooltipProvider(), withRouter],
  args: {
    chainId: 1,
    chainName: 'Ethereum Mainnet',
    chainMismatch: false,
    walletConnected: true,
    farm: {
      address: CheckedAddress('0x1234567890123456789012345678901234567890'),
      apy: Percentage(0.05),
      entryAssetsGroup: {
        type: 'stablecoins',
        name: 'Stablecoins',
        assets: [tokens.DAI.symbol, tokens.sDAI.symbol, tokens.USDC.symbol, tokens.NST.symbol, tokens.sNST.symbol],
      },
      rewardToken: tokens.MKR,
      stakingToken: tokens.DAI,
      earned: NormalizedUnitNumber(71.2345783),
      staked: NormalizedUnitNumber(10_000),
      rewardRate: NormalizedUnitNumber(0.0000000003756),
      earnedTimestamp: 1724337615,
      periodFinish: 2677721600,
      totalSupply: NormalizedUnitNumber(100_000),
      depositors: 6,
    },
    farmDetailsRowData: {
      depositors: 6,
      tvl: NormalizedUnitNumber(57_891),
      apy: Percentage(0.05),
    },
    tokensToDeposit: [
      {
        token: tokens.NST,
        balance: NormalizedUnitNumber(10_000),
      },
      {
        token: tokens.DAI,
        balance: NormalizedUnitNumber(20_864.56),
      },
      {
        token: tokens.USDC,
        balance: NormalizedUnitNumber(0),
      },
      {
        token: tokens.sDAI,
        balance: NormalizedUnitNumber(0),
      },
      {
        token: tokens.sNST,
        balance: NormalizedUnitNumber(0),
      },
    ],
    openStakeDialog: () => {},
    openConnectModal: () => {},
    openSandboxModal: () => {},
    farmHistoricData: exampleFarmHistoricData,
  },
}

export default meta
type Story = StoryObj<typeof FarmDetailsView>

export const ActiveDesktop: Story = {}
export const ActiveMobile = getMobileStory(ActiveDesktop)
export const ActiveTablet = getTabletStory(ActiveDesktop)

export const InactiveDesktop: Story = {
  args: {
    farm: {
      address: CheckedAddress('0x1234567890123456789012345678901234567890'),
      apy: Percentage(0.05),
      entryAssetsGroup: {
        type: 'stablecoins',
        name: 'Stablecoins',
        assets: [tokens.DAI.symbol, tokens.USDC.symbol, tokens.USDT.symbol],
      },
      rewardToken: tokens.MKR,
      stakingToken: tokens.DAI,
      earned: NormalizedUnitNumber(0),
      staked: NormalizedUnitNumber(0),
      rewardRate: NormalizedUnitNumber(0.0000000003756),
      earnedTimestamp: 1724337615,
      periodFinish: 2677721600,
      totalSupply: NormalizedUnitNumber(100_000),
      depositors: 6,
    },
  },
}
export const InactiveMobile = getMobileStory(InactiveDesktop)
export const InactiveTablet = getTabletStory(InactiveDesktop)

export const NotConnectedDesktop: Story = {
  args: {
    farm: {
      address: CheckedAddress('0x1234567890123456789012345678901234567890'),
      apy: Percentage(0.05),
      entryAssetsGroup: {
        type: 'stablecoins',
        name: 'Stablecoins',
        assets: [tokens.DAI.symbol, tokens.USDC.symbol, tokens.USDT.symbol],
      },
      rewardToken: tokens.MKR,
      stakingToken: tokens.DAI,
      earned: NormalizedUnitNumber(0),
      staked: NormalizedUnitNumber(0),
      rewardRate: NormalizedUnitNumber(0.0000000003756),
      earnedTimestamp: 1724337615,
      periodFinish: 2677721600,
      totalSupply: NormalizedUnitNumber(100_000),
      depositors: 6,
    },
    walletConnected: false,
  },
}
export const NotConnectedMobile = getMobileStory(NotConnectedDesktop)
export const NotConnectedTablet = getTabletStory(NotConnectedDesktop)

export const ActiveDesktopChainMismatch: Story = {
  args: {
    chainMismatch: true,
  },
}
