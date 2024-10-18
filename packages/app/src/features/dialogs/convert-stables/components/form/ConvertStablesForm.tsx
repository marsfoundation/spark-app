import { UseFormReturn } from 'react-hook-form'

import { Form } from '@/ui/atoms/form/Form'
import { AssetSelectorWithInput } from '@/ui/organisms/asset-selector-with-input/AssetSelectorWithInput'
import type { ConvertStablesFormSchema } from '../../logic/form/schema'
import { ConvertStablesFormFields } from '../../types'

export interface ConvertStablesFormProps {
  formFields: ConvertStablesFormFields
  form: UseFormReturn<ConvertStablesFormSchema>
}

export function ConvertStablesForm({ formFields, form }: ConvertStablesFormProps) {
  const {
    selectedAsset1,
    selectedAsset2,
    changeAsset1,
    changeAsset2,
    asset1Options,
    asset2Options,
    maxSelectedFieldName,
  } = formFields

  return (
    <Form {...form}>
      <SelectorWithInputHeader>From</SelectorWithInputHeader>
      <AssetSelectorWithInput
        fieldName="amount"
        control={form.control}
        selectorAssets={asset1Options}
        selectedAsset={selectedAsset1}
        setSelectedAsset={changeAsset1}
        maxSelectedFieldName={maxSelectedFieldName}
        maxValue={selectedAsset1.balance}
        showError
      />
      <SelectorWithInputHeader>To</SelectorWithInputHeader>
      <AssetSelectorWithInput
        fieldName="amount"
        control={form.control}
        selectorAssets={asset2Options}
        selectedAsset={selectedAsset2}
        setSelectedAsset={changeAsset2}
        maxSelectedFieldName={maxSelectedFieldName}
        maxValue={selectedAsset1.balance}
      />
    </Form>
  )
}

function SelectorWithInputHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-2">
      <h3 className="font-semibold text-primary text-xs">{children}</h3>
    </div>
  )
}
