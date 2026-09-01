# Aniluna Aqua Buddy - Product Brief

This is the product brief: what the app is, who it is for, how it is meant to
feel, and which rules it holds itself to. It describes `index.html` as built at
**v0.31**.

It deliberately does not duplicate the operational documents beside it:
[`ARCHITECTURE.md`](ARCHITECTURE.md) for the code map and the configuration,
[`ROADMAP.md`](ROADMAP.md) for the known issues and the deferred work, and
[`../CHANGELOG.md`](../CHANGELOG.md) for what shipped when. Where they could
overlap, the brief states the intent and those state the state. If they
ever disagree, the README is describing what exists and this document is
describing what was wanted, and the difference is worth a look.

## Version log

Newest first. This log tracks the brief, not the app.

### v0.12 - 2026-09-01

- Updated for app v0.31: the mood reaches the world, not only the creature.
  Written into the mood section as a rule about what a band is allowed to
  change, because it is the first time a band touches anything outside the
  sprite.

### v0.11 - 2026-08-25

- Updated for app v0.30: recorded that the artboard is not the clip boundary,
  the scene is, because the sprites animate past the edge of their own
  viewBox and the horn was being cut off for it.

### v0.10 - 2026-08-25

- Updated for app v0.29: the unicorn's mane no longer overtakes the head above
  the head's own widest row, so the silhouette reads as hair beside a rounded
  skull rather than as a lump on it. Written down under the creatures, because
  it is a rule the other species have to keep too.

### v0.9 - 2026-08-25

- The name is settled: `Aniluna` is the product and repository name rather than
  a working title, so the sentence calling it one is gone. A decision being
  recorded rather than anything built (F1 in the README).
- Every locale has now been read by a speaker of it: the Traditional Chinese by
  Taiwanese native speakers (F2), the German by a native German speaker (F14).
  The language section no longer says it is waiting on anyone.
- Updated for app v0.28: the settings summary and the reset button carry an
  icon ahead of their label, and reset is no longer the faintest thing on the
  panel.

### v0.8 - 2026-08-24

- Updated for app v0.27: a third creature, the panda Wan Wan, chosen from the
  settings, with the dinosaur moved behind the secret switch and marked
  `secret: true` in config. Documented that the switch is a detour rather than
  a cycle, that a sprite declares its own species rather than the stylesheet
  pairing them, and why the markings on a black and white animal are charcoal.
- Noted that the secret switch keeps its accessible name but has no tooltip.

### v0.7 - 2026-08-24

- Rewrote the document from a pre-build spec into a brief describing the app as
  it now stands at v0.26. The original was addressed to an implementer who had
  not started yet, so its implementation order, acceptance criteria and closing
  instruction have been dropped as spent, along with citation markers that
  pointed at sources this repository never carried.
- Renamed throughout: the character is Aniluna, the product is Aqua Buddy, and
  the meter is Hydration rather than a thirst meter. The last of those was a
  deliberate departure from the original brief, made in app v0.13 because a
  meter that fills when you drink cannot be labelled thirst.
- Documented everything added since the MVP: a second creature and editable
  names, three languages, four themes including glitter, the sun and moon arc,
  the ambient wind and gull animations, the night and day meter rewards, and
  haptics.
- Removed em dashes in favour of hyphens, per the NeXtWind script standards
  (NXW-NAM-6), which the original predated.

### v0.6 - 2026-08-19
- Consolidated all concept, UX, architecture, timer, audio, animation, and maintainability guidance into one complete brief.
- Added requirement for a dedicated version log in the brief.
- Added top-level config object requirement for easy character renaming.
- Added happy-state rainbow reward idea as a decorative state-specific effect.
- Added idle animation requirement across hydration states.

### v0.5 - 2026-08-19
- Added explicit idle animation guidance per hydration state.
- Added reduced-motion requirement for idle loops and decorative animation.

### v0.4 - 2026-08-19
- Added happy-state rainbow visual reward concept.
- Clarified that the rainbow should be decorative, subtle, and tied only to the happiest state.
- Added note that the character name is a working title and should be configurable.

### v0.3 - 2026-08-19
- Added procedural sound effect requirements.
- Added five-taps-in-five-seconds blubber/gurgle easter egg.
- Clarified Web Audio unlock behaviour for mobile browsers.

### v0.2 - 2026-08-19
- Added modular single-file architecture guidance.
- Added localStorage persistence and timestamp-driven hydration decay requirements.
- Added mobile browser background-timer behaviour notes.

