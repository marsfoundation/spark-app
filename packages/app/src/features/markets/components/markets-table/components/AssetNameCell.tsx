import { ReserveStatus } from '@/domain/market-info/reserve-status'
import { Token } from '@/domain/types/Token'
import { getTokenImage } from '@/ui/assets'
import { ColorFilter } from '@/ui/atoms/color-filter/ColorFilter'
import { TokenIcon } from '@/ui/atoms/token-icon/TokenIcon'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/ui/atoms/tooltip/Tooltip'
import { FrozenPill } from '@/ui/molecules/frozen-pill/FrozenPill'
import { PausedPill } from '@/ui/molecules/paused-pill/PausedPill'
import { cn } from '@/ui/utils/style'
import { testIds } from '@/ui/utils/testIds'
import { useIsTruncated } from '@/ui/utils/useIsTruncated'

interface AssetNameCellProps {
  token: Token
  reserveStatus: ReserveStatus
  'data-testid': string
}

export function AssetNameCell({ token, reserveStatus, 'data-testid': dataTestId }: AssetNameCellProps) {
  const tokenImage = getTokenImage(token.symbol)
  const isPaused = reserveStatus === 'paused'
  const isFrozen = reserveStatus === 'frozen'

  return (
    <div className="flex flex-row items-center gap-3 py-2" data-testid={dataTestId}>
      {tokenImage && (
        <div className="flex shrink-0">
          <ColorFilter variant={isPaused ? 'red' : 'none'}>
            <TokenIcon token={token} className="flex h-6 w-6 lg:h-6 md:h-5 lg:w-6 md:w-5" />
          </ColorFilter>
        </div>
      )}
      <div className="flex min-w-0 flex-col xl:flex-row xl:items-baseline xl:gap-2">
        <TokenName token={token} className={cn(isPaused && 'text-system-error-secondary')} />
        <p className={cn('typography-label-6 text-secondary', isPaused && 'text-system-error-secondary/60')}>
          {token.symbol}
        </p>
      </div>
      {isFrozen && <FrozenPill data-testid={testIds.markets.frozenPill} />}
      {isPaused && <PausedPill data-testid={testIds.markets.pausedPill} />}
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
        <p className={cn('typography-label-4 truncate', className)} ref={tokenNameRef}>
          {token.name}
        </p>
      </TooltipTrigger>
      <TooltipContent>{token.name}</TooltipContent>
    </Tooltip>
  )
}
