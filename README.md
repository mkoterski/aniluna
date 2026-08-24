# Aniluna Aqua Buddy - v0.19

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
| Two creatures | A unicorn and a dinosaur, switched by an almost hidden `*` in the bottom right. Name, speech, favicon and synth voice all follow |
| Light and dark | Automatic from the local clock, day 07:00 to 19:00. The top bar button sets an explicit override, and a settings toggle hands control back to the clock |
| Stars | Always at night. In daylight only at the happiest level, where they turn warm gold so they read against a pale sky |
| Sun and moon | Both travel one east-to-west arc: up from the left, highest at the peak hour, down to the right. Sun peaks at 12:00, moon rises after dusk and peaks at midnight |
| Ambient life | Rare birds by day, rarer wind gusts by day and more of them at night. Random height, direction, size and speed, small and faint so the sky stays uncluttered |
| Info | A small circled-i in the top bar opens two localised sentences explaining the loop |
| Default decay | Full to completely empty in 2 hours, so the dehydrated band is entered just after 1 h 36 min |
| Idle animation | Bob, head nod, tail swish, ear twitch, blink, sparkle. Amplitude and speed tuned per state |
| Rainbow | Decorative reward, only while the meter reads 95% or above. At the 2 h default that is roughly the 6 minutes after topping up |
| Sound | Procedural Web Audio: sip, yippie, sad "oh", gurgle. Unlocked on first gesture |
| Easter egg | 5 drink taps within 5 seconds triggers a blubber/gurgle |
| Settings | Full-to-empty slider (0.5 to 4.0 hours, half-hour steps), refill slider (25/50/75/100%), sound, easter egg, day/night theme |
| Favicon | Unicorn emoji wrapped in an inline SVG data URI, so there is no icon asset to ship |
| Accessibility | `prefers-reduced-motion` respected, 44 px touch targets, ARIA labels, no autoplay audio |

## Renaming the character

Everything user-facing reads from one config object near the top of the script:

