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
    selectedAssetFrom,
    selectedAssetTo,
    changeAssetFrom,
    changeAssetTo,
    assetFromOptions,
    assetToOptions,
    maxSelectedFieldName,
  } = formFields

  return (
    <Form {...form}>
      <SelectorWithInputHeader>From</SelectorWithInputHeader>
      <AssetSelectorWithInput
        fieldName="amount"
        control={form.control}
        selectorAssets={assetFromOptions}
        selectedAsset={selectedAssetFrom}
        setSelectedAsset={changeAssetFrom}
        maxSelectedFieldName={maxSelectedFieldName}
        maxValue={selectedAssetFrom.balance}
        showError
      />
      <SelectorWithInputHeader>To</SelectorWithInputHeader>
      <AssetSelectorWithInput
        fieldName="amount"
        control={form.control}
        selectorAssets={assetToOptions}
        selectedAsset={selectedAssetTo}
        setSelectedAsset={changeAssetTo}
        maxSelectedFieldName={maxSelectedFieldName}
        maxValue={selectedAssetFrom.balance}
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
