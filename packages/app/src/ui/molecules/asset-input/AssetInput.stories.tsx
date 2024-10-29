import { tokens } from '@storybook-config/tokens'
import type { Meta, StoryObj } from '@storybook/react'

import { NormalizedUnitNumber } from '@/domain/types/NumericValues'

import { AssetInput } from './AssetInput'

const meta: Meta<typeof AssetInput> = {
  title: 'Components/Molecules/AssetInput',
  component: (props) => (
    <div className="w-64">
      <AssetInput {...props} />
    </div>
  ),
}

export default meta
type Story = StoryObj<typeof AssetInput>

export const Default: Story = {
  name: 'Default',
}

export const WithUSD: Story = {
  name: 'With USD',
  args: {
    value: '100',
    token: tokens.ETH,
  },
}

export const WithMaxButton: Story = {
  name: 'With max',
  args: {
    setMax: () => {},
  },
}

export const WithMaxAndBalance: Story = {
  name: 'With max and balance',
  args: {
    token: tokens.ETH,
    setMax: () => {},
    balance: NormalizedUnitNumber(200),
  },
}

export const WithMaxAndZeroBalance: Story = {
  name: 'With max and zero balance',
  args: {
    token: tokens.ETH,
    setMax: () => {},
    balance: NormalizedUnitNumber(0),
  },
}

export const WithRemoveButton: Story = {
  name: 'With remove',
  args: {
    onRemove: () => {},
  },
}

export const WithRemoveButtonAndZeroBalance: Story = {
  name: 'With remove and zero balance',
  args: {
    token: tokens.ETH,
    onRemove: () => {},
    balance: NormalizedUnitNumber(0),
  },
}

export const WithAll: Story = {
  name: 'With all enabled',
  args: {
    token: tokens.ETH,
    setMax: () => {},
    onRemove: () => {},
    balance: NormalizedUnitNumber(200),
    value: '100',
  },
}

export const WithBigNumber: Story = {
  name: 'With big number',
  args: {
    value: '123456789012345678123456789012345678',
  },
}

export const Responsive: Story = {
  name: 'Responsive',
  args: {
    value: '123456789012345678123456789012345678',
    setMax: () => {},
    onRemove: () => {},
  },
}

export const MinimalSize: Story = {
  name: 'MinimalSize',
  args: {
    value: '123456789',
    setMax: () => {},
    onRemove: () => {},
  },
  render: (args) => (
    <div className="flex">
      <AssetInput {...args} />
    </div>
  ),
}
export const PredefinedSize: Story = {
  name: 'PredefinedSize',
  args: {
    value: '1234567891234567',
    setMax: () => {},
    onRemove: () => {},
    className: 'w-64',
  },
}

// biome-ignore lint/suspicious/noShadowRestrictedNames: <explanation>
export const Error: Story = {
  name: 'Error',
  args: {
    value: '1300',
    error: 'Here is a quick explainer why this risk is important and what it is all about.',
    setMax: () => {},
    onRemove: () => {},
  },
}

export const usdVariant: Story = {
  name: 'USD variant',
  args: {
    token: tokens.USDC,
    setMax: () => {},
    balance: NormalizedUnitNumber(200),
    value: '100',
    variant: 'usd',
  },
}

export const usdVariantWithWalletLabel: Story = {
  name: 'USD variant with wallet label',
  args: {
    token: tokens.USDC,
    setMax: () => {},
    balance: NormalizedUnitNumber(200),
    value: '100',
    variant: 'usd',
    walletIconLabel: 'Savings',
  },
}

export const withMaxButtonPressed: Story = {
  name: 'With MAX button pressed',
  args: {
    token: tokens.USDC,
    setMax: () => {},
    balance: NormalizedUnitNumber(100),
    isMaxSelected: true,
    value: '100',
  },
}
