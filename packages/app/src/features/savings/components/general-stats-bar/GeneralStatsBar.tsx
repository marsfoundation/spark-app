import { USD_MOCK_TOKEN } from '@/domain/types/Token'
import { cn } from '@/ui/utils/style'
import { NormalizedUnitNumber } from '@marsfoundation/common-universal'
import { ReactNode } from 'react'

export interface GeneralStatsBarProps {
  tvl: number
  liquidity: number
  users: number
}

export function GeneralStatsBar({ tvl, users, liquidity }: GeneralStatsBarProps) {
  return (
    <div className={cn('inline-flex divide-x divide-secondary rounded-[10px]', 'bg-primary/80 py-3 backdrop-blur-lg')}>
      <Stat>
        <Label>TVL:</Label>
        <Value>{USD_MOCK_TOKEN.formatUSD(NormalizedUnitNumber(tvl), { compact: true })}</Value>
      </Stat>
      <Stat>
        <Label>Users</Label>
        <Value>{formatUsersNumber(users)}</Value>
      </Stat>
      <Stat>
        <Label>Liquidity:</Label>
        <Value>{USD_MOCK_TOKEN.formatUSD(NormalizedUnitNumber(liquidity), { compact: true })}</Value>
      </Stat>
    </div>
  )
}

export function Stat({ children }: { children: ReactNode }) {
  return <div className="flex gap-1 px-4">{children}</div>
}

function Label({ children }: { children: string }) {
  return <div className="typography-label-3 text-secondary">{children}</div>
}

function Value({ children }: { children: string }) {
  return <div className="typography-label-3 text-primary">{children}</div>
}

function formatUsersNumber(users: number): string {
  return Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(users)
}
