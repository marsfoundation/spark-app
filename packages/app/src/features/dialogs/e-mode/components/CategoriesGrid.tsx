import { ReactNode } from 'react'

interface CategoriesGridProps {
  children: ReactNode
}

export function CategoriesGrid({ children }: CategoriesGridProps) {
  return <div className="my-2 grid grid-cols-1 gap-3 sm:grid-cols-3">{children}</div>
}
