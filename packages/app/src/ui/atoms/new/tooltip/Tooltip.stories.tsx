import { WithTooltipProvider } from '@sb/decorators'
import { getMobileStory, getTabletStory } from '@sb/viewports'
import { Meta } from '@storybook/react'

import { assets } from '@/ui/assets'

import {
  Tooltip,
  TooltipContent,
  TooltipContentBody,
  TooltipContentHeader,
  TooltipContentIcon,
  TooltipContentLayout,
  TooltipContentTitle,
  TooltipTrigger,
} from './Tooltip'

const meta: Meta<typeof Tooltip> = {
  title: 'Components/Atoms/New/Tooltip',
  decorators: [WithTooltipProvider()],
}

export default meta

export const Default = {
  render: () => (
    <Tooltip defaultOpen>
      <TooltipTrigger>Hover me</TooltipTrigger>
      <TooltipContent>Tooltip content</TooltipContent>
    </Tooltip>
  ),
}

export const LengthyText = {
  render: () => (
    <Tooltip defaultOpen>
      <TooltipTrigger>Hover me</TooltipTrigger>
      <TooltipContent>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.
      </TooltipContent>
    </Tooltip>
  ),
}

export const LengthyTextMobile = getMobileStory(LengthyText)
export const LengthyTextTablet = getTabletStory(LengthyText)

export const LongContent = {
  render: () => (
    <Tooltip defaultOpen>
      <TooltipTrigger>Hover me</TooltipTrigger>
      <TooltipContent>
        <TooltipContentLayout>
          <TooltipContentHeader>
            <TooltipContentIcon src={assets.pause} />
            <TooltipContentTitle>Paused asset</TooltipContentTitle>
          </TooltipContentHeader>

          <TooltipContentBody>
            This asset is planned to be offboarded due to a Spark community decision.
          </TooltipContentBody>
        </TooltipContentLayout>
      </TooltipContent>
    </Tooltip>
  ),
}
