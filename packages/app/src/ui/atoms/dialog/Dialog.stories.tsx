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

function DialogExample({ content }: { content: string }) {
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

        <div className="flex items-center space-x-2">{content}</div>
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
  args: {
    content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatibus.',
  },
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

export const WithLongContent: Story = {
  name: 'With long content',
  args: {
    content: `
      Reprehenderit in proident eu voluptate esse officia nisi enim consequat consequat tempor deserunt. Amet labore deserunt sunt voluptate amet amet elit et minim nisi ex. Ad sint ipsum minim laboris aute fugiat ut minim est exercitation mollit veniam. Duis velit cillum incididunt in qui non aute deserunt aliquip. Laboris sint labore adipisicing exercitation exercitation. Lorem cillum dolor commodo nostrud sunt occaecat reprehenderit amet voluptate minim voluptate ipsum proident do nostrud. Fugiat est sit dolore proident enim labore. Ipsum Lorem ad amet. Qui est est duis id commodo minim. Excepteur dolor ut cupidatat qui Lorem excepteur consequat incididunt.Lorem ad minim anim anim non tempor aliqua proident. Dolor anim dolore dolore elit reprehenderit. Exercitation dolor mollit fugiat voluptate qui laboris deserunt deserunt consectetur velit dolor velit eu. Aliqua ullamco occaecat excepteur ad est ut elit aute laborum irure. Consequat irure dolore pariatur proident officia officia ex nostrud aliquip deserunt minim commodo proident ea veniam.Est nisi consequat labore ex dolor id excepteur. Deserunt aliqua anim voluptate cupidatat fugiat amet est et laboris. Incididunt consectetur eu tempor nostrud non. Sunt ea est amet magna. Deserunt irure sint est culpa voluptate veniam eiusmod aute aute minim culpa proident nostrud in.
      Laborum ad mollit deserunt ea nulla. Nisi ut consectetur eiusmod consequat nisi dolor sit proident ea. Duis amet dolore proident eu amet ad nisi sit. In cupidatat ea id est cupidatat.
      Do minim culpa do labore duis esse esse incididunt cupidatat laboris. Amet irure ipsum incididunt ullamco. Nulla commodo cupidatat consectetur ex tempor cillum velit. Ea qui eiusmod tempor culpa anim voluptate consectetur ullamco sit culpa anim non dolor non.
      In cupidatat adipisicing quis reprehenderit sunt est nisi. Commodo esse aliquip enim magna nostrud anim ad ex velit. Culpa do laboris non exercitation proident anim et minim mollit eiusmod nostrud aliquip laborum. Sunt fugiat dolore et labore magna reprehenderit minim enim in irure ullamco magna.
      Nisi elit adipisicing ad officia. Aliqua laborum officia eiusmod. Veniam nostrud exercitation ipsum labore eu amet aliquip tempor veniam laborum ut irure Lorem nulla. Aliquip ex Lorem deserunt nisi. Laborum aute excepteur labore occaecat est non id ex irure. Duis adipisicing Lorem eiusmod laboris duis labore.
      Do proident incididunt dolor mollit esse dolor fugiat dolore Lorem dolore deserunt eiusmod. Cupidatat officia mollit consequat laboris non ea duis. Aliquip id nulla nulla. Veniam aute deserunt consectetur excepteur cillum elit do cillum. Deserunt id cupidatat aliquip elit anim amet minim tempor. Aliquip eiusmod consequat ullamco labore duis ullamco est consequat ipsum.
      Sunt esse irure officia minim. Laborum adipisicing nostrud sit mollit in aute ipsum dolore ipsum non. Consequat exercitation do nulla et et esse consectetur pariatur aliqua ex duis. Nostrud adipisicing sunt sunt incididunt tempor excepteur Lorem ullamco laborum dolor aliqua nisi veniam eiusmod cillum. Duis elit ea velit ullamco dolor velit. Est ex non voluptate. Do ut magna labore est ex qui dolor eiusmod mollit qui sint excepteur minim mollit. Reprehenderit do elit dolor laborum excepteur reprehenderit adipisicing irure eiusmod.
      Reprehenderit ad qui velit voluptate sit officia fugiat sint voluptate non velit ut in. Ut deserunt laboris do enim pariatur cupidatat elit officia occaecat nisi Lorem. Eiusmod deserunt cillum id dolor pariatur ipsum. Id commodo consectetur commodo velit eiusmod eu mollit non. Sunt proident amet esse quis ex sunt Lorem sunt est dolore labore. Occaecat et dolore sunt ea dolore incididunt in sunt commodo non. Ut do cillum adipisicing elit velit id id in culpa duis magna Lorem.
      Ut est aute Lorem cupidatat qui fugiat. Aliqua duis ex laborum commodo laborum velit adipisicing tempor nulla voluptate quis sit nulla veniam laborum. Sint ipsum ipsum veniam veniam tempor anim sint ad aute sunt enim minim aliquip. In dolor dolore commodo cillum duis. Consectetur pariatur elit cupidatat quis dolor anim velit velit id Lorem magna. Aliquip ea elit consectetur ut in ad aliquip dolore ipsum ad. Deserunt pariatur consectetur ut Lorem exercitation mollit in cillum ad do sint ad enim quis.
      Ipsum dolore qui aliquip. Officia deserunt nisi aliquip aliquip et veniam ea proident est duis velit ullamco pariatur. Id dolor aute dolore enim nisi sunt nulla labore. Eu sint et pariatur. Lorem fugiat commodo aute et dolor et. Irure in deserunt mollit ullamco voluptate ex.`,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    ;(await canvas.findByRole('button')).click()
  },
}
