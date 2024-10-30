interface TransactionOverviewDetailsItemProps {
  label: string
  children: React.ReactNode
  'data-testid'?: string
}
export function TransactionOverviewDetailsItem({
  label,
  children,
  'data-testid': dataTestId,
}: TransactionOverviewDetailsItemProps) {
  return (
    <div className="flex items-center justify-between border-b py-4 last:border-0 last:pb-0" data-testid={dataTestId}>
      <div>{label}</div>
      <div>{children}</div>
    </div>
  )
}
