import * as Portal from '@radix-ui/react-portal'
import ReactConfetti, { Props as ReactConfettiProps } from 'react-confetti'

import { useWindowSize } from '@/ui/utils/useWindowSize'

// @note: Without explicitly setting dimensions of ReactConfetti component,
// canvas size will default to initial window size and won't update on resize
// which can cause document to be stretched after layout changes.
// Rendered in portal to be independent of parent layout
export function Confetti(props: ReactConfettiProps) {
  const { width, height } = useWindowSize()
  return (
    <Portal.Root>
      <ReactConfetti {...props} width={width} height={height} />
    </Portal.Root>
  )
}
