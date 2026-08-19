# Aniluna Water Friend - v0.11

**Status:** DEVELOPMENT
**Versioning:** `v0.x` = development/testing, `v1.x` = production-ready

A tiny hydration companion that lives in one HTML file. Tap **"I drank water"**,
the thirst meter refills, and Aniluna the pixel unicorn perks up. Leave them
alone and they slowly droop. That is the whole app.

**Play it:** https://mkoterski.github.io/ina-water-friend/

## Why it is built like this

- **One file.** `index.html` holds the markup, CSS and JS. No build step, no
  dependencies, no server. Drop it on any static host.
- **Timestamps, not timers.** Hydration is derived from `Date.now()` minus the
  stored `lastUpdateAt`, so closing the tab, locking the phone or killing the
  browser all produce the correct amount of decay. `setInterval` is used *only*
  to refresh the "last drink" label while the page is visible.
- **Local state only.** One serialised object in `localStorage`. No accounts, no
  sync, nothing leaves the device.

## Features

| | |
|---|---|
| Mood states | `hydrated` >=75, `okay` >=45, `thirsty` >=20, `dehydrated` <20 |
| Default decay | Full to completely empty in 2 hours, so the dehydrated band is entered just after 1 h 36 min |
| Idle animation | Bob, head nod, tail swish, ear twitch, blink, sparkle. Amplitude and speed tuned per state |
| Rainbow | Decorative reward, happiest state only |
| Sound | Procedural Web Audio: sip, yippie, sad "oh", gurgle. Unlocked on first gesture |
| Easter egg | 5 drink taps within 5 seconds triggers a blubber/gurgle |
| Settings | Full-to-empty slider (0.5 to 4.0 hours, half-hour steps), refill slider (25/50/75/100%), sound, easter egg, day/night theme |
| Accessibility | `prefers-reduced-motion` respected, 44 px touch targets, ARIA labels, no autoplay audio |

## Renaming the character

Everything user-facing reads from one config object near the top of the script:

```js
const Config = {
  app: { version: "v0.11", status: "DEVELOPMENT" },
  character: { name: "Aniluna", species: "unicorn" },
  hydration: { max: 100, defaultDecayHours: 2, defaultRefillAmount: 25 },
  limits: {
    decayHours: { min: 0.5, max: 4, step: 0.5 },
    refillAmount: { min: 25, max: 100, step: 25 }
  },
  ...
};
```

Change `name` and the title, heading, speech, status text and ARIA labels all
follow. The `limits` block drives the slider bounds, their tick labels and the
clamping of saved values, so widening a slider is a one-line change. Bumping
`storageKey` resets everyone's saved state, so only do that on a breaking change
to the state shape.

## Code map

The single script is split into labelled sections:

| Section | Responsibility |
|---|---|
| `CONFIG` | Version, constants, defaults, thresholds, slider limits, storage key, copy |
| `STORAGE` | Read/write/clear the JSON blob in `localStorage` |
| `TIME` | Relative time labels, local day key |
| `AUDIO` | Context setup, gesture unlock, procedural sounds |
| `STATE` | Decay, refill, bands, tap history, settings |
| `UI` | DOM refs, rendering, naming, slider limits, speech, effects |
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

This project follows the NeXtWind script standards
([`../nxw-script-standards.md`](../nxw-script-standards.md)) for versioning and
changelog discipline: development starts at `v0.10`, every iteration increments
the minor component by exactly one, every bump gets an entry, entries are newest
first and say what changed and why, and prose uses hyphens rather than em dashes
(NXW-VER-1 to NXW-VER-8, NXW-NAM-6).

The version string appears in three places: the `index.html` header block, the
changelog below, and the startup console banner. Promotion to `v1.0` happens
only after a confirmed successful test run.

### Changelog

```
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
