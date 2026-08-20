# Aniluna Aqua Buddy - v0.17

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
  app: { version: "v0.17", status: "DEVELOPMENT" },
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
v0.17  2026-08-20  Rewrote the copy in every language as native writing rather
                   than translation, and tuned the ambient life.

                   Chinese moved from Simplified to Taiwanese Traditional. The
                   Intl tag is now zh-TW and the document language carries the
                   full tag, because bare "zh" does not tell a browser whether
                   to pick Traditional or Simplified glyphs. Added Traditional
                   font fallbacks and relabelled the button 繁中. The register
                   is deliberately soft, using the sentence-final particles
                   that read as cute rather than formal. Worth a native
                   speaker's eye before showing it to anyone in Taiwan.

                   German now leans on diminutives and warmth rather than
                   literal equivalents: Schlückchen, Schwänzchen, "Neuer Tag,
                   neues Glück", "Ganz doll durstig". The meter label went from
                   Flüssigkeit, which reads oddly, to Hydration, which is the
                   word actually used. English kept the same term rather than
                   inventing a second one, and got a lighter, warmer pass.

                   Ambient: gusts now roam the whole sky rather than the band
                   behind the character, and they are smaller and fainter so a
                   wider band does not crowd the scene. Both kinds already
                   picked their direction per appearance; that is now stated in
                   a comment so a later edit cannot quietly drop it.

v0.16  2026-08-20  Renamed the product to Aqua Buddy in all three languages,
                   as a brand name that stays in English.

                   Added a sun and a moon on one shared east-to-west arc: up
                   from the left at the rise hour, highest at the peak hour,
                   down to the right at the set hour. Progress is interpolated
                   in two halves, so an off-centre peak still lands exactly on
                   its stated hour: the sun is highest at 12:00 despite an
                   asymmetric 07:00 to 19:00 window, and the moon at midnight
                   despite rising at 20:00. The moon's window crosses midnight,
                   so its hours run past 24 and wrap. The bodies ride the same
                   ticker as the automatic theme, so they never disagree with
                   the sky they sit in.

                   Added rare ambient life in a new AMBIENT module: birds by
                   day only, wind gusts rarely by day and more often at night,
                   with rates per effect and per daypart in Config.ambient.
                   Each element crosses once and removes itself. The rate is
                   re-checked when a timer fires rather than when it is set, so
                   dusk changes the rhythm without any restart, and nothing is
                   scheduled while the tab is hidden or under reduced motion,
                   so a backgrounded page cannot accumulate nodes.

                   Softened the rainbow from 0.78 to 0.45 opacity and put it
                   above the sky layer, so a busy happiest-state daytime scene
                   with sun, stars, rainbow, birds and sparkles still reads.

v0.15  2026-08-20  Added a secret species switch, three languages, a clock
                   driven theme, an info button, and a gentler first run.

                   Species: an almost hidden asterisk in the bottom right
                   flips between the unicorn Aniluna and a new dinosaur,
                   Anirex. Name, speech copy, favicon emoji and the synth
                   voice all follow from Config.species, so adding a third
                   creature is a config entry plus a sprite. Both sprites use
                   the same group class names, so the single animation system
                   and the four mood-band token blocks drive either one with
                   no extra CSS. The switch is visually quiet but a real
                   labelled button, so keyboards and screen readers can still
                   reach it. Anirex is a working title.

                   Languages: German, English and Chinese, German by default,
                   in a new STRINGS section with one entry per locale and
                   speech keyed by species. Relative times use
                   Intl.RelativeTimeFormat rather than hand-written strings,
                   so the grammar is right in all three, and numbers go
                   through toLocaleString, so the sliders read 1,5 Stunden in
                   German. Renamed the sprite classes from .ina-* to .pet-*
                   and the outline filter to petInk: after two renames the old
                   prefix was a misnomer, and with two species it named the
                   wrong thing entirely.

                   Theme: themeMode replaces the theme boolean and takes auto,
                   day or night. Auto resolves against the local clock and is
                   re-evaluated on return to the tab and on the UI ticker, so
                   it flips at dusk while the page is open. The top bar button
                   sets an explicit override; a settings toggle returns
                   control to the clock. Saves written before this version
                   carry theme rather than themeMode, and that value is
                   adopted as an explicit choice rather than discarded.

                   Stars: shown always at night, and in daylight only at or
                   above the rainbow threshold, tinted warm gold in daylight
                   so they read against a pale sky rather than vanishing.

                   First run: hydration starts at Config.hydration.initial of
                   75 instead of full, so a new user has something to fix and
                   learns the loop from a single tap. Reset still fills to 100.

                   Info: a circled-i in the top bar toggles a localised
                   two-sentence explanation, wired with aria-expanded and
                   aria-controls.

                   Not changed: the page does not reload itself. State is
                   derived from timestamps, so it self-corrects whenever the
                   tab becomes visible. An automatic reload would add nothing
                   and could interrupt a tap.

