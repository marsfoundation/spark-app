import { TokenWithBalance } from '@/domain/common/types'
import { Form } from '@/ui/atoms/form/Form'
import { AssetInput } from '@/ui/organisms/asset-input/AssetInput'
import { UseFormReturn } from 'react-hook-form'
import { AssetInputSchema } from '../../logic/form'
import { FormFieldsForDialog } from '../../types'

export interface DialogFormProps {
  selectorAssets: TokenWithBalance[]
  assetsFields: FormFieldsForDialog
  form: UseFormReturn<AssetInputSchema>
}

export function DialogForm({ selectorAssets, assetsFields, form }: DialogFormProps) {
  const { selectedAsset, changeAsset, maxSelectedFieldName, maxValue } = assetsFields

  return (
    <Form {...form}>
      <AssetInput
        label="Amount"
        fieldName="value"
        control={form.control}
        selectorAssets={selectorAssets}
        selectedAsset={selectedAsset}
        setSelectedAsset={changeAsset}
        maxValue={maxValue}
        maxSelectedFieldName={maxSelectedFieldName}
        showError
      />
    </Form>
  )
}