### v0.1 - 2026-08-19
- Defined the core concept: a cute single-screen hydration companion with a unicorn character and a meter.
- Established the static hosting target: GitHub Pages or similar no-server hosting.

## Purpose

A small static hydration companion in a single HTML file, hostable on GitHub
Pages or any similar static host, with no backend and with persistence in
`localStorage`. The point is the emotional loop of a cozy character companion,
kept much smaller in scope than the apps that inspired it: hydration only, one
screen, no accounts.

## Product summary

A one-screen hydration companion that feels like a handheld virtual pet rather
than a productivity dashboard. The user logs a drink, the meter refills, the
creature visibly perks up, and the app answers with visual, audible and haptic
feedback. The presentation is pixel-art: the creatures are drawn as SVG rects
outlined by a single `feMorphology` filter, which reads well on a phone and
suits a playful habit interface.

## Core product goals

- Make hydration logging feel cute, lightweight, and emotionally rewarding.
- Keep the app extremely simple and static-host friendly.
- Avoid backend infrastructure entirely.
- Make the app feel alive through character state, idle motion, ambient life
  and responsive feedback.
- Keep the code maintainable even though it is only one file.

## Non-goals

This is not a wellness dashboard, a multi-screen app, or an account-based
tracker. It stays away from:

- User accounts.
- Cloud sync.
- Social features.
- Complex statistics pages.
- Achievements or shop systems.
- Multiple routes or navigation-heavy architecture.

## Hard constraints

- A single `index.html` file, with the CSS and JavaScript inline.
- No server-side code, no framework, no build step, not even an icon file.
- Runs entirely in the browser, mobile-first.
- State persists locally.
- Survives browser suspension and closure through timestamp recalculation
  rather than through a background timer that will not be allowed to run.

## The creatures

Three of them, from one config entry each. The unicorn **Aniluna** and the panda
**Wan Wan** are chosen in the settings. The dinosaur **Anirex** is reachable only
through the almost hidden `*` in the footer, and that switch is a detour rather
than a cycle: pressing it again returns to whatever the settings picked, so it
cannot strand anyone on a creature the settings do not offer. **Aniluna** is
settled as the name of the product and of the repository, not a working title,
and the creature names beside it are defaults any owner can overwrite.

`Config.species` holds the name, the favicon emoji, the synth voice and a
`secret` flag per creature, so a fourth one is a config entry plus a sprite and
nothing in the code needs to know which creature is the hidden one. All three
sprites use the same group class names, so one animation system and one set of
mood-band tokens drive any of them. Each sprite declares its own species in
`data-species` and `applySpecies` hides the others: pairing CSS selectors
instead needs one rule per ordered pair, which does not scale past two.

The markings on a black and white animal are charcoal rather than black, because
the outline filter floods with `--ink` and a truly black creature would lose its
edges against it.

A head is symmetric and rounds in as it rises, and nothing that is not part of
the head may overtake it above its own widest row. A mane, a fin or an ear tuft
that reaches out past a narrowing skull stops reading as something attached to
the creature and starts reading as a swelling of the skull itself, which is how
the unicorn's mane read until v0.29. Anything that hangs beside the head begins
where the head is already at full width, and anything drawn inside the head
follows the outline rather than squaring off a corner the other side keeps.

Since v0.20 the owner can rename the creature on screen from the settings
panel, up to `Config.naming.maxLength` of 24 characters. Overrides live per
species in `State.data.names`, so each creature keeps its own name, and
`UI.name()` is the single place that resolves an override against the built-in
name. Clearing the field restores the built-in name. Every visible string takes
the name as an argument, so the title, heading, speech, stats, settings footer,
reset prompt, console banner and every ARIA label follow from that one call.

## Core user loop

1. Time passes.
2. The Hydration meter drops.
3. The creature droops and loses saturation.
4. The user taps "I drank water".
5. The meter refills.
6. The creature perks up, says something, and may play a sound, a buzz, or
   show a reward in the sky.

## Features as built

### Interface

- One-screen layout: top bar, scene, meter, stats, actions, settings, footer.
- A **Hydration** meter with a visible percentage. It fills when you drink, so
  100% is full and 0% is empty. It is deliberately not called a thirst meter.
- A large drink button, a reset button, a drinks-today stat and a relative
  last-drink stat. The drink, reset and settings controls each carry an icon
  ahead of the label, so the three are told apart at a glance rather than by
  reading. The icon is decoration on a control that already has a word, so it
  never carries meaning of its own and never reaches the accessible name.
