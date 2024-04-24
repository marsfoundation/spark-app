import { ReactNode } from 'react'

interface AssetStatusDescriptionProps {
  children: [ReactNode, ReactNode]
}

export function AssetStatusDescription({ children }: AssetStatusDescriptionProps) {
  const [icon, description] = children
  return (
    <div className="flex items-center gap-3">
      {icon}
      <p className="text-prompt-foreground text-sm">{description}</p>
    </div>
  )
}
