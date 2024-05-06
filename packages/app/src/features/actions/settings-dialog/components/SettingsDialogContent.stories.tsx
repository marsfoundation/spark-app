import { WithClassname } from '@storybook/decorators'
import { Meta, StoryObj } from '@storybook/react'
import { getMobileStory, getTabletStory } from '@storybook/viewports'
import { useForm } from 'react-hook-form'

import { Percentage } from '@/domain/types/NumericValues'

import { SettingsDialogContent } from './SettingsDialogContent'

const meta: Meta<typeof SettingsDialogContent> = {
  title: 'Features/Actions/SettingsDialogContent',
  component: SettingsDialogContent,
  decorators: [WithClassname('max-w-xl')],
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const form = useForm() as any
    return (
      <SettingsDialogContent
        onConfirm={() => {}}
        permitsSettings={{ preferPermits: true, togglePreferPermits: () => {} }}
        slippageSettings={{
          form,
          slippage: Percentage(0.005),
          type: 'button',
          onSlippageChange: () => {},
        }}
      />
    )
  },
}

export default meta
type Story = StoryObj<typeof SettingsDialogContent>

export const Desktop: Story = {}
export const Mobile = getMobileStory(Desktop)
export const Tablet = getTabletStory(Desktop)
