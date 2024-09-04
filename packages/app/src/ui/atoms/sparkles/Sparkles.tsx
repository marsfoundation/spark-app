import { cn } from '@/ui/utils/style'
import { range } from '@/utils/array'
import { randomIntRange } from '@/utils/random'
import { useCallback, useEffect, useRef, useState } from 'react'

const DEFAULT_COLOR = '#FFC700'

export interface SparklesProps extends React.HTMLAttributes<HTMLSpanElement> {
  color?: string
  children: React.ReactNode
  sizeRange?: [number, number]
}

export function Sparkles({ color = DEFAULT_COLOR, children, sizeRange = [10, 18], ...delegated }: SparklesProps) {
  const [sparkles, setSparkles] = useState(() => range(0, 3).map(() => generateSparkle({ color, sizeRange })))

  useRandomInterval(
    () => {
      const sparkle = generateSparkle({ color, sizeRange })
      const now = Date.now()

      const nextSparkles = sparkles.filter((sp) => {
        const delta = now - sp.createdAt
        return delta < 750
      })

      nextSparkles.push(sparkle)

      setSparkles(nextSparkles)
    },
    {
      minDelay: 400,
      maxDelay: 1300,
      enabled: true,
    },
  )
  return (
    <span {...delegated} className={cn(delegated.className, 'relative isolate inline-block')}>
      {sparkles.map((sparkle) => (
        <Sparkle key={sparkle.id} color={sparkle.color} size={sparkle.size} style={sparkle.style} />
      ))}
      <strong className="relative z-10 font-bold">{children}</strong>
    </span>
  )
}

interface SparkleProps {
  size: number
  color: string
  style: React.CSSProperties
}

function Sparkle({ size, color, style }: SparkleProps) {
  const path =
    'M26.5 25.5C19.0043 33.3697 0 34 0 34C0 34 19.1013 35.3684 26.5 43.5C33.234 50.901 34 68 34 68C34 68 36.9884 50.7065 44.5 43.5C51.6431 36.647 68 34 68 34C68 34 51.6947 32.0939 44.5 25.5C36.5605 18.2235 34 0 34 0C34 0 33.6591 17.9837 26.5 25.5Z'

  return (
    <span className="absolute z-20 block motion-safe:animate-sprinkle-come-in-out" style={style}>
      <svg
        className="block motion-safe:animate-sprinkle-spin"
        width={size}
        height={size}
        viewBox="0 0 68 68"
        fill="none"
      >
        <path d={path} fill={color} />
      </svg>
    </span>
  )
}

interface UseRandomIntervalParams {
  minDelay: number
  maxDelay: number
  enabled: boolean
}

function useRandomInterval(callback: () => void, { minDelay, maxDelay, enabled }: UseRandomIntervalParams) {
  const timeoutId = useRef<number | null>(null)
  const savedCallback = useRef(callback)

  const cancel = useCallback(() => {
    if (timeoutId.current !== null) {
      window.clearTimeout(timeoutId.current)
    }
  }, [])

  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  // biome-ignore lint/correctness/useExhaustiveDependencies: cancel is a constant reference
  useEffect(() => {
    if (enabled) {
      function handleTick() {
        const nextTickAt = randomIntRange(minDelay, maxDelay)

        timeoutId.current = window.setTimeout(() => {
          savedCallback.current()

          handleTick()
        }, nextTickAt)
      }

      handleTick()
    }

    return () => {
      if (timeoutId.current !== null) {
        window.clearTimeout(timeoutId.current)
      }
    }
  }, [minDelay, maxDelay])

  return cancel
}

interface GenerateSparkleParams {
  color: string
  sizeRange: [number, number]
}
function generateSparkle({ color, sizeRange }: GenerateSparkleParams) {
  const size = randomIntRange(...sizeRange)
  // this ensures only max 50% of the sparkle is outside the children boundary
  const transformBoundary = `calc(${randomIntRange(0, 100)}% - ${size / 2}px)`

  const sparkle = {
    id: String(randomIntRange(10000, 99999)),
    createdAt: Date.now(),
    color,
    size,
    style: {
      top: transformBoundary,
      left: transformBoundary,
    },
  }

  return sparkle
}
