import { WithClassname } from '@sb/decorators'
import { getMobileStory, getTabletStory } from '@sb/viewports'
import { Meta, StoryObj } from '@storybook/react'

import { assets } from '@/ui/assets'
import { SelectNetworkDialogView } from './SelectNetworkDialogView'

const meta: Meta<typeof SelectNetworkDialogView> = {
  title: 'Features/Dialogs/Views/SelectNetwork',
  component: SelectNetworkDialogView,
  decorators: [WithClassname('max-w-xl')],
  args: {
    chains: [
      {
        logo: assets.chain.ethereum,
        name: 'Ethereum Mainnet',
        supportedPages: ['Savings', 'Borrow', 'Farms'],
        selected: true,
        isInSwitchingProcess: false,
        onSelect: () => {},
      },
      {
        logo: assets.chain.gnosis,
        name: 'Gnosis Chain',
        supportedPages: ['Savings', 'Borrow'],
        selected: false,
        isInSwitchingProcess: false,
        onSelect: () => {},
      },
      {
        logo: assets.chain.base,
        name: 'Base',
        supportedPages: ['Savings', 'Farms'],
        selected: false,
        isInSwitchingProcess: true,
        onSelect: () => {},
      },
    ],
  },
}

export default meta
type Story = StoryObj<typeof SelectNetworkDialogView>

export const Desktop: Story = {}
export const Mobile = getMobileStory(Desktop)
export const Tablet = getTabletStory(Desktop)
