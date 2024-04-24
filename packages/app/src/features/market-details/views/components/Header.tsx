import { Token } from '@/domain/types/Token'
import { TokenIcon } from '@/ui/atoms/token-icon/TokenIcon'

interface HeaderProps {
  token: Token
}

export function Header({ token }: HeaderProps) {
  return (
    <div className="mb-4 mt-6 flex items-center gap-3 px-3 sm:mb-10 sm:mt-8 md:ml-5 lg:px-0">
      <TokenIcon token={token} className="h-8 w-8" />
      <h1 className="text-4xl font-semibold text-sky-950">{token.symbol}</h1>
    </div>
  )
}
