import { links } from '@/ui/constants/links'
import { Percentage } from '@marsfoundation/common-universal'
import { WithClassname, WithTooltipProvider } from '@sb/decorators'
import { tokens } from '@sb/tokens'
import { getMobileStory, getTabletStory } from '@sb/viewports'
import type { Meta, StoryObj } from '@storybook/react'
import { withRouter } from 'storybook-addon-remix-react-router'
import { DepositCTAPanel } from './DepositCTAPanel'

const meta: Meta<typeof DepositCTAPanel> = {
  title: 'Features/Savings/Components/DepositCTAPanel',
  component: DepositCTAPanel,
  decorators: [WithTooltipProvider(), withRouter(), WithClassname('max-w-6xl grid md:h-[352px]')],
  args: {
    savingsRate: Percentage(0.12),
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
    isInSandbox: false,
  },
}

export default meta
type Story = StoryObj<typeof DepositCTAPanel>

export const usds: Story = {
  args: {
    entryTokens: [tokens.USDS, tokens.DAI, tokens.USDC],
    savingsToken: tokens.sUSDS,
    description: {
      text: 'Deposit to Savings USDS to tap into the most predictable savings rate at scale! Learn more about it ',
      docsLink: links.docs.earningSavings,
    },
  },
}
export const usdsMobile = getMobileStory(usds)
export const usdsTablet = getTabletStory(usds)

export const usdsDisconnected: Story = {
  args: {
    entryTokens: [tokens.USDS, tokens.DAI, tokens.USDC],
    savingsToken: tokens.sUSDS,
    description: {
      text: 'Deposit to Savings USDS to tap into the most predictable savings rate at scale! Learn more about it ',
      docsLink: links.docs.earningSavings,
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
    entryTokens: [tokens.USDC],
    savingsToken: tokens.sUSDC,
    description: {
      text: 'Deposit to Savings USDC to tap into the most predictable savings rate at scale! Learn more about it ',
      docsLink: links.docs.earningSavings,
    },
  },
}
export const usdcMobile = getMobileStory(usdc)
export const usdcTablet = getTabletStory(usdc)

export const dai: Story = {
  args: {
    entryTokens: [tokens.USDS, tokens.DAI, tokens.USDC],
    savingsToken: tokens.sDAI,
    description: {
      text: 'Deposit to Savings DAI to tap into the most predictable savings rate at scale! Learn more about it ',
      docsLink: links.docs.earningSavings,
    },
  },
}
export const daiMobile = getMobileStory(dai)
export const daiTablet = getTabletStory(dai)

export const inSandbox: Story = {
  args: {
    ...usds.args,
    isInSandbox: true,
  },
}
export const inSandboxMobile = getMobileStory(inSandbox)
export const inSandboxTablet = getTabletStory(inSandbox)
