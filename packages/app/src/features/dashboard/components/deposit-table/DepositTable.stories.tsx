import { WithTooltipProvider } from '@storybook/decorators'
import { Meta, StoryObj } from '@storybook/react'
import { within } from '@storybook/test'
import { tokens } from '@storybook/tokens'
import { getMobileStory, getTabletStory } from '@storybook/viewports'
import { withRouter } from 'storybook-addon-react-router-v6'

import { NormalizedUnitNumber, Percentage } from '@/domain/types/NumericValues'
import { raise } from '@/utils/raise'

import { Deposit } from '../../logic/assets'
import { DepositTable } from './DepositTable'

const assets: Deposit[] = [
  {
    token: tokens['ETH'],
    balance: NormalizedUnitNumber('84.330123431'),
    deposit: NormalizedUnitNumber('13.74'),
    supplyAPY: Percentage(0.0145),
    isUsedAsCollateral: true,
    reserveStatus: 'active',
  },
  {
    token: tokens['stETH'],
    balance: NormalizedUnitNumber('16.76212348'),
    deposit: NormalizedUnitNumber('34.21'),
    supplyAPY: Percentage(0.0145),
    isUsedAsCollateral: true,
    reserveStatus: 'active',
  },
  {
    token: tokens['DAI'],
    balance: NormalizedUnitNumber('48.9234234'),
    deposit: NormalizedUnitNumber('9.37'),
    supplyAPY: Percentage(0.0145),
    isUsedAsCollateral: false,
    reserveStatus: 'active',
  },
  {
    token: tokens['GNO'],
    balance: NormalizedUnitNumber('299.9234234'),
    deposit: NormalizedUnitNumber('1.37'),
    supplyAPY: Percentage(0.0345),
    isUsedAsCollateral: false,
    reserveStatus: 'frozen',
  },
  {
    token: tokens['wstETH'],
    balance: NormalizedUnitNumber('89.923'),
    deposit: NormalizedUnitNumber('5.37'),
    supplyAPY: Percentage(0.012),
    isUsedAsCollateral: false,
    reserveStatus: 'paused',
  },
]

const meta: Meta<typeof DepositTable> = {
  title: 'Features/Dashboard/Components/DepositTable',
  decorators: [withRouter, WithTooltipProvider()],
  component: DepositTable,
  args: {
    assets,
    openDialog: () => {},
  },
}

export default meta
type Story = StoryObj<typeof DepositTable>

export const Desktop: Story = {}

const WithCanvas: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const switches = await canvas.findAllByRole('switch')
    ;(switches[0] ?? raise('No switch element found')).click()
  },
}

export const Mobile = getMobileStory(WithCanvas)
export const Tablet = getTabletStory(WithCanvas)
