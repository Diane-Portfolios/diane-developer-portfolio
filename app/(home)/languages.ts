// Shared by the sidebar list and the on-screen language menu so the two can't
// drift apart. English leads the list — it's the menu's own reset target
// (see GameBoyMenu) as well as a selectable row — with `native` == `en` since
// there's no separate native form to swap in for it.
//
// Casing on the native side follows each language's own convention rather
// than being forced to title case: only German capitalises its language
// name, so the rest are correctly lowercase.
export const LANGUAGES = [
  { en: 'English', native: 'English', lang: 'en' },
  { en: 'Spanish', native: 'español', lang: 'es' },
  { en: 'French', native: 'français', lang: 'fr' },
  { en: 'Portuguese', native: 'português', lang: 'pt' },
  { en: 'Italian', native: 'italiano', lang: 'it' },
  { en: 'German', native: 'Deutsch', lang: 'de' },
  { en: 'Czech', native: 'čeština', lang: 'cs' },
  { en: 'Japanese', native: '日本語', lang: 'ja' },
  { en: 'Simplified Chinese', native: '简体中文', lang: 'zh-Hans' },
  { en: 'Korean', native: '한국어', lang: 'ko' },
]
