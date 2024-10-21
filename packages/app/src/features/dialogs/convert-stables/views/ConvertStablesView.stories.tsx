import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { TokensInfo } from '@/domain/wallet/useTokens/TokenInfo'
import { WithClassname, WithTooltipProvider, ZeroAllowanceWagmiDecorator } from '@storybook/decorators'
import { Meta, StoryObj } from '@storybook/react'
import { tokens } from '@storybook/tokens'
import { getMobileStory, getTabletStory } from '@storybook/viewports'
import { useConvertStablesForm } from '../logic/form/useConvertStablesForm'
import { ConvertStablesView } from './ConvertStablesView'

const dai = tokens.DAI
const usds = tokens.USDS
const usdc = tokens.USDC
const mockTokensInfo = new TokensInfo(
  [
    { token: dai, balance: NormalizedUnitNumber(2000) },
    { token: usds, balance: NormalizedUnitNumber(0) },
    { token: usdc, balance: NormalizedUnitNumber(500) },
  ],
  {
    DAI: dai.symbol,
    USDS: usds.symbol,
  },
)
const psmStables = [tokens.DAI.symbol, tokens.USDC.symbol, tokens.USDS.symbol]

const meta: Meta<typeof ConvertStablesView> = {
  title: 'Features/Dialogs/Views/ConvertStables/ConvertStablesView',
  decorators: [ZeroAllowanceWagmiDecorator(), WithClassname('max-w-xl'), WithTooltipProvider()],
  component: (args) => {
    const { form, formFields } = useConvertStablesForm({
      tokensInfo: mockTokensInfo,
      psmStables,
    })
    return <ConvertStablesView {...args} form={form} formFields={formFields} />
  },
  args: {
    objectives: [
      {
        type: 'convertStables',
        inToken: tokens.DAI,
        outToken: tokens.USDC,
        amount: NormalizedUnitNumber(2000),
      },
    ],
    pageStatus: {
      state: 'form',
      actionsEnabled: true,
      goToSuccessScreen: () => {},
    },
    txOverview: {
      status: 'success',
      inToken: tokens.DAI,
      outcome: { token: tokens.USDC, value: NormalizedUnitNumber(2000), usdValue: NormalizedUnitNumber(2000) },
      route: [
        { token: tokens.DAI, value: NormalizedUnitNumber(2000), usdValue: NormalizedUnitNumber(2000) },
        { token: tokens.USDC, value: NormalizedUnitNumber(2000), usdValue: NormalizedUnitNumber(2000) },
      ],
    },
    actionsContext: {
      tokensInfo: mockTokensInfo,
    },
  },
}

export default meta
type Story = StoryObj<typeof ConvertStablesView>

export const Desktop: Story = {}
export const Mobile = getMobileStory(Desktop)
export const Tablet = getTabletStory(Desktop)
