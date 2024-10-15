export interface Chain {
  logo: string
  name: string
  supportedPages: string[]
  selected: boolean
  onSelect: () => void
}
