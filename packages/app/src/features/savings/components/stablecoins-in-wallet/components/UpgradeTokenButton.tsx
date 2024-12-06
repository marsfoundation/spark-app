import { Token } from '@/domain/types/Token'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { Button } from '@/ui/atoms/button/Button'
import { TokenIcon } from '@/ui/atoms/token-icon/TokenIcon'
import { cn } from '@/ui/utils/style'
import { testIds } from '@/ui/utils/testIds'
import { ArrowBigUpDash } from 'lucide-react'

export interface UpgradeTokenButtonProps {
  token: Token
  upgradedTokenSymbol: TokenSymbol
  onUpgradeClick: () => void
  'data-testid'?: string
}

export function UpgradeTokenButton({
  token,
  upgradedTokenSymbol,
  onUpgradeClick,
  'data-testid': dataTestId,
}: UpgradeTokenButtonProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center justify-center gap-1.5',
        'typography-label-4 bg-secondary py-1 pr-1 pl-1 sm:pl-2',
        'rounded-sm bg-secondary text-primary',
      )}
      data-testid={dataTestId}
    >
      <div className="flex items-center gap-1 sm:gap-2">
        <TokenIcon token={token} className="h-6 w-6" />
        {token.symbol}
        <Button
          size="s"
          className="group h-7 w-7 overflow-hidden px-1 transition-all duration-300 sm:h-8 sm:hover:w-[154px] sm:w-8 sm:justify-start sm:px-2"
          onClick={onUpgradeClick}
          data-testid={testIds.savings.stablecoinsInWallet.upgradeDaiToUsds}
        >
          <div className="flex items-center gap-2">
            <ArrowBigUpDash className="icon-xs" />
            <span className="hidden opacity-0 transition-opacity delay-50 duration-300 sm:block group-hover:opacity-100">
              Upgrade to {upgradedTokenSymbol}
            </span>
          </div>
        </Button>
      </div>
    </div>
  )
}
