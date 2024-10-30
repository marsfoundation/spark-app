import { LinkDecorator } from '@/ui/atoms/link-decorator/LinkDecorator'
import { ScrollArea } from '@/ui/atoms/scroll-area/ScrollArea'
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/ui/atoms/table/Table'
import { cn } from '@/ui/utils/style'
import { testIds } from '@/ui/utils/testIds'
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { Fragment, useMemo, useState } from 'react'
import { ColumnHeader } from './components/ColumnHeader'
import { ColumnDefinition } from './types'

export interface RowClickOptions {
  destination: string
  external?: boolean
}
interface RowType {
  [k: string]: any
  rowClickOptions?: RowClickOptions
}

export interface DataTableProps<T extends RowType> {
  columnDef: {
    [key: string]: ColumnDefinition<T>
  }
  scroll?: {
    height: number
  }
  hideTableHeader?: boolean
  gridTemplateColumnsClassName?: string
  data: T[]
  footer?: React.ReactNode
  'data-testid'?: string
}

/**
 * @note: Using columnDef as a dependency for columns memoizer will cause the table to re-mount on every re-render.
 * If this is the problem, take care of memoizing columnDef outside of the component, so react knows that
 * passed object is the same between renders, which will prevent unnecessary re-mount.
 */
export function DataTable<T extends RowType>({
  columnDef,
  data,
  scroll,
  hideTableHeader = false,
  gridTemplateColumnsClassName,
  footer,
  'data-testid': dataTestId,
}: DataTableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([])

  const columns: ColumnDef<T>[] = useMemo(() => {
    return Object.keys(columnDef).map<ColumnDef<T>>((key) => {
      const definition = columnDef[key]
      return {
        accessorKey: key,
        sortingFn: definition?.sortingFn,
        header: ({ column }) => <ColumnHeader column={column} columnDefinition={definition} />,
        cell: ({ row }) => definition?.renderCell(row.original),
      }
    })
  }, [columnDef])

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  })

  const Wrapper = scroll ? ScrollWrapperWithHeight({ height: scroll.height }) : Fragment

  return (
    <div className="w-full">
      <Wrapper>
        <Table data-testid={dataTestId}>
          {!hideTableHeader && (
            <TableHeader className="static">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className={cn('grid w-full gap-2', gridTemplateColumnsClassName)}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
          )}
          <TableBody>
            {table.getRowModel().rows.map((row, index) => (
              <TableRowWithLink key={row.id} rowClickOptions={row.original.rowClickOptions}>
                <TableRow
                  className={cn('grid w-full items-center gap-2', gridTemplateColumnsClassName)}
                  data-testid={testIds.component.DataTable.row(index)}
                >
                  {row.getAllCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              </TableRowWithLink>
            ))}
          </TableBody>
          {footer && <TableFooter>{footer}</TableFooter>}
        </Table>
      </Wrapper>
    </div>
  )
}

interface TableRowWithLinkProps {
  children: React.ReactNode
  rowClickOptions?: RowClickOptions
}

function TableRowWithLink({ children, rowClickOptions }: TableRowWithLinkProps) {
  if (!rowClickOptions) {
    return <>{children}</>
  }
  const { destination, external } = rowClickOptions
  return (
    <LinkDecorator to={destination} external={external}>
      {children}
    </LinkDecorator>
  )
}

function ScrollWrapperWithHeight({ height }: { height: number }) {
  function ScrollWrapper({ children }: { children: React.ReactNode }) {
    return <ScrollArea style={{ height }}>{children}</ScrollArea>
  }

  return ScrollWrapper
}
