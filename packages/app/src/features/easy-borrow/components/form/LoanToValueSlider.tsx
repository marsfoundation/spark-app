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
      <SliderPrimitive.Track className="relative h-6 w-full rounded-lg border bg-white/20">
        {steps[0] && steps[1] && steps[2] && (
          <div
            className="absolute inset-0 rounded-l-lg"
            style={{
              width: `${steps[0].width + steps[1].width + steps[2].width}%`,
              background: `linear-gradient(to right,
              #6FE67A ${steps[0].from}%,
              #6FE67A ${steps[0].width}%,
              #FEE473 ${steps[0].width + steps[1].width / 3}%,
              #FEE473 ${steps[0].width + steps[1].width * 0.8}%,
              #FEE473 ${steps[2].from}%,
              #FC3897 ${steps[2].from + steps[2].width * 0.3}%)`,
            }}
          />
        )}

        {steps.map((step, index) => (
          <div
            key={step.label}
            className={cn(
              'absolute flex h-full items-center justify-center transition-all duration-300',
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
            <Typography variant="prompt" className={cn('-bottom-6 absolute text-primary')}>
              {step.label}
            </Typography>
          </div>
        ))}

        <div
          className="absolute h-full w-1 bg-primary-bg"
          style={{
            left: `${(maxSelectableValue / maxSliderValue) * 100}%`,
          }}
        />

        <div
          className="absolute flex h-full w-1 items-center justify-center bg-product-red"
          style={{
            left: `${liquidationValue}%`,
          }}
        >
          <Typography
            variant="prompt"
            className={cn('absolute text-product-red', liquidationValue < 70 ? '-bottom-14' : '-bottom-6')}
          >
            Liquidation
          </Typography>
          <Typography className={cn('absolute bottom-8 text-product-red')} variant="prompt">
            {formatPercentage(liquidationLtv)}
          </Typography>
        </div>

        <SliderPrimitive.Range className="absolute h-full bg-transparent" />
      </SliderPrimitive.Track>

      <SliderPrimitive.Thumb className="blockshadow transition-colors disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none">
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
    colorActive: 'backdrop-brightness-100',
    colorInactive: 'backdrop-brightness-75',
    label: 'Conservative',
  }

  const moderate: Step = {
    from: conservative.width,
    width: healthFactorToLtv(RISKY_HEALTH_FACTOR_THRESHOLD, liquidationThreshold).toNumber() * 100 - conservative.width,
    colorActive: 'backdrop-brightness-100',
    colorInactive: 'backdrop-brightness-75',
    label: 'Moderate',
  }

  const aggressive: Step = {
    from: conservative.width + moderate.width,
    width: liquidationThreshold.toNumber() * 100 - conservative.width - moderate.width,
    colorActive: 'backdrop-brightness-100',
    colorInactive: 'backdrop-brightness-75',
    label: 'Aggressive',
    noUpperLimit: true,
  }

  return [conservative, moderate, aggressive]
}