```js
const Config = {
  app: { version: "v0.19", status: "DEVELOPMENT" },
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
follow. Both creature names are working titles and each is a single string. The `limits` block drives the slider bounds, their tick labels and the
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
| `CONFIG` | Version, constants, defaults, thresholds, slider limits, storage key, copy |
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

### Local working directory

`.work/` is a gitignored scratch folder: throwaway copies of `index.html`,
notes, screenshots, exported `localStorage` blobs used to reproduce a bug.
Nothing in it is tracked or published, and deleting the whole folder is always
safe. It is not in the repository, so create it after a fresh clone:

```bash
mkdir -p .work
```

Anything worth keeping moves out into `README.md`, `BRIEF.md` or `index.html`.

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
v0.19  2026-08-24  Fixed B9: the sun and the moon are now gated on the resolved
                   theme rather than on the clock alone. UI.applySky() takes
                   the theme applyTheme() has already resolved and hides the
                   body that would contradict the sky around it, so forcing
                   night in the afternoon no longer paints a dark sky, stars
                   and a lit sun at once. Root cause: applySky() read
                   Time.hourOfDay() and nothing else, while the stars were
                   gated on [data-theme="night"] in CSS, so an override moved
                   the stars and left the sun where it was. The arcs and
                   Sky.position() are untouched.

                   Forcing night before the moon's rise hour leaves an empty
                   sky, by decision: feeding the arc a substitute hour would
                   put the moon somewhere the clock never says it is. Automatic
                   mode is unchanged, because the sun's arc already matched the
                   theme's day hours exactly, and the gaps at 19:00 to 20:00
                   and 05:00 to 07:00 were already empty.

v0.18  2026-08-24  Trimmed the German settings footer to "Aniluna wohnt nur in
                   diesem Browser." The dropped second sentence, "Nichts wird
                   irgendwohin geschickt, versprochen.", protests too much in
                   German, where an unprompted promise invites the doubt it
                   means to settle. The first sentence already carries the
                   whole point. English and Chinese keep their second sentence,
                   because "promise" and the final 喔 land as warmth rather
                   than reassurance, and per v0.17 the three locales are native
                   copy rather than translations of one another.

                   Docs: condensed this changelog and archived v0.14 and older
                   below the rule (NXW-VER-7). Split the deferred work in two,
                   so defects the app ships with are under Known issues and
                   work never started stays under Roadmap, sharing one ID
                   series. Added B6 to B10 while reading the code for that
                   split, of which B9 matters: an explicit theme override
                   leaves the sun and moon on their clock-driven arcs, so
                   forcing night in the afternoon paints a dark sky, stars and
                   a sun at once. Closed B1 as won't-fix on the requester's
                   call, and corrected its description first: it never froze
                   decay, because State.sync() re-stamps lastUpdateAt on every
                   call.

v0.17  2026-08-20  Rewrote the copy in every language as native writing rather
                   than translation. Chinese moved to Taiwanese Traditional:
                   the Intl tag and the document language are now zh-TW,
                   because bare "zh" does not tell a browser whether to pick
                   Traditional or Simplified glyphs. Added Traditional font
                   fallbacks, relabelled the button 繁中, and chose a soft
                   register built on the cute sentence-final particles; still
                   worth a native speaker's eye. German leans on diminutives
                   and warmth, and its meter label went from Flüssigkeit, which
                   reads oddly, to Hydration, the word actually used. Ambient
                   gusts now roam the whole sky rather than the band behind the
                   character, and are smaller and fainter so the wider band
                   does not crowd the scene.

v0.16  2026-08-20  Renamed the product to Aqua Buddy in all three languages, as
                   a brand name that stays in English. Added a sun and a moon
                   on one shared east-to-west arc, with progress interpolated
                   in two halves so an off-centre peak still lands exactly on
                   its stated hour: the sun is highest at 12:00 inside an
                   asymmetric 07:00 to 19:00 window, the moon at midnight
                   inside a window that wraps past 24. Both ride the same
                   ticker as the automatic theme, so they never disagree with
                   the sky they sit in. Added rare ambient life in a new
                   AMBIENT module: birds by day only, wind gusts rarely by day
                   and more often at night, with rates per effect and daypart
                   in Config.ambient. Each element crosses once and removes
                   itself, and the rate is re-checked when a timer fires rather
                   than when it is set, so dusk changes the rhythm without a
                   restart and a hidden tab or reduced motion schedules
                   nothing. Softened the rainbow from 0.78 to 0.45 opacity and
                   moved it above the sky layer, so a busy daytime scene with
                   sun, stars, rainbow, birds and sparkles still reads.

v0.15  2026-08-20  Added a secret species switch, three languages, a clock
                   driven theme, an info button, and a gentler first run.
                   Species: an almost hidden asterisk in the bottom right flips
                   between the unicorn Aniluna and a new dinosaur, Anirex
                   (working title). Name, speech copy, favicon emoji and synth
                   voice all follow from Config.species, and both sprites share
                   the same group class names, so one animation system and the
                   four mood-band token blocks drive either with no extra CSS.
                   The switch is visually quiet but a real labelled button, so
                   keyboards and screen readers reach it. Languages: German by
                   default, English and Chinese, in a new STRINGS section with
                   speech keyed by species; relative times go through
                   Intl.RelativeTimeFormat and numbers through toLocaleString
                   rather than hand-written strings. Renamed the sprite classes
                   from .ina-* to .pet-* and the outline filter to petInk,
                   since with two species the old prefix named the wrong thing.
                   Theme: themeMode (auto, day, night) replaces the theme
                   boolean; auto resolves against the local clock and is
                   re-evaluated on the ticker and on return to the tab, so it
                   flips at dusk while the page is open. The top bar button
                   sets an override, a settings toggle hands control back to
                   the clock, and older saves carrying theme are adopted as an
                   explicit choice rather than discarded. Stars show always at
                   night and in daylight only at or above the rainbow
                   threshold, tinted warm gold so they read against a pale sky.
                   First run starts hydration at Config.hydration.initial of 75
                   so a new user has something to fix and learns the loop from
                   one tap; reset still fills to 100. Info: a circled-i toggles
                   a localised two-sentence explanation, wired with
                   aria-expanded and aria-controls. Not changed: the page never
                   reloads itself, because state is derived from timestamps and
                   self-corrects when the tab becomes visible.

────────────────────────────────────────────────────────────────────────────
Archive: superseded development iterations (NXW-VER-7).

v0.14  2026-08-20  Renamed the localStorage key from ina-water-friend/v1 to
                   aniluna/v1, so nothing still carries the old working title.
                   Config.legacyKeys and Storage.migrate() adopt a save found
                   under an old key exactly once and never overwrite data
                   already at the current key. Verified across a real reload,
                   idempotent, a no-op on a clean install, and a corrupt legacy
                   save falls back to defaults rather than breaking startup.
                   Fixed: mood bands were compared against the raw hydration
                   float while the meter displayed the rounded percent, so a
                   meter reading exactly 75% could sit in the okay band at
                   74.997. State.band() now rounds first. Same class of bug as
                   the v0.13 rainbow gating.

v0.13  2026-08-20  Renamed the visible meter label from "Thirst meter" to
                   "Hydration": the bar fills when you drink, so labelling it
                   thirst inverted the meaning, and 100% read as maximally
                   thirsty. Root cause: the label was taken verbatim from the
                   brief while the state, the mood copy and the ARIA name all
                   used hydration, so the visible label was the only wrong half
                   and disagreed with its own accessible name. A deliberate
                   deviation from the brief's wording. Narrowed the rainbow to
                   at or above the new Config.thresholds.rainbow of 95, gated
                   on the displayed rounded percent so the arc agrees with the
                   number on screen, and replaced the four per-band
                   --rainbow-op tokens with one data-radiant attribute.

v0.12  2026-08-20  Added a favicon. A hand-drawn 16x16 pixel unicorn head
                   matching the sprite did not read as a unicorn at that size,
                   so it was replaced with the unicorn emoji in an inline SVG
                   data URI: 189 characters instead of 1163, and still one
                   file. Renamed the repository to aniluna. Documented why
                   storageKey kept the old working-title string.

v0.11  2026-08-20  Renamed the character to Aniluna, with every mention now
                   coming from Config.character.name. Cut the default
                   full-to-empty time from 4 hours to 2 so the mood states are
                   reachable in a single sitting. Replaced both settings number
                   inputs with sliders, full-to-empty from 0.5 to 4.0 hours in
                   half-hour steps and refill at 25/50/75/100 percent; clamping
                   now snaps onto the slider step instead of rounding to whole
                   numbers, which would have silently destroyed a half-hour
                   setting on the next load. Bounds and tick labels are
                   generated from Config.limits so they cannot drift apart.
                   Removed em dashes per NXW-NAM-6, and added the header block,
                   version config and console banner.
                   Fixed: a null or empty field in a saved state became 0
                   rather than the default, so a partially corrupted save
                   loaded as the fastest decay rate or an empty meter. Root
                   cause: Number(null) is 0, not NaN, so the Number.isFinite
                   guard accepted it. Coercion now goes through State.num,
                   which treats null, undefined and "" as absent.

v0.10  2026-08-19  Initial version. Single-file static app with timestamp
                   driven hydration decay, four mood bands with per-state idle
                   animation, a pixel unicorn drawn as SVG rects and outlined
                   by one feMorphology filter, happy-state rainbow reward,
                   procedural Web Audio sip/yippie/sad/gurgle unlocked on first
                   gesture, the five-taps-in-five-seconds gurgle easter egg,
                   day/night themes, and localStorage persistence that survives
                   tab suspension and browser kills.
```

