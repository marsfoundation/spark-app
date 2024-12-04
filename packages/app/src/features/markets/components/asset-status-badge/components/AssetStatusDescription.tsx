import { ReactNode } from 'react'

interface AssetStatusDescriptionProps {
  children: [ReactNode, ReactNode]
}

export function AssetStatusDescription({ children }: AssetStatusDescriptionProps) {
  const [icon, description] = children
  return (
    <div className="flex items-center gap-3">
      {icon}
      <p className="typography-label-6 text-primary-inverse">{description}</p>
    </div>
  )
}
