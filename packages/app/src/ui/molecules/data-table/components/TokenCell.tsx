import { getChainConfigEntry } from '@/config/chain'
import { Token } from '@/domain/types/Token'
import { IconStack } from '../../icon-stack/IconStack'

export interface TokenCellProps {
  token: Token
  chainId: number
}

export function TokenCell({ token, chainId }: TokenCellProps) {
  const chainImage = getChainConfigEntry(chainId).meta.logo
  return (
    <div className="typography-label-2 flex flex-row items-center gap-2">
      <IconStack items={[token]} subIcon={chainImage} />
      {token.symbol}
    </div>
  )
}
