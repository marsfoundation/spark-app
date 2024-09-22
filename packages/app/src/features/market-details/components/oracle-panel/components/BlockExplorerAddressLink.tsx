import { useBlockExplorerAddressLink } from '@/domain/hooks/useBlockExplorerAddressLink'
import BoxArrowTopRight from '@/ui/assets/box-arrow-top-right.svg?react'
import { Address } from '@/ui/atoms/address/Address'
import { Link } from '@/ui/atoms/link/Link'
import { Address as AddressType } from 'viem'

interface BlockExplorerAddressLinkProps {
  address: AddressType
  chainId: number
  className?: string
}

export function BlockExplorerAddressLink({ address, chainId }: BlockExplorerAddressLinkProps) {
  const contractLink = useBlockExplorerAddressLink({ address, chainId })

  return contractLink ? (
    <Link
      to={contractLink}
      external
      className="flex items-center gap-2 text-inherit hover:text-inherit hover:underline"
    >
      <Address address={address} />
      <BoxArrowTopRight className="h-3.5 w-3.5 shrink-0" />
    </Link>
  ) : (
    <span className="flex items-center gap-2">
      <Address address={address} />
    </span>
  )
}
