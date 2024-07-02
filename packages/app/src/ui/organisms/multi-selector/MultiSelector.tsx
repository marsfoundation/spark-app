import { Control, Controller, useFormContext } from 'react-hook-form'

import { formFormat } from '@/domain/common/format'
import { TokenWithBalance } from '@/domain/common/types'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { AssetInput, AssetInputProps } from '@/ui/molecules/asset-input/AssetInput'
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
  showMaxPlaceholder?: boolean
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
  showMaxPlaceholder,
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
        function toggleIsMaxSelected() {
          if (maxSelectedFieldName) {
            setValue(maxSelectedFieldName, !isMaxSelected, {
              shouldValidate: true,
            })
          }
        }

        const setMaxValue = max?.gt(0)
          ? () => {
              setValue(fieldName, formFormat(max, token.decimals), {
                shouldValidate: true,
              })
              toggleIsMaxSelected()
            }
          : showMaxPlaceholder
            ? toggleIsMaxSelected
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
            setMax={setMaxValue}
            showMaxPlaceholder={maxSelectedFieldName && isMaxSelected && showMaxPlaceholder}
            onChange={(e) => {
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
