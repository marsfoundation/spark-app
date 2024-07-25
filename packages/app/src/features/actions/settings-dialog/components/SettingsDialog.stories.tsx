import { Meta, StoryObj } from '@storybook/react'
import { getMobileStory, getTabletStory } from '@storybook/viewports'
import { SettingsDialog } from './SettingsDialog'

const meta: Meta<typeof SettingsDialog> = {
  title: 'Features/Actions/SettingsDialog',
  component: SettingsDialog,
  render: () => {
    return (
      <SettingsDialog onConfirm={() => {}} permitsSettings={{ preferPermits: true, togglePreferPermits: () => {} }} />
    )
  },
}

export default meta
type Story = StoryObj<typeof SettingsDialog>

export const Default: Story = {}
export const Mobile: Story = getMobileStory(Default)
export const Tablet: Story = getTabletStory(Default)
