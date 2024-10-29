import { Meta, StoryObj } from '@storybook/react'

import { Switch } from './Switch'

const meta: Meta<typeof Switch> = {
  title: 'Components/Atoms/New/Switch',
}

export default meta
type Story = StoryObj<typeof Switch>

export const Default: Story = {
  render: () => (
    <div className="grid w-fit grid-cols-2 justify-items-center gap-x-12 gap-y-4">
      <div>Checked</div>
      <div>Unchecked</div>
      <Switch checked />
      <Switch />
    </div>
  ),
}

export const Hovered: Story = {
  render: () => (
    <div className="grid w-fit grid-cols-2 justify-items-center gap-x-12 gap-y-4">
      <div>Checked</div>
      <div>Unchecked</div>
      <Switch checked />
      <Switch />
    </div>
  ),
  parameters: {
    pseudo: {
      hover: true,
    },
  },
}

export const Fucused: Story = {
  render: () => (
    <div className="grid w-fit grid-cols-2 justify-items-center gap-x-12 gap-y-4">
      <div>Checked</div>
      <div>Unchecked</div>
      <Switch checked />
      <Switch />
    </div>
  ),
  parameters: {
    pseudo: {
      focusVisible: true,
    },
  },
}

export const Pressed: Story = {
  render: () => (
    <div className="grid w-fit grid-cols-2 justify-items-center gap-x-12 gap-y-4">
      <div>Checked</div>
      <div>Unchecked</div>
      <Switch checked />
      <Switch />
    </div>
  ),
  parameters: {
    pseudo: {
      active: true,
    },
  },
}

export const Disabled: Story = {
  render: () => (
    <div className="grid w-fit grid-cols-2 justify-items-center gap-x-12 gap-y-4">
      <div>Checked</div>
      <div>Unchecked</div>
      <Switch checked disabled />
      <Switch disabled />
    </div>
  ),
}
