import { Control, FieldPath, FieldValues } from 'react-hook-form'

import { TokenWithBalance } from '@/domain/common/types'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { AssetInputProps } from '@/ui/molecules/asset-input/AssetInput'
import { cn } from '@/ui/utils/style'

import { AssetSelector } from '../../molecules/asset-selector/AssetSelector'
import { ControlledMultiSelectorAssetInput } from '../multi-selector/MultiSelector'

export interface AssetSelectorWithInputProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>
  fieldName: FieldPath<TFieldValues>
  selectorAssets: TokenWithBalance[]
  selectedAsset: TokenWithBalance
  setSelectedAsset: (selectedAsset: TokenSymbol) => void
  maxValue?: NormalizedUnitNumber
  maxSelectedFieldName?: string
  removeSelectedAsset?: () => void
  disabled?: boolean
  showError?: boolean // defaults to show error if field is touched or dirty
  className?: string
  variant?: AssetInputProps['variant']
  walletIconLabel?: string
}

export function AssetSelectorWithInput<TFieldValues extends FieldValues>({
  control,
  fieldName,
  selectorAssets,
  selectedAsset,
  setSelectedAsset,
  maxValue,
  removeSelectedAsset,
  disabled,
  showError,
  className,
  variant,
  walletIconLabel,
  maxSelectedFieldName,
}: AssetSelectorWithInputProps<TFieldValues>) {
  return (
    <div className={cn('flex w-full flex-row justify-between gap-2', className)}>
      <AssetSelector
        assets={selectorAssets}
        selectedAsset={selectedAsset.token}
        setSelectedAsset={(newAsset) => setSelectedAsset(newAsset)}
        disabled={disabled}
      />
      <ControlledMultiSelectorAssetInput
        fieldName={fieldName}
        control={control}
        disabled={disabled}
        token={selectedAsset.token}
        onRemove={removeSelectedAsset}
        balance={selectedAsset.balance}
        max={maxSelectedFieldName === undefined ? maxValue ?? selectedAsset.balance : undefined}
        maxSelectedFieldName={maxSelectedFieldName}
        showError={showError}
        variant={variant}
        walletIconLabel={walletIconLabel}
      />
    </div>
  )
}
