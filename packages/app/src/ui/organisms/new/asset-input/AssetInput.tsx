import { formFormat } from '@/domain/common/format'
import { TokenWithBalance } from '@/domain/common/types'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { AssetSelector } from '@/ui/molecules/new/asset-selector/AssetSelector'
import { cn } from '@/ui/utils/style'
import { testIds } from '@/ui/utils/testIds'
import { parseBigNumber } from '@/utils/bigNumber'
import BigNumber from 'bignumber.js'
import { Control, FieldPath, FieldValues, useController, useFormContext } from 'react-hook-form'

export interface AssetInputProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>
  fieldName: FieldPath<TFieldValues>
  selectorAssets: TokenWithBalance[]
  selectedAsset: TokenWithBalance
  setSelectedAsset: (selectedAsset: TokenSymbol) => void
  maxValue?: NormalizedUnitNumber
  maxSelectedFieldName?: string
  disabled?: boolean
  showError?: boolean // defaults to show error if field is touched or dirty
}

export function AssetInput<TFieldValues extends FieldValues>({
  fieldName,
  control,
  selectorAssets,
  selectedAsset,
  setSelectedAsset,
  showError = true,
  disabled = false,
  maxValue,
  maxSelectedFieldName,
}: AssetInputProps<TFieldValues>) {
  const { setValue, trigger, getValues } = useFormContext()
  const {
    field,
    fieldState: { error, isTouched, isDirty },
  } = useController({
    name: fieldName,
    control,
  })

  showError = showError ?? (isTouched || isDirty)
  const isMaxSelected = maxSelectedFieldName ? getValues(maxSelectedFieldName) : false
  const token = selectedAsset.token
  const value = field.value === '' ? '0' : field.value

  function toggleIsMaxSelected() {
    if (maxSelectedFieldName) {
      setValue(maxSelectedFieldName, !isMaxSelected, {
        shouldValidate: true,
      })
    }
  }

  const setMaxValue = maxValue?.gt(0)
    ? () => {
        setValue(fieldName, formFormat(maxValue, token.decimals) as any, {
          shouldValidate: true,
        })
        toggleIsMaxSelected()
      }
    : undefined

  const inputValue = (() => {
    if (isMaxSelected) {
      const valueAsBigNumber = BigNumber(field.value)
      if (!valueAsBigNumber.isNaN()) {
        return valueAsBigNumber.dp(6).toFixed()
      }
    }

    return field.value
  })()

  return (
    <div className="flex flex-col gap-0.5">
      <div
        className={cn(
          'grid grid-cols-[auto_1fr_auto] items-center gap-3 p-2 pr-4',
          'rounded-sm border border-reskin-border-primary bg-reskin-bg-secondary',
          'focus-within:border-reskin-border-brand-primary',
          disabled && 'cursor-not-allowed bg-reskin-bg-secondary/50',
          showError && error && 'border-reskin-bg-system-error-secondary bg-reskin-bg-system-error-primary',
        )}
      >
        <div className="min-w-[120px]">
          <AssetSelector
            assets={selectorAssets}
            selectedAsset={token}
            setSelectedAsset={setSelectedAsset}
            disabled={disabled}
          />
        </div>
        <div className="flex min-w-0 flex-col gap-0.5">
          <input
            type="text"
            inputMode="decimal"
            className={cn(
              'typography-label-4 text-primary focus:outline-none',
              disabled && 'cursor-not-allowed opacity-50',
            )}
            placeholder="0"
            size={1} // force minimum width
            autoComplete="off"
            data-testid={testIds.component.AssetInput.input}
            {...field}
            disabled={disabled}
            value={inputValue}
            onChange={(e) => {
              e.target.value = e.target.value.replace(/,/g, '.')
              e.target.value = e.target.value.replace(/\s/g, '')
              const value = e.target.value
              if (!value || (decimalNumberRegex.test(value) && (value.split('.')[1]?.length ?? 0) <= token.decimals)) {
                field.onChange(e)
                if (maxSelectedFieldName) {
                  setValue(maxSelectedFieldName, false, {
                    shouldValidate: true,
                  })
                }
                // always trigger validation of the whole form
                trigger().catch(console.error)
              }
            }}
          />
          <div className={cn('typography-label-6 truncate text-secondary', disabled && 'opacity-50')}>
            {token.formatUSD(NormalizedUnitNumber(parseBigNumber(value, 0)))}
          </div>
        </div>
        {maxValue && (
          <div className="flex flex-col items-end justify-center gap-0.5">
            <button
              onClick={disabled ? undefined : setMaxValue}
              className={cn(
                'typography-label-5 text-brand disabled:text-secondary',
                disabled && 'cursor-not-allowed opacity-50',
              )}
              disabled={disabled || isMaxSelected}
              data-testid={testIds.component.AssetInput.maxButton}
            >
              MAX
            </button>
            <div className={cn('typography-body-6 text-secondary', disabled && 'opacity-50')}>
              {token.format(maxValue, { style: 'compact' })} {token.symbol}
            </div>
          </div>
        )}
      </div>
      {showError && error && (
        <div data-testid={testIds.component.AssetInput.error} className="typography-label-6 text-error">
          {error.message}
        </div>
      )}
    </div>
  )
}

const decimalNumberRegex = /^\d+\.?\d*$/
