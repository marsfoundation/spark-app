export function getRandomColor(): string {
  const letters = '0123456789ABCDEF'
  let color = '#'
  for (let _ = 0; _ < 6; _++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}
