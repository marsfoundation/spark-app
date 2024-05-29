import { Address, sha256 } from 'viem'

const defaultAvatar =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAAAAXNSR0IArs4c6QAAAQpJREFUaEPtmTEOhDAMBMmr+QK8OlfcVSdFWmlMcDHUcWLveK0AY845j+C572DRi0vOMzt8WPBCKAlnHbRtlS29kFoPr3pQD29zZ3aQHtbDXwXGdWU3rayx+q+y4P6MWIYSZvr1j5Zwf0YsQwkz/fpHS5gySi/x6TnVb2nlhC04RbnpW5qEIZDDloYKOrSggHoYCqiHqYDtPUwLfDq+3MNPJ0z3t2CqYPd4CXcnRPOTMFWwe7yEuxOi+cWEq99zaeL/8ekV1IJXyku4uifhfrb0QkA9rId/Cji04JCpDndo0aGVEqlu/ZRcml88pdMNLThVarFOwlBAWxoK6K8WKqAehgrqYShgew9/AEyBEOCiheCTAAAAAElFTkSuQmCC'

export function generateWalletAvatar(address: Address): string {
  const hash = sha256(address.toLowerCase() as Address).slice(2)
  const size = 6
  const scale = 10
  const canvas = document.createElement('canvas')
  canvas.width = size * scale
  canvas.height = size * scale
  const ctx = canvas.getContext('2d')

  if (!ctx) {
    return defaultAvatar
  }

  function pseudoRandomColor(index: number): string {
    const char = hash[index % hash.length]!
    const x = Number.parseInt(char, 16)
    return x > 7 ? '#FFF' : '#88F'
  }

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      ctx.fillStyle = pseudoRandomColor(y * size + (x >= size / 2 ? x : size - x - 1))
      ctx.fillRect(x * scale, y * scale, scale, scale)
    }
  }

  return canvas.toDataURL()
}
