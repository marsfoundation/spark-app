import { Meta, StoryObj } from '@storybook/react'

import { StatusIcon } from './StatusIcon'

const meta: Meta<typeof StatusIcon> = {
  title: 'Features/MarketDetails/Components/StatusPanel/Components/StatusIcon',
  component: StatusIcon,
}

export default meta
type Story = StoryObj<typeof StatusIcon>

export const GreenCheckmark: Story = {
  name: 'Green Checkmark',
  render: () => <StatusIcon status="yes" />,
}

export const OrangeCheckmark: Story = {
  name: 'Orange Checkmark',
  render: () => <StatusIcon status="only-in-isolation-mode" />,
}

export const GrayX: Story = {
  name: 'Gray X',
  render: () => <StatusIcon status="no" />,
}

export const RedX: Story = {
  name: 'Red X',
  render: () => <StatusIcon status="borrow-cap-reached" />,
}
