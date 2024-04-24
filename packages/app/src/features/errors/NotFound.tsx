import { paths } from '@/config/paths'
import { LinkButton } from '@/ui/atoms/button/Button'
import { ErrorLayout } from '@/ui/layouts/ErrorLayout'

export function NotFound() {
  return (
    <ErrorLayout>
      <div className="my-auto flex flex-col items-center justify-center gap-6 py-8">
        <div className="text-basics-dark-grey text-7xl font-bold">404</div>
        <h2 className="text-base font-medium sm:text-2xl">The requested page could not be found.</h2>
        <LinkButton to={paths.easyBorrow}>Go to Homepage</LinkButton>
      </div>
    </ErrorLayout>
  )
}
