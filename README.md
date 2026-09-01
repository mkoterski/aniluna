# Aniluna Aqua Buddy - v0.31

**Status:** DEVELOPMENT
**Versioning:** `v0.x` = development/testing, `v1.x` = production-ready

A tiny hydration companion that lives in one HTML file. Tap **"I drank water"**,
the meter refills, and your pixel pet perks up. Leave them alone and they slowly
droop. That is the whole app.

Speaks German, Taiwanese Chinese and English. Comes as a unicorn called Aniluna,
a panda called Wan Wan, or a dinosaur called Anirex if you find the switch.

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
| Three creatures | A unicorn and a panda from the settings, plus a dinosaur behind the almost hidden `*`. Name, speech, favicon and synth voice all follow from one config entry each |
| Naming | Each creature can be renamed, up to 24 characters. The name flows into the title, the speech, the stats and every ARIA label |
| Languages | German (default), Traditional Chinese (`zh-TW`) and English, written as native copy rather than translations |
| Themes | Follow the clock, day, night, or glitter. Auto resolves against the local clock and re-resolves at dusk while the page is open |
| Sky | Sun and moon on one east-to-west arc, stars at night, rare birds by day and wind gusts by night |
| The world answers | The mood reaches the scene, not only the creature: a grey wash dulls sky, ground, sun and moon together as hydration drops, and ambient life thins with it. The character stays above the wash and keeps its colour |
| Rewards | A rainbow in daylight and a shooting star after dark, both while the meter reads 95% or above |
| Idle animation | Bob, head nod, tail swish, ear twitch, blink, sparkle, tuned per mood band |
| Sound and haptics | Procedural Web Audio, a 30 ms tick when the mood improves and a 180 ms buzz when it drops. Both optional, neither ever the only feedback |
| Easter egg | Five drink taps within five seconds |
| Accessibility | `prefers-reduced-motion` respected, 44 px touch targets, ARIA labels, no autoplay audio |

## Running it

It is one static file. Open `index.html`, or serve the folder if you want the
browser test runner to work:

```bash
python -m http.server 8791
```

## Testing

```bash
node test/smoke-test.mjs
```

Twenty checks, no dependencies, exits non-zero on any failure. The same checks
run in a browser at `test/smoke-test.html`, which is what makes them work on
GitHub Pages where nothing can run node. Both runners import
`test/smoke-checks.mjs`, so there is one copy of the checks and no drift.

The smoke test asserts on the source and on pure logic against a stub page. It
never renders, which is [`docs/DEVICE-TESTS.md`](docs/DEVICE-TESTS.md)'s job.

## Layout

```
index.html              the app, and the page GitHub Pages serves
CHANGELOG.md            every version, newest first
docs/
  BRIEF.md              what the app is and how it should feel
  ARCHITECTURE.md       config, code map, storage keys, the working folder
  ROADMAP.md            known issues, planned work, settled decisions
  DEVICE-TESTS.md       the device matrix v1.0 is gated on
test/
  smoke-test.mjs        terminal runner
  smoke-test.html       browser runner, for platforms without node
  smoke-checks.mjs      the checks themselves, one copy
v2/
  index.html            the v2 interface prototype
  design.html           the proposal it was built from
.work/                  gitignored scratch: labs, prototypes, notes
```

`.work/` is never tracked and deleting it is always safe. What is worth keeping
moves out of it into `docs/` or into the app.

## Where to look next

| | |
|---|---|
| What it is meant to be | [`docs/BRIEF.md`](docs/BRIEF.md) |
| How it is put together | [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) |
| What is broken, what is planned | [`docs/ROADMAP.md`](docs/ROADMAP.md) |
| What shipped when | [`CHANGELOG.md`](CHANGELOG.md) |
| What blocks `v1.0` | [`docs/DEVICE-TESTS.md`](docs/DEVICE-TESTS.md) |

## The v2 interface

[`v2/`](v2/) is a redesign, on its own URL and its own file so the app is never
at risk from it:

| | |
|---|---|
| https://mkoterski.github.io/aniluna/v2/ | the prototype, the app with the new interface built |
| https://mkoterski.github.io/aniluna/v2/design.html | the proposal it was built from |

Same app underneath: same sprites, sky, rewards, audio, haptics, decay and
storage key. What changed is the order of the screen. The meter is a water
column beside the scene instead of a bar under it, drop pips count the day
against a goal set in taps, the drink button lives in a fixed dock, and the
settings moved into a sheet.

It carries `v2-proto` rather than a number in the app's series, because there is
no path from `v0.31` to a `v2.0` under NXW-VER-2 and NXW-VER-4. When it merges
it lands as ordinary iterations, and `v1.0` is declared when B2 passes with it
in place. The decisions behind it and the corrected patch it was built from are
in `.work/v2/`, which is scratch and should move into `docs/` if this goes
ahead.

Note that the prototype is a **copy** of the app, so a change to one has to be
applied to the other or they drift. That is affordable for a two-line fix and
is not a long-term arrangement.

## Status

Prototype, `v0.31`, DEVELOPMENT. The loop works end to end and the app is
usable. Promotion to `v1.0` is gated on B2, the device test matrix, which is the
only P1 left and has never been run: everything here was verified in one desktop
browser. `node test/smoke-test.mjs` should pass before any commit.

This project follows the NeXtWind script authoring standards for versioning,
changelog discipline and naming (`nxw-script-standards.md`, in the parent
working folder and not published here).
