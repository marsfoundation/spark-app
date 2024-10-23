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
    selectedAssetIn,
    selectedAssetOut,
    changeAssetIn,
    changeAssetOut,
    assetInOptions,
    assetOutOptions,
    maxSelectedFieldName,
  } = formFields

  return (
    <Form {...form}>
      <div>
        <SelectorWithInputHeader>From</SelectorWithInputHeader>
        <AssetSelectorWithInput
          fieldName="amount"
          control={form.control}
          selectorAssets={assetInOptions}
          selectedAsset={selectedAssetIn}
          setSelectedAsset={changeAssetIn}
          maxSelectedFieldName={maxSelectedFieldName}
          maxValue={selectedAssetIn.balance}
          showError
        />
        <SelectorWithInputHeader>To</SelectorWithInputHeader>
        <AssetSelectorWithInput
          fieldName="amount"
          control={form.control}
          selectorAssets={assetOutOptions}
          selectedAsset={selectedAssetOut}
          setSelectedAsset={changeAssetOut}
          maxSelectedFieldName={maxSelectedFieldName}
          maxValue={selectedAssetIn.balance}
          showError={false}
        />
      </div>
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
