import { cn } from '@/ui/utils/style'
import { CSSProperties } from 'react'

interface ShortenedAddressProps {
  address: string
  endVisibleCharacters?: number
  className?: string
}

export function Address({ address, endVisibleCharacters = 4, className }: ShortenedAddressProps) {
  return (
    <span
      className={cn('overflow-hidden whitespace-nowrap', className)}
      aria-label={address}
      style={
        {
          '--end-visible-characters': endVisibleCharacters,
        } as CSSProperties
      }
    >
      <span
        aria-hidden="true"
        className={
          'inline-block min-w-[calc(var(--end-visible-characters)*1ch)] max-w-[calc(100%-calc(var(--end-visible-characters)*1ch))] overflow-hidden text-ellipsis whitespace-nowrap align-middle'
        }
      >
        {address.slice(0, address.length - endVisibleCharacters)}
      </span>
      <span
        aria-hidden="true"
        className={
          'rtl inline-block max-w-[calc(100%-calc(var(--end-visible-characters)*1ch))] overflow-hidden whitespace-nowrap align-bottom'
        }
      >
        {address.slice(-endVisibleCharacters)}
      </span>
    </span>
  )
}
