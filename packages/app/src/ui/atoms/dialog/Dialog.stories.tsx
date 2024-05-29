import { Meta, StoryObj } from '@storybook/react'
import { within } from '@storybook/test'

import { Button } from '../button/Button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './Dialog'

function DialogExample() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Title</DialogTitle>
          <DialogDescription>Description</DialogDescription>
        </DialogHeader>

        <div className="flex items-center space-x-2">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatibus.
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

const meta: Meta<typeof DialogExample> = {
  title: 'Components/Atoms/Dialog',
  component: DialogExample,
}

export default meta
type Story = StoryObj<typeof DialogExample>

export const Default: Story = {
  name: 'Closed',
}

export const Opened: Story = {
  name: 'Opened',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    ;(await canvas.findByRole('button')).click()
  },
}
