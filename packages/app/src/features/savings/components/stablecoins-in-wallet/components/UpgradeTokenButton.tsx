import { Token } from '@/domain/types/Token'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import UpgradeIcon from '@/ui/assets/upgrade.svg?react'
import { Button, ButtonIcon } from '@/ui/atoms/new/button/Button'
import { TokenIcon } from '@/ui/atoms/token-icon/TokenIcon'
import { cn } from '@/ui/utils/style'
import { testIds } from '@/ui/utils/testIds'

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
        'inline-flex items-center justify-start gap-2 rounded-sm text-primary',
        'typography-label-4 bg-secondary p-1 pl-2 md:pl-2',
      )}
      data-testid={dataTestId}
    >
      <TokenIcon token={token} className="h-6 w-6" />
      {token.symbol}
      <Button
        variant="primary"
        size="s"
        className="group h-7 w-7 overflow-hidden transition-all duration-300 sm:h-8 sm:hover:w-[160px] sm:w-8 sm:justify-start"
        onClick={onUpgradeClick}
        data-testid={testIds.savings.stablecoinsInWallet.upgradeDaiToUsds}
      >
        <div className="flex items-center gap-2">
          <ButtonIcon icon={UpgradeIcon} />
          <span className="hidden opacity-0 transition-opacity delay-50 duration-300 sm:block group-hover:opacity-100">
            Upgrade to {upgradedTokenSymbol}
          </span>
        </div>
      </Button>
    </div>
  )
}
