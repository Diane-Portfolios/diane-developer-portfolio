// Held in English for the whole rotation — only the role below it changes.
// No trailing dash: the name and role now sit on their own stacked lines
// rather than sharing one, so a connector between them would dangle.
export const TITLE_PREFIX = 'Diane Stephani'

// The navbar role, keyed by language. Rotation order lives in ./rotation.
//
// GENDERED JOB TITLES — French, German, Spanish, Portuguese, Czech and Italian
// inflect for the gender of the person described. All six use the feminine
// forms. Japanese, Korean and Chinese don't inflect.
//
// NOT NATIVE-REVIEWED. These are my best effort and are pending verification.
export const ROLE_BY_LANG: Record<string, string> = {
  en: 'Software & Localization Engineer',
  fr: 'Ingénieure logiciel et localisation',
  ja: 'ソフトウェア＆ローカライゼーションエンジニア',
  de: 'Software- und Lokalisierungsingenieurin',
  ko: '소프트웨어 및 현지화 엔지니어',
  es: 'Ingeniera de software y localización',
  'zh-Hans': '软件与本地化工程师',
  pt: 'Engenheira de software e localização',
  cs: 'Softwarová a lokalizační inženýrka',
  it: 'Ingegnera del software e della localizzazione',
}
