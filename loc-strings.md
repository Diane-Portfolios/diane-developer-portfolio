# Localization Strings

All non-English strings currently in the codebase, gathered here for translation review. Every set below lives in `app/(home)/` and is **not native-reviewed** — treat as placeholder pending verification by a native speaker of each language.

Language codes used throughout: `en`, `fr`, `ja`, `de`, `ko`, `es`, `zh-Hans`, `pt`, `cs`, `it`.

---

## 1. Navbar job title role

**Source:** [`app/(home)/cycle-phrases.ts`](app/(home)/cycle-phrases.ts) — `ROLE_BY_LANG`
**Rendered by:** [`app/(home)/cycling-title.tsx`](app/(home)/cycling-title.tsx), inside `SiteNav`

Gender-inflected feminine in the six languages that inflect for gender (fr, de, es, pt, cs, it). Japanese, Korean, and Chinese don't inflect.

| Code | String |
|---|---|
| en | Software & Localization Engineer |
| fr | Ingénieure logiciel et localisation |
| ja | ソフトウェア＆ローカライゼーションエンジニア |
| de | Software- und Lokalisierungsingenieurin |
| ko | 소프트웨어 및 현지화 엔지니어 |
| es | Ingeniera de software y localización |
| zh-Hans | 软件与本地化工程师 |
| pt | Engenheira de software e localização |
| cs | Softwarová a lokalizační inženýrka |
| it | Ingegnera del software e della localizzazione |

---

## 2. Language names (autonyms)

**Source:** [`app/(home)/languages.ts`](app/(home)/languages.ts) — `LANGUAGES`
**Rendered by:** [`app/(home)/gameboy-menu.tsx`](app/(home)/gameboy-menu.tsx), the Game Boy "LANGUAGE" menu screen

Each language's own name, written in itself. Casing follows each language's own convention (only German capitalizes its language name).

| English name | Native name | Code |
|---|---|---|
| Spanish | español | es |
| French | français | fr |
| Portuguese | português | pt |
| Italian | italiano | it |
| German | Deutsch | de |
| Czech | čeština | cs |
| Japanese | 日本語 | ja |
| Simplified Chinese | 简体中文 | zh-Hans |
| Korean | 한국어 | ko |

---

## 3. "I work in" label + location names

**Source:** [`app/(home)/location-note.tsx`](app/(home)/location-note.tsx) — `LABEL_BY_LANG`, `PLACES`, `CZECH_PLACES`
**Rendered by:** `LocationNote()` in the same file, below `AboutNote` in the hero

### Label

The ja/ko/zh-Hans entries are noun labels ("work location" / "workplace") rather than literal renderings of "I work in" — those languages structure the sentence differently (particle after the place, or wrapping the phrase), so a word-for-word version would strand a fragment above the city names.

| Code | String |
|---|---|
| en | I work in |
| fr | Je travaille à |
| ja | 勤務地 |
| de | Ich arbeite in |
| ko | 근무지 |
| es | Trabajo en |
| zh-Hans | 工作地点 |
| pt | Trabalho em |
| cs | Pracuji |
| it | Lavoro a |

### Location names

Static for every language except Czech, which declines the city names into the locative case (Seattle → Seattlu, Chicago → Chicagu) with the "v" preposition folded into the place name itself, since the Czech label is just the bare verb "Pracuji".

| Default (all other languages) | Czech |
|---|---|
| Seattle, WA | v Seattlu |
| Chicago, IL | v Chicagu |
