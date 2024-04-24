import { WithClassname } from '@storybook/decorators'
import { Meta, StoryObj } from '@storybook/react'
import { getMobileStory, getTabletStory } from '@storybook/viewports'

import { SandboxDialogView } from './SandboxDialogView'

const meta: Meta<typeof SandboxDialogView> = {
  title: 'Features/Dialogs/Views/Sandbox',
  component: SandboxDialogView,
  decorators: [WithClassname('max-w-xl')],
  args: {
    startSandbox: () => {},
    isInSandbox: false,
    isPending: false,
    isSuccess: false,
    isError: false,
    error: null,
  },
}

export default meta
type Story = StoryObj<typeof SandboxDialogView>

export const Desktop: Story = {}
export const Mobile = getMobileStory(Desktop)
export const Tablet = getTabletStory(Desktop)

export const Pending: Story = {
  args: {
    isPending: true,
  },
}
export const PendingMobile = getMobileStory(Pending)
export const PendingTablet = getTabletStory(Pending)

export const Success: Story = {
  args: {
    isSuccess: true,
  },
}
export const SuccessMobile = getMobileStory(Success)
export const SuccessTablet = getTabletStory(Success)

export const WithError: Story = {
  args: {
    isError: true,
    error: new Error('Something went wrong'),
  },
}
export const WithErrorMobile = getMobileStory(WithError)
export const WithErrorTablet = getTabletStory(WithError)

export const AlreadyInSandbox: Story = {
  args: {
    isInSandbox: true,
  },
}
export const InSandboxMobile = getMobileStory(AlreadyInSandbox)
export const InSandboxTablet = getTabletStory(AlreadyInSandbox)
