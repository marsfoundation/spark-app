import { useBlockExplorerAddressLink } from '@/domain/hooks/useBlockExplorerAddressLink'
import { CheckedAddress } from '@/domain/types/CheckedAddress'
import { Token } from '@/domain/types/Token'
import BoxArrowTopRight from '@/ui/assets/box-arrow-top-right.svg?react'
import MoreIcon from '@/ui/assets/more-icon.svg?react'
import { Address } from '@/ui/atoms/address/Address'
import { Button } from '@/ui/atoms/button/Button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/ui/atoms/dropdown/DropdownMenu'
import { Link } from '@/ui/atoms/link/Link'
import { TokenIcon } from '@/ui/atoms/token-icon/TokenIcon'
import { PropsWithChildren, ReactNode } from 'react'

export interface TokenLinksDropdownProps {
  token: Token
  aToken: Token
  variableDebtTokenAddress: CheckedAddress
  chainId: number
}

export function TokenLinksDropdown({ token, aToken, variableDebtTokenAddress, chainId }: TokenLinksDropdownProps) {
  const tokenContractsLinks = [
    { token, address: token.address, label: token.symbol },
    { token: aToken, address: aToken.address, label: aToken.symbol },
    { token: aToken, address: variableDebtTokenAddress, label: `Variable Debt ${token.symbol}` },
  ]
  return (
    <TokenLinksWrapper>
      <DropdownMenuLabel className="p-4 pb-0 font-normal">Token Contracts</DropdownMenuLabel>
      {tokenContractsLinks.map((contractLink) => (
        <BlockExplorerAddressLink key={contractLink.address} address={contractLink.address} chainId={chainId}>
          <TokenLinksDropdownItem {...contractLink} />
        </BlockExplorerAddressLink>
      ))}
    </TokenLinksWrapper>
  )
}

function TokenLinksWrapper({ children }: PropsWithChildren) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" className="bg-white/10 px-3">
          <MoreIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">{children}</DropdownMenuContent>
    </DropdownMenu>
  )
}

interface BlockExplorerAddressLinkProps {
  address: CheckedAddress
  children: ReactNode
  chainId: number
}

function BlockExplorerAddressLink({ address, children, chainId }: BlockExplorerAddressLinkProps) {
  const contractLink = useBlockExplorerAddressLink({ address, chainId })

  return contractLink ? (
    <Link to={contractLink} external>
      {children}
    </Link>
  ) : (
    <>{children}</>
  )
}

interface TokenLinksDropdownItemProps {
  address: CheckedAddress
  label: string
  token: Token
}

function TokenLinksDropdownItem({ address, token, label }: TokenLinksDropdownItemProps) {
  return (
    <DropdownMenuItem key={address} className="cursor-pointer">
      <div className="flex max-w-60 flex-1 flex-col gap-1">
        <div className="flex items-center gap-1">
          <TokenIcon token={token} className="h-4 w-4" />
          <div className="flex flex-row items-center gap-2.5 font-normal text-white/50 lg:gap-1 group-hover:text-nav-primary lg:text-xs">
            {label}
          </div>
        </div>
        <div className="flex items-center gap-2 font-semibold text-white">
          <Address address={address} postfix={<BoxArrowTopRight className="h-3.5 w-3.5" />} />
        </div>
      </div>
    </DropdownMenuItem>
  )
}
