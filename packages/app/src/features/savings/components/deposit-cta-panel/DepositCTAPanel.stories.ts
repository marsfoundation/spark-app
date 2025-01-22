import { NormalizedUnitNumber, Percentage } from '@marsfoundation/common-universal'
import { WithClassname, WithTooltipProvider } from '@sb/decorators'
import { tokens } from '@sb/tokens'
import { getMobileStory, getTabletStory } from '@sb/viewports'
import type { Meta, StoryObj } from '@storybook/react'
import { withRouter } from 'storybook-addon-remix-react-router'
import { DepositCTAPanel } from './DepositCTAPanel'

const meta: Meta<typeof DepositCTAPanel> = {
  title: 'Features/Savings/Components/DepositCTAPanel',
  component: DepositCTAPanel,
  decorators: [WithTooltipProvider(), withRouter(), WithClassname('max-w-6xl')],
  args: {
    globalStats: {
      savingsRate: Percentage(0.12),
      users: NormalizedUnitNumber(43_232),
      liquidity: NormalizedUnitNumber(1_000_000),
      tvl: NormalizedUnitNumber(5_000_123_000),
    },
    actions: {
      primary: {
        title: 'Deposit',
        action: () => {},
      },
      secondary: {
        title: 'Try in Sandbox',
        action: () => {},
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof DepositCTAPanel>

export const usds: Story = {
  args: {
    inputTokens: [tokens.USDS, tokens.DAI, tokens.USDC],
    outputToken: tokens.sUSDS,
    description: {
      text: 'Deposit your stablecoins into Savings USDS to tap into the Sky Savings Rate, which grants you a predictable APY in USDS.',
      docsLink: '',
    },
  },
}
export const usdsMobile = getMobileStory(usds)
export const usdsTablet = getTabletStory(usds)

export const usdsDisconnected: Story = {
  args: {
    inputTokens: [tokens.USDS, tokens.DAI, tokens.USDC],
    outputToken: tokens.sUSDS,
    description: {
      text: 'Deposit your stablecoins into Savings USDS to tap into the Sky Savings Rate, which grants you a predictable APY in USDS.',
      docsLink: '',
    },
    actions: {
      primary: {
        title: 'Connect Wallet',
        action: () => {},
      },
      secondary: {
        title: 'Try in Sandbox',
        action: () => {},
      },
    },
  },
}

export const usdc: Story = {
  args: {
    inputTokens: [tokens.USDC],
    outputToken: tokens.sUSDC,
    description: {
      text: 'Deposit your stablecoins into Savings USDC to tap into the Sky Savings Rate, which grants you a predictable APY in USDC.',
      docsLink: '',
    },
  },
}
export const usdcMobile = getMobileStory(usdc)
export const usdcTablet = getTabletStory(usdc)

export const dai: Story = {
  args: {
    inputTokens: [tokens.USDS, tokens.DAI, tokens.USDC],
    outputToken: tokens.sDAI,
    description: {
      text: 'Deposit your stablecoins into Savings DAI to tap into the Sky Savings Rate, which grants you a predictable APY in DAI.',
      docsLink: '',
    },
  },
}
export const daiMobile = getMobileStory(dai)
export const daiTablet = getTabletStory(dai)
