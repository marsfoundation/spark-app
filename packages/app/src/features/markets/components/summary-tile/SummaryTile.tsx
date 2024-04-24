import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { assets } from '@/ui/assets'

import { Tile, TileProps } from './components/Tile'

interface SummaryTileProps {
  variant: 'total-market-size' | 'total-value-locked' | 'total-available' | 'total-borrows'
  USDValue: NormalizedUnitNumber
}

export function SummaryTile({ variant, USDValue }: SummaryTileProps) {
  return <Tile USDValue={USDValue} {...tileProps[variant]} />
}

const tileProps: Record<SummaryTileProps['variant'], Omit<TileProps, 'USDValue'>> = {
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
