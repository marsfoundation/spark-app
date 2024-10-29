import { WithClassname } from '@sb/decorators'
import { getMobileStory, getTabletStory } from '@sb/viewports'
import { Meta, StoryObj } from '@storybook/react'
import { within } from '@storybook/test'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './Accordion'

const meta: Meta = {
  title: 'Components/Atoms/Accordion',
  decorators: [WithClassname('max-w-6xl')],
}

export default meta
type Story = StoryObj<typeof meta>

const content = [
  {
    title: 'Item number one',
    text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi quasi perferendis alias neque, excepturi qui sequi, minima amet soluta minus est ipsum quas asperiores, eius rerum? Minima dolore deleniti delectus.',
  },
  {
    title: 'Item number two',
    text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus, animi repellendus! Nisi voluptatum iusto ipsum vero eius exercitationem et temporibus dolorum, iste aspernatur aliquid quos excepturi ullam voluptatem ab odit?',
  },
]

export const MultipleOpenable: Story = {
  render: () => {
    return (
      <Accordion type="multiple">
        {content.map((item, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger>{item.title}</AccordionTrigger>
            <AccordionContent>{item.text}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    )
  },
  play: async ({ canvasElement }) => (await within(canvasElement).findByText('Item number one')).click(),
}

export const SingleOpenable: Story = {
  render: () => {
    return (
      <Accordion type="single">
        {content.map((item, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger>{item.title}</AccordionTrigger>
            <AccordionContent>{item.text}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    )
  },
  play: async ({ canvasElement }) => (await within(canvasElement).findByText('Item number one')).click(),
}

// @note: Disabling play function to prevent visual regression misleading reports
export const Mobile: Story = { ...getMobileStory(MultipleOpenable), play: undefined }
export const Tablet: Story = { ...getTabletStory(MultipleOpenable), play: undefined }
