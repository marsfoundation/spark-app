import { JSONStringifyRich } from '@/utils/object'
import { solidFetch } from '@/utils/solidFetch'

const plausibleId = import.meta.env.VITE_ANALYTICS_PLAUSIBLE_ID

/**
 * Track an event for analytic purposes.
 * @note: this function creates a "floating" promise to avoid slowing down or breaking the functionality that it's called from.
 */
export function recordEvent(event: string, props: Record<string, any> = {}): void {
  void recordEventAsync(event, props)
}

async function recordEventAsync(event: string, props: Record<string, any> = {}): Promise<void> {
  if (!plausibleId) {
    return
  }

  const response = await solidFetch('https://plausible.io/api/event', {
    method: 'POST',
    body: JSON.stringify({
      name: event,
      url: window.location.href,
      domain: plausibleId,
      props: JSONStringifyRich(props),
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    const errorMsg = { code: response.status, text: await response.text() }
    throw new Error(`Failed to record event: ${JSON.stringify(errorMsg)}`)
  }
}
