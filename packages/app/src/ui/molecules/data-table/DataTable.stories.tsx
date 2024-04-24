import { Meta, StoryObj } from '@storybook/react'

import { DataTable } from './DataTable'

export type Payment = {
  id: string
  amount: number
  status: 'pending' | 'processing' | 'success' | 'failed'
  email: string
}

const data: Payment[] = [
  {
    id: 'm5gr84i9',
    amount: 316,
    status: 'success',
    email: 'ken99@yahoo.com',
  },
  {
    id: '3u1reuv4',
    amount: 242,
    status: 'success',
    email: 'Abe45@gmail.com',
  },
  {
    id: 'derv1ws0',
    amount: 837,
    status: 'processing',
    email: 'Monserrat44@gmail.com',
  },
  {
    id: '5kma53ae',
    amount: 874,
    status: 'success',
    email: 'Silas22@gmail.com',
  },
  {
    id: 'bhqecj4p',
    amount: 721,
    status: 'failed',
    email: 'carmella@hotmail.com',
  },
]

const meta: Meta<typeof DataTable> = {
  title: 'Components/Molecules/DataTable',
  component: DataTable,
  args: {
    columnDef: {
      id: {
        header: 'ID',
        renderCell: ({ id }) => id,
      },
      amount: {
        header: 'Amount',
        sortable: true,
        headerAlign: 'center',
        sortingFn: (a, b) => a.original.amount - b.original.amount,
        renderCell: ({ amount }) => <div className="m-auto w-fit">{amount}</div>,
      },
      status: {
        header: 'Status',
        headerAlign: 'center',
        renderCell: ({ status }) => <div className="m-auto w-fit">{status}</div>,
      },
      email: {
        header: 'Email',
        headerAlign: 'right',
        renderCell: ({ email }) => <div className="flex w-full flex-row justify-end">{email}</div>,
      },
    },
    data,
    gridTemplateColumnsClassName: 'grid-cols-4',
  },
}

export default meta
type Story = StoryObj<typeof DataTable>

export const Default: Story = {
  name: 'Default',
}

export const WithoutTableHeader: Story = {
  name: 'Without Table Header',
  args: {
    hideTableHeader: true,
  },
}
