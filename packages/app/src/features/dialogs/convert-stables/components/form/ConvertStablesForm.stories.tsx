import { TokenRepository } from '@/domain/token-repository/TokenRepository'
import { NormalizedUnitNumber } from '@marsfoundation/common-universal'
import { WithClassname } from '@sb/decorators'
import { tokens } from '@sb/tokens'
import { getMobileStory, getTabletStory } from '@sb/viewports'
import { Meta, StoryObj } from '@storybook/react'
import { useConvertStablesForm } from '../../logic/form/useConvertStablesForm'
import { ConvertStablesForm } from './ConvertStablesForm'

const dai = tokens.DAI
const usds = tokens.USDS
const usdc = tokens.USDC
const mockTokenRepository = new TokenRepository(
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

const meta: Meta<typeof ConvertStablesForm> = {
  title: 'Features/Dialogs/ConvertStables/Components/Form',
  component: () => {
    const { form, formFields } = useConvertStablesForm({
      tokenRepository: mockTokenRepository,
      psmStables,
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
