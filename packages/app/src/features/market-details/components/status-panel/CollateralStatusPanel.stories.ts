import { WithClassname, WithTooltipProvider } from '@storybook/decorators'
import { Meta, StoryObj } from '@storybook/react'
import { tokens } from '@storybook/tokens'
import { getMobileStory, getTabletStory } from '@storybook/viewports'
import { withRouter } from 'storybook-addon-remix-react-router'

import { NormalizedUnitNumber, Percentage } from '@/domain/types/NumericValues'

import { CollateralStatusPanel } from './CollateralStatusPanel'

const meta: Meta<typeof CollateralStatusPanel> = {
  title: 'Features/MarketDetails/Components/StatusPanel/CollateralStatusPanel',
  component: CollateralStatusPanel,
  decorators: [WithTooltipProvider(), WithClassname('max-w-2xl'), withRouter],
}

export default meta
type Story = StoryObj<typeof CollateralStatusPanel>

export const CanBeUsedAsCollateral: Story = {
  name: 'Can be used as collateral',
  args: {
    status: 'yes',
    debtCeiling: NormalizedUnitNumber(0),
    debt: NormalizedUnitNumber(1000),
    maxLtv: Percentage(0.8),
    liquidationThreshold: Percentage(0.825),
    liquidationPenalty: Percentage(0.05),
  },
}

export const CanBeUsedAsCollateralMobile = {
  ...getMobileStory(CanBeUsedAsCollateral),
  name: 'Can be used as collateral (Mobile)',
}
export const CanBeUsedAsCollateralTablet = {
  ...getTabletStory(CanBeUsedAsCollateral),
  name: 'Can be used as collateral (Tablet)',
}

export const CanBeUsedAsCollateralInIsolationMode: Story = {
  name: 'Only in isolation Mode',
  args: {
    status: 'only-in-isolation-mode',
    debtCeiling: NormalizedUnitNumber(50_000_000),
    debt: NormalizedUnitNumber(37_896_154),
    maxLtv: Percentage(0.8),
    liquidationThreshold: Percentage(0.825),
    liquidationPenalty: Percentage(0.05),
  },
}
export const CanBeUsedAsCollateralInIsolationModeMobile = {
  ...getMobileStory(CanBeUsedAsCollateralInIsolationMode),
  name: 'Only in isolation Mode (Mobile)',
}
export const CanBeUsedAsCollateralInIsolationModeTablet = {
  ...getTabletStory(CanBeUsedAsCollateralInIsolationMode),
  name: 'Only in isolation Mode (Tablet)',
}

export const CannotBeUsedAsCollateral: Story = {
  name: 'Cannot Be Used As Collateral',
  args: {
    status: 'no',
    debtCeiling: NormalizedUnitNumber(0),
    debt: NormalizedUnitNumber(1000),
    maxLtv: Percentage(0),
    liquidationThreshold: Percentage(0),
    liquidationPenalty: Percentage(0),
  },
}
export const CannotBeUsedAsCollateralMobile = {
  ...getMobileStory(CannotBeUsedAsCollateral),
  name: 'Cannot Be Used As Collateral (Mobile)',
}
export const CannotBeUsedAsCollateralTablet = {
  ...getTabletStory(CannotBeUsedAsCollateral),
  name: 'Cannot Be Used As Collateral (Tablet)',
}

export const Dai: Story = {
  name: 'DAI',
  args: {
    status: 'yes',
    maxLtv: Percentage(0.8),
    liquidationThreshold: Percentage(0.825),
    liquidationPenalty: Percentage(0.05),
    supplyReplacement: {
      token: tokens.sDAI,
      totalSupplied: NormalizedUnitNumber(72_000),
      supplyAPY: Percentage(0.05),
    },
  },
}
export const DaiMobile = {
  ...getMobileStory(Dai),
  name: 'DAI (Mobile)',
}
export const DaiTablet = {
  ...getTabletStory(Dai),
  name: 'DAI (Tablet)',
}
