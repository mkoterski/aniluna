# Aniluna Aqua Buddy - v0.30

**Status:** DEVELOPMENT
**Versioning:** `v0.x` = development/testing, `v1.x` = production-ready

A tiny hydration companion that lives in one HTML file. Tap **"I drank water"**,
the meter refills, and your pixel pet perks up. Leave them alone and they slowly
droop. That is the whole app.

Speaks German, Taiwanese Chinese and English. Comes as a unicorn called
Aniluna, or a dinosaur called Anirex if you find the switch.

**Play it:** https://mkoterski.github.io/aniluna/

## Why it is built like this

- **One file.** `index.html` holds the markup, CSS and JS. No build step, no
  dependencies, no server, not even an icon file. Drop it on any static host.
- **Timestamps, not timers.** Hydration is derived from `Date.now()` minus the
  stored `lastUpdateAt`, so closing the tab, locking the phone or killing the
  browser all produce the correct amount of decay. `setInterval` is used *only*
  to refresh the "last drink" label while the page is visible.
- **Local state only.** One serialised object in `localStorage`. No accounts, no
  sync, nothing leaves the device.

## Features

| | |
|---|---|
| Mood states | `hydrated` >=75, `okay` >=45, `thirsty` >=20, `dehydrated` <20, compared against the displayed percent |
| Meter | Labelled **Hydration**: 100% is full, 0% is empty. The bar fills when you drink |
| First run | Starts at 75%, not full, so a drink is the obvious next move and teaches the loop. Reset still fills to 100% |
| Languages | German (default), Traditional Chinese (`zh-TW`) and English. Written as native copy rather than translations, and relative times come from `Intl.RelativeTimeFormat` |
| Three creatures | A unicorn and the panda Wan Wan, chosen in the settings, plus a dinosaur reachable only through the almost hidden `*` in the bottom right. Name, speech, favicon and synth voice all follow from one config entry each |
| Naming | Each creature can be renamed in the settings, up to 24 characters. The name flows into the title, the speech, the stats and every ARIA label. Clearing the field restores the built-in name |
| Tooltips | The emoji-only buttons name themselves on hover and on keyboard focus, from the same string as their accessible name |
| Three themes plus auto | A segmented pill in the top bar: follow the clock, day, night, or glitter. Auto resolves against the local clock, day 07:00 to 19:00, and re-resolves at dusk while the page is open |
| Glitter mode | A theme rather than a switch: pink and lavender palette, a rounded typeface, a slow sheen, decorative ribbons, and an emoji particle canvas. The pointer trail needs a mouse and says so when there is none; under reduced motion the palette stays and the motion goes |
| Stars | Always at night, brighter when the meter is topped out. In daylight only for a few seconds after a drink fills the meter to 100%, tinted warm gold so they read against a pale sky. The rest of the daytime sky belongs to the wind and the birds |
| Sun and moon | Both travel one east-to-west arc: up from the left, highest at the peak hour, down to the right. Sun peaks at 12:00, moon rises after dusk and peaks at midnight |
| Ambient life | Rare birds by day, rarer wind gusts by day and more of them at night. Random height, direction, size and speed |
| Wind | One thin semi-transparent trail per gust, drawn from the reference footage: it travels along its own path, sweeping in and curling into an open loop, with a few specks alongside |
| Info | A small circled-i in the top bar opens two localised sentences explaining the loop |
| Default decay | Full to completely empty in 2 hours, so the dehydrated band is entered just after 1 h 36 min |
| Idle animation | Bob, head nod, tail swish, ear twitch, blink, sparkle. Amplitude and speed tuned per state |
| Gulls | A loose flock of three to five stepped pixel sprites in the Link's Awakening idiom, each at its own scale for depth, flapping by frame swap through wide bowl, shallow vee and narrow peak, crossing the sky at a slant |
| Rainbow | The daytime reward, only while the meter reads 95% or above and the sky is lit. At the 2 h default that is roughly the 6 minutes after topping up |
| Shooting star | The same reward after dark, since a rainbow needs a lit sky to read as one. A streak crosses high above the character every 8 to 17 seconds while the meter earns it, and the whole starfield lifts to full brightness, which is what carries the reward under reduced motion |
| Sound | Procedural Web Audio: sip, yippie, sad "oh", gurgle. Unlocked on first gesture |
| Haptics | A 30 ms tick when the mood improves, a 180 ms buzz when it drops, and nothing finer, because a phone motor cannot resolve finer. Off in one tap, hidden where the API does not exist, silent under reduced motion, and never the only feedback for anything |
| Easter egg | 5 drink taps within 5 seconds triggers a blubber/gurgle |
| Settings | Full-to-empty slider (0.5 to 4.0 hours, half-hour steps), refill slider (25/50/75/100%), sound, easter egg, day/night theme |
| Favicon | Unicorn emoji wrapped in an inline SVG data URI, so there is no icon asset to ship |
| Accessibility | `prefers-reduced-motion` respected, 44 px touch targets, ARIA labels, no autoplay audio |

