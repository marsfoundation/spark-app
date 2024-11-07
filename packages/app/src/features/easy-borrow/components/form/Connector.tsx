import EasyBorrowConnector from '@/ui/assets/easy-borrow-connector.svg?react'

export interface ConnectorProps {
  className?: string
}

export function Connector({ className }: ConnectorProps) {
  return <EasyBorrowConnector className={className} />
}
