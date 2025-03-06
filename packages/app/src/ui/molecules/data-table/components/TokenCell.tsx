import { Token } from '@/domain/types/Token'
import { IconStack } from '../../icon-stack/IconStack'

export interface TokenCellProps {
  token: Token
}

export function TokenCell({ token }: TokenCellProps) {
  return (
    <div className="typography-label-2 flex flex-row items-center gap-2">
      <IconStack items={[token]} />
      {token.symbol}
    </div>
  )
}
