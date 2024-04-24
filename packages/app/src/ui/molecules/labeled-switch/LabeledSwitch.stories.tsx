import { Meta, StoryObj } from '@storybook/react'
import { Banana } from 'lucide-react'

import { LabeledSwitch } from './LabeledSwitch'

const meta: Meta<typeof LabeledSwitch> = {
  title: 'Components/Molecules/LabeledSwitch',
}

export default meta
type Story = StoryObj<typeof LabeledSwitch>

export const Default: Story = {
  name: 'Default',
  render: () => <LabeledSwitch> Switch me! </LabeledSwitch>,
}

export const WithCustomId: Story = {
  name: 'With Custom Id',
  render: () => <LabeledSwitch id="custom-id"> Switch me! </LabeledSwitch>,
}

export const WithIcon: Story = {
  name: 'With Icon',
  render: () => (
    <LabeledSwitch>
      <div className="flex flex-row items-center gap-1">
        <div>Switch me!</div>
        <Banana />
      </div>
    </LabeledSwitch>
  ),
}