## Renaming the character

Everything user-facing reads from one config object near the top of the script:

```js
const Config = {
  app: { version: "v0.30", status: "DEVELOPMENT" },
  species: {
    unicorn:  { name: "Aniluna", emoji: "\u{1F984}", voice: { pitch: 1,    wave: "triangle" } },
    dinosaur: { name: "Anirex",  emoji: "\u{1F996}", voice: { pitch: 0.55, wave: "sawtooth" } }
  },
  defaultSpecies: "unicorn",
  locales: ["de", "en", "zh"],
  defaultLocale: "de",
  hydration: { max: 100, initial: 75, defaultDecayHours: 2, defaultRefillAmount: 25 },
  limits: {
    decayHours: { min: 0.5, max: 4, step: 0.5 },
    refillAmount: { min: 25, max: 100, step: 25 }
  },
  ...
};
```

Change a `name` and the title, heading, speech, status text and ARIA labels all
follow. Each is a single string. `Aniluna` is the settled name of the product
and the repository rather than a working title (F1), and the creature names
beside it are defaults an owner can overwrite.

Since v0.20 there are two layers. `Config.species[x].name` is the built-in
default, and `State.data.names` holds the owner's override, one entry per
species key, set from the Name field in the settings panel. `UI.name()` is the
single place that resolves the two, so nothing else needs to know which is in
play. An empty field deletes the override rather than storing a blank, which is
what makes the built-in name reachable again, and `Config.naming.maxLength`
caps the field and the save path alike. The `limits` block drives the slider bounds, their tick labels and the
clamping of saved values, so widening a slider is a one-line change.

`storageKey` is `aniluna/v1`. Renaming a storage key normally costs everyone
their saved state, so `Config.legacyKeys` lists the names the app used to write
under and `Storage.migrate()` adopts the first one it finds on startup, exactly
once, never overwriting data already at the current key. That makes a rename free.
Prune `legacyKeys` once no browser could plausibly still hold an old name.

The `/vN` suffix is the state-shape version, which is a different thing: bump it
on a breaking change to the shape, where abandoning old saves is the point.

## Code map

The single script is split into labelled sections:

| Section | Responsibility |
|---|---|
| `CONFIG` | Version, constants, defaults, thresholds, slider limits, storage key, theme list, glitter tuning, copy |
| `GLITTER` | `GlitCaps` for live pointer and motion queries, `GlitSprites` for the one-per-glyph sprite cache, `GlitEngine` for the particle canvas |
| `STORAGE` | Read/write/clear the JSON blob in `localStorage`, and one-time migration from a legacy key |
| `TIME` | Relative time labels, local day key |
| `AUDIO` | Context setup, gesture unlock, procedural sounds |
| `STATE` | Decay, refill, bands, tap history, settings |
| `STRINGS` | Every user-facing string, one entry per locale, speech keyed by species |
| `UI` | DOM refs, rendering, text application, slider limits, speech, effects |
| `EVENTS` | Input, lifecycle and the UI-only refresh ticker |
| `INIT` | Startup sequence and the version banner |

## Running locally

Just open `index.html`, no server needed. `localStorage` works from `file://` in
Chrome, Edge and Firefox. To test on a phone on the same network:

```bash
python -m http.server 8000
```

The running version is printed to the browser console on startup.

### Testing

```bash
node smoke-test.mjs
```

