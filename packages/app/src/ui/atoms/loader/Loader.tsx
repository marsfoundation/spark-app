import { cn } from '@/ui/utils/style'

export interface LoaderProps {
  size?: number
  className?: string
}

export function Loader({ size = 20, className }: LoaderProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('animate-spin', className)}
    >
      <g clipPath="url(#clip0_6109_4274)">
        <path
          d="M10 20C15.421 20 20 15.421 20 10H18C18 14.337 14.337 18 10 18C5.663 18 2 14.337 2 10C2 5.663 5.663 2 10 2V0C4.579 0 0 4.58 0 10C0 15.421 4.579 20 10 20Z"
          fill="url(#paint0_linear_6109_4274)"
        />
      </g>
      <defs>
        <linearGradient id="paint0_linear_6109_4274" x1="10" y1="0" x2="10" y2="20" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFC456" />
          <stop offset="1" stopColor="#FC62BF" />
        </linearGradient>
        <clipPath id="clip0_6109_4274">
          <rect width="20" height="20" fill="white" />
        </clipPath>
      </defs>
    </svg>
  )
}
