import { Control, Controller, useFormContext } from 'react-hook-form'

import { formFormat } from '@/domain/common/format'
import { TokenWithBalance } from '@/domain/common/types'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { AssetInput, AssetInputProps, MAX_VALUE_PLACEHOLDER } from '@/ui/molecules/asset-input/AssetInput'
import { testIds } from '@/ui/utils/testIds'

import { AssetSelectorWithInput } from '../asset-selector-with-input/AssetSelectorWithInput'

export interface MultiAssetSelectorProps {
  fieldName: string
  selectedAssets: TokenWithBalance[]
  allAssets: TokenWithBalance[]
  assetToMaxValue: Record<TokenSymbol, NormalizedUnitNumber>
  removeAsset: (index: number) => void
  changeAsset: (index: number, newAssetSymbol: TokenSymbol) => void
  control: Control<any>
  disabled?: boolean
  showError?: boolean
}

export function MultiAssetSelector({
  fieldName,
  selectedAssets,
  allAssets,
  assetToMaxValue,
  removeAsset,
  changeAsset,
  control,
  disabled,
  showError,
}: MultiAssetSelectorProps) {
  return (
    <div>
      {selectedAssets.map((asset, index) => {
        return (
          <div key={asset.token.symbol} className="mt-2" data-testid={testIds.component.MultiAssetSelector.group}>
            <AssetSelectorWithInput
              fieldName={`${fieldName}.${index}.value`}
              control={control}
              selectorAssets={allAssets.filter((s) => !selectedAssets.some((a) => a.token.symbol === s.token.symbol))}
              selectedAsset={asset}
              setSelectedAsset={(newAsset) => changeAsset(index, newAsset)}
              removeSelectedAsset={selectedAssets.length > 1 ? () => removeAsset(index) : undefined}
              maxValue={assetToMaxValue[asset.token.symbol]}
              disabled={disabled}
              showError={showError}
            />
          </div>
        )
      })}
    </div>
  )
}

interface ControlledMultiSelectorAssetInputProps {
  fieldName: string
  control: Control<any>
  token: Token
  max?: NormalizedUnitNumber
  maxSelectedFieldName?: string
  onRemove?: () => void
  balance?: NormalizedUnitNumber
  disabled?: boolean
  showError?: boolean // defaults to show error if field is touched or dirty
  variant?: AssetInputProps['variant']
  walletIconLabel?: string
}

export function ControlledMultiSelectorAssetInput({
  fieldName,
  control,
  disabled,
  token,
  onRemove,
  balance,
  max,
  maxSelectedFieldName,
  showError,
  variant,
  walletIconLabel,
}: ControlledMultiSelectorAssetInputProps) {
  const { setValue, trigger } = useFormContext()

  return (
    <Controller
      name={fieldName}
      control={control}
      render={({ field, fieldState: { error, isTouched, isDirty } }) => {
        showError = showError ?? (isTouched || isDirty)
        const isMaxSelected = (control as any)?._formValues?.isMaxSelected // as any & ?. are needed to make storybook happy

        const setMaxValue = max?.gt(0)
          ? () => {
              setValue(fieldName, formFormat(max, token.decimals), {
                shouldValidate: true,
              })
            }
          : undefined

        const setMaxSelectedField = maxSelectedFieldName
          ? () => {
              setValue(maxSelectedFieldName, !isMaxSelected, {
                shouldValidate: true,
              })
              if (!isMaxSelected) {
                setValue(fieldName, '', {
                  shouldValidate: true,
                })
              }
            }
          : undefined

        return (
          <AssetInput
            {...field}
            token={token}
            onRemove={onRemove}
            balance={balance}
            error={showError ? error?.message : undefined}
            disabled={disabled}
            variant={variant}
            walletIconLabel={walletIconLabel}
            setMax={setMaxValue ?? setMaxSelectedField}
            isMaxSelected={maxSelectedFieldName && isMaxSelected}
            onChange={(e) => {
              if (e.target.value === MAX_VALUE_PLACEHOLDER.slice(0, -1)) {
                // backspace was pressed while MAX was selected
                ;(setMaxValue ?? setMaxSelectedField)?.()
                return
              }

              e.target.value = e.target.value.replace(/,/g, '.')
              const value = e.target.value

              const validNumberInput =
                !value || (decimalNumberRegex.test(value) && (value.split('.')[1]?.length ?? 0) <= 6)
              if (!validNumberInput) {
                return
              }

              field.onChange(e)
              if (maxSelectedFieldName) {
                setValue(maxSelectedFieldName, false, {
                  shouldValidate: false,
                })
              }
              // always trigger validation of the whole form
              trigger().catch(console.error)
            }}
          />
        )
      }}
    />
  )
}

const decimalNumberRegex = /^\d+\.?\d*$/
