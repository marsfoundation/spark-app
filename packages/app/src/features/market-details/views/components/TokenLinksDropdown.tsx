import { useBlockExplorerAddressLink } from '@/domain/hooks/useBlockExplorerAddressLink'
import { Token } from '@/domain/types/Token'
import BoxArrowTopRight from '@/ui/assets/box-arrow-top-right.svg?react'
import MoreIcon from '@/ui/assets/more-icon.svg?react'
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
import { cn } from '@/ui/utils/style'
import { PropsWithChildren, ReactNode } from 'react'
import { Address } from 'viem'

export interface TokenLinksDropdownProps {
  token: Token
  aToken: Token
  variableDebtTokenAddress: Address
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
      <DropdownMenuLabel className="p-4 pb-0 font-normal text-basics-dark-grey">Token Contracts</DropdownMenuLabel>
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
        <Button variant="secondary" className="bg-white px-3">
          <MoreIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">{children}</DropdownMenuContent>
    </DropdownMenu>
  )
}

interface BlockExplorerAddressLinkProps {
  address: Address
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
  address: Address
  label: string
  token: Token
}

function TokenLinksDropdownItem({ address, token, label }: TokenLinksDropdownItemProps) {
  return (
    <DropdownMenuItem key={address} className="cursor-pointer">
      <div className="flex max-w-60 flex-col gap-1">
        <div className="flex items-center gap-1">
          <TokenIcon token={token} className="h-4 w-4" />
          <div className="flex flex-row items-center gap-2.5 font-normal text-basics-dark-grey lg:gap-1 group-hover:text-nav-primary lg:text-xs">
            {label}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="block truncate font-semibold text-basics-black first:block">{address}</span>
          <BoxArrowTopRight className={cn('h-3.5 w-3.5 shrink-0')} />
        </div>
      </div>
    </DropdownMenuItem>
  )
}
