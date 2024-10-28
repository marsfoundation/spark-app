import type { Meta, StoryObj } from '@storybook/react'

import { userEvent, within } from '@storybook/test'
import { tokens } from '@storybook/tokens'
import { TokenIcon } from '../../token-icon/TokenIcon'
import { Select, SelectContent, SelectItem, SelectTrigger } from './Select'

function Selector({ disabled }: { disabled?: boolean }) {
  const selectedAsset = tokens.ETH

  return (
    <div className="w-[120px]">
      <Select disabled={disabled}>
        <SelectTrigger>
          <div className="flex flex-row items-center gap-2">
            <TokenIcon token={selectedAsset} className="h-6 w-6" />
            <div className="typography-label-4">{selectedAsset.symbol}</div>
          </div>
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="WETH">
            <div className="flex flex-row items-center gap-2">
              <TokenIcon token={tokens.WETH} className="h-6 w-6" />
              <div className="typography-label-4">{tokens.WETH.symbol}</div>
            </div>
          </SelectItem>
          <SelectItem value="wstETH">
            <div className="flex flex-row items-center gap-2">
              <TokenIcon token={tokens.wstETH} className="h-6 w-6" />
              <div className="typography-label-4">{tokens.wstETH.symbol}</div>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
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
