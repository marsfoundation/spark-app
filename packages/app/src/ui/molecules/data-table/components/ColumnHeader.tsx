import { Button } from '@/ui/atoms/new/button/Button'
import { cn } from '@/ui/utils/style'
import { Column } from '@tanstack/react-table'
import { ChevronDownIcon, ChevronUpIcon, ChevronsUpDown } from 'lucide-react'
import { ColumnDefinition } from '../types'

interface ColumnHeaderProps<T> {
  column: Column<T>
  columnDefinition: ColumnDefinition<T> | undefined
}

export function ColumnHeader<T>({ column, columnDefinition }: ColumnHeaderProps<T>) {
  const { headerAlign, sortable, header } = columnDefinition ?? {}
  return (
    <div
      className={cn(
        'flex flex-row',
        headerAlign === 'center' && 'justify-center',
        headerAlign === 'right' && 'justify-end',
      )}
    >
      <Button
        variant="transparent"
        className={cn(
          'h-4 cursor-auto rounded-[1px] p-0 font-bold text-primary text-xs',
          sortable && 'cursor-pointer hover:text-secondary-foreground',
        )}
        onClick={() => sortable && column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        {sortable &&
          (column.getIsSorted() !== false ? (
            <>
              {column.getIsSorted() === 'asc' ? (
                <ChevronDownIcon className="icon-xs" />
              ) : (
                <ChevronUpIcon className="icon-xs" />
              )}
            </>
          ) : (
            <ChevronsUpDown size={16} />
          ))}
        {header}
      </Button>
    </div>
  )
}
