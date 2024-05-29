import { useEffect } from 'react'

export function useViteErrorOverlay(): void {
  useEffect(function addViteErrorHandler() {
    // eslint-disable-next-line func-style
    const handler = ({ reason }: PromiseRejectionEvent): void => showErrorOverlay(reason)

    window.addEventListener('unhandledrejection', handler)

    return () => {
      window.removeEventListener('unhandledrejection', handler)
    }
  }, [])
}

function showErrorOverlay(err: Error): void {
  // must be within function call because that's when the element is defined for sure.
  const ErrorOverlay = customElements.get('vite-error-overlay')
  // don't open outside vite environment
  if (!ErrorOverlay) {
    return
  }
  // biome-ignore lint/suspicious/noConsoleLog: <explanation>
  console.log(err)
  const overlay = new ErrorOverlay(err)
  document.body.appendChild(overlay)
}
