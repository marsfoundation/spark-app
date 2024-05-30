import { Button } from '@/ui/atoms/button/Button'
import { Typography } from '@/ui/atoms/typography/Typography'
import { ErrorLayout } from '@/ui/layouts/ErrorLayout'

export interface ErrorFallbackProps {
  onReload: () => void
  fullScreen?: boolean
}

export function ErrorFallback({ onReload, fullScreen }: ErrorFallbackProps) {
  return (
    <ErrorLayout fullScreen={fullScreen}>
      <Typography variant="h1">Oops</Typography>
      <Typography variant="h3">Something went wrong</Typography>
      <Button onClick={onReload}>Reload</Button>
    </ErrorLayout>
  )
}
