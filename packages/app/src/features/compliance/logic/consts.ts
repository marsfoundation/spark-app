import { paths } from '@/config/paths'

export const blockedCountryCodes = [
  'AF', // Afghanistan
  'BA', // Bosnia and Herzegovina
  'BY', // Belarus
  'BI', // Burundi
  'CF', // Central African Republic
  'CU', // Cuba
  'CD', // Democratic Republic of the Congo
  'ET', // Ethiopia
  'GN', // Guinea
  'GW', // Guinea-Bissau
  'HT', // Haiti
  'IR', // Iran
  'IQ', // Iraq
  'LB', // Lebanon
  'LY', // Libya
  'ML', // Mali
  'MM', // Myanmar (Burma)
  'NI', // Nicaragua
  'NE', // Niger
  'KP', // North Korea
  'RU', // Russia
  'SO', // Somalia
  'SD', // Sudan
  'SY', // Syria
  'UA', // Ukraine
  'VE', // Venezuela
  'YE', // Yemen
  'ZW', // Zimbabwe
  'US', // United States
]

export const blockedPagesByCountryCode: Record<string, (keyof typeof paths)[]> = {
  GB: ['farms', 'farmDetails'],
}
