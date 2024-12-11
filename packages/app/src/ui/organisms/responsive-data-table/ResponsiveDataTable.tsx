import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/ui/atoms/table/Table'
import { testIds } from '@/ui/utils/testIds'
import { useBreakpoint } from '@/ui/utils/useBreakpoint'
import { Fragment } from 'react'
import { DataTable, DataTableColumnDefinitions, DataTableRowType } from '../../molecules/data-table/DataTable'
import { CollapsibleCell } from './components/CollapsibleCell'

export interface ResponsiveDataTableProps<T extends DataTableRowType, C extends DataTableColumnDefinitions<T>> {
  columnDefinition: C
  scroll?: {
    height: number
  }
  defaultSortingState?: { id: keyof C; desc: boolean }[]
  hideTableHeader?: boolean
  gridTemplateColumnsClassName?: string
  data: T[]
  'data-testid'?: string
}

export function ResponsiveDataTable<T extends { [k: string]: any }, C extends DataTableColumnDefinitions<T>>({
  columnDefinition,
  data,
  defaultSortingState,
  scroll,
  gridTemplateColumnsClassName,
  hideTableHeader = false,
  'data-testid': dataTestId,
}: ResponsiveDataTableProps<T, C>) {
  const desktop = useBreakpoint('md')

  if (desktop) {
    return (
      <DataTable
        columnDef={columnDefinition}
        data={data}
        defaultSortingState={defaultSortingState}
        scroll={scroll}
        gridTemplateColumnsClassName={gridTemplateColumnsClassName}
        hideTableHeader={hideTableHeader}
        data-testid={dataTestId}
      />
    )
  }

  const [rowHeaderDefinition, ...contentDefinitions] = Object.values(columnDefinition)
  return (
    <Table data-testid={dataTestId}>
      {!hideTableHeader && (
        <TableHeader>
          <TableRow className="flex justify-between pb-3">
            {[rowHeaderDefinition?.header, 'More info'].map((header, index) => (
              <TableHead className="typography-label-4 p-0 text-secondary" key={index}>
                {header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
      )}
      <TableBody>
        {data.map((value, index) => (
          <TableRow key={index} data-testid={testIds.component.DataTable.row(index)}>
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
