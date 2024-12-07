import type { Meta, StoryObj } from '@storybook/react'

import { WithClassname } from '@sb/decorators'
import { userEvent, within } from '@storybook/test'
import { Select, SelectContent, SelectItem, SelectTrigger } from './Select'

function Selector({ disabled }: { disabled?: boolean }) {
  return (
    <Select disabled={disabled}>
      <SelectTrigger>
        <div>Apple</div>
      </SelectTrigger>

      <SelectContent>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana">Banana</SelectItem>
        <SelectItem value="blueberry">Blueberry</SelectItem>
        <SelectItem value="grapes">Grapes</SelectItem>
        <SelectItem value="pineapple">Pineapple</SelectItem>
      </SelectContent>
    </Select>
  )
}

const meta: Meta<typeof Selector> = {
  title: 'Components/Atoms/Select',
  component: Selector,
  decorators: [WithClassname('w-[120px]')],
}

export default meta
type Story = StoryObj<typeof Selector>

export const Default: Story = {}
export const Hovered: Story = {
  parameters: {
    pseudo: {
      hover: true,
    },
  },
}
export const Active: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement.ownerDocument.body)
    const button = await canvas.findByRole('combobox')
    await userEvent.click(button)
  },
}
export const Focused: Story = {
  parameters: {
    pseudo: {
      focusVisible: true,
    },
  },
}
export const Disabled: Story = {
  args: {
    disabled: true,
  },
}
