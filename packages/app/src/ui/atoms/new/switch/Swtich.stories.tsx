import { Meta, StoryObj } from '@storybook/react'
import { Switch } from './Switch'

const meta: Meta<typeof Switch> = {
  title: 'Components/Atoms/New/Switch',
  component: ({ disabled }: { disabled?: boolean }) => (
    <div className="grid w-fit grid-cols-2 justify-items-center gap-x-12 gap-y-4 bg-white p-6">
      <div className="typography-label-6 text-reskin-neutral-500">ON</div>
      <div className="typography-label-6 text-reskin-neutral-500">OFF</div>
      <Switch checked disabled={disabled} />
      <Switch disabled={disabled} />
    </div>
  ),
}

export default meta
type Story = StoryObj<typeof Switch>

export const Default: Story = {}

export const Hovered: Story = {
  parameters: {
    pseudo: {
      hover: true,
    },
  },
}

export const Fucused: Story = {
  parameters: {
    pseudo: {
      focusVisible: true,
    },
  },
}

export const Pressed: Story = {
  parameters: {
    pseudo: {
      active: true,
    },
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
  },
}