- An info button that opens two localised sentences explaining the loop.
- Tooltips on the icon-only buttons, on hover and on keyboard focus, written
  from the same string as the accessible name so the two cannot drift. The
  secret switch is the exception: it keeps an accessible name, because a
  focusable button needs one, but has no tooltip, since a hover label reading
  "secret switch" is not a secret.

### Logic

- Hydration decay over elapsed time, from timestamps.
- Refill on the drink action, capped at 100.
- Daily count with a local-calendar rollover.
- Persistence of one serialised object in `localStorage`, with adoption of
  saves written under an older key name.

### Settings

- The creature's name.
- The creature: the unicorn or the panda. The dinosaur is not offered here,
  only through the switch.
- Language: German, English or Traditional Chinese.
- Full-to-empty time, a slider from 0.5 to 4.0 hours in half-hour steps.
- Refill amount, a four-stop slider at 25, 50, 75 and 100 percent.
- Sound on or off.
- Gurgle easter egg on or off.
- Vibration on or off, hidden where the browser has no Vibration API.

## Mood and state design

Four bands, compared against the displayed percentage so the number on screen,
the mood line, the sprite and the rewards always agree:

| Band | From | Feel |
|---|---|---|
| Hydrated | 75 | Bright, upright, sparkles at full strength, cheerful speech |
| Okay | 45 | Calm and comfortable, mild sparkle, gentle motion |
| Thirsty | 20 | Mild droop, muted saturation, asks for water gently |
| Dehydrated | below 20 | Subdued, low posture, almost no sparkle, sad but soft |

Each band is a block of CSS tokens covering the palette, the sparkle opacity
and the idle animation timing, so a band change retunes the whole scene without
per-band component code.

Since v0.31 a band reaches the world as well as the creature. The weather is
the mood: as hydration drops, a neutral grey wash settles over the scene and
dulls sky, ground, sun and moon together, and the ambient life thins out with
it. It is one wash rather than a palette per band, because a second set of
scene colours would have to be drawn and maintained for every theme, and grey
works against a pale sky and a dark one alike.

The character is the exception, and deliberately: it sits above the wash and
keeps its own saturation, so the creature stays the one thing in the picture
that has not gone grey. A band may dull the world, but it may never take the
character's colour with it, because the creature is what the eye is meant to
land on and a fully grey screen reads as broken rather than as sad. The
rewards are the other exception: they are earned at 95 percent, where the wash
is nothing anyway, so nothing that celebrates is ever dimmed.

## Idle animation

Subtle looped motion carries the personality: bobbing, breathing, blinking,
tail swish, ear twitch and sparkle twinkle. The band tunes amplitude, speed and
opacity rather than swapping animations. Movement uses `transform` and
`opacity` only, never layout, because this is a persistent companion UI on a
phone.

The artboard is not the clip boundary, the scene is. A sprite that bobs, hops,
wobbles or stretches leaves its own viewBox, and the tallest of them, the
unicorn's horn, has no room in it at all: it ends on the artboard's top row and
the outline filter spends the one row above it, so at rest the ink sits exactly
on the edge. `.pet` is therefore `overflow: visible`, and the scene, which is
`overflow: hidden`, decides what is off the picture. A new sprite may be drawn
to the edge of the artboard; it may not be drawn expecting the artboard to
catch its motion.

## Sky

The sky is not wallpaper. It carries the time of day and the state of the
meter.

- **Sun and moon** travel one shared east-to-west arc, interpolated in two
  halves so an off-centre peak still lands on its stated hour: the sun is
  highest at 12:00 inside an asymmetric 07:00 to 19:00 window, the moon at
  midnight inside a window that wraps past 24.
- **Starfield** shows all night, brighter still when the meter is topped out.
  In daylight it appears only for 4.5 seconds after a drink fills the meter to
  100%, because a lit sky should not keep a starfield in it for minutes.
- **Rainbow** is the daytime reward, above `Config.thresholds.reward` of 95.
- **Shooting star** is the same reward after dark, since a rainbow needs a lit
  sky to read as one. One thin trail travels along its own path and curls into
  an open loop at the head.

Which reward appears follows the resolved theme rather than the clock, so an
override that darkens the sky at noon gets the night reward.

## Ambient life

