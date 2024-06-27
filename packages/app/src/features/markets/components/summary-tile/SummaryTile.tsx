import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { assets } from '@/ui/assets'
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
    icon: assets.markets.chart,
    title: 'Total market size',
  },
  'total-value-locked': {
    icon: assets.markets.lock,
    title: 'Total value locked',
  },
  'total-available': {
    icon: assets.markets.inputOutput,
    title: 'Total available',
  },
  'total-borrows': {
    icon: assets.markets.output,
    title: 'Total borrows',
  },
}
