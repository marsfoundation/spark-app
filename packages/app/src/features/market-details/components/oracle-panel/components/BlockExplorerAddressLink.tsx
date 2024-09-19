import { useBlockExplorerAddressLink } from '@/domain/hooks/useBlockExplorerAddressLink'
import BoxArrowTopRight from '@/ui/assets/box-arrow-top-right.svg?react'
import { Link } from '@/ui/atoms/link/Link'
import { shortenAddress } from '@/ui/utils/shortenAddress'
import { Address } from 'viem'

interface BlockExplorerAddressLinkProps {
  address: Address
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
      {shortenAddress(address)}
      <BoxArrowTopRight className="h-3.5 w-3.5 shrink-0" />
    </Link>
  ) : (
    <span className="flex items-center gap-2">{shortenAddress(address)}</span>
  )
}