Eighteen checks, no dependencies, exits non-zero on any failure. It exists
because v0.23 shipped an app that did not start: the file parsed, which was the
only thing being checked, and a missing object property is a runtime error
rather than a syntax one. It checks the invariants that hold a single file
together, then evaluates the pure logic against a stub page. It does not
render, which is B2's job: the checks that need a real device are written out
in [`DEVICE-TESTS.md`](DEVICE-TESTS.md), and `v1.0` waits on a recorded run of
them.

The same checks run in a browser at [`smoke-test.html`](smoke-test.html), which
is what makes them work on GitHub Pages where nothing can run node. Both
runners import [`smoke-checks.mjs`](smoke-checks.mjs), so there is one copy of
the checks and no drift. The page needs a served origin: from `file://` the
fetch is refused, so serve the folder or open the published copy.

```bash
python -m http.server 8791
```

### Local working directory

`.work/` is a gitignored scratch folder: throwaway copies of `index.html`,
notes, screenshots, exported `localStorage` blobs used to reproduce a bug.
Nothing in it is tracked or published, and deleting the whole folder is always
safe. It is not in the repository, so create it after a fresh clone:

```bash
mkdir -p .work
```

Anything worth keeping moves out into `README.md`, `BRIEF.md` or `index.html`.

`.work/panda-lab.html` is the third-species lab for F8: a panda drawn to the
same rules as the other two, picked from a settings radiogroup rather than from
the secret asterisk, with all three shown side by side at the same mood band so
a new silhouette can be judged against the old ones. The tokens, the sprite and
its visibility change are what would move into `index.html`.

`.work/haptics-lab.html` is the haptics lab for F4: it reports what the
device and browser actually support, offers one candidate pattern per app
event, and is blunt about the fact that `navigator.vibrate` returning true
means the call was accepted rather than that anything buzzed. Nothing in it is
judgeable on a desktop.

`.work/anim-lab.html` is the animation lab: it spawns the ambient animations on
demand, in any theme, at any speed, and freezes them mid-flight, because
waiting minutes for a rare gust is no way to judge one. Every animation in it
is a **copy** of the real one in `index.html`, which is the drift risk its own
header warns about: judge in the lab, port back, then reload the lab from the
app rather than letting the two wander apart.

`.work/unicorn-mane-lab.html` is the mane lab, written for v0.29: six versions
of the unicorn's mane side by side, everything else about the sprite identical,
so the only thing that can differ is the mane. It carries the tools that make a
silhouette judgeable rather than guessable. Silhouette inks every fill so only
the shape is left, mirror flips the sprite because a shape looked at for a week
stops being visible, and each card prints the left and right edge per row so an
impression can be checked against a number. It also reports any hole inside the
silhouette, which caught two of the six proposals opening a one-pixel gap the
outline filter would have inked into a speck. Each card emits its markup ready
to paste, which is how `tucked` reached `index.html`.

`.work/glitter-mode/` held the F12 prototype until v0.22 landed it, so that
folder is throwaway again. Its four general findings are worth promoting into
`web-prototype-findings.md` before it goes.

## Versioning and changelog

This project follows the NeXtWind script standards (`nxw-script-standards.md` in
the parent `claude-mk` working folder, not published here) for versioning and
changelog discipline: development starts at `v0.10`, every iteration increments
the minor component by exactly one, every bump gets an entry, entries are newest
first and say what changed and why, bug-fix entries name the root cause, and
prose uses hyphens rather than em dashes (NXW-VER-1 to NXW-VER-8, NXW-NAM-6).

The version string appears in three places: the `index.html` header block, the
changelog below, and the startup console banner. Promotion to `v1.0` happens
only after a confirmed successful test run.

### Changelog

