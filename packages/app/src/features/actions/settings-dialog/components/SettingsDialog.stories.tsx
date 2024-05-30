import { Meta, StoryObj } from '@storybook/react'
import { getMobileStory, getTabletStory } from '@storybook/viewports'
import { useForm } from 'react-hook-form'

import { Percentage } from '@/domain/types/NumericValues'

import { SettingsDialog } from './SettingsDialog'

const meta: Meta<typeof SettingsDialog> = {
  title: 'Features/Actions/SettingsDialog',
  component: SettingsDialog,
  render: () => {
    const form = useForm() as any
    return (
      <SettingsDialog
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
type Story = StoryObj<typeof SettingsDialog>

export const Default: Story = {}
export const Mobile: Story = getMobileStory(Default)
export const Tablet: Story = getTabletStory(Default)
