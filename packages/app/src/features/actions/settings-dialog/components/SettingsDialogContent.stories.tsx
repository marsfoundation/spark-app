import { WithClassname } from '@storybook-config/decorators'
import { getMobileStory, getTabletStory } from '@storybook-config/viewports'
import { Meta, StoryObj } from '@storybook/react'
import { SettingsDialogContent } from './SettingsDialogContent'

const meta: Meta<typeof SettingsDialogContent> = {
  title: 'Features/Actions/SettingsDialogContent',
  component: SettingsDialogContent,
  decorators: [WithClassname('max-w-xl')],
  render: () => {
    return (
      <SettingsDialogContent
        onConfirm={() => {}}
        permitsSettings={{ preferPermits: true, togglePreferPermits: () => {} }}
      />
    )
  },
}

export default meta
type Story = StoryObj<typeof SettingsDialogContent>

export const Desktop: Story = {}
export const Mobile = getMobileStory(Desktop)
export const Tablet = getTabletStory(Desktop)
