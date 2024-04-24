import { ReactNode } from 'react'

interface CategoriesGridProps {
  children: ReactNode
}

export function CategoriesGrid({ children }: CategoriesGridProps) {
  return (
    <div className="mb-2 mt-4 flex flex-col gap-2">
      <h3 className="text-basics-black text-xs font-semibold">Category</h3>
      <div className="grid grid-cols-3 gap-2">{children}</div>
    </div>
  )
}
