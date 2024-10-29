import { WithClassname, WithTooltipProvider } from '@storybook-config/decorators'
import { getMobileStory, getTabletStory } from '@storybook-config/viewports'
import { Meta, StoryObj } from '@storybook/react'

import { ActionsGrid } from '../ActionsGrid'
import { allActionHandlers } from './allActionHandlers'

const meta: Meta<typeof ActionsGrid> = {
  title: 'Features/Actions/ActionsGrid/AllActions',
  component: ActionsGrid,
  decorators: [WithTooltipProvider(), WithClassname('max-w-3xl')],
}

export default meta
type Story = StoryObj<typeof ActionsGrid>

// Extended variant
export const AllActionsExtended: Story = {
  name: 'All Actions (Extended)',
  args: {
    actionHandlers: Object.values(allActionHandlers),
    variant: 'extended',
  },
}
export const AllActionExtendedMobile = { name: 'All Actions (Extended, Mobile)', ...getMobileStory(AllActionsExtended) }
export const AllActionsExtendedTablet = {
  name: 'All Actions (Extended, Tablet)',
  ...getTabletStory(AllActionsExtended),
}

export const AllActionsExtendedError: Story = {
  name: 'All Actions (Extended, Error)',
  args: {
    actionHandlers: Object.values(allActionHandlers).map((handler) => ({
      ...handler,
      state: { status: 'error', message: 'Transaction rejected by user. This is lengthy error message. Layout test.' },
    })),
    variant: 'extended',
  },
}

export const AllActionsErrorMobile = {
  name: 'All Actions (Extended, Error, Mobile)',
  ...getMobileStory(AllActionsExtendedError),
}
export const AllActionsErrorTablet = {
  name: 'All Actions (Extended, Error, Tablet)',
  ...getTabletStory(AllActionsExtendedError),
}

export const AllActionsExtendedLoading: Story = {
  name: 'All Actions (Extended, Loading)',
  args: {
    actionHandlers: Object.values(allActionHandlers).map((handler) => ({ ...handler, state: { status: 'loading' } })),
    variant: 'extended',
  },
}
export const AllActionsLoadingMobile = {
  name: 'All Actions (Extended, Loading, Mobile)',
  ...getMobileStory(AllActionsExtendedLoading),
}
export const AllActionsLoadingTablet = {
  name: 'All Actions (Extended, Loading, Tablet)',
  ...getTabletStory(AllActionsExtendedLoading),
}

export const AllActionsExtendedSuccess: Story = {
  name: 'All Actions (Extended, Success)',
  args: {
    actionHandlers: Object.values(allActionHandlers).map((handler) => ({ ...handler, state: { status: 'success' } })),
    variant: 'extended',
  },
}
export const AllActionsSuccessMobile = {
  name: 'All Actions (Extended, Success, Mobile)',
  ...getMobileStory(AllActionsExtendedSuccess),
}
export const AllActionsSuccessTablet = {
  name: 'All Actions (Extended, Success, Tablet)',
  ...getTabletStory(AllActionsExtendedSuccess),
}

// Compact variant
export const AllActionsCompact: Story = {
  name: 'All Actions (Compact)',
  args: {
    actionHandlers: Object.values(allActionHandlers),
    variant: 'compact',
  },
}
export const AllActionsCompactMobile = { name: 'All Actions (Compact, Mobile)', ...getMobileStory(AllActionsCompact) }
export const AllActionsCompactTablet = { name: 'All Actions (Compact, Tablet)', ...getTabletStory(AllActionsCompact) }

export const AllActionsCompactError: Story = {
  name: 'All Actions (Compact, Error)',
  args: {
    actionHandlers: Object.values(allActionHandlers).map((handler) => ({
      ...handler,
      state: { status: 'error', message: 'Transaction rejected by user. This is lengthy error message. Layout test.' },
    })),
    variant: 'compact',
  },
}
export const AllActionsCompactErrorMobile = {
  name: 'All Actions (Compact, Error, Mobile)',
  ...getMobileStory(AllActionsCompactError),
}
export const AllActionsCompactErrorTablet = {
  name: 'All Actions (Compact, Error, Tablet)',
  ...getTabletStory(AllActionsCompactError),
}

export const AllActionsCompactLoading: Story = {
  name: 'All Actions (Compact, Loading)',
  args: {
    actionHandlers: Object.values(allActionHandlers).map((handler) => ({ ...handler, state: { status: 'loading' } })),
    variant: 'compact',
  },
}
export const AllActionsCompactLoadingMobile = {
  name: 'All Actions (Compact, Loading, Mobile)',
  ...getMobileStory(AllActionsCompactLoading),
}
export const AllActionsCompactLoadingTablet = {
  name: 'All Actions (Compact, Loading, Tablet)',
  ...getTabletStory(AllActionsCompactLoading),
}

export const AllActionsCompactSuccess: Story = {
  name: 'All Actions (Compact, Success)',
  args: {
    actionHandlers: Object.values(allActionHandlers).map((handler) => ({ ...handler, state: { status: 'success' } })),
    variant: 'compact',
  },
}
export const AllActionsCompactSuccessMobile = {
  name: 'All Actions (Compact, Success, Mobile)',
  ...getMobileStory(AllActionsCompactSuccess),
}
export const AllActionsCompactSuccessTablet = {
  name: 'All Actions (Compact, Success, Tablet)',
  ...getTabletStory(AllActionsCompactSuccess),
}
