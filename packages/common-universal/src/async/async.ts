export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function halt(): Promise<never> {
  return new Promise(() => {})
}
