import { Meta, StoryObj } from '@storybook/react'

import { ScrollArea, ScrollBar } from './ScrollArea'

const meta: Meta<typeof ScrollArea> = {
  title: 'Components/Atoms/ScrollArea',
}

export default meta
type Story = StoryObj<typeof ScrollArea>

export const Vertical: Story = {
  name: 'Vertical',
  render: () => (
    <ScrollArea className="h-[200px] w-fit px-4">
      <div className="flex flex-col gap-2">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i}>Item {i}</div>
        ))}
      </div>
    </ScrollArea>
  ),
}

export const Horizontal: Story = {
  name: 'Horizontal',
  render: () => (
    <ScrollArea className="w-96">
      <div className="flex w-max flex-row gap-2 py-4">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i}>Item {i}</div>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  ),
}
