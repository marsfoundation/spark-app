import { ReactNode } from 'react'

interface CategoriesGridProps {
  children: ReactNode
}

export function CategoriesGrid({ children }: CategoriesGridProps) {
  return (
    <div className="mt-4 mb-2 flex flex-col gap-2">
      <h3 className="font-semibold text-xs">Category</h3>
      <div className="grid grid-cols-3 gap-2">{children}</div>
    </div>
  )
}
