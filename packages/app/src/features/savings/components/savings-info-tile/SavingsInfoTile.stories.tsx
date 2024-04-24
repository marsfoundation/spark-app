import { WithTooltipProvider } from '@storybook/decorators'
import { Meta, StoryObj } from '@storybook/react'

import { SavingsInfoTile } from './SavingsInfoTile'

const meta: Meta<typeof SavingsInfoTile> = {
  title: 'Features/Savings/Components/SavingsInfoTile',
  component: SavingsInfoTile,
  decorators: [WithTooltipProvider()],
}

export default meta
type Story = StoryObj<typeof SavingsInfoTile>

export const BaseDark: Story = {
  name: 'Base Dark',
  render: () => {
    return (
      <SavingsInfoTile>
        <SavingsInfoTile.Label tooltipContent="Tooltip text.">30-day projection</SavingsInfoTile.Label>
        <SavingsInfoTile.Value>+60$</SavingsInfoTile.Value>
      </SavingsInfoTile>
    )
  },
}

export const BaseGreen: Story = {
  name: 'Base Green',
  render: () => {
    return (
      <SavingsInfoTile>
        <SavingsInfoTile.Label tooltipContent="Tooltip text.">30-day projection</SavingsInfoTile.Label>
        <SavingsInfoTile.Value color="green">+$50</SavingsInfoTile.Value>
      </SavingsInfoTile>
    )
  },
}

export const MediumDark: Story = {
  name: 'Medium Dark',
  render: () => {
    return (
      <SavingsInfoTile>
        <SavingsInfoTile.Label tooltipContent="Tooltip text.">30-day projection</SavingsInfoTile.Label>
        <SavingsInfoTile.Value size="medium">+$100</SavingsInfoTile.Value>
      </SavingsInfoTile>
    )
  },
}

export const MediumGreen: Story = {
  name: 'Medium Green',
  render: () => {
    return (
      <SavingsInfoTile>
        <SavingsInfoTile.Label tooltipContent="Tooltip text.">30-day projection</SavingsInfoTile.Label>
        <SavingsInfoTile.Value size="medium" color="green">
          +$100
        </SavingsInfoTile.Value>
      </SavingsInfoTile>
    )
  },
}

export const LargeDark: Story = {
  name: 'Large Dark',
  render: () => {
    return (
      <SavingsInfoTile>
        <SavingsInfoTile.Label tooltipContent="Tooltip text.">30-day projection</SavingsInfoTile.Label>
        <SavingsInfoTile.Value size="large">+$100</SavingsInfoTile.Value>
      </SavingsInfoTile>
    )
  },
}

export const LargeGreen: Story = {
  name: 'Large Green',
  render: () => {
    return (
      <SavingsInfoTile>
        <SavingsInfoTile.Label tooltipContent="Tooltip text.">30-day projection</SavingsInfoTile.Label>
        <SavingsInfoTile.Value size="large" color="green">
          +$100
        </SavingsInfoTile.Value>
      </SavingsInfoTile>
    )
  },
}

export const HugeDark: Story = {
  name: 'Huge Dark',
  render: () => {
    return (
      <SavingsInfoTile>
        <SavingsInfoTile.Label tooltipContent="Tooltip text.">30-day projection</SavingsInfoTile.Label>
        <SavingsInfoTile.Value size="huge">+$150</SavingsInfoTile.Value>
      </SavingsInfoTile>
    )
  },
}

export const HugeGreen: Story = {
  name: 'Huge Green',
  render: () => {
    return (
      <SavingsInfoTile>
        <SavingsInfoTile.Label tooltipContent="Tooltip text.">30-day projection</SavingsInfoTile.Label>
        <SavingsInfoTile.Value size="huge" color="green">
          +$150
        </SavingsInfoTile.Value>
      </SavingsInfoTile>
    )
  },
}

export const NoTooltip: Story = {
  name: 'No Tooltip',
  render: () => {
    return (
      <SavingsInfoTile>
        <SavingsInfoTile.Label>30-day projection</SavingsInfoTile.Label>
        <SavingsInfoTile.Value>+$50</SavingsInfoTile.Value>
      </SavingsInfoTile>
    )
  },
}

export const ValueOnTop: Story = {
  name: 'Value On Top',
  render: () => {
    return (
      <SavingsInfoTile alignItems="center">
        <SavingsInfoTile.Value size="huge">5%</SavingsInfoTile.Value>
        <SavingsInfoTile.Label tooltipContent="Tooltip text.">DSR Rate</SavingsInfoTile.Label>
      </SavingsInfoTile>
    )
  },
}

export const ItemsCenter: Story = {
  name: 'Items Center',
  render: () => {
    return (
      <SavingsInfoTile alignItems="center">
        <SavingsInfoTile.Label tooltipContent="Tooltip text.">30-day projection</SavingsInfoTile.Label>
        <SavingsInfoTile.Value color="green">+$50</SavingsInfoTile.Value>
      </SavingsInfoTile>
    )
  },
}

export const ItemsEnd: Story = {
  name: 'Items End',
  render: () => {
    return (
      <SavingsInfoTile alignItems="end">
        <SavingsInfoTile.Label tooltipContent="Tooltip text.">30-day projection</SavingsInfoTile.Label>
        <SavingsInfoTile.Value color="green">+$50</SavingsInfoTile.Value>
      </SavingsInfoTile>
    )
  },
}
