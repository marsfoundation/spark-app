import { UseFormReturn } from 'react-hook-form'

import { Form } from '@/ui/atoms/form/Form'
import { AssetInput } from '@/ui/organisms/asset-input/AssetInput'
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
      <AssetInput
        label="From"
        fieldName="amount"
        control={form.control}
        selectorAssets={assetInOptions}
        selectedAsset={selectedAssetIn}
        setSelectedAsset={changeAssetIn}
        maxSelectedFieldName={maxSelectedFieldName}
        maxValue={selectedAssetIn.balance}
        showError
      />
      <AssetInput
        label="To"
        fieldName="amount"
        control={form.control}
        selectorAssets={assetOutOptions}
        selectedAsset={selectedAssetOut}
        setSelectedAsset={changeAssetOut}
        maxSelectedFieldName={maxSelectedFieldName}
        maxValue={selectedAssetIn.balance}
        showError={false}
      />
    </Form>
  )
}
