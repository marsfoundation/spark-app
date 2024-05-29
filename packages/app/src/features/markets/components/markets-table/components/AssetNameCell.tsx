import { ReserveStatus } from '@/domain/market-info/reserve-status'
import { Token } from '@/domain/types/Token'
import { getTokenImage } from '@/ui/assets'
import { ColorFilter } from '@/ui/atoms/color-filter/ColorFilter'
import { TokenIcon } from '@/ui/atoms/token-icon/TokenIcon'
import { Tooltip, TooltipContentShort, TooltipTrigger } from '@/ui/atoms/tooltip/Tooltip'
import { FrozenPill } from '@/ui/molecules/frozen-pill/FrozenPill'
import { PausedPill } from '@/ui/molecules/paused-pill/PausedPill'
import { cn } from '@/ui/utils/style'
import { useIsTruncated } from '@/ui/utils/useIsTruncated'

interface AssetNameCellProps {
  token: Token
  reserveStatus: ReserveStatus
  // @todo Use when implementing mobile view
  // depositAPYDetails: APYDetails
  // borrowAPYDetails: APYDetails
  // mobileViewOptions?: MobileViewOptions
}

export function AssetNameCell({ token, reserveStatus }: AssetNameCellProps) {
  const tokenImage = getTokenImage(token.symbol)
  const isPaused = reserveStatus === 'paused'
  const isFrozen = reserveStatus === 'frozen'

  return (
    <div className="flex flex-row items-center gap-3 py-2">
      {tokenImage && (
        <div className="flex shrink-0">
          <ColorFilter variant={isPaused ? 'red' : 'none'}>
            <TokenIcon token={token} className="flex h-6 w-6 lg:h-6 md:h-5 lg:w-6 md:w-5" />
          </ColorFilter>
        </div>
      )}
      <div className="flex min-w-0 flex-col">
        <TokenName token={token} className={cn(isPaused && 'text-red-600')} />
        <p className={cn('text-slate-500 text-sx leading-none', isPaused && 'text-red-300')}>{token.symbol}</p>
      </div>
      {isFrozen && <FrozenPill />}
      {isPaused && <PausedPill />}
    </div>
  )
}

interface TokenNameProps {
  token: Token
  className?: string
}

export function TokenName({ token, className }: TokenNameProps) {
  const [tokenNameRef, isTruncated] = useIsTruncated()

  return (
    <Tooltip open={!isTruncated ? false : undefined}>
      <TooltipTrigger asChild>
        <p className={cn('truncate font-semibold text-base lg:text-base md:text-sm', className)} ref={tokenNameRef}>
          {token.name}
        </p>
      </TooltipTrigger>
      <TooltipContentShort>{token.name}</TooltipContentShort>
    </Tooltip>
  )
}
