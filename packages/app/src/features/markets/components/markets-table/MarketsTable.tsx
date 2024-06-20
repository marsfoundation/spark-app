import { generatePath } from 'react-router-dom'

import { paths } from '@/config/paths'
import { sortByAPY, sortByUsdValue } from '@/domain/common/sorters'
import { LinkButton } from '@/ui/atoms/button/Button'
import { ApyTooltip } from '@/ui/molecules/apy-tooltip/ApyTooltip'
import { ActionsCell } from '@/ui/molecules/data-table/components/ActionsCell'
import { CompactValueCell } from '@/ui/molecules/data-table/components/CompactValueCell'
import { ResponsiveDataTable } from '@/ui/organisms/responsive-data-table/ResponsiveDataTable'

import { MarketEntry } from '../../types'
import { AssetStatusBadge } from '../asset-status-badge/AssetStatusBadge'
import { ApyWithRewardsCell } from './components/ApyWithRewardsCell'
import { AssetNameCell } from './components/AssetNameCell'

export interface MarketsTableProps {
  entries: MarketEntry[]
  chainId: number
  hideTableHeader?: boolean
}

export function MarketsTable({ entries, chainId, hideTableHeader }: MarketsTableProps) {
  return (
    <ResponsiveDataTable
      gridTemplateColumnsClassName="grid-cols-[_repeat(6,minmax(0,1fr))_minmax(0,70px)] lg:grid-cols-[_minmax(0,5fr)_repeat(5,minmax(0,3fr))_minmax(0,70px)]"
      hideTableHeader={hideTableHeader}
      columnDefinition={{
        asset: {
          header: 'Assets',
          renderCell: ({ token, reserveStatus }) => <AssetNameCell token={token} reserveStatus={reserveStatus} />,
        },
        totalSupplied: {
          header: 'Total supplied',
          headerAlign: 'right',
          sortable: true,
          sortingFn: (a, b) => sortByUsdValue(a.original, b.original, 'totalSupplied'),
          renderCell: ({ token, totalSupplied, reserveStatus }, mobileViewOptions) => (
            <CompactValueCell
              token={token}
              value={totalSupplied}
              dimmed={reserveStatus !== 'active'}
              mobileViewOptions={mobileViewOptions}
              compactValue
              hideEmpty
            />
          ),
        },
        depositAPY: {
          header: <ApyTooltip variant="supply">Deposit APY</ApyTooltip>,
          headerAlign: 'right',
          sortable: true,
          sortingFn: (a, b) => sortByAPY(a.original.depositAPYDetails.apy, b.original.depositAPYDetails.apy),
          renderCell: ({ depositAPYDetails, reserveStatus, token }, mobileViewOptions) => (
            <ApyWithRewardsCell
              reserveStatus={reserveStatus}
              incentivizedReserve={token}
              apyDetails={depositAPYDetails}
              mobileViewOptions={mobileViewOptions}
            />
          ),
        },
        totalBorrowed: {
          header: 'Total borrowed',
          headerAlign: 'right',
          sortable: true,
          sortingFn: (a, b) => sortByUsdValue(a.original, b.original, 'totalBorrowed'),
          renderCell: ({ token, totalBorrowed, reserveStatus }, mobileViewOptions) => (
            <CompactValueCell
              token={token}
              value={totalBorrowed}
              dimmed={reserveStatus !== 'active'}
              mobileViewOptions={mobileViewOptions}
              compactValue
              hideEmpty
            />
          ),
        },
        borrowAPY: {
          header: <ApyTooltip variant="borrow">Borrow APY</ApyTooltip>,
          headerAlign: 'right',
          sortable: true,
          sortingFn: (a, b) => sortByAPY(a.original.borrowAPYDetails.apy, b.original.borrowAPYDetails.apy),
          renderCell: ({ borrowAPYDetails, reserveStatus, token }, mobileViewOptions) => (
            <ApyWithRewardsCell
              reserveStatus={reserveStatus}
              incentivizedReserve={token}
              apyDetails={borrowAPYDetails}
              mobileViewOptions={mobileViewOptions}
              bold
            />
          ),
        },
        status: {
          header: 'Status',
          headerAlign: 'center',
          renderCell: ({ marketStatus }) => (
            <div className="flex w-full flex-row justify-center">
              <AssetStatusBadge
                supplyStatus={marketStatus.supplyAvailabilityStatus}
                collateralStatus={marketStatus.collateralEligibilityStatus}
                borrowStatus={marketStatus.borrowEligibilityStatus}
              />
            </div>
          ),
        },
        actions: {
          header: '',
          renderCell: ({ token, reserveStatus }) => {
            return (
              <ActionsCell>
                <LinkButton
                  className="w-full md:w-auto"
                  size="sm"
                  variant={reserveStatus !== 'active' ? 'secondary' : 'primary'}
                  to={generatePath(paths.marketDetails, { asset: token.address, chainId: chainId.toString() })}
                >
                  Details
                </LinkButton>
              </ActionsCell>
            )
          },
        },
      }}
      data={entries}
    />
  )
}