## Known issues

Defects present in `v0.19`, as opposed to work never started, which is under
[Roadmap](#roadmap). Both lists share one ID series and the IDs are stable, so
an item keeps its ID when it moves between them and a changelog entry can quote
it when it is fixed.

| ID | Pri | Issue | Detail |
|---|---|---|---|
| B4 | P2 | Two open tabs overwrite each other | Each tab keeps its own `State.data` and writes the whole blob, so the last write wins and can resurrect a hydration value the other tab had already spent. A `storage` event listener that re-reads and re-renders would fix it. Minor on a phone, real on a desktop. |
| B3 | P2 | Reset claims a drink that never happened | `State.reset()` sets `lastDrinkAt = now`, so the "last drink" line reads as a fresh sip immediately after a reset. `null` is the honest value, and the label already renders that case for a first run. |
| B10 | P2 | Day and night are fixed hours, not real daylight | `Config.theme` flips at 07:00 and 19:00 and `Config.sky` matches, so in a northern winter the scene is bright with the sun up at 17:30 when it is already dark outside, and around midsummer it goes dark while the sun is still visibly up. Real sunrise and sunset need the date and a latitude, which means either a location permission or an approximation from the timezone offset. Fixed hours were the deliberate v0.16 choice; this records what that choice costs rather than reopening it. |
| B6 | P3 | The scene follows an untrusted device clock | `Time.hourOfDay()` and `Time.isDaytime()` read the local clock, so a wrong clock, or a phone still set to the timezone the user has flown out of, puts the sun and moon in the wrong place and can flip the automatic theme. Nothing breaks, and no other source of time is available offline in a single file, so this is accepted rather than planned. |
| B7 | P3 | Two saved toggles accept junk as on | `State.load()` reads `soundOn` and `easterEggOn` as `saved.x !== false`, so a save carrying `"false"`, `0` or `null` loads as on, while every other field goes through `num`, `oneOf` or `clampStep`. Only reachable by hand-editing the save or by a future version writing a different shape, hence P3. |
| B8 | P3 | Unknown keys in a save live forever | `load()` spreads `...saved` over the defaults, so a key written by a future or hand-edited version is kept and re-written on every save. Harmless bloat rather than a fault, but it means the stored blob is not guaranteed to match the current schema. `theme` is the one key explicitly deleted, because v0.15 replaced it. |

Accepted limitations, written down so they are not rediscovered as bugs:

- With `localStorage` unavailable, in private mode or with storage blocked or
  full, every visit starts fresh. `Storage` catches and warns to the console on
  purpose, because a storage failure should not stop the app, but the user gets
  no notice that nothing is being kept.
- No reminders once the tab is closed, and no haptics on iOS. Both are platform
  limits rather than omissions; see F9 and F4 for what could be done anyway.
- No device test matrix has been run (B2) and the Traditional Chinese copy has
  not been read by a native speaker (F2), so `v0.19` is a prototype in the
  literal sense: everything here was verified in one desktop browser.
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
| F1 | P1 | Confirm or replace the working titles | `Aniluna` and `Anirex` are both still working titles. One string each in `Config.species`, so the rename is cheap in code, but it is also the product name, the repo name and the storage key. Decide before `v1.0`. |
| F2 | P1 | Native-speaker pass on the Traditional Chinese copy | It is written as native copy rather than translation and the register is deliberately soft, but no Taiwanese speaker has read it yet. The German diminutives deserve a second pair of eyes too, less urgently. |
| F3 | P2 | "While you were away" note | Brief stretch goal. After a long gap, one line about what happened instead of silently presenting a drooping pet. The data already exists: `lastDrinkAt`, and the points `State.sync()` returns. |
| F4 | P2 | Haptics | Brief stretch goal. `navigator.vibrate` on the drink tap and the easter egg, gated by a toggle and suppressed under `prefers-reduced-motion`. Unsupported on iOS Safari, so it can only ever be additive. |
| F5 | P2 | Real sprite art | Brief stretch goal. Both creatures are SVG rects outlined by a single `feMorphology` filter. Per-state sprites would replace the shapes, not the animation system, because both species already share the `.pet-*` group classes. |
| F6 | P2 | Undo the last drink | A mis-tap can currently only be corrected with a full reset, which also clears the daily count. Keeping the previous `hydration` and `lastDrinkAt` for one step would cover it. |
| F8 | P3 | A third creature | `Config.species` is already a map and `toggleSpecies()` already cycles it, so this is a config entry plus a sprite. The single `*` switch would need to express three states instead of toggling two. |
| F7 | P3 | Richer scene changes between moods | Brief stretch goal. The sky already carries sun, moon, stars and ambient life, but the mood bands change the character rather than the world around it. |
| F9 | P3 | Reminder experiments | Brief stretch goal, and the one that fights the constraints: without a service worker there is no notification once the tab is closed, and a service worker means a second file, which breaks the single-file promise. Parked until someone decides which of the two matters more. |
| F10 | P3 | Prune `Config.legacyKeys` | Drop `ina-water-friend/v1` once no browser can plausibly still hold a save under it. Harmless until then, so this is bookkeeping rather than work. |

### Hardening and testing

Defects already in the app are not here, they are under
[Known issues](#known-issues). These two are work that has never been done.

| ID | Pri | Item | Notes |
|---|---|---|---|
| B2 | P1 | Device test matrix before `v1.0` | Promotion to `v1.0` needs a confirmed successful test run (NXW-VER-4). At minimum: iOS Safari audio unlock after backgrounding and with the silent switch on, Android Chrome, a real suspension across a day boundary to prove the `todayCount` rollover, and both `prefers-reduced-motion` settings. |
| B5 | P2 | No test harness | Band boundaries, `clampStep` snapping, the legacy-key migration and the day rollover have each been verified by hand, once, at the version that touched them. They are pure functions and would fit a small harness. The single-file rule constrains the shipped app, not a test file sitting next to it. |

## Docs

[`BRIEF.md`](BRIEF.md) is the full product brief, including its own version log.
It is kept as authored, so it still uses the working title and em dashes.

## Status

Prototype, `v0.19`, DEVELOPMENT. The loop works end to end and the app is
usable. What it gets wrong today is listed under
[Known issues](#known-issues); what has never been started is under
[Roadmap](#roadmap), where the stretch goals from `BRIEF.md` live too, so
there is no third list to keep in sync. One ID series covers both, so an item
keeps its ID when it moves from one to the other.

Promotion to `v1.0` is gated on B2, the device test matrix. No P1 defect is
open.
