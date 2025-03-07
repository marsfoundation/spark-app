import { paths } from '@/config/paths'
import { LinkButton } from '@/ui/atoms/link-button/LinkButton'
import { ErrorLayout } from '@/ui/layouts/ErrorLayout'

interface NotFoundProps {
  fullScreen?: boolean
}

export function NotFound({ fullScreen }: NotFoundProps) {
  return (
    <ErrorLayout fullScreen={fullScreen}>
      <div className="my-auto flex flex-col items-center justify-center gap-6 py-8">
        <div className="typography-display-2 text-secondary">404</div>
        <h2 className="typography-heading-4">The requested page could not be found.</h2>
        <LinkButton to={paths.easyBorrow}>Go to Homepage</LinkButton>
      </div>
    </ErrorLayout>
  )
}
