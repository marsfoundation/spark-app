import { WithTooltipProvider } from '@storybook-config/decorators'
import { getHoveredStory } from '@storybook-config/utils'
import { getMobileStory, getTabletStory } from '@storybook-config/viewports'
import { Meta } from '@storybook/react'

import { assets } from '@/ui/assets'

import { Tooltip, TooltipContentLong, TooltipContentShort, TooltipTrigger } from './Tooltip'
import { TooltipContentLayout } from './TooltipContentLayout'

const meta: Meta<typeof Tooltip> = {
  title: 'Components/Atoms/Tooltip',
  decorators: [WithTooltipProvider()],
}

export default meta

export const Default = getHoveredStory(
  {
    name: 'Default',
    render: () => (
      <Tooltip>
        <TooltipTrigger>Hover me</TooltipTrigger>
        <TooltipContentShort>Tooltip content</TooltipContentShort>
      </Tooltip>
    ),
  },
  'button',
)

export const LengthyText = getHoveredStory(
  {
    name: 'Lengthy Text',
    render: () => (
      <Tooltip>
        <TooltipTrigger>Hover me</TooltipTrigger>
        <TooltipContentShort>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.
        </TooltipContentShort>
      </Tooltip>
    ),
  },
  'button',
)

export const LengthyTextMobile = getMobileStory(LengthyText)
export const LengthyTextTablet = getTabletStory(LengthyText)

export const LongContent = getHoveredStory(
  {
    name: 'Long Content',
    render: () => (
      <Tooltip>
        <TooltipTrigger>Hover me</TooltipTrigger>
        <TooltipContentLong>
          <TooltipContentLayout>
            <TooltipContentLayout.Header>
              <TooltipContentLayout.Icon src={assets.pause} />
              <TooltipContentLayout.Title>Paused asset</TooltipContentLayout.Title>
            </TooltipContentLayout.Header>

            <TooltipContentLayout.Body>
              This asset is planned to be offboarded due to a Spark community decision.
            </TooltipContentLayout.Body>
          </TooltipContentLayout>
        </TooltipContentLong>
      </Tooltip>
    ),
  },
  'button',
)
