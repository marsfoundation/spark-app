import { tokens } from '@storybook-config/tokens'
import type { Meta, StoryFn, StoryObj } from '@storybook/react'
import { useForm } from 'react-hook-form'

import { TokenWithBalance, TokenWithFormValue } from '@/domain/common/types'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { Form } from '@/ui/atoms/form/Form'

import { MultiAssetSelector } from './MultiSelector'

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

const assetToMaxValue: Record<TokenSymbol, NormalizedUnitNumber> = {
  [TokenSymbol('ETH')]: NormalizedUnitNumber(1),
  [TokenSymbol('DAI')]: NormalizedUnitNumber(500),
  [TokenSymbol('wstETH')]: NormalizedUnitNumber(7),
  [TokenSymbol('USDC')]: NormalizedUnitNumber(300),
}

const selectedAssets: TokenWithFormValue[] = [
  {
    token: tokens.ETH,
    balance: NormalizedUnitNumber('1'),
    value: '1',
  },
  {
    token: tokens.DAI,
    balance: NormalizedUnitNumber('500'),
    value: '10',
  },
]

const meta: Meta<typeof MultiAssetSelector> = {
  title: 'Components/Organisms/MultiAssetSelector',
  component: MultiAssetSelector,
  decorators: [WithFormProvider],
  args: {
    allAssets: assets,
    assetToMaxValue,
    changeAsset: () => {},
    removeAsset: () => {},
    selectedAssets: [],
  },
}

export default meta
type Story = StoryObj<typeof MultiAssetSelector>

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
    selectedAssets: [selectedAssets[0]!],
  },
}

export const MultipleSelectedStory: Story = {
  name: 'Multiple Selected',
  args: {
    selectedAssets: [selectedAssets[0]!, selectedAssets[1]!],
  },
}

export const AllDisabledStory: Story = {
  name: 'All Disabled',
  args: {
    selectedAssets,
    disabled: true,
  },
}
