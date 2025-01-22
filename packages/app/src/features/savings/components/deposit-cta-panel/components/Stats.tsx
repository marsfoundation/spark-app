import { USD_MOCK_TOKEN } from '@/domain/types/Token'
import { Info } from '@/ui/molecules/info/Info'
import { cn } from '@/ui/utils/style'
import { NormalizedUnitNumber } from '@marsfoundation/common-universal'
import { ReactNode } from 'react'
import { DepositCTAPanelProps } from '../DepositCTAPanel'

export interface StatsProps {
  globalStats: DepositCTAPanelProps['globalStats']
}

export function Stats({ globalStats }: StatsProps) {
  return (
    <div className="flex gap-8">
      <Stat>
        <Label tooltipText="Total value locked">TVL</Label>
        <Value>{USD_MOCK_TOKEN.formatUSD(globalStats.tvl, { compact: true })}</Value>
      </Stat>
      <Stat>
        <Label tooltipText="Liquidity">Liquidity</Label>
        <Value>{USD_MOCK_TOKEN.formatUSD(globalStats.liquidity, { compact: true })}</Value>
      </Stat>
      <Stat>
        <Label tooltipText="Number of users">Users</Label>
        <Value>{formatUsersNumber(globalStats.users)}</Value>
      </Stat>
    </div>
  )
}

export function Stat({ children }: { children: ReactNode }) {
  return <div className="flex flex-col gap-1">{children}</div>
}

function Label({ children, tooltipText }: { children: string; tooltipText: string }) {
  return (
    <div className="flex items-center gap-1">
      <div className="typography-label-3 text-tertiary">{children}</div>
      <Info className="icon-secondary icon-xxs">{tooltipText}</Info>
    </div>
  )
}

function Value({ children }: { children: ReactNode }) {
  return <div className={cn('typography-label-1 text-primary-inverse')}>{children}</div>
}

function formatUsersNumber(users: NormalizedUnitNumber): string {
  const number = users.toNumber()
  return Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(number)
}
