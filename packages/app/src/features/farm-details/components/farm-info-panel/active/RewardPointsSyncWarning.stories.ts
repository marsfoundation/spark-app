import { Meta, StoryObj } from '@storybook/react'

import { RewardPointsSyncWarning } from './RewardPointsSyncWarning'

const meta: Meta<typeof RewardPointsSyncWarning> = {
  title: 'Features/FarmDetails/Components/FarmInfoPanel/RewardPointsSyncWarning',
  component: RewardPointsSyncWarning,
  args: {
    status: 'out-of-sync',
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const OutOfSync: Story = {}
export const SyncFailed: Story = {
  args: {
    status: 'sync-failed',
  },
}
