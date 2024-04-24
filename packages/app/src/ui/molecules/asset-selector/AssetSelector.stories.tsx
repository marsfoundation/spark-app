import type { Meta, StoryObj } from '@storybook/react'
import { tokens } from '@storybook/tokens'
import BigNumber from 'bignumber.js'

import { AssetSelector as AssetSelectorComponent } from './AssetSelector'

function AssetSelector({ open, withAmount }: { open: boolean; withAmount: boolean }) {
  const assets = [
    { token: tokens['ETH'], amount: new BigNumber('0.0001') },
    { token: tokens['DAI'], amount: new BigNumber('0.001') },
    { token: tokens['USDC'], amount: new BigNumber('100') },
    { token: tokens['USDT'], amount: new BigNumber('1000') },
    { token: tokens['GNO'], amount: new BigNumber('1000000') },
    { token: tokens['rETH'], amount: new BigNumber('1000000000') },
    { token: tokens['WBTC'], amount: new BigNumber('1000000000000') },
    { token: tokens['WETH'], amount: new BigNumber('100000000000000000') },
  ]
  return (
    <AssetSelectorComponent
      setSelectedAsset={() => {}}
      selectedAsset={tokens['ETH']}
      assets={withAmount ? assets : assets.map((a) => ({ token: a.token }))}
      open={open}
    />
  )
}

const meta: Meta<typeof AssetSelector> = {
  title: 'Components/Molecules/AssetSelector',
  component: AssetSelector,
}

export default meta
type Story = StoryObj<typeof AssetSelector>

export const Default: Story = {
  name: 'Default',
}

export const SelectorOpenWithAmount: Story = {
  name: 'Open with amount',
  args: {
    open: true,
    withAmount: true,
  },
}

export const SelectorOpenWithoutAmount: Story = {
  name: 'Open without amount',
  args: {
    open: true,
    withAmount: false,
  },
}

export const OneAsset: Story = {
  name: 'One asset',
  render: () => {
    return (
      <AssetSelectorComponent
        setSelectedAsset={() => {}}
        selectedAsset={tokens['DAI']}
        assets={[{ token: tokens['DAI'] }]}
      />
    )
  },
  args: {},
}
