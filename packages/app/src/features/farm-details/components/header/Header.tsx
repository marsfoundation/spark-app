import { getChainConfigEntry } from '@/config/chain'
import { Token } from '@/domain/types/Token'
import { TokenIcon } from '@/ui/atoms/token-icon/TokenIcon'
import { Alert } from '@/ui/molecules/alert/Alert'

interface HeaderProps {
  token: Token
  farmName: string
  chainId: number
  chainMismatch: boolean
}

export function Header({ token, farmName, chainId, chainMismatch }: HeaderProps) {
  const chainConfig = getChainConfigEntry(chainId)
  const chainName = chainConfig.meta.name

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3 px-3 md:ml-5 lg:px-0">
        <TokenIcon token={token} className="h-8 w-8" />
        <h1 className="typography-heading-1 text-primary">{farmName}</h1>
      </div>
      {chainMismatch && (
        <Alert variant="warning">
          You are currently viewing farm details on {chainName}. To view farms from connected chain, go back to the
          farms page.
        </Alert>
      )}
    </div>
  )
}
