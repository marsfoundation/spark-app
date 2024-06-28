import { formatPercentage } from '@/domain/common/format'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'
import { Link } from '@/ui/atoms/link/Link'
import { TokenIcon } from '@/ui/atoms/token-icon/TokenIcon'
import { Typography } from '@/ui/atoms/typography/Typography'
import { DataTable } from '@/ui/molecules/data-table/DataTable'
import { calculateDistribution } from './logic/calculate-distribution'

export interface AssetsTableRow {
  token: Token
  value: NormalizedUnitNumber
  detailsLink: string
}

export interface AssetTableProps {
  rows: AssetsTableRow[]
  scroll?: { height: number }
}
export function AssetTable({ rows, scroll }: AssetTableProps) {
  const rowsWithDistribution = calculateDistribution(rows)

  return (
    <DataTable
      gridTemplateColumnsClassName="grid-cols-[repeat(3,_1fr)_50px] sm:grid-cols-[repeat(4,_1fr)]"
      columnDef={{
        symbol: {
          header: 'Assets',
          renderCell: ({ token }) => (
            <div className="flex flex-row items-center gap-2">
              <TokenIcon token={token} className="h-6 w-6" />
              {token.symbol}
            </div>
          ),
        },
        amount: {
          header: 'Amount',
          headerAlign: 'right',
          renderCell: ({ value, token }) => (
            <div>
              <div className="flex w-full flex-row justify-end">{token.format(value, { style: 'auto' })}</div>
              <div className="flex w-full flex-row justify-end">
                <Typography variant="prompt">{token.formatUSD(value)}</Typography>
              </div>
            </div>
          ),
        },
        deposit: {
          header: 'Distribution',
          headerAlign: 'right',
          renderCell: ({ distribution }) => (
            <div>
              <div className="flex w-full flex-row justify-end"> {formatPercentage(distribution)} </div>
            </div>
          ),
        },
        details: {
          header: '',
          headerAlign: 'right',
          renderCell: ({ detailsLink }) => (
            <div>
              <div className="flex w-full flex-row justify-end">
                <Link className="text-xs sm:mr-4" to={detailsLink}>
                  Details
                </Link>
              </div>
            </div>
          ),
        },
      }}
      data={rowsWithDistribution}
      scroll={scroll}
    />
  )
}
