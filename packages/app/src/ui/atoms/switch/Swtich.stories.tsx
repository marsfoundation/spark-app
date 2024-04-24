import { Meta, StoryObj } from '@storybook/react'

import { Switch } from './Switch'

const meta: Meta<typeof Switch> = {
  title: 'Components/Atoms/Switch',
}

export default meta
type Story = StoryObj<typeof Switch>

export const SwitchOff: Story = {
  name: 'Switch off',
  render: () => <Switch />,
}

export const SwitchOn: Story = {
  name: 'Switch on',
  render: () => <Switch checked />,
}
