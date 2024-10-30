import { useState } from 'react'

export interface UseClipboardOptions {
  timeout?: number
}
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function useClipboard({ timeout = 2000 }: UseClipboardOptions = {}) {
  const [error, setError] = useState<Error | null>(null)
  const [copied, setCopied] = useState(false)
  /** @note
   * Browsers might rate-limit clipboard access if requests are too frequent.
   * Some browsers enforce specific restrictions or even throw errors if they detect
   * too many requests to navigator.clipboard APIs in a short time.
   */
  const [copyTimeout, setCopyTimeout] = useState<number | null>(null)

  function handleCopyResult(): void {
    window.clearTimeout(copyTimeout!)
    setCopyTimeout(window.setTimeout(() => setCopied(false), timeout))
    setCopied(true)
  }

  function copy(valueToCopy: string): void {
    if ('clipboard' in navigator) {
      navigator.clipboard.writeText(valueToCopy).then(handleCopyResult).catch(setError)
    } else {
      setError(new Error('useClipboard: navigator.clipboard is not supported'))
    }
  }

  function reset(): void {
    setCopied(false)
    setError(null)
    window.clearTimeout(copyTimeout!)
  }

  return { copy, reset, error, copied }
}
