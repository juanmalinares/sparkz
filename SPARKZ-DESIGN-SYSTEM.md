# Sparkz — Design System & App Restyle Brief

> **Purpose of this doc.** Paste this into a new session (or feed it to your CLI coding agent) to restyle the **live Sparkz app**. It is the single source of truth for the visual language. The app is in production and **starts in Spanish (`es`)**. Restyle one screen at a time and verify against the rules at the bottom.

---

## 0 · How to use this in a new session

1. Drop this file in your repo root as `SPARKZ-DESIGN-SYSTEM.md`.
2. Open a new session and say: *"Restyle `<screen/component>` to the Sparkz design system in `SPARKZ-DESIGN-SYSTEM.md`. Keep behavior identical; change only visuals."*
3. Work **token-first**: apply §2 (tokens) globally, then re-skin components with §6 recipes.
4. Reject any diff that introduces gradients, soft shadows, glass, or emoji-as-icon (see §10).

---

## 1 · Brand in one paragraph

Sparkz is a premium kids' education app (primary audience **ages 8–10**, parents 28–45 secondary). The language is **Bauhaus geometry × manga character energy × abstract composition**. It treats children as capable, ambitious learners — *cool > cute, impressive > adorable*. The logo is the **Z‑Lightning Mark**: two opposing triangular notches cut into a rounded square; the gap between the tips is "the spark." Tone is **earned pride, not performed delight**.

**Adjectives:** Bold · Structured · Alive · Precise · Charged.

---

## 2 · Color tokens

```css
:root {
  /* Primary */
  --electric:   #C5E830; /* brand spark, the Z, hero accent — NOT a general UI color */
  --forest:     #0D2318; /* mark dark, deepest surface, hard-shadow ink */
  --cobalt:     #1A2FBF; /* primary action · Math */
  --vermillion: #E5311D; /* challenge, urgency · high-stakes CTA */
  --amber:      #F5C400; /* reward, success · Art */
  --obsidian:   #111827; /* components, nav bar, strokes */
  --cream:      #F6F2EC; /* app background — warm, never clinical white */

  /* Support */
  --teal:       #00B4A6; /* correct state · Science */
  --violet:     #7C3AED; /* Reading · rare badges */
  --stone:      #E5E1DC; /* borders, disabled */
  --slate:      #6B7280; /* secondary text, hint, "wrong" state */
  --near-black: #0A0D12; /* true dark, app-icon bg */
}
```

**Rules**
- **Max 3 palette colors per screen** (excluding obsidian + cream).
- **No gradients. No glass/blur. No soft shadows.** Flat color only.
- Color signals zone: **dark (forest/obsidian) = immersive/lesson**, **cream = home/navigation**.
- **Electric is brand-only** — the mark, the Z, key spark moments. Never a button or body fill.

---

## 3 · Typography

```css
--font-display: 'Space Grotesk', sans-serif;   /* titles, wordmark — 700, -0.02em */
--font-body:    'Plus Jakarta Sans', sans-serif;/* exercise copy, descriptions — 400/500 */
--font-ui:      'DM Sans', sans-serif;          /* labels, nav, chips — 700 ALL-CAPS, 0.18em */
```

| Token | Size | Weight | Font |
|---|---|---|---|
| display-xl | 56–72px | 700 | Space Grotesk |
| display-lg | 36–48px | 700 | Space Grotesk |
| heading-md | 24–28px | 600 | Space Grotesk |
| body-lg | 18px | 400 | Plus Jakarta Sans |
| body-md | 15px | 400 | Plus Jakarta Sans |
| label-sm | 10–12px | 700 · UPPERCASE · 0.15em | DM Sans |

Body text **18px minimum** at arm's length for ages 8–10.

---

## 4 · Shape & radius

Six primitives carry meaning (never pure decoration):
**Circle** = curiosity/infinite · **Triangle** = direction/challenge · **Square** = structure · **Diamond** = premium/rare · **Cross** = add/unlock · **Lightning‑Z** = brand energy.

```css
--r-sharp: 4px;   /* action & reward buttons, badges, icon buttons */
--r-card:  12px;  /* content cards, modals */
--r-pill:  999px; /* primary buttons, tags, selection pills */
```

---

## 5 · Surfaces & the signature shadow

```css
/* THE signature — hard offset shadow, never soft */
--shadow-card: 3px 3px 0 var(--forest);
--shadow-pill: 2px 2px 0 var(--forest);

/* cards on light bg */            border: 1px solid var(--stone); border-radius: 12px;
/* tactile/tappable cards */       border: 2px solid var(--forest); box-shadow: 3px 3px 0 var(--forest);
/* cards on dark bg */             /* no border — solid color blocks float */
```

---

## 6 · Component recipes

**Primary button** (forward action)
```css
background: var(--cobalt); color:#fff; border-radius:999px;
padding:14px 28px; font:600 15px 'Space Grotesk';
```
**Action button** (high-stakes — submit, challenge)
```css
background: var(--vermillion); color:#fff; border-radius:4px; padding:14px 28px;
```
**Reward button** (collect, unlock)
```css
background: var(--amber); color: var(--obsidian); border-radius:4px;
border:2px solid var(--forest); box-shadow:3px 3px 0 var(--forest);
```
**Selection pill** (exercise answer — the core mechanic)
```css
background:#fff; color: var(--obsidian);
border:2px solid var(--forest); border-radius:999px;
box-shadow:2px 2px 0 var(--forest); min-height:56px;
font:700 20–22px 'Space Grotesk';
/* correct  */ border-color: var(--teal); background:#D9F5F2; transform:scale(1.02);
/* wrong    */ border-color: var(--slate); background:#F3F4F6; animation: shake .4s; /* NO red */
```
**Nav bar** — obsidian/forest background, 5 geometric glyph icons, **amber active state**, DM Sans 10px uppercase labels.