The random animations are **wind** and **gulls**. Both are rare, both cross
once and remove themselves, and their rates live per effect and per daypart in
`Config.ambient`. The rate is re-checked when a timer fires rather than when it
is set, so dusk changes the rhythm without a restart, and nothing is scheduled
while the tab is hidden or under reduced motion.

- **Wind** is one thin semi-transparent trail per gust, drawn as a dash window
  walking along a looping path so the curve draws itself.
- **Gulls** are a loose flock of three to five stepped pixel sprites, each at
  its own scale for depth and its own phase, flapping by frame swap through a
  wide bowl, a shallow vee and a narrow peak. The flock crosses at a slant.

Both were drawn from reference footage rather than from memory, and both are
tuned in `.work/anim-lab.html`, which spawns them on demand at any speed.

## Themes

`themeMode` takes four values, chosen from a segmented pill in the top bar:
`auto`, `day`, `night` and `glitter`. Auto resolves against the local clock,
day from 07:00 to 19:00, and re-resolves on the UI ticker and on return to the
tab, so it flips at dusk while the page is open.

Glitter is a theme rather than a switch, which is why it is a fourth value and
not a checkbox: a pink and lavender palette, a rounded typeface, a slow sheen,
decorative ribbons and an emoji particle canvas. Its pointer trail needs a
pointer and says so when there is none. Under reduced motion the palette and
typeface stay and the motion stops.

The control is a `radiogroup` with a roving tabindex, because a switch would
have to lie about two of the four states.

## Sound design

Procedural Web Audio, no audio files. A sip on every drink, a happy cheer when
a drink improves the band, a sad note when the creature falls to dehydrated,
and the gurgle for the easter egg. Each creature has its own voice parameters,
so the dinosaur is lower and rougher than the unicorn.

Mobile browsers need a gesture before audio can start, so the context is
unlocked on the first tap or keypress anywhere, not on load. On return from a
suspended tab the app prefers visual feedback and will not play a sound unless
a gesture has already unlocked the context.

## Haptics

Two signals and nothing finer, which is a measurement rather than a taste. On
the Android device tested in `.work/haptics-lab.html`, a phone motor cannot
tell 12 ms from 22 ms and cannot resolve a three-beat rhythm, so:

- The mood improving is a 30 ms tick.
- The mood dropping is a 180 ms buzz.

Haptics is never the only feedback for anything, because it can be silently
off: Do Not Disturb silences vibration outright while `navigator.vibrate` still
returns true, iOS Safari has no Vibration API at all, and desktop Chrome
accepts every call with no motor to honour it. Every buzz doubles something the
mood line and the sprite already show.

It stays quiet on the drink tap, on the first render after a load, on return
from a hidden tab, under reduced motion, and while the page is not visible.

## Languages and copy

German by default, English, and Traditional Chinese with the `zh-TW` tag,
because a bare `zh` does not tell a browser whether to pick Traditional or
Simplified glyphs. Each locale is written as native copy rather than as a
translation of the German, with its own register. Relative times come from
`Intl.RelativeTimeFormat` and numbers from `toLocaleString`, so the grammar and
the decimal separators are right in all three.

Every locale has been read by someone who speaks it: the Traditional Chinese by
Taiwanese native speakers, which closed F2, and the German by a native German
speaker, which closed F14.

## Persistence model

One serialised object in `localStorage` under `aniluna/v1`. The `/vN` suffix is
the state-shape version: bumping it deliberately abandons old saves rather than
migrating them. `Config.legacyKeys` lists names the app used to write under, and
`Storage.migrate()` adopts the first one it finds exactly once, never
overwriting data already at the current key.

Current shape:

```js
{
  hydration: 75,
  lastUpdateAt: 1756000000000,
  lastDrinkAt: null,
  todayCount: 0,
  dayKey: "2026-08-24",
  decayHours: 2,
  refillAmount: 25,
  soundOn: true,
  easterEggOn: true,
  hapticsOn: true,
  themeMode: "auto",        // "auto" | "day" | "night" | "glitter"
  species: "unicorn",
  names: {},                // species key -> the owner's name, if any
  locale: "de",
  tapHistory: []
}
```

Every field is coerced through a guard on load, so a partial or corrupted save
falls back to defaults rather than breaking startup. Absent values are treated
as absent rather than as zero, which is not what `Number()` would do.

## Timer and background behaviour

**Do not** rely on `setInterval` as the source of truth for decay. Browsers
throttle timers in inactive tabs and mobile browsers suspend or kill pages
outright.

