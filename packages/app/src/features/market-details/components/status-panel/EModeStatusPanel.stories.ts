import { WithClassname, WithTooltipProvider } from '@storybook/decorators'
import { Meta, StoryObj } from '@storybook/react'
import { tokens } from '@storybook/tokens'
import { getMobileStory, getTabletStory } from '@storybook/viewports'
import { withRouter } from 'storybook-addon-remix-react-router'

import { Percentage } from '@/domain/types/NumericValues'

import { EModeStatusPanel } from './EModeStatusPanel'

const meta: Meta<typeof EModeStatusPanel> = {
  title: 'Features/MarketDetails/Components/StatusPanel/EModeStatusPanel',
  component: EModeStatusPanel,
  decorators: [WithTooltipProvider(), WithClassname('max-w-2xl'), withRouter],
  args: {
    maxLtv: Percentage(0.95),
    liquidationThreshold: Percentage(0.9),
    liquidationPenalty: Percentage(0.02),
    categoryId: 1,
    eModeCategoryTokens: [tokens.WETH.symbol, tokens.wstETH.symbol, tokens.rETH.symbol],
  },
}

export default meta
type Story = StoryObj<typeof EModeStatusPanel>

export const ETHDesktop: Story = {
  name: 'ETH Correlated',
}
export const ETHMobile: Story = {
  ...getMobileStory(ETHDesktop),
  name: 'ETH Correlated (Mobile)',
}
export const ETHTablet: Story = {
  ...getTabletStory(ETHDesktop),
  name: 'ETH Correlated (Tablet)',
}

export const DAIDesktop: Story = {
  name: 'DAI Correlated',
  args: {
    categoryId: 2,
    token: tokens.sDAI,
    eModeCategoryTokens: [tokens.sDAI.symbol, tokens.USDC.symbol, tokens.USDT.symbol],
  },
}
export const DAIMobile: Story = {
  ...getMobileStory(DAIDesktop),
  name: 'DAI Correlated (Mobile)',
}
export const DAITablet: Story = {
  ...getTabletStory(DAIDesktop),
  name: 'DAI Correlated (Tablet)',
}
