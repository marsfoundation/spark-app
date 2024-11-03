import { WithClassname, WithTooltipProvider } from '@sb/decorators'
import { Meta, StoryObj } from '@storybook/react'
import { userEvent, within } from '@storybook/test'
import { useState } from 'react'
import { TopbarMenu } from './TopbarMenu'

const meta: Meta<typeof TopbarMenu> = {
  title: 'Components/Molecules/New/TopbarMenu',
  decorators: [WithTooltipProvider(), WithClassname('h-[400px]')],
  play: async ({ canvasElement }) => {
    const button = await within(canvasElement).findByRole('button')

    await userEvent.click(button)
  },
  render: () => {
    const [sandboxEnabled, setSandboxEnabled] = useState(false)

    return (
      <TopbarMenu
        isSandboxEnabled={sandboxEnabled}
        onSandboxModeClick={() => setSandboxEnabled((p) => !p)}
        buildInfo={{
          sha: 'bdebc69',
          buildTime: '25/10/2024, 10:01:51',
        }}
      />
    )
  },
}

export default meta
type Story = StoryObj<typeof TopbarMenu>

export const Default: Story = {}