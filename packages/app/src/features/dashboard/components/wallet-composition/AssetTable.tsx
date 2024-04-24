import { generatePath } from 'react-router-dom'

import { paths } from '@/config/paths'
import { formatPercentage } from '@/domain/common/format'
import { TokenWithValue } from '@/domain/common/types'
import { calculateDistribution } from '@/features/dashboard/components/wallet-composition/logic/calculate-distribution'
import { Link } from '@/ui/atoms/link/Link'
import { TokenIcon } from '@/ui/atoms/token-icon/TokenIcon'
import { Typography } from '@/ui/atoms/typography/Typography'
import { DataTable } from '@/ui/molecules/data-table/DataTable'

export interface AssetTableProps {
  assets: TokenWithValue[]
  chainId: number
  scroll?: { height: number }
}
export function AssetTable({ assets, scroll, chainId }: AssetTableProps) {
  const assetsWithDistribution = calculateDistribution(assets)

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
        swapCollateral: {
          header: '',
          headerAlign: 'right',
          renderCell: ({ token }) => (
            <div>
              <div className="flex w-full flex-row justify-end">
                <Link
                  className="text-xs sm:mr-4"
                  to={generatePath(paths.marketDetails, { asset: token.address, chainId: chainId.toString() })}
                >
                  Details
                </Link>
              </div>
            </div>
          ),
        },
      }}
      data={assetsWithDistribution}
      scroll={scroll}
    />
  )
}
