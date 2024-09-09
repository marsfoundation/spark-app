import { NormalizedUnitNumber, Percentage } from '@/domain/types/NumericValues'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { WithClassname, WithTooltipProvider } from '@storybook/decorators'
import type { Meta, StoryObj } from '@storybook/react'
import { tokens } from '@storybook/tokens'
import { getMobileStory, getTabletStory } from '@storybook/viewports'
import { mainnet } from 'viem/chains'
import { SavingsOpportunity } from './SavingsOpportunity'

const meta: Meta<typeof SavingsOpportunity> = {
  title: 'Features/Savings/Components/SavingsOpportunity',
  component: SavingsOpportunity,
  decorators: [WithTooltipProvider(), WithClassname('max-w-lg')],
  args: {
    APY: Percentage(0.05),
    originChainId: mainnet.id,
    savingsMeta: {
      primary: {
        savingsToken: TokenSymbol('sUSDS'),
        stablecoin: TokenSymbol('USDS'),
        savingsRateAcronym: 'SSR',
        savingsRateName: 'Sky Savings Rate',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof SavingsOpportunity>

export const Whale: Story = {
  name: 'Savings DAI Whale',
  args: {
    projections: {
      thirtyDays: NormalizedUnitNumber(500000),
      oneYear: NormalizedUnitNumber(2500000),
    },
  },
}

export const WhaleMobile: Story = {
  ...getMobileStory(Whale),
  name: 'Savings DAI Whale (Mobile)',
}
export const WhaleTablet: Story = {
  ...getTabletStory(Whale),
  name: 'Savings DAI Whale (Tablet)',
}

export const Dust: Story = {
  name: 'Savings DAI Dust',
  args: {
    projections: {
      thirtyDays: NormalizedUnitNumber(1.1),
      oneYear: NormalizedUnitNumber(5.5),
    },
  },
}

export const DustMobile: Story = {
  ...getMobileStory(Dust),
  name: 'Savings DAI Dust (Mobile)',
}

export const DustTablet: Story = {
  ...getTabletStory(Dust),
  name: 'Savings DAI Dust (Tablet)',
}

export const Normik: Story = {
  name: 'Savings DAI Normik',
  args: {
    projections: {
      thirtyDays: NormalizedUnitNumber(50.5),
      oneYear: NormalizedUnitNumber(2500),
    },
    maxBalanceToken: {
      token: tokens.DAI,
      balance: NormalizedUnitNumber(22727),
    },
    openDialog: () => {},
  },
}

export const NormikMobile: Story = {
  ...getMobileStory(Normik),
  name: 'Savings DAI Normik (Mobile)',
}

export const NormikTablet: Story = {
  ...getTabletStory(Normik),
  name: 'Savings DAI Normik (Tablet)',
}

export const Degen: Story = {
  name: 'Savings DAI Degen',
  args: {
    projections: {
      thirtyDays: NormalizedUnitNumber(500.52),
      oneYear: NormalizedUnitNumber(2500.55),
    },
  },
}

export const DegenMobile: Story = {
  ...getMobileStory(Degen),
  name: 'Savings DAI Degen (Mobile)',
}

export const DegenTablet: Story = {
  ...getTabletStory(Degen),
  name: 'Savings DAI Degen (Tablet)',
}
