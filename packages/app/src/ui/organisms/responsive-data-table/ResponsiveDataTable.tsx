import { Fragment } from 'react'

import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/ui/atoms/table/Table'
import { ColumnDefinition } from '@/ui/molecules/data-table/types'
import { useBreakpoint } from '@/ui/utils/useBreakpoint'

import { DataTable } from '../../molecules/data-table/DataTable'
import { CollapsibleCell } from './components/CollapsibleCell'

export interface ResponsiveDataTableProps<T> {
  columnDefinition: { [key: string]: ColumnDefinition<T> }
  scroll?: {
    height: number
  }
  hideTableHeader?: boolean
  gridTemplateColumnsClassName?: string
  data: T[]
}

export function ResponsiveDataTable<T extends { [k: string]: any }>({
  columnDefinition,
  data,
  scroll,
  gridTemplateColumnsClassName,
  hideTableHeader = false,
}: ResponsiveDataTableProps<T>) {
  const desktop = useBreakpoint('md')

  if (desktop) {
    return (
      <DataTable
        columnDef={columnDefinition}
        data={data}
        scroll={scroll}
        gridTemplateColumnsClassName={gridTemplateColumnsClassName}
        hideTableHeader={hideTableHeader}
      />
    )
  }

  const [rowHeaderDefinition, ...contentDefinitions] = Object.values(columnDefinition)
  return (
    <Table>
      {!hideTableHeader && (
        <TableHeader>
          <TableRow className="flex justify-between pb-3">
            {[rowHeaderDefinition?.header, 'More info'].map((header, index) => (
              <TableHead className="p-0 font-bold text-primary text-xs" key={index}>
                {header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
      )}
      <TableBody>
        {data.map((value, index) => (
          <TableRow key={index}>
            <CollapsibleCell>
              {rowHeaderDefinition?.renderCell(value)}
              {contentDefinitions.map((def, index) => (
                <Fragment key={index}>{def.renderCell(value, { isMobileView: true, rowTitle: def.header })}</Fragment>
              ))}
            </CollapsibleCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
