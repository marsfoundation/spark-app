import { Suspense } from 'react'

/* eslint-disable func-style */
export function withSuspense<T extends {}>(
  WrappedComponent: React.ComponentType<T>,
  FallbackComponent: React.ComponentType<{}>,
): React.ComponentType<T> {
  // make it easy to spot missing suspense fallbacks in development
  if (import.meta.env.MODE === 'development') {
    const FallbackComponentOriginal = FallbackComponent

    // eslint-disable-next-line react/display-name
    FallbackComponent = () => {
      // eslint-disable-next-line no-console
      console.log('Rendering fallback component...')
      return <FallbackComponentOriginal />
    }
    FallbackComponent.displayName = FallbackComponentOriginal.displayName || FallbackComponentOriginal.name
  }
  const ComponentWithSuspense = (props: T) => (
    <Suspense fallback={<FallbackComponent />}>
      <WrappedComponent {...props} />
    </Suspense>
  )

  ComponentWithSuspense.displayName = WrappedComponent.displayName || WrappedComponent.name

  return ComponentWithSuspense
}
/* eslint-enable func-style */
