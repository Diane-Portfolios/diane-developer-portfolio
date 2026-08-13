// Held in English for the whole animation — only the role after it cycles.
export const TITLE_PREFIX = 'Diane Stephani -'

// What the role settles on.
export const FINAL_ROLE = 'Software & Localization Engineer'

// Total time from first paint to fully-settled English, in ms. The cycle runs
// for TOTAL_DURATION_MS - FINAL_FADE_MS and the English crossfades over the last
// phrase, so the whole thing lands at exactly TOTAL_DURATION_MS.
export const TOTAL_DURATION_MS = 4000

// How long the English takes to fade up. The last cycling phrase is held this
// much longer than its slot so the two crossfade — without the overlap the cycle
// ends before the English is legible and you get a blank flicker between them.
export const FINAL_FADE_MS = 200

// Order as requested. Slot timing divides the cycle window by however many
// entries are here, so adding or removing a language repaces it automatically.
//
// GENDERED JOB TITLES — French, German, Spanish, Portuguese, Czech and Italian
// inflect for the gender of the person described. All six use the feminine
// forms. Japanese, Korean and Chinese don't inflect.
//
// NOT NATIVE-REVIEWED. These are my best effort and are pending verification.
export const ROLE_PHRASES = [
  'Ingénieure logiciel et localisation', // French
  'ソフトウェア＆ローカライゼーションエンジニア', // Japanese
  'Software- und Lokalisierungsingenieurin', // German
  '소프트웨어 및 현지화 엔지니어', // Korean
  'Ingeniera de software y localización', // Spanish
  '软件与本地化工程师', // Simplified Chinese
  'Engenheira de software e localização', // Portuguese
  'Softwarová a lokalizační inženýrka', // Czech
  'Ingegnera del software e della localizzazione', // Italian
]
