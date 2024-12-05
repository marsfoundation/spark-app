import type { Meta, StoryObj } from '@storybook/react'

import { Form } from '@/ui/atoms/form/Form'
import { NormalizedUnitNumber } from '@marsfoundation/common-universal'
import { WithClassname, WithTooltipProvider } from '@sb/decorators'
import { tokens } from '@sb/tokens'
import { useForm } from 'react-hook-form'
import { withRouter } from 'storybook-addon-remix-react-router'
import { Borrow } from './Borrow'

function BorrowWrapper() {
  const form = useForm() as any

  return (
    <Form {...form}>
      <Borrow
        control={form.control}
        selectedAssets={[
          {
            token: tokens.DAI,
            balance: NormalizedUnitNumber(1),
          },
        ]}
        changeAsset={() => {}}
        allAssets={[
          {
            token: tokens.DAI,
            balance: NormalizedUnitNumber(1),
          },
          {
            token: tokens.USDS,
            balance: NormalizedUnitNumber(2),
          },
        ]}
        alreadyBorrowed={{
          tokens: [tokens.DAI],
          totalValueUSD: NormalizedUnitNumber(3000),
        }}
        pageStatus={{
          state: 'confirmation',
          onProceedToForm: () => {},
          submitForm: () => {},
          goToSuccessScreen: () => {},
          actionsEnabled: true,
        }}
      />
    </Form>
  )
}

const meta: Meta<typeof BorrowWrapper> = {
  title: 'Features/EasyBorrow/Components/Form/Borrow',
  decorators: [withRouter, WithTooltipProvider(), WithClassname('w-[425px]')],
  component: BorrowWrapper,
}

export default meta
type Story = StoryObj<typeof BorrowWrapper>

export const Default: Story = {}
