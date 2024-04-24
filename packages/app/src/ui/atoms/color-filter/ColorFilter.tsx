import { ReactNode } from 'react'

interface ColorFilterProps {
  variant: 'red' | 'green' | 'blue' | 'none'
  children: ReactNode
}

export function ColorFilter({ variant, children }: ColorFilterProps) {
  if (variant === 'none') {
    return <>{children}</>
  }

  return (
    // style property used instead of tailwind to prevent changing order of filters by prettier */
    // https://tailwindcss.com/blog/automatic-class-sorting-with-prettier */
    <div style={{ filter: `grayscale(100%) sepia(100%) hue-rotate(${variantToHueRotation[variant]})` }}>{children}</div>
  )
}

const variantToHueRotation = { red: '-45deg', green: '90deg', blue: '160deg' }
