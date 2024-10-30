import { CheckedAddress } from '@/domain/types/CheckedAddress'
import { Token } from '@/domain/types/Token'
import { Alert } from '@/features/dialogs/common/components/alert/Alert'
import { TokenIcon } from '@/ui/atoms/token-icon/TokenIcon'
import { TokenLinksDropdown } from './TokenLinksDropdown'

interface HeaderProps {
  token: Token
  aToken: Token
  variableDebtTokenAddress: CheckedAddress
  chainName: string
  chainMismatch: boolean
  chainId: number
}

export function Header({ token, aToken, variableDebtTokenAddress, chainName, chainMismatch, chainId }: HeaderProps) {
  return (
    <div className="mt-6 mb-4 flex flex-col gap-4 sm:mt-8 sm:mb-10">
      <div className="flex items-center gap-3 px-3 md:ml-5 lg:px-0">
        <TokenIcon token={token} className="h-8 w-8" />
        <h1 className="font-semibold text-4xl">{token.symbol}</h1>
        <TokenLinksDropdown
          token={token}
          aToken={aToken}
          variableDebtTokenAddress={variableDebtTokenAddress}
          chainId={chainId}
        />
      </div>
      {chainMismatch && (
        <Alert variant="warning">
          You are currently viewing {chainName} asset details. To view assets from connected chain, go back to the
          markets page.
        </Alert>
      )}
    </div>
  )
}
