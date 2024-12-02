import { Button } from '@/ui/atoms/new/button/Button'
import { ErrorLayout } from '@/ui/layouts/ErrorLayout'

export interface ErrorViewProps {
  onReload: () => void
  fullScreen?: boolean
}

export function ErrorView({ onReload, fullScreen }: ErrorViewProps) {
  return (
    <ErrorLayout fullScreen={fullScreen}>
      <div className="my-auto flex flex-col items-center justify-center gap-6 py-8">
        <div className="typography-display-2 text-secondary">Oops</div>
        <div className="typography-heading-4">Something went wrong</div>
        <Button onClick={onReload}>Reload</Button>
      </div>
    </ErrorLayout>
  )
}
