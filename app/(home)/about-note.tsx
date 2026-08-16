import { SEQUENCE, rotationStyle } from './rotation'

const NAME = 'Diane Stephani'

// The hero's about paragraph, keyed by language, on the same rotation clock
// as the navbar role and the work-location label — see ./rotation. Kept as a
// one-entry array per language (rather than a single string) for the same
// reason the old static ABOUT was: the render below maps over it, so a future
// edit back to multiple paragraphs per language is a one-line change.
//
// GENDERED — French, German, Spanish, Portuguese, Czech and Italian inflect
// for the gender of the person speaking ("I'm a software engineer..."). All
// six use the feminine forms, matching ROLE_BY_LANG in ./cycle-phrases.
// Japanese, Korean and Chinese don't inflect.
//
// NOT NATIVE-REVIEWED. These are my best effort and are pending verification.
const ABOUT_BY_LANG: Record<string, string[]> = {
  en: [
    `I'm a software engineer with a background in games, specializing in localization, though I'm always open to other industries and projects! I work with marketing teams to translate promotional campaigns, and build automation tools to simplify their day-to-day.`,
  ],
  fr: [
    `Je suis ingénieure logicielle avec une expérience dans les jeux vidéo, spécialisée en localisation, bien que je sois toujours ouverte à d'autres secteurs et projets ! Je travaille avec des équipes marketing pour traduire des campagnes promotionnelles, et je développe des outils d'automatisation pour simplifier leur quotidien.`,
  ],
  ja: [
    `私はゲーム業界出身のソフトウェアエンジニアで、ローカライゼーションを専門としていますが、他の業界やプロジェクトにもいつでも興味があります!マーケティングチームと協力してプロモーションキャンペーンを翻訳し、日々の業務を簡略化する自動化ツールを構築しています。`,
  ],
  de: [
    `Ich bin Software-Ingenieurin mit einem Hintergrund in der Gamesbranche und auf Lokalisierung spezialisiert, bin aber immer offen für andere Branchen und Projekte! Ich arbeite mit Marketingteams zusammen, um Werbekampagnen zu übersetzen, und entwickle Automatisierungstools, die ihren Alltag vereinfachen.`,
  ],
  ko: [
    `저는 게임 업계 출신의 소프트웨어 엔지니어로, 현지화를 전문으로 하지만 다른 업계나 프로젝트에도 언제나 열려 있습니다! 마케팅 팀과 협력하여 프로모션 캠페인을 번역하고, 그들의 일상 업무를 간소화하는 자동화 도구를 만듭니다.`,
  ],
  es: [
    `Soy ingeniera de software con experiencia en videojuegos, especializada en localización, aunque siempre estoy abierta a otras industrias y proyectos. Trabajo con equipos de marketing para traducir campañas promocionales, y desarrollo herramientas de automatización para simplificar su día a día.`,
  ],
  'zh-Hans': [
    `我是一名有游戏行业背景的软件工程师,专注于本地化,不过我一直对其他行业和项目持开放态度!我与市场团队合作翻译推广活动内容,并构建自动化工具来简化他们的日常工作。`,
  ],
  pt: [
    `Sou engenheira de software com experiência em jogos, especializada em localização, embora esteja sempre aberta a outras indústrias e projetos! Trabalho com equipes de marketing para traduzir campanhas promocionais e crio ferramentas de automação para simplificar o dia a dia delas.`,
  ],
  cs: [
    `Jsem softwarová inženýrka se zkušenostmi z herního průmyslu, specializuji se na lokalizaci, i když jsem vždy otevřená dalším odvětvím a projektům! Spolupracuji s marketingovými týmy na překladu propagačních kampaní a vytvářím automatizační nástroje, které jim zjednodušují každodenní práci.`,
  ],
  it: [
    `Sono un'ingegnera del software con un background nei videogiochi, specializzata in localizzazione, anche se sono sempre aperta ad altri settori e progetti! Lavoro con i team di marketing per tradurre campagne promozionali e creo strumenti di automazione per semplificare il loro lavoro quotidiano.`,
  ],
}

// Top half of the hero's left column (see page.tsx), stacked above
// LocationNote. Capped width rather than filling the column: a wide block of
// this much small text reads as a denser "mass" than a narrower, taller one
// — the same reasoning that already applied when this sat beside the
// console instead of above the location note. The name stays static — it's
// the one string on the page with no translation to rotate through — but the
// paragraph below it now rotates on the same clock as the navbar role and
// the work-location label, so all three always show the same language.
export function AboutNote() {
  const codes = [...new Set(SEQUENCE)]

  return (
    <div className="ns-enter-side max-w-[22rem] text-left" style={{ animationDelay: '0.55s' }}>
      <h2 className="text-4xl font-semibold tracking-tight text-white">{NAME}</h2>

      {/* --wrap (see globals.css): unlike the navbar role or the location
          label, this state is a full paragraph, so it needs to wrap onto
          multiple lines rather than forcing one long one. The stack still
          sizes to its tallest state, same as everywhere else, so the switch
          between languages of very different lengths never reflows the
          column beneath it. */}
      <div className="ns-cycle-stack ns-cycle-stack--wrap mt-4 text-sm leading-[1.7] text-neutral-300">
        {codes.map((code) => (
          <div
            key={code}
            className={code === 'en' ? 'ns-rot-default space-y-3' : 'ns-rot space-y-3'}
            aria-hidden={code === 'en' ? undefined : 'true'}
            lang={code === 'en' ? undefined : code}
            dir="auto"
            style={rotationStyle(code)}
          >
            {ABOUT_BY_LANG[code].map((para) => (
              <p key={para.slice(0, 24)}>{para}</p>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
