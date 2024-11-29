export function test(): string {
  // biome-ignore lint/suspicious/noConsoleLog: <explanation>
  console.log('test')

  return 'test'
}

async function asyncFn(): Promise<number> {
  return 5
}

export async function testAsync(): Promise<void> {
  await asyncFn()
}
