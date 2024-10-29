import { tokens } from '@sb/tokens'
import { Meta, StoryObj } from '@storybook/react'

import { getTokenImage } from '@/ui/assets'

import { IconStack } from './IconStack'

const meta: Meta<typeof IconStack> = {
  title: 'Components/Molecules/IconStack',
  component: IconStack,
  args: {
    paths: [tokens.ETH, tokens.DAI, tokens.USDC].map(({ symbol }) => getTokenImage(symbol)),
  },
}

export default meta

type Story = StoryObj<typeof IconStack>

export const Default: Story = {
  name: 'Default',
}

export const ManyIcons: Story = {
  name: 'Many icons',
  args: {
    paths: [tokens.ETH, tokens.DAI, tokens.USDC, tokens.USDT, tokens.GNO].map(({ symbol }) => getTokenImage(symbol)),
    maxIcons: 3,
  },
}

export const Large: Story = {
  name: 'Larger icons',
  args: {
    paths: [tokens.ETH, tokens.DAI, tokens.USDC, tokens.USDT, tokens.GNO].map(({ symbol }) => getTokenImage(symbol)),
    size: 'lg',
  },
}

export const FirstOnTop: Story = {
  name: 'First on top',
  args: {
    stackingOrder: 'first-on-top',
    paths: [tokens.DAI, tokens.ETH, tokens.USDC, tokens.USDT, tokens.GNO].map(({ symbol }) => getTokenImage(symbol)),
    size: 'lg',
  },
}

export const IconBorder: Story = {
  args: {
    iconBorder: true,
    paths: [tokens.DAI, tokens.ETH, tokens.USDC, tokens.USDT, tokens.GNO].map(({ symbol }) => getTokenImage(symbol)),
  },
}
