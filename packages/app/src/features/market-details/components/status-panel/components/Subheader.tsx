import { VariantProps, cva } from 'class-variance-authority'
import { ReactNode } from 'react'

import { MarketAssetStatus } from '@/domain/market-info/reserve-status'
import { Link } from '@/ui/atoms/link/Link'
import { links } from '@/ui/constants/links'
import { cn } from '@/ui/utils/style'

interface SubheaderProps {
  status: MarketAssetStatus
}

export function Subheader({ status }: SubheaderProps) {
  if (status === 'only-in-isolation-mode') {
    return (
      <Content variant="orange">
        In Isolation Mode you can only borrow stablecoins up to the debt ceiling and cannot use any other asset as
        collateral.{' '}
        <Link to={links.docs.isolationMode} variant="underline" external>
          Learn more
        </Link>
        .
      </Content>
    )
  }

  if (status === 'only-in-siloed-mode') {
    return (
      <Content variant="orange">
        Siloed borrowing means that the asset can be the only asset borrowed in a position.{' '}
        <Link to={links.docs.siloedMode} variant="underline" external>
          Learn more
        </Link>
        .
      </Content>
    )
  }

  if (status === 'supply-cap-reached') {
    return (
      <Content variant="red">
        Maximum amount available to supply is limited because asset supply cap is reached.{' '}
        <Link to={links.docs.supplyBorrowCaps} variant="underline" external>
          Learn more
        </Link>
        .
      </Content>
    )
  }

  if (status === 'borrow-cap-reached') {
    return (
      <Content variant="red">
        Maximum amount available to borrow is limited because asset borrow cap is reached.{' '}
        <Link to={links.docs.supplyBorrowCaps} variant="underline" external>
          Learn more
        </Link>
        .
      </Content>
    )
  }
  return null
}

interface ContentProps extends VariantProps<typeof variants> {
  children: ReactNode
}

function Content({ children, variant }: ContentProps) {
  return <p className={cn(variants({ variant }), 'col-span-2 col-start-2 mt-1.5 mb-3')}>{children}</p>
}

const variants = cva('typography-body-4', {
  variants: {
    variant: {
      orange: 'text-system-warning-primary',
      red: 'text-system-error-primary',
    },
  },
})
