import { TokenWithBalance } from '@/domain/common/types'
import { ControlledAddressInput } from '@/features/dialogs/savings/withdraw/components/form/ControlledAddressInput'
import { SendModeOptions } from '@/features/dialogs/savings/withdraw/types'
import { Form } from '@/ui/atoms/form/Form'
import { AssetInputProps } from '@/ui/molecules/asset-input/AssetInput'
import { AssetSelectorWithInput } from '@/ui/organisms/asset-selector-with-input/AssetSelectorWithInput'
import { UseFormReturn } from 'react-hook-form'
import { AssetInputSchema } from '../../logic/form'
import { FormFieldsForDialog } from '../../types'
import { DialogPanelTitle } from '../DialogPanelTitle'

export interface DialogFormProps {
  selectorAssets: TokenWithBalance[]
  assetsFields: FormFieldsForDialog
  form: UseFormReturn<AssetInputSchema>
  variant?: AssetInputProps['variant']
  walletIconLabel?: string
  sendModeOptions?: SendModeOptions
}

export function DialogForm({
  selectorAssets,
  assetsFields,
  form,
  variant,
  walletIconLabel,
  sendModeOptions,
}: DialogFormProps) {
  const { selectedAsset, changeAsset, maxSelectedFieldName, maxValue } = assetsFields

  return (
    <>
      <Form {...form}>
        <DialogPanelTitle>Amount</DialogPanelTitle>
        <AssetSelectorWithInput
          fieldName="value"
          control={form.control}
          selectorAssets={selectorAssets}
          selectedAsset={selectedAsset}
          setSelectedAsset={changeAsset}
          maxValue={maxValue}
          maxSelectedFieldName={maxSelectedFieldName}
          showError
          variant={variant}
          walletIconLabel={walletIconLabel}
        />
      </Form>
      {sendModeOptions?.isSendMode && (
        <Form {...sendModeOptions.receiverForm}>
          <div className="mt-2 mb-3">
            <DialogPanelTitle>Sent to</DialogPanelTitle>
            <ControlledAddressInput form={sendModeOptions.receiverForm} />
          </div>
        </Form>
      )}
    </>
  )
}
