import { WithClassname } from '@storybook/decorators'
import { Meta, StoryObj } from '@storybook/react'
import { getMobileStory, getTabletStory } from '@storybook/viewports'

import { Percentage } from '@/domain/types/NumericValues'

import { SlippageForm } from './SlippageForm'

const meta: Meta<typeof SlippageForm> = {
  title: 'Features/Actions/SlippageForm',
  component: SlippageForm,
  decorators: [WithClassname('max-w-xl')],
  args: {
    fieldType: 'button',
    fieldValue: Percentage(0.005),
  },
}

export default meta
type Story = StoryObj<typeof SlippageForm>

export const Desktop: Story = {}
export const Mobile = getMobileStory(Desktop)
export const Tablet = getTabletStory(Desktop)

export const Error: Story = {
  args: {
    fieldType: 'input',
    fieldValue: Percentage(0.6),
    error: 'Value have to be greater than 0 and less than 50.',
  },
}
export const ErrorMobile = getMobileStory(Error)
export const ErrorTablet = getTabletStory(Error)

export const CustomSlippage: Story = {
  args: {
    fieldType: 'input',
    fieldValue: Percentage(0.3),
  },
}
export const CustomSlippageMobile = getMobileStory(CustomSlippage)
export const CustomSlippageTablet = getTabletStory(CustomSlippage)
