import { paths } from '@/config/paths'
import { LinkButton } from '@/ui/atoms/new/link-button/LinkButton'
import { ErrorLayout } from '@/ui/layouts/ErrorLayout'

interface NotFoundProps {
  fullScreen?: boolean
}

export function NotFound({ fullScreen }: NotFoundProps) {
  return (
    <ErrorLayout fullScreen={fullScreen}>
      <div className="my-auto flex flex-col items-center justify-center gap-6 py-8">
        <div className="font-bold text-7xl text-basics-dark-grey">404</div>
        <h2 className="font-medium text-base sm:text-2xl">The requested page could not be found.</h2>
        <LinkButton to={paths.easyBorrow}>Go to Homepage</LinkButton>
      </div>
    </ErrorLayout>
  )
}
