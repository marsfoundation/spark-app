import { WithClassname } from '@storybook-config/decorators'
import { getMobileStory, getTabletStory } from '@storybook-config/viewports'
import { Meta, StoryObj } from '@storybook/react'
import { withRouter } from 'storybook-addon-remix-react-router'
import { AddressInput } from './AddressInput'

const meta: Meta<typeof AddressInput> = {
  title: 'Features/Dialogs/Savings/Components/AddressInput',
  component: AddressInput,
  decorators: [WithClassname('max-w-xl'), withRouter],
  args: {
    value: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
    blockExplorerUrl: 'https://etherscan.io/address/0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
  },
}

export default meta
type Story = StoryObj<typeof AddressInput>

export const Desktop: Story = {}
export const Mobile = getMobileStory(Desktop)
export const Tablet = getTabletStory(Desktop)

// biome-ignore lint/suspicious/noShadowRestrictedNames: <explanation>
export const Error: Story = {
  args: {
    error: 'Incorrect address',
  },
}
export const ErrorMobile = getMobileStory(Error)
export const ErrorTablet = getTabletStory(Error)
