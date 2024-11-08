import { getChainConfigEntry } from '@/config/chain'
import { Token } from '@/domain/types/Token'
import { TokenIcon } from '@/ui/atoms/token-icon/TokenIcon'
import { Alert } from '@/ui/molecules/new/alert/Alert'

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
    <div className="mt-6 mb-4 flex flex-col gap-4 sm:mt-8 sm:mb-10">
      <div className="flex items-center gap-3 px-3 md:ml-5 lg:px-0">
        <TokenIcon token={token} className="h-8 w-8" />
        <h1 className="typography-heading-1 text-sky-950">{farmName}</h1>
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
