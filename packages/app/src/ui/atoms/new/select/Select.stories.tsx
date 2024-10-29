import type { Meta, StoryObj } from '@storybook/react'

import { userEvent, within } from '@storybook/test'
import { Select, SelectContent, SelectItem, SelectTrigger } from './Select'

function Selector({ disabled }: { disabled?: boolean }) {
  return (
    <div className='w-[200px] h-[400px]' >
      <div className="w-[120px]">
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
      </div>
    </div>
  )
}

const meta: Meta<typeof Selector> = {
  title: 'Components/Atoms/New/Select',
  component: Selector,
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
