import { WithClassname } from '@storybook/decorators'
import { Meta, StoryObj } from '@storybook/react'
import { getMobileStory, getTabletStory } from '@storybook/viewports'
import { useForm } from 'react-hook-form'

import { Percentage } from '@/domain/types/NumericValues'

import { formatPercentageFormValue } from '../../logic/form'
import { SlippageForm } from './SlippageForm'

const meta: Meta<typeof SlippageForm> = {
  title: 'Features/Actions/SlippageForm',
  component: (args) => {
    const form = useForm({
      defaultValues: {
        slippage: {
          value: formatPercentageFormValue(args.slippage),
        },
      },
    }) as any
    return <SlippageForm {...args} form={form} />
  },
  decorators: [WithClassname('max-w-xl')],
  args: {
    type: 'button',
    slippage: Percentage(0.005),
    onSlippageChange: () => {},
  },
}

export default meta
type Story = StoryObj<typeof SlippageForm>

export const Desktop: Story = {}
export const Mobile = getMobileStory(Desktop)
export const Tablet = getTabletStory(Desktop)

// biome-ignore lint/suspicious/noShadowRestrictedNames: <explanation>
export const Error: Story = {
  args: {
    type: 'input',
    slippage: Percentage(0.6),
    error: 'Value have to be greater than 0 and less than 50.',
  },
}
export const ErrorMobile = getMobileStory(Error)
export const ErrorTablet = getTabletStory(Error)

export const CustomSlippage: Story = {
  args: {
    type: 'input',
    slippage: Percentage(0.3),
  },
}
export const CustomSlippageMobile = getMobileStory(CustomSlippage)
export const CustomSlippageTablet = getTabletStory(CustomSlippage)
