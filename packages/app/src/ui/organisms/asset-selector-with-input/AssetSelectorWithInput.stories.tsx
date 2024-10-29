import { WithClassname } from '@storybook-config/decorators'
import { tokens } from '@storybook-config/tokens'
import type { Meta, StoryFn, StoryObj } from '@storybook/react'
import { useForm } from 'react-hook-form'

import { TokenWithBalance } from '@/domain/common/types'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { Form } from '@/ui/atoms/form/Form'

import { AssetSelectorWithInput } from './AssetSelectorWithInput'

const assets: TokenWithBalance[] = [
  {
    token: tokens.ETH,
    balance: NormalizedUnitNumber('1'),
  },
  {
    token: tokens.DAI,
    balance: NormalizedUnitNumber('500'),
  },
  {
    token: tokens.wstETH,
    balance: NormalizedUnitNumber('7'),
  },
  {
    token: tokens.USDC,
    balance: NormalizedUnitNumber('300'),
  },
]

const meta: Meta<typeof AssetSelectorWithInput> = {
  title: 'Components/Organisms/AssetSelectorWithInput',
  component: AssetSelectorWithInput,
  decorators: [WithFormProvider, WithClassname('flex flex-row gap-4')],
  args: {
    selectorAssets: assets,
    setSelectedAsset: () => {},
    maxValue: NormalizedUnitNumber('1000'),
    removeSelectedAsset: () => {},
  },
}

export default meta
type Story = StoryObj<typeof AssetSelectorWithInput>

function WithFormProvider(Story: StoryFn) {
  const form = useForm() as any
  return (
    <Form {...form}>
      <Story control={form.control} />
    </Form>
  )
}

export const Default: Story = {
  name: 'Default',
  args: {
    selectedAsset: assets[0],
    fieldName: 'name',
  },
}
