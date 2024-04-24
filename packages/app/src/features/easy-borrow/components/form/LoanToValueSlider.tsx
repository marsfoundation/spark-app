import { valueToBigNumber } from '@aave/math-utils'
import * as SliderPrimitive from '@radix-ui/react-slider'

import { formatPercentage } from '@/domain/common/format'
import { MODERATE_HEALTH_FACTOR_THRESHOLD, RISKY_HEALTH_FACTOR_THRESHOLD } from '@/domain/common/risk'
import { healthFactorToLtv } from '@/domain/market-info/math'
import { Percentage } from '@/domain/types/NumericValues'
import { assets } from '@/ui/assets'
import { Typography } from '@/ui/atoms/typography/Typography'
import { cn } from '@/ui/utils/style'

export interface LoanToValueSliderProps {
  className: string
  ltv: Percentage
  maxAvailableLtv: Percentage
  liquidationLtv: Percentage
  disabled?: boolean
  onLtvChange: (value: Percentage) => void
}

export function LoanToValueSlider({
  className,
  maxAvailableLtv,
  liquidationLtv,
  disabled,
  ltv,
  onLtvChange,
}: LoanToValueSliderProps) {
  const steps = getSliderSteps(liquidationLtv)
  const value = ltv.toNumber() * maxSliderValue
  const maxSelectableValue = maxAvailableLtv.toNumber() * maxSliderValue
  const liquidationValue = liquidationLtv.toNumber() * 100

  // eslint-disable-next-line func-style
  const onValueChange = (values: number[]) => {
    const value = Math.min(values[0] ?? 0, maxSelectableValue)

    const newLTV = valueToBigNumber(value).dividedBy(maxSliderValue)

    onLtvChange(Percentage(newLTV))
  }

  return (
    <SliderPrimitive.Root
      disabled={disabled}
      className={cn('relative mb-8 flex w-full touch-none select-none items-center', className)}
      max={maxSliderValue}
      value={[value]}
      onValueChange={onValueChange}
    >
      <SliderPrimitive.Track className="relative h-6 w-full rounded-lg border bg-white">
        {steps.map((step, index) => (
          <div
            key={step.label}
            className={cn(
              `absolute flex h-full items-center justify-center transition-colors duration-300`,
              (value / maxSliderValue) * 100 >= step.from &&
                (step.noUpperLimit || (value / maxSliderValue) * 100 < step.from + step.width)
                ? step.colorActive
                : step.colorInactive,
              index === 0 && 'rounded-s-lg',
            )}
            style={{
              width: `${step.width}%`,
              left: `${step.from}%`,
            }}
          >
            <Typography variant="prompt" className={cn('text-primary absolute -bottom-6')}>
              {step.label}
            </Typography>
          </div>
        ))}

        <div
          className="bg-primary-bg absolute h-full w-1"
          style={{
            left: `${(maxSelectableValue / maxSliderValue) * 100}%`,
          }}
        />

        <div
          className="bg-product-red absolute flex h-full w-1 items-center justify-center"
          style={{
            left: `${liquidationValue}%`,
          }}
        >
          <Typography
            variant="prompt"
            className={cn('text-product-red absolute ', liquidationValue < 70 ? '-bottom-14' : '-bottom-6')}
          >
            Liquidation
          </Typography>
          <Typography className={cn('text-product-red absolute bottom-8')} variant="prompt">
            {formatPercentage(liquidationLtv)}
          </Typography>
        </div>

        <SliderPrimitive.Range className="absolute h-full bg-transparent" />
      </SliderPrimitive.Track>

      <SliderPrimitive.Thumb className="blockshadow transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 ">
        <img
          className={cn('transform transition-transform', !disabled && 'hover:scale-125')}
          src={assets.sliderThumb}
        />
      </SliderPrimitive.Thumb>
    </SliderPrimitive.Root>
  )
}

const maxSliderValue = 10000

interface Step {
  label: string
  width: number
  from: number
  colorActive: string
  colorInactive: string
  noUpperLimit?: boolean
}

function getSliderSteps(liquidationThreshold: Percentage): Step[] {
  const conservative: Step = {
    from: 0,
    width: healthFactorToLtv(MODERATE_HEALTH_FACTOR_THRESHOLD, liquidationThreshold).toNumber() * 100,
    colorActive: 'bg-product-green',
    colorInactive: 'bg-product-green/inactive',
    label: 'Conservative',
  }

  const moderate: Step = {
    from: conservative.width,
    width: healthFactorToLtv(RISKY_HEALTH_FACTOR_THRESHOLD, liquidationThreshold).toNumber() * 100 - conservative.width,
    colorActive: 'bg-product-orange',
    colorInactive: 'bg-product-orange/inactive',
    label: 'Moderate',
  }

  const aggressive: Step = {
    from: conservative.width + moderate.width,
    width: liquidationThreshold.toNumber() * 100 - conservative.width - moderate.width,
    colorActive: 'bg-product-red',
    colorInactive: 'bg-product-red/inactive',
    label: 'Aggressive',
    noUpperLimit: true,
  }

  return [conservative, moderate, aggressive]
}
