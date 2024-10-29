import { WithClassname } from '@storybook-config/decorators'
import { tokens } from '@storybook-config/tokens'
import { getHoveredStory } from '@storybook-config/utils'
import { getMobileStory, getTabletStory } from '@storybook-config/viewports'
import { Meta, StoryObj } from '@storybook/react'

import { EModeCategoryTile } from './EModeCategoryTile'

const meta: Meta<typeof EModeCategoryTile> = {
  title: 'Features/Dialogs/Components/EModeCategoryTile',
  component: EModeCategoryTile,
  decorators: [WithClassname('w-44')],
}

export default meta
type Story = StoryObj<typeof EModeCategoryTile>

export const ETHCorrelated: Story = {
  args: {
    eModeCategory: {
      name: 'ETH Correlated',
      tokens: [tokens.ETH, tokens.rETH, tokens.wstETH],
      isActive: false,
      isSelected: false,
      onSelect: () => {},
    },
  },
}

export const ETHCorrelatedSelected: Story = {
  args: {
    eModeCategory: {
      name: 'ETH Correlated',
      tokens: [tokens.ETH, tokens.rETH, tokens.wstETH],
      isActive: false,
      isSelected: true,
      onSelect: () => {},
    },
  },
}

export const ETHCorrelatedActive: Story = {
  args: {
    eModeCategory: {
      name: 'ETH Correlated',
      tokens: [tokens.ETH, tokens.rETH, tokens.wstETH],
      isActive: true,
      isSelected: false,
      onSelect: () => {},
    },
  },
}

export const ETHCorrelatedHovered = getHoveredStory(ETHCorrelated, 'button')

export const Stablecoins: Story = {
  args: {
    eModeCategory: {
      name: 'Stablecoins',
      tokens: [tokens.DAI, tokens.USDC, tokens.USDT],
      isActive: false,
      isSelected: false,
      onSelect: () => {},
    },
  },
}

export const StablecoinsActive: Story = {
  args: {
    eModeCategory: {
      name: 'Stablecoins',
      tokens: [tokens.DAI, tokens.USDC, tokens.USDT],
      isActive: true,
      isSelected: false,
      onSelect: () => {},
    },
  },
}

export const NoCategory: Story = {
  args: {
    eModeCategory: {
      name: 'No E-Mode',
      tokens: [tokens.ETH, tokens.rETH, tokens.wstETH, tokens.DAI, tokens.USDC, tokens.USDT],
      isActive: false,
      isSelected: false,
      onSelect: () => {},
    },
  },
}

export const NoCategoryActive: Story = {
  args: {
    eModeCategory: {
      name: 'No E-Mode',
      tokens: [tokens.ETH, tokens.rETH, tokens.wstETH, tokens.DAI, tokens.USDC, tokens.USDT],
      isActive: true,
      isSelected: false,
      onSelect: () => {},
    },
  },
}

export const Mobile = getMobileStory(ETHCorrelated)
export const Tablet = getTabletStory(ETHCorrelated)
