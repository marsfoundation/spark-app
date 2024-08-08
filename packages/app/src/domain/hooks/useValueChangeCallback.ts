import { useEffect } from 'react'

export function useValueChangeCallback(txReceipt: any, callback: () => void): void {
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    callback()
  }, [txReceipt])
}