**Card (dark)** — solid `--obsidian`/`--forest` block, no border, 12px radius.

---

## 7 · Iconography

2px-equivalent geometric glyphs, sharp construction, **single color**, no emoji ever. Subject icons map 1:1 to the registry; UI/reward glyphs share the family weight.

- **Subjects:** math (÷), science (atom), reading (book), art (Bauhaus primaries), music (beamed notes), coding (`</>`), history (hourglass), geography (globe), language (speech bubble), logic (Venn), challenge (trophy).
- **UI / reward:** bolt, flame, heart, gem, crown, star, sparkle, check, play, lock, home, cap, user, search, bell, gear, map, chart, plus, chevron.
- The four reward/utility glyphs **flame · crown · bell · map** are built from pure primitives (triangle+semicircle, triangles+bar+jewels, dome+trapezoid+clapper, circle+triangle pin).

---

## 8 · Background system (Bauhaus grid)

Every screen gets a geometric field **behind** content — *Geometrica*-style tessellation, not random sprinkle. Tiles snap to a unit grid: semicircles, quarter-circles, full circles, rings, diagonal halves, stripe blocks, dot clusters, arches.

```
unit: 50–120px · density: 0.3–0.55 · opacity: 6–25%
colors: subject color + 1 accent (amber/electric) on the zone background
```
Header strips use a denser field at ~12% white; cream bodies use ~6% subject color; reward/dark screens use ~25% subject color on forest.

---

## 9 · Motion

| Moment | Motion | Feel |
|---|---|---|
| Screen transition | horizontal slide 220ms ease-out | manga panel cut |
| Correct answer | scale 1 → 1.08 → 1.02 + amber flash + check | physical, a fist-pump |
| Wrong answer | shake ±4px × 3, shift to mid-grey | calm, non-punishing — **no red** |
| Progress fill | left-to-right with spring overshoot | alive, tactile |
| Badge unlock | drop from top, spring bounce, **particle burst of ▲ + ■** (not confetti) | earned drama |
| Button press | scale 1 → 0.96 | tactile |

---

## 10 · Guardrails

**Never:** gradients · soft drop shadows · glass/blur · emoji as UI icons · >3 palette colors per screen · 24px-rounded SaaS UI everywhere · single mascot · confetti · clinical `#FFFFFF` · bubble/hand-drawn fonts · electric-green as a general UI color · red punishment states.

**Always:** geometric shape vocabulary · hard offset shadow `3px 3px 0` · 2px obsidian border on interactive light-surface elements · pill selection mechanic · geometric glyph nav icons · subject color = context · Bauhaus background field · earned reward moments · Spanish-first copy.

---

## 11 · Subjects (scalable registry)

The subject list is data-driven — add an entry and it propagates to logo fill, headers, progress, icons everywhere. Shape of each entry:

```js
{ id, label_es, label_en, color, soft, iconId }
```

| id | es | en | color | icon |
|---|---|---|---|---|
| math | Matemáticas | Mathematics | `#1A2FBF` | math |
| science | Ciencias | Science | `#00B4A6` | science |
| reading | Lectura | Reading | `#7C3AED` | reading |
| art | Arte | Art | `#F5C400` | art |
| music | Música | Music | `#EC4899` | music |
| coding | Programación | Coding | `#0EA5E9` | coding |
| history | Historia | History | `#92400E` | history |
| geography | Geografía | Geography | `#059669` | geography |
| language | Idiomas | Languages | `#DC2626` | language |
| logic | Lógica | Logic | `#475569` | logic |
| challenge | Reto | Challenge | `#E5311D` | challenge |

Each subject reuses the **same logo mark, different fill** — one mark, infinite context signals.

---

## 12 · Spanish-first copy kit

| Key | Español | English |
|---|---|---|
| lesson | LECCIÓN | LESSON |
| question | PREGUNTA | QUESTION |
| correct | ¡Correcto! | Correct. |
| wrong (calm) | No del todo. Mira las partes. | Not quite. Look at the parts. |
| streak | RACHA · EN LLAMAS | STREAK · ON FIRE |
| progress | Mapa de Maestría | Mastery Map |
| reward | INSIGNIA DESBLOQUEADA | BADGE UNLOCKED |
| collect | RECOGER | COLLECT |
| tap to continue | TOCA PARA CONTINUAR | TAP TO CONTINUE |
| nav | INICIO · APRENDER · RETO · PREMIOS · PERFIL | HOME · LEARN · CHALLENGE · REWARDS · PROFILE |

Voice: less "¡diversión!", more "vamos." Day initials in `es`: L M M J V S D.

---

## 13 · The Z-Lightning Mark (drop-in)

```html
<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <rect x="4" y="4" width="92" height="92" rx="13" fill="#C5E830"/>
  <polygon points="4,22 63,42 4,62" fill="#0D2318"/>
  <polygon points="96,38 37,58 96,78" fill="#0D2318"/>
</svg>
```
Min size 16px · clear space = rx (13 in a 100 viewbox) · always square · never stretch · subject variants only change the `rect` fill.

---

## North star

> Sparkz should make a child feel like the **main character in their own story** — not a passive user being entertained. Every decision reinforces agency, capability, and the feeling that learning is the most exciting thing you can do. **Build for the kid who wants to be taken seriously.**
