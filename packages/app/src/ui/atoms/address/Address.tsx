import { CheckedAddress } from '@/domain/types/CheckedAddress'
import { cn } from '@/ui/utils/style'
import { useResizeObserver } from '@/ui/utils/useResizeObserver'
import { CSSProperties, useCallback, useEffect, useRef } from 'react'

export interface AddressProps {
  width?: CSSProperties['width']
  address: CheckedAddress
  className?: string
  endVisibleCharacters?: number
  startVisibleCharacters?: number
  inlineIcon?: JSX.Element
}

export function Address({
  className,
  address,
  width,
  endVisibleCharacters = 4,
  startVisibleCharacters = 4,
  inlineIcon,
}: AddressProps) {
  const parentRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const inlineIconRef = useRef<HTMLDivElement>(null)

  const setTextContent = useCallback(
    (node: HTMLDivElement) => {
      const textNode = textRef.current

      if (textNode === null) {
        return
      }

      // reset text back to data-address-text if it exists.
      // This is required to when the width is increased and less text is needed to be ellipsed
      textNode.textContent = textNode.getAttribute('data-address')

      const updatedText = createEllipseWhileTruncated({
        parentNode: node,
        textNode,
        endVisibleCharacters,
        startVisibleCharacters,
        iconWidth: inlineIconRef.current ? inlineIconRef.current.getBoundingClientRect().width + 8 : 0,
      })

      textNode.textContent = updatedText
    },
    [startVisibleCharacters, endVisibleCharacters],
  )

  // biome-ignore lint/correctness/useExhaustiveDependencies: we want to run this when the address changes
  useEffect(() => {
    if (parentRef.current) {
      setTextContent(parentRef.current)
    }
  }, [setTextContent, address])

  useResizeObserver({
    ref: parentRef,
    onResize: () => {
      if (parentRef.current) {
        setTextContent(parentRef.current)
      }
    },
  })

  return (
    <div
      aria-label={address}
      ref={parentRef}
      className={cn('inline-flex w-full min-w-0 items-center gap-0 overflow-hidden', className)}
      style={{
        width,
      }}
    >
      <span aria-hidden="true" ref={textRef} data-address={address} />
      {inlineIcon && (
        <span ref={inlineIconRef} className="pl-[8px]">
          {inlineIcon}
        </span>
      )}
    </div>
  )
}

interface CreateEllipseWhileTruncatedParams {
  parentNode: HTMLElement
  textNode: HTMLElement
  endVisibleCharacters: number
  startVisibleCharacters: number
  iconWidth: number
}

function createEllipseWhileTruncated({
  parentNode,
  textNode,
  endVisibleCharacters,
  startVisibleCharacters,
  iconWidth,
}: CreateEllipseWhileTruncatedParams) {
  const containerWidth = parentNode.offsetWidth - iconWidth
  const textWidth = textNode.offsetWidth

  let text = textNode.textContent || ''

  const isTruncated = textWidth > containerWidth

  if (isTruncated) {
    const averageCharSize = textWidth / text.length
    const canFit = containerWidth / averageCharSize

    const ellipsisSize = 4
    const charsToRemove = Math.floor((text.length - canFit + ellipsisSize) / 2)

    const midpoint = Math.floor(text.length / 2)
    const startSlice = Math.max(midpoint - charsToRemove, startVisibleCharacters)
    const endSlice = Math.min(midpoint + charsToRemove, text.length - endVisibleCharacters)

    const firstPart = text.slice(0, startSlice)
    const secondPart = text.slice(endSlice)

    text = `${firstPart}...${secondPart}`
  }

  return text
}
