interface TransactionOverviewDetailsItemProps {
  label: string
  children: React.ReactNode
}
export function TransactionOverviewDetailsItem({ label, children }: TransactionOverviewDetailsItemProps) {
  return (
    <div className="flex items-center justify-between border-b py-4 last:border-0 last:pb-0">
      <div className="text-basics-black">{label}</div>
      <div>{children}</div>
    </div>
  )
}
