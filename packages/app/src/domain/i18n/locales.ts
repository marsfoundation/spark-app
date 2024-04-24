import { i18n } from '@lingui/core'

export const locales = {
  en: 'English',
  pl: 'Polski',
}
export type Locale = keyof typeof locales
export const defaultLocale = 'en' satisfies Locale

/**
 * Dynamically load and activate locale
 */
export async function switchLocale(locale: string): Promise<void> {
  const { messages } = await import(`../../locales/${locale}.po`)

  i18n.load(locale, messages)
  i18n.activate(locale)
}

export function getCurrentLocale(): Locale {
  return i18n.locale as Locale
}