```
v0.30  2026-08-25  The horn stopped being cut off mid-bob. An outer `svg`
                   is `overflow: hidden` by default, so the artboard was the
                   clip boundary, and the unicorn had no room in it: the horn
                   ends at y 0, the viewBox opens at -1, and the feMorphology
                   outline is exactly 1 unit thick, so at rest the ink lands
                   on the edge with nothing to spare. Every animation that
                   lifts the sprite then cut the tip off, worst at the
                   hydrated band where the bob is largest, which is why it
                   showed at 100%. Measured lift past the edge, in artboard
                   units: 1.15 idle bob, 1.92 sip hop, 2.35 gurgle wobble,
                   9.54 species morph. `.pet` is now `overflow: visible` and
                   the scene, which is `overflow: hidden` and gives 20 to 27
                   units of sky depending on whether the sprite is at its
                   max-width, is the clip boundary instead. Growing the
                   viewBox was the alternative and was dropped: it is part of
                   the contract all three species share, so it would have
                   meant empty rows on all of them to fit the rarest case.
                   The panda and the dinosaur start a row lower and so were
                   only clipped during the bob, and this covers them too.

v0.29  2026-08-25  The unicorn's head lost the bump on its left, reported from
                   a screenshot and confirmed against the sprite: it was the
                   mane, in two places. The head is symmetric about column
                   15.5 and rounds in as it rises, 9-22 up to row 8, then
                   10-21, then 11-20. The side mane started on row 7, where
                   the head had already pulled in and the ears had ended, so
                   the silhouette stepped from column 9 out to column 6 in one
                   row with a square corner. And the strip inside the head
                   started on row 6 and spanned both its columns, filling the
                   rounded top-left corner that the right side keeps. A head
                   square on one side and round on the other is what the eye
                   reports as a swelling. The mane now starts on row 8, the
                   first row where the head is at full width, and the inner
                   strip follows the outline a column per row. Nothing else
                   about the sprite moved, the mane is no shorter than it
                   looks, and six versions were judged side by side in
                   `.work/unicorn-mane-lab.html` before this one was picked.

v0.28  2026-08-25  Two controls made easier to find. The settings summary
                   carries a gear, and reset a circular-arrow symbol, both
                   ahead of the label the way the drink button already wore
                   its drop. The gear is a separate `aria-hidden` span rather
                   than part of the localised string, because the summary has
                   no `aria-label` to hide it behind and the accessible name
                   should stay the word alone; the reset symbol sits in the
                   string, where the existing `resetAria` already covers it.
                   Reset also stopped reading as disabled: on `--text-soft`
                   over `--panel-edge` it was the faintest thing on the panel,
                   so it takes `--text` and a `--text-soft` border. Both are
                   tokens, so it darkens in day and glitter and brightens
                   against the night panel, which is the same intent.

v0.27  2026-08-24  A third creature, the panda Wan Wan, chosen in the settings.
                   The dinosaur moved behind the secret switch, marked
                   `secret: true` in config, and that switch lost its tooltip:
                   a hover label saying "secret switch" is not a secret. It
                   keeps its ARIA name, because a focusable button needs one.
                   The switch is a detour, not a cycle: it returns to whatever
                   the settings picked. The dinosaur was redrawn in the same
                   pass, bigger head and eyes, teeth, curling tail.
                   Fixed: `el.hidden = true` does nothing on an SVG element, so
                   the unselected creature rendered behind the chosen one.

v0.26  2026-08-24  Daylight stars are a moment, not a state: 4.5 seconds after
                   a drink fills the meter, rather than the whole time it reads
                   95 or above. Night is unchanged. Rewrote BRIEF.md from a
                   pre-build spec into a brief describing the app as built.

v0.25  2026-08-24  Haptics on mood changes (F4), off in one tap. Two signals
                   only, a 30 ms tick up and a 180 ms buzz down, because the
                   phone tested cannot resolve anything finer. Never the only
                   feedback for anything: Do Not Disturb silences vibration
                   while the API still reports success.

v0.24  2026-08-24  Fixed: v0.23 did not start at all. `Ambient.KINDS` lost its
                   star entry, so `rateFor("star")` threw, and `init()` calls
                   the two functions that reach it. Root cause: an edit sliced
                   to the wrong closing brace. It shipped because the only
                   check run was a parse, and a missing property is a runtime
                   error. B5 raised to P1.

v0.23  2026-08-24  Wind and gulls redrawn from reference footage. Wind is one
                   thin trail that travels along a looping path; gulls are a
                   loose flock of stepped pixel sprites that flap by frame swap
                   and cross at a slant. Fixed: the dash offset ran 100 to -46,
                   so the loop at the head of the path was never drawn.
                   Added the animation and haptics labs under `.work/`.

v0.22  2026-08-24  Glitter mode (F12). A theme, not a switch, so `themeMode`
                   takes a fourth value and one segmented pill replaces the
                   theme button and both settings checkboxes. Palette, rounded
                   typeface, sheen and an emoji particle canvas; the trail
                   needs a pointer and says so when there is none. Glitter
                   counts as a lit sky, so it keeps the sun and the rainbow.

v0.21  2026-08-24  The reward after dark is a shooting star, not a rainbow: a
                   rainbow needs a lit sky to read as one. Renamed
                   `thresholds.rainbow` to `.reward`, since it now gates both.
                   Fixed: the drop was a translateY percentage, which resolves
                   against the element's own height, so the streak flew flat.

v0.20  2026-08-24  Editable names (F11) and tooltips on the mode buttons (F13).
                   Names live per species and resolve through one `UI.name()`,
                   trimmed and capped at 24 by code point so an emoji cannot be
                   cut in half. Tooltips come from the same string as the
                   accessible name, so the two cannot drift.

v0.19  2026-08-24  Fixed B9: the sun and moon are gated on the resolved theme,
                   not the clock alone, so an override no longer paints a dark
                   sky with the sun still up.

v0.18  2026-08-24  Trimmed the German settings footer: an unprompted promise
                   invites the doubt it means to settle. Split the deferred
                   work into Known issues and Roadmap, added B6 to B10, closed
                   B1 as won't-fix.

────────────────────────────────────────────────────────────────────────────
Archive: superseded development iterations (NXW-VER-7).

v0.17  2026-08-20  Rewrote the copy in every language as native writing rather
                   than translation. Chinese moved to Taiwanese Traditional,
                   `zh-TW`, because bare "zh" does not tell a browser which
                   glyphs to pick. Gusts roam the whole sky.

v0.16  2026-08-20  Renamed the product to Aqua Buddy. Added a sun and a moon on
                   one arc, interpolated in two halves so an off-centre peak
                   lands on its stated hour, and rare ambient life in a new
                   AMBIENT module.

v0.15  2026-08-20  A secret species switch, three languages, a clock-driven
                   theme, an info button, and a first run that starts at 75 so
                   a new user has something to fix. `themeMode` replaced the
                   theme boolean.

v0.14  2026-08-20  Renamed the storage key to `aniluna/v1`, with a migration
                   that adopts an old save once and never overwrites.
                   Fixed: bands compared the raw float while the meter showed
                   the rounded percent, so 75% could sit in the okay band.

v0.13  2026-08-20  Renamed the meter to Hydration: the bar fills when you
                   drink, so thirst inverted the meaning. Narrowed the reward
                   to 95 and above, gated on the displayed percent.

v0.12  2026-08-20  Added a favicon, the unicorn emoji in an inline SVG data
                   URI, after a hand-drawn one did not read at that size.
                   Renamed the repository to aniluna.

v0.11  2026-08-20  Renamed the character to Aniluna. Cut full-to-empty from 4
                   hours to 2, and replaced both number inputs with sliders
                   that snap onto their step.
                   Fixed: a null field in a save became 0 rather than the
                   default, because `Number(null)` is 0 and passed the guard.

v0.10  2026-08-19  Initial version. Single-file static app: timestamp-driven
                   decay, four mood bands with per-state idle animation, a
                   pixel unicorn outlined by one feMorphology filter, a
                   happy-state rainbow, procedural Web Audio, the five-taps
                   gurgle easter egg, day and night themes, and localStorage
                   persistence that survives suspension.
```

