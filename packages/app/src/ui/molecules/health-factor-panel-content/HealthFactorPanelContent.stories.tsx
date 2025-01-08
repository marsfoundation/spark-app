import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { Panel } from '@/ui/atoms/panel/Panel'
import { bigNumberify } from '@marsfoundation/common-universal'
import { NormalizedUnitNumber } from '@marsfoundation/common-universal'
import { WithClassname, WithTooltipProvider } from '@sb/decorators'
import { Meta, StoryObj } from '@storybook/react'
import { HealthFactorPanelContent, HealthFactorPanelContentProps } from './HealthFactorPanelContent'

const meta: Meta<typeof HealthFactorPanelContent> = {
  title: 'Components/Molecules/HealthFactorPanelContent',
  decorators: [WithTooltipProvider(), WithClassname('max-w-[425px]')],
  component: (props: HealthFactorPanelContentProps) => (
    <Panel variant="secondary">
      <HealthFactorPanelContent {...props} />
    </Panel>
  ),
}

export default meta
type Story = StoryObj<typeof HealthFactorPanelContent>

export const Default: Story = {
  args: {
    hf: bigNumberify(3.84554),
  },
}

export const WithLiquidationPrice: Story = {
  args: {
    hf: bigNumberify(2.5),
    liquidationDetails: {
      liquidationPrice: NormalizedUnitNumber(1262.9),
      tokenWithPrice: {
        priceInUSD: NormalizedUnitNumber(1895.81),
        symbol: TokenSymbol('ETH'),
      },
    },
  },
}