v0.14  2026-08-20  Renamed the localStorage key from ina-water-friend/v1 to
                   aniluna/v1, so nothing user-visible or internal still
                   carries the old working title. Added Config.legacyKeys and
                   Storage.migrate() so the rename does not cost anyone their
                   saved companion: on startup the app adopts a save found
                   under an old key name, exactly once, and never overwrites
                   data already present at the current key. Verified that
                   hydration, drink count, decay hours, refill amount, theme
                   and both toggles all survive the rename across a real page
                   reload, that migration is idempotent, that it is a no-op on
                   a clean install, and that a corrupt legacy save is adopted
                   and then falls back to defaults rather than breaking
                   startup.
                   Fixed: mood bands were compared against the raw hydration
                   float while the meter displayed the rounded percent, so a
                   meter reading exactly 75% could sit in the okay band
                   because the underlying value was 74.997. Found while
                   testing the migration. State.band() now rounds first, so
                   the number on screen, the mood line, the sprite state and
                   the rainbow all agree at every boundary. Same class of bug
                   as the v0.13 rainbow gating.

v0.13  2026-08-20  Renamed the visible meter label from "Thirst meter" to
                   "Hydration". The bar fills when you drink, so labelling it
                   thirst inverted the meaning: 100% read as maximally thirsty
                   when it means completely topped up. Root cause: the label
                   was taken verbatim from the brief's feature list while the
                   state, the mood copy and the generated ARIA name all used
                   hydration, so the visible label was the only wrong half and
                   disagreed with its own accessible name. This is a
                   deliberate deviation from the brief's "thirst meter with
                   visible percentage" wording.
                   Narrowed the rainbow to the top of the range. It now needs
                   the meter to read at or above the new Config.thresholds
                   .rainbow of 95 rather than the whole hydrated band from 75.
                   Gated on the displayed, rounded percent so the arc always
                   agrees with the number on screen: 94.6 renders as 95% and
                   earns the rainbow. Replaced the four per-band --rainbow-op
                   tokens with a single data-radiant attribute, since
                   visibility is now one threshold rather than four values.

v0.12  2026-08-20  Added a favicon. First attempt was a hand-drawn 16x16 pixel
                   unicorn head matching the in-app sprite, but at favicon size
                   it did not read as a unicorn, so it was replaced with the
                   unicorn emoji wrapped in an inline SVG data URI. That is also
                   189 characters instead of 1163 and keeps the single-file
                   promise. Renamed the repository to aniluna. Documented why
                   storageKey keeps the old working-title string.

v0.11  2026-08-20  Renamed the character to Aniluna. The old working title is
                   gone from the code entirely, every mention now comes from
                   Config.character.name. Cut the default full-to-empty time
                   from 4 hours to 2 so the mood states are reachable in a
                   single sitting. Replaced both settings number inputs with
                   sliders: full-to-empty runs 0.5 to 4.0 hours in half-hour
                   steps so values like 1.5 are selectable, refill is a
                   four-stop slider at 25/50/75/100 percent. Saved-value
                   clamping now snaps onto the slider step instead of rounding
                   to whole numbers, which would otherwise have silently
                   destroyed any half-hour setting on the next load. Slider
                   bounds and tick labels are generated from Config.limits so
                   they cannot drift apart. Removed em dashes from all prose,
                   comments and ARIA text per NXW-NAM-6. Added the header
                   block, version config and console banner.
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

## Docs

[`BRIEF.md`](BRIEF.md) is the full product brief, including its own version log.
It is kept as authored, so it still uses the working title and em dashes.

## Status

Prototype. Stretch ideas not built yet: real sprite art, haptics, a "while you
were away" summary, richer scene changes between moods.
