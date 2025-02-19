import { Token } from '@/domain/types/Token'
import { TokenIcon } from '@/ui/atoms/token-icon/TokenIcon'

export interface TokenCellProps {
  token: Token
}

export function TokenCell({ token }: TokenCellProps) {
  return (
    <div className="typography-label-2 flex flex-row items-center gap-2">
      <TokenIcon token={token} className="icon-md" />
      {token.symbol}
    </div>
  )
}
