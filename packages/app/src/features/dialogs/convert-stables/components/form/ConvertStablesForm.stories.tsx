import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { TokensInfo } from '@/domain/wallet/useTokens/TokenInfo'
import { WithClassname } from '@storybook/decorators'
import { Meta, StoryObj } from '@storybook/react'
import { tokens } from '@storybook/tokens'
import { getMobileStory, getTabletStory } from '@storybook/viewports'
import { mainnet } from 'viem/chains'
import { useConvertStablesForm } from '../../logic/form/useConvertStablesForm'
import { ConvertStablesForm } from './ConvertStablesForm'

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

const meta: Meta<typeof ConvertStablesForm> = {
  title: 'Features/Dialogs/ConvertStables/Components/Form',
  component: () => {
    const { form, formFields } = useConvertStablesForm({
      tokensInfo: mockTokensInfo,
      chainId: mainnet.id,
    })

    return <ConvertStablesForm form={form} formFields={formFields} />
  },
  decorators: [WithClassname('max-w-xl')],
}

export default meta
type Story = StoryObj<typeof ConvertStablesForm>

export const Desktop: Story = {}
export const Mobile = getMobileStory(Desktop)
export const Tablet = getTabletStory(Desktop)
