import { getMobileStory, getTabletStory } from '@storybook-config/viewports'
import { Meta, StoryObj } from '@storybook/react'

import { ResponsiveDataTable } from './ResponsiveDataTable'

export interface Payment {
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

const meta: Meta<typeof ResponsiveDataTable> = {
  title: 'Components/Organisms/ResponsiveDataTable',
  component: ResponsiveDataTable,
  args: {
    columnDefinition: {
      id: {
        header: 'ID',
        renderCell: ({ id }) => <div className="w-fit">{id}</div>,
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
        renderCell: ({ email }) => <div className="flex w-full justify-center md:justify-end">{email}</div>,
      },
    },
    data,
  },
}

export default meta
type Story = StoryObj<typeof ResponsiveDataTable>

export const Desktop: Story = {
  name: 'Desktop',
  args: {
    gridTemplateColumnsClassName: 'grid-cols-4',
  },
}

export const WithoutTableHeader: Story = {
  name: 'Without Table Header',
  args: {
    gridTemplateColumnsClassName: 'grid-cols-4',
    hideTableHeader: true,
  },
}

export const Mobile = getMobileStory(Desktop)
export const Tablet = getTabletStory(Desktop)
