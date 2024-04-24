import { SortingFn } from '@tanstack/react-table'
import { ReactNode } from 'react'

export interface ColumnDefinition<T> {
  header: ReactNode
  renderCell: (value: T, mobileViewOptions?: MobileViewOptions) => ReactNode
  sortable?: boolean
  sortingFn?: SortingFn<T>
  headerAlign?: 'left' | 'center' | 'right'
}

export interface MobileViewOptions {
  rowTitle: ReactNode
  isMobileView: boolean
}
