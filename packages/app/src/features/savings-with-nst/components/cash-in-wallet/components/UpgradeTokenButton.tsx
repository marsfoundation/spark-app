import { Token } from '@/domain/types/Token'
import { assets } from '@/ui/assets'
import { Button } from '@/ui/atoms/button/Button'
import { TokenIcon } from '@/ui/atoms/token-icon/TokenIcon'
import { cn } from '@/ui/utils/style'

export interface UpgradeTokenButtonProps {
  token: Token
}

export function UpgradeTokenButton({ token }: UpgradeTokenButtonProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center justify-center gap-1.5',
        'rounded-[10px] border border-slate-700 border-opacity-10',
        'bg-secondary py-1 pr-1 pl-2 font-semibold text-base',
        'text-secondary-foreground',
      )}
    >
      <div className="flex items-center gap-2">
        <TokenIcon token={token} className="h-6 w-6" />
        {token.symbol}
        <Button
          size="sm"
          className="group w-8 justify-start overflow-hidden px-2 transition-all duration-300 hover:w-[135px]"
        >
          <div className="flex items-center gap-2">
            <img src={assets.upgrade} alt="upgrade" className="h-[14px] w-[14px]" />
            <span className="opacity-0 transition-opacity duration-300 group-hover:opacity-100">Upgrade to NST</span>
          </div>
        </Button>
      </div>
    </div>
  )
}
