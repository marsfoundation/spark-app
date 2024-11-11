import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { ArrowUpFromLineIcon, ArrowsUpFromLineIcon, ChartPieIcon, LockIcon } from 'lucide-react'
import { Tile, TileProps } from './components/Tile'

interface SummaryTileProps {
  variant: 'total-market-size' | 'total-value-locked' | 'total-available' | 'total-borrows'
  USDValue: NormalizedUnitNumber
  'data-testid'?: string
}

export function SummaryTile({ variant, USDValue, 'data-testid': dataTestId }: SummaryTileProps) {
  return <Tile USDValue={USDValue} {...tileProps[variant]} data-testid={dataTestId} />
}

const tileProps: Record<SummaryTileProps['variant'], Omit<TileProps, 'USDValue' | 'index'>> = {
  'total-market-size': {
    icon: ChartPieIcon,
    title: 'Total market size',
  },
  'total-value-locked': {
    icon: LockIcon,
    title: 'Total value locked',
  },
  'total-available': {
    icon: ArrowsUpFromLineIcon,
    title: 'Total available',
  },
  'total-borrows': {
    icon: ArrowUpFromLineIcon,
    title: 'Total borrows',
  },
}
