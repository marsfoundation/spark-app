import { X } from 'lucide-react'
import { forwardRef } from 'react'

import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'
import { assets as uiAssets } from '@/ui/assets'
import { Button } from '@/ui/atoms/button/Button'
import { type InputProps } from '@/ui/atoms/input/Input'
import { Typography } from '@/ui/atoms/typography/Typography'
import { cn } from '@/ui/utils/style'
import { testIds } from '@/ui/utils/testIds'
import { parseBigNumber } from '@/utils/bigNumber'
import BigNumber from 'bignumber.js'

export type AssetInputProps = {
  token: Token
  className?: string | undefined
  onRemove?: () => void
  setMax?: () => void
  isMaxSelected?: boolean
  balance?: NormalizedUnitNumber
  disabled?: boolean
  error?: string
  value: string
  variant?: 'usd' | 'crypto'
  walletIconLabel?: string
} & InputProps

export const AssetInput = forwardRef<HTMLInputElement, AssetInputProps>(
  (
    {
      token,
      className,
      onRemove,
      setMax,
      balance,
      disabled,
      error,
      value,
      onChange,
      variant = 'crypto',
      walletIconLabel,
      isMaxSelected,
      ...rest
    },
    ref,
  ) => {
    const inputValue = (() => {
      if (isMaxSelected) {
        const valueAsBigNumber = BigNumber(value)
        if (!valueAsBigNumber.isNaN()) {
          return valueAsBigNumber.dp(6).toFixed()
        }
      }

      return value
    })()

    return (
      <div className="flex-1">
        <div
          className={cn(
            'flex h-14 min-w-[10rem] flex-row rounded-xl border bg-input-background py-2 pr-2 pl-4',
            disabled && 'opacity-70',
            error && 'mb-1 border-error bg-error/10',
            className,
          )}
        >
          <div className="flex grow flex-col">
            <input
              type="text"
              inputMode="decimal"
              className={cn('flex bg-transparent focus:outline-none', error && 'text-error')}
              ref={ref}
              placeholder="0"
              id="asset-input"
              disabled={disabled}
              size={1} // force minimum width
              value={inputValue}
              data-testid={testIds.component.AssetInput.input}
              {...rest}
              onChange={(e) => {
                e.target.value = e.target.value.replace(/,/g, '.')
                e.target.value = e.target.value.replace(/\s/g, '')
                const value = e.target.value
                if (
                  !value ||
                  (decimalNumberRegex.test(value) && (value.split('.')[1]?.length ?? 0) <= token.decimals)
                ) {
                  onChange?.(e)
                }
              }}
            />
            {token && (
              <Typography variant="prompt" className="overflow-auto break-all">
                {token.formatUSD(NormalizedUnitNumber(parseBigNumber(value, 0)))}
              </Typography>
            )}
          </div>
          <div className="flex flex-row">
            <div className="flex flex-col items-end">
              {setMax && (
                <Button
                  onClick={disabled ? undefined : setMax}
                  className={cn('p-1', balance && 'p-0 text-xs')}
                  disabled={isMaxSelected}
                  variant="text"
                  data-testid={testIds.component.AssetInput.maxButton}
                >
                  MAX
                </Button>
              )}
              {balance && (
                <div className="mt-auto flex flex-row items-center">
                  {walletIconLabel && (
                    <Typography variant="prompt" className="mr-1">
                      {walletIconLabel}
                    </Typography>
                  )}
                  <img className="mr-1" src={uiAssets.wallet} alt="wallet" />
                  <Typography variant="prompt">
                    {variant === 'crypto'
                      ? token!.format(balance, { style: 'compact' })
                      : token?.formatUSD(balance, { compact: true })}
                  </Typography>
                </div>
              )}
            </div>
            {onRemove && (
              <Button
                onClick={disabled ? undefined : onRemove}
                className={cn('p-1 text-icon-foreground')}
                variant="text"
              >
                <X />
              </Button>
            )}
          </div>
        </div>
        {error && (
          <Typography data-testid={testIds.component.AssetInput.error} variant="prompt" className="text-error">
            {error}
          </Typography>
        )}
      </div>
    )
  },
)

AssetInput.displayName = 'AssetInput'

const decimalNumberRegex = /^\d+\.?\d*$/