Instead: store `lastUpdateAt`, and on every sync take the elapsed time from
`Date.now()`, convert it to hydration loss, re-stamp, render and persist. A
15-second interval runs only while the page is visible, and only to refresh the
relative-time label and re-resolve the clock theme. It is never the state
engine.

Lifecycle uses `visibilitychange` and `pagehide`, which are the signals mobile
browsers actually deliver. `beforeunload` and `unload` often never fire there.

The page never reloads itself. State is derived from timestamps, so it
self-corrects whenever the tab becomes visible.

## Rapid-tap easter egg

Five drink taps inside a rolling five-second window trigger a gurgle and a
playful line. Tap timestamps are filtered to the window, the trigger clears the
history, and the whole thing can be switched off in settings.

## Code structure

One file, but organised. Each section carries a banner comment:

| Module | Responsibility |
|---|---|
| `CONFIG` | Version, constants, defaults, thresholds, slider limits, storage key, theme list, glitter and haptics tuning |
| `STRINGS` | Every user-facing string, one entry per locale, speech keyed by species |
| `STORAGE` | Read, write, clear, and the one-time legacy-key migration |
| `TIME` | Day key, fractional hour, daytime test, localised relative time |
| `SKY` | Position of one body on its arc at a given hour |
| `HAPTICS` | Capability checks and the two buzzes |
| `GLITTER` | Live pointer and motion queries, the sprite cache, the particle canvas |
| `AUDIO` | Context setup, gesture unlock, procedural sounds per voice |
| `AMBIENT` | The wind, gull and shooting-star kinds, their rates and their spawner |
| `STATE` | Decay, refill, bands, coercion guards, toggles, tap history |
| `UI` | Element cache, rendering, text, theme, sky, the name, the theme control |
| `EVENTS` | Input handlers, lifecycle handlers, the visible-only refresh ticker |
| `INIT` | Startup sequence and the console banner |

Every configurable value lives in `Config` rather than in the body of the code.

## Thresholds and defaults

- Bands: 75 hydrated, 45 okay, 20 thirsty, below 20 dehydrated.
- Reward threshold: 95, for the rainbow by day and the shooting star at night.
- First run starts at 75, not full, so a new user has something to fix and
  learns the loop from a single tap.
- Full to empty in 2 hours by default, so the mood states are reachable in one
  sitting. Adjustable from 0.5 to 4.0.
- Refill 25% by default.

## Layout and styling constraints

- Maximum width 424 px, for comfortable mobile framing.
- A large primary drink button.
- Touch targets of at least 44 px.
- A soft pastel palette with readable contrast, in every theme.
- Rounded, toy-like panels.
- Pixel-art details, sharpened with `shape-rendering: crispEdges`.
- Fast first paint and minimal complexity.

## UX writing guidance

Kind, playful, non-judgemental. The creature speaks in the first person and
never nags.

Good: "Ich glitzere vor Glück ✨", "Ein Schlückchen später wär schön 💧",
"oh... ich brauche wirklich Wasser".

Avoid shame-based copy, alarmist health claims, productivity-speak, and dense
explanatory text.

## Interaction rules

### Drink

Unlock audio, sync elapsed decay, add the refill amount, stamp the last drink,
increment today's count, process the rapid-tap window, re-render, then play the
sip or the gurgle, and the cheer if the band improved. If the meter is now
full, the daylight starfield appears for a few seconds.

### Reset

Fill to 100, clear today's count and the tap history, re-stamp, re-render.
Reset is housekeeping rather than an achievement, so it does not celebrate.

## Accessibility requirements

- `prefers-reduced-motion` is respected for idle motion, ambient life, glitter
  particles and haptics. The glitter palette and typeface stay; only the motion
  stops.
- No autoplay audio, for comfort and because mobile browsers forbid it.
- Touch targets of at least 44 px.
- Every icon-only control has a localised accessible name, written from the
  same string as its tooltip.
- The theme control is a radiogroup with a roving tabindex and one tab stop.
- The meter reports its value and its mood as an accessible name.
- Screen readers hear each control named once, not twice.

## What this brief does not decide

Deferred work, defects and the test matrix live in the README, not here:

- [Known issues](ROADMAP.md#known-issues) for the defects the current version
  ships with.
- [Roadmap](ROADMAP.md#roadmap) for work that has not been started, including
  the panda, real sprite art, the "while you were away" note, reminder
  experiments, and the native-speaker pass on the Chinese copy.

Promotion to `v1.0` is gated on a confirmed device test run, which has not
happened yet.
