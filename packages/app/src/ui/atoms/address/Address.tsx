import { cn } from '@/ui/utils/style'
import { useResizeObserver } from '@/ui/utils/useResizeObserver'
import { CSSProperties, useCallback, useEffect, useRef } from 'react'
import { Address as AddressType } from 'viem'

export interface AddressTruncateProps {
  address: AddressType
  endVisibleCharacters?: number
  startVisibleCharacters?: number
  className?: string
}

const staticPartClasses = 'inline-block flex-basis-content shrink-0 grow-0 overflow-hidden whitespace-nowrap'

/**
 * @param address - Address to be truncated, validation is omitted
 */
export function AddressTruncate({
  address,
  endVisibleCharacters = 4,
  startVisibleCharacters = 6,
  className,
}: AddressProps) {
  // subtract 1 to account for the ellipsis character
  const startCharacters = startVisibleCharacters - 1

  return (
    <span className={cn(className, 'flex min-w-0 flex-row flex-nowrap justify-start')} aria-label={address}>
      <span aria-hidden="true" className={staticPartClasses}>
        {address.slice(0, startCharacters)}
      </span>
      {/* min width of 2ch (ellipsis sign + 1 character) is to prevent hiding the ellipsis on lower widths */}
      <span aria-hidden="true" className="min-w-[2ch] flex-shrink overflow-hidden text-ellipsis whitespace-nowrap">
        {address.slice(startCharacters, address.length - endVisibleCharacters)}
      </span>
      <span aria-hidden="true" className={staticPartClasses}>
        {address.slice(-endVisibleCharacters)}
      </span>
    </span>
  )
}

export function AddressTruncateMiddle({ address, className }: AddressProps) {
  return (
    <div className={cn(className, 'flex min-w-0 flex-row flex-nowrap justify-start')} aria-label={address}>
      <div aria-hidden="true" className="flex-shrink overflow-hidden text-ellipsis whitespace-nowrap">
        {address.slice(0, Math.floor(address.length / 2))}
      </div>
      <div
        aria-hidden="true"
        className="rtl flex-basis-content flex-shrink flex-grow-0 overflow-hidden whitespace-nowrap"
        style={
          {
            align: 'right',
          } as CSSProperties
        }
      >
        {address.slice(Math.ceil(address.length / 2))}
      </div>
    </div>
  )
}

export interface AddressProps {
  // TODO check if CheckedAddress is better eg. variableDebtTokenAddress
  width?: CSSProperties['width']
  address: AddressType
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
  const measuredParentRef = useRef<HTMLDivElement>(null)
  const measuredTextRef = useRef<HTMLDivElement>(null)
  const inlineIconRef = useRef<HTMLDivElement>(null)

  const setTextContent = useCallback(
    (node: HTMLDivElement) => {
      const txtToEllipse = measuredTextRef.current
      const parent = node.parentNode as HTMLElement | null

      if (txtToEllipse === null || parent === null) {
        return
      }

      // reset text back to data-address-text if it exists.
      // This is required to when the width is increased and less text is needed to be ellipsed
      txtToEllipse.textContent = txtToEllipse.getAttribute('data-address')

      const updatedText = createEllipseWhileTruncated({
        parentNode: node,
        textNode: txtToEllipse,
        endVisibleCharacters,
        startVisibleCharacters,
        iconWidth: inlineIconRef.current ? inlineIconRef.current.getBoundingClientRect().width + 8 : 0,
      })

      txtToEllipse.textContent = updatedText
    },
    [startVisibleCharacters, endVisibleCharacters],
  )

  // biome-ignore lint/correctness/useExhaustiveDependencies: we want to run this when the address changes
  useEffect(() => {
    if (measuredParentRef.current) {
      setTextContent(measuredParentRef.current)
    }
  }, [setTextContent, address])

  useResizeObserver({
    ref: measuredParentRef,
    onResize: () => {
      if (measuredParentRef.current) {
        setTextContent(measuredParentRef.current)
      }
    },
  })

  return (
    <div
      aria-label={address}
      ref={measuredParentRef}
      className={cn('inline-flex w-full min-w-0 items-center gap-0 overflow-hidden', className)}
      style={{
        width,
      }}
    >
      <span aria-hidden="true" ref={measuredTextRef} data-address={address} />
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