## Known issues

Defects present in `v0.30`, as opposed to work never started, which is under
[Roadmap](#roadmap). Both lists share one ID series and the IDs are stable, so
an item keeps its ID when it moves between them and a changelog entry can quote
it when it is fixed.

| ID | Pri | Issue | Detail |
|---|---|---|---|
| B4 | P2 | Two open tabs overwrite each other | Each tab keeps its own `State.data` and writes the whole blob, so the last write wins and can resurrect a hydration value the other tab had already spent. A `storage` event listener that re-reads and re-renders would fix it. Minor on a phone, real on a desktop. |
| B6 | P3 | The scene follows an untrusted device clock | `Time.hourOfDay()` and `Time.isDaytime()` read the local clock, so a wrong clock, or a phone still set to the timezone the user has flown out of, puts the sun and moon in the wrong place and can flip the automatic theme. Nothing breaks, and no other source of time is available offline in a single file, so this is accepted rather than planned. |
| B8 | P3 | Unknown keys in a save live forever | `load()` spreads `...saved` over the defaults, so a key written by a future or hand-edited version is kept and re-written on every save. Harmless bloat rather than a fault, but it means the stored blob is not guaranteed to match the current schema. `theme` is the one key explicitly deleted, because v0.15 replaced it. |

Accepted limitations, written down so they are not rediscovered as bugs:

- With `localStorage` unavailable, in private mode or with storage blocked or
  full, every visit starts fresh. `Storage` catches and warns to the console on
  purpose, because a storage failure should not stop the app, but the user gets
  no notice that nothing is being kept.
- No reminders once the tab is closed, and no haptics on iOS. Both are platform
  limits rather than omissions; see F9 and F4 for what could be done anyway.
- The device test matrix is written but unrun (B2), so `v0.30` is a prototype in
  the literal sense: everything here was verified in one desktop browser. The
  matrix itself lives in [`DEVICE-TESTS.md`](DEVICE-TESTS.md).
- B3 is accepted, decided 2026-08-25. `State.reset()` sets `lastDrinkAt = now`,
  so the "last drink" line reads as a fresh sip immediately after a reset.
  `null` would be the honest value and the label already renders that case for a
  first run, but a reset is a deliberate act by the only person who could be
  misled by it. The ID is retired rather than reused.
- B10 is accepted, decided 2026-08-25. Day and night stay fixed hours:
  `Config.theme` flips at 07:00 and 19:00 and `Config.sky` matches, so in a
  northern winter the sun is up at 17:30 when it is already dark outside, and
  around midsummer the scene goes dark while the sun is still visibly up. Real
  sunrise and sunset need the date and a latitude, which means either a location
  permission or an approximation from the timezone offset, and neither is worth
  it here. This is what the deliberate v0.16 choice costs, recorded rather than
  reopened.
- B7 is accepted, decided 2026-08-25. `State.load()` reads `soundOn` and
  `easterEggOn` as `saved.x !== false`, so a save carrying `"false"`, `0` or
  `null` loads as on while every other field goes through `num`, `oneOf` or
  `clampStep`. Only reachable by hand-editing the save or by a future version
  writing a different shape, and the worst outcome is a toggle that starts on.
  Worth remembering if a later version ever changes the shape of the save.
- B1 is closed as won't-fix, decided in v0.18. A system clock moved backwards
  forgives the decay for the span it skipped, but reaching that takes a
  deliberate clock change, which nobody performs on a hydration toy, and
  `State.sync()` re-stamps `lastUpdateAt` on every call, so the app is back to
  normal on the next sync either way. The ID is retired rather than reused, and
  B6 covers what a wrong clock does to the sky, which is visible without any
  tampering.

## Roadmap

Nothing in this section is committed work. It is the list of things noticed and
deliberately deferred, so a later session can pick one up without rediscovering
it. The IDs are stable, and a changelog entry quotes the ID when an item lands.

Priority: **P1** wanted before `v1.0`, **P2** wanted but not blocking, **P3**
parked idea.

### Planned features

| ID | Pri | Item | Notes |
|---|---|---|---|
| F3 | P2 | "While you were away" note | Brief stretch goal. After a long gap, one line about what happened instead of silently presenting a drooping pet. The data already exists: `lastDrinkAt`, and the points `State.sync()` returns. |
| F5 | P2 | Real sprite art | Brief stretch goal. The creatures are SVG rects outlined by a single `feMorphology` filter. Per-state sprites would replace the shapes, not the animation system, because both species already share the `.pet-*` group classes. |
| F6 | P2 | Undo the last drink | A mis-tap can currently only be corrected with a full reset, which also clears the daily count. Keeping the previous `hydration` and `lastDrinkAt` for one step would cover it. |
| F7 | P3 | Richer scene changes between moods | Brief stretch goal. The sky already carries sun, moon, stars and ambient life, but the mood bands change the character rather than the world around it. |
| F9 | P3 | Reminder experiments | Brief stretch goal, and the one that fights the constraints: without a service worker there is no notification once the tab is closed, and a service worker means a second file, which breaks the single-file promise. Parked until someone decides which of the two matters more. |
| F10 | P3 | Prune `Config.legacyKeys` | Drop `ina-water-friend/v1` once no browser can plausibly still hold a save under it. Harmless until then, so this is bookkeeping rather than work. |

### Settled

Decided rather than built, kept here so the IDs are not reused and the decision
is not rediscovered as an open question.

| ID | Settled | Decision |
|---|---|---|
| F1 | 2026-08-25 | `Aniluna` is the final name of the product and of the repository, not a working title. `Config.storageKey` is already `aniluna/v1`, so nothing in the code moves. The creature names beside it stay as they are, and F11 lets an owner overwrite any of them anyway. |
| F2 | 2026-08-25 | Taiwanese native speakers have read the Traditional Chinese copy, including the v0.22 Glitzermodus strings and the two trail notices. The register was confirmed rather than corrected. |
| F14 | 2026-08-25 | The German copy, the diminutives and the Glitzermodus strings included, is written and checked by a native German speaker. Raised and closed on the same day, because F2 covered only the Traditional Chinese side and the German one deserved saying out loud rather than leaving implied. All three locales have now been read by someone who speaks them. |

### Hardening and testing

Defects already in the app are not here, they are under
[Known issues](#known-issues). These two are work that has never been done.

| ID | Pri | Item | Notes |
|---|---|---|---|
| B2 | P1 | Run the device test matrix before `v1.0` | The matrix was written on 2026-08-25 and lives in [`DEVICE-TESTS.md`](DEVICE-TESTS.md): 38 checks across six platforms, three of which are required. It covers what B2 always asked for, the iOS Safari audio unlock after backgrounding and with the silent switch on, Android Chrome, a real suspension across a day boundary to prove the `todayCount` rollover, and both `prefers-reduced-motion` settings, plus the layout, contrast, touch-target and screen-reader checks a script cannot make. Writing it was the easy half. B2 stays open until a run is recorded, because NXW-VER-4 gates `v1.0` on a confirmed successful test run, not on a plan for one. |
| B5 | P2 | The smoke test does not cover everything | `smoke-test.mjs` now covers the band boundaries, `clampStep` snapping, name cleaning, save coercion, the day rollover, the sun and moon arcs, the reward gating, the secret species and the haptics guards, and it catches the v0.23 failure by name. Two gaps remain. `Storage.migrate()`, the legacy-key adoption, is still only hand-verified, because it wants a save written under the old key and the stub does not exercise that path. And nothing asserts on a rendered page: layout, contrast and touch targets are B2's job, not a script's. Dropped from P1 to P2 now that the class of bug that shipped in v0.23 is guarded. |

## Docs

[`BRIEF.md`](BRIEF.md) is the product brief: what the app is, who it is for,
how it is meant to feel, and the rules it holds itself to. Rewritten at v0.26
to describe the app as built, so it no longer reads as a spec addressed to an
implementer who has not started yet. It keeps its own version log, which tracks
the document rather than the app.

[`DEVICE-TESTS.md`](DEVICE-TESTS.md) is B2 itself: the matrix of platforms and
checks that `v1.0` is gated on, and the place a completed run is recorded. It
holds the checks that need a device rather than a script, so it is the other
half of `smoke-test.mjs` rather than a duplicate of it.

The split between the three is deliberate. The brief states the intent, this
file states the state, the matrix states what has been checked on real
hardware: the changelog, the roadmap, the known issues, the code map and how to
run it all live here. Where the brief and this file disagree, this file
describes what exists and the brief describes what was wanted, and the gap is
worth a look.

## Status

Prototype, `v0.30`, DEVELOPMENT. The loop works end to end and the app is
usable. What it gets wrong today is listed under
[Known issues](#known-issues); what has never been started is under
[Roadmap](#roadmap), where the stretch goals from `BRIEF.md` live too, so
there is no third list to keep in sync. One ID series covers both, so an item
keeps its ID when it moves from one to the other.

Promotion to `v1.0` is gated on B2, and B2 is now the only P1 left: the name is
settled (F1) and the Traditional Chinese copy has been read by native speakers
(F2). No P1 defect is open. What remains is to run
[`DEVICE-TESTS.md`](DEVICE-TESTS.md) on the three required platforms and record
the result there. `node smoke-test.mjs` should pass before any commit.
