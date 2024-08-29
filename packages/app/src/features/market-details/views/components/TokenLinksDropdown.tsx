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
import { PropsWithChildren } from 'react'

export interface TokenLinksDropdownProps {
  token: Token
  aToken: Token
  variableDebtTokenAddress: string
}

export function TokenLinksDropdown({ token, aToken, variableDebtTokenAddress }: TokenLinksDropdownProps) {
  const tokenContractsLinks = [
    { token, address: token.address, label: token.symbol },
    { token: aToken, address: aToken.address, label: aToken.symbol },
    { token: aToken, address: variableDebtTokenAddress, label: `Variable Debt ${token.symbol}` },
  ]
  return (
    <TokenLinksWrapper>
      <DropdownMenuLabel className="p-4 pb-0">
        <div className="flex flex-row items-center gap-2.5 font-semibold lg:gap-1 lg:font-normal group-hover:text-nav-primary lg:text-basics-dark-grey lg:text-xs">
          Token Contracts
        </div>
      </DropdownMenuLabel>
      {tokenContractsLinks.map(({ address, token, label }) => (
        <Link key={address} to="https://spark.fi/terms-of-use.html" external>
          <DropdownMenuItem className="cursor-pointer">
            <div className="flex max-w-60 flex-col gap-1">
              <div className="flex gap-1">
                <TokenIcon token={token} className="h-4 w-4" />
                <div className="flex flex-row items-center gap-2.5 font-semibold lg:gap-1 lg:font-normal group-hover:text-nav-primary lg:text-basics-dark-grey lg:text-xs">
                  {label}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="hidden truncate font-semibold text-basics-black first:block lg:block">{address}</span>
                <BoxArrowTopRight className={cn('h-3.5 w-3.5 shrink-0')} />
              </div>
            </div>
          </DropdownMenuItem>
        </Link>
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
