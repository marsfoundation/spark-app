import { useState } from 'react'

export interface UseClipboardOptions {
  timeout?: number
}
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function useClipboard({ timeout = 1500 }: UseClipboardOptions = {}) {
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

  async function copy(valueToCopy: string): Promise<void> {
    try {
      // Try to use modern clipboard api if available
      if ('clipboard' in navigator) {
        await navigator.clipboard.writeText(valueToCopy)
        handleCopyResult()
      }
    } catch {
      // Use fallback solution, might be useful in iframes, where clipboard-write is turned off (Safe)
      await fallbackCopy(valueToCopy)
    }
  }

  async function fallbackCopy(text: string): Promise<void> {
    const span = Object.assign(document.createElement('span'), {
      textContent: text,
      style: 'position: absolute; left: -1000vw; opacity:0;',
    })
    document.body.appendChild(span)

    const range = document.createRange()
    const selection = window.getSelection()
    range.selectNodeContents(span)
    selection?.removeAllRanges()
    selection?.addRange(range)

    try {
      // @note: execCommand is deprecated but needed for fallback support
      document.execCommand('copy')
      handleCopyResult()
    } catch (e) {
      setError(new Error(`Failed to copy text: ${e}`))
    } finally {
      selection?.removeAllRanges()
      document.body.removeChild(span)
    }
  }

  function reset(): void {
    setCopied(false)
    setError(null)
    window.clearTimeout(copyTimeout!)
  }

  return { copy, reset, error, copied }
}
