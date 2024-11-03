import { WithClassname, WithTooltipProvider } from '@sb/decorators'
import { Meta, StoryObj } from '@storybook/react'
import { userEvent, within } from '@storybook/test'
import { useState } from 'react'
import { TopbarMenu } from './TopbarMenu'

const meta: Meta<typeof TopbarMenu> = {
  title: 'Components/Molecules/New/TopbarMenu',
  // @note to make dropdown display in correct position
  decorators: [WithClassname('flex justify-end'), WithTooltipProvider()],
  args: {
    isSandboxEnabled: false,
    onSandboxModeClick: () => {},
  },
  play: async ({ canvasElement }) => {
    const button = await within(canvasElement).findByRole('button')

    await userEvent.click(button)
  },
  render: () => {
    const [sandboxEnabled, setSandboxEnabled] = useState(false)

    return <TopbarMenu isSandboxEnabled={sandboxEnabled} onSandboxModeClick={() => setSandboxEnabled((p) => !p)} />
  },
}

export default meta
type Story = StoryObj<typeof TopbarMenu>

export const Default: Story = {}
