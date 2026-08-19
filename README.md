# Ina Water Friend 💧🦄

A tiny hydration companion that lives in one HTML file. Tap **"I drank water"**,
the thirst meter refills, and Ina the pixel unicorn perks up. Leave her alone and
she slowly droops. That's the whole app.

**Play it:** https://mkoterski.github.io/ina-water-friend/

## Why it is built like this

- **One file.** `index.html` holds the markup, CSS and JS. No build step, no
  dependencies, no server — drop it on any static host.
- **Timestamps, not timers.** Hydration is derived from `Date.now()` minus the
  stored `lastUpdateAt`, so closing the tab, locking the phone or killing the
  browser all produce the correct amount of decay. `setInterval` is used *only*
  to refresh the "last drink" label while the page is visible.
- **Local state only.** One serialised object in `localStorage`. No accounts, no
  sync, nothing leaves the device.

## Features

| | |
|---|---|
| Mood states | `hydrated` ≥75, `okay` ≥45, `thirsty` ≥20, `dehydrated` <20 |
| Idle animation | Bob, head nod, tail swish, ear twitch, blink, sparkle — amplitude and speed tuned per state |
| Rainbow | Decorative reward, happiest state only |
| Sound | Procedural Web Audio: sip, yippie, sad "oh", gurgle. Unlocked on first gesture |
| Easter egg | 5 drink taps within 5 seconds → blubber/gurgle |
| Settings | Decay hours, refill %, sound, easter egg, day/night theme |
| Accessibility | `prefers-reduced-motion` respected, 44 px touch targets, ARIA labels, no autoplay audio |

## Renaming the character

Everything user-facing reads from one config object near the top of the script:

```js
const Config = {
  character: { name: "Ina", species: "unicorn" },
  hydration: { max: 100, defaultDecayHours: 4, defaultRefillAmount: 25 },
  ...
};
```

Change `name` and the title, heading, speech, status text and ARIA labels all
follow. Bumping `storageKey` resets everyone's saved state — only do that on a
breaking change to the state shape.

## Code map

The single script is split into labelled sections:

| Section | Responsibility |
|---|---|
| `CONFIG` | Constants, defaults, thresholds, storage key, copy |
| `STORAGE` | Read/write/clear the JSON blob in `localStorage` |
| `TIME` | Relative time labels, local day key |
| `AUDIO` | Context setup, gesture unlock, procedural sounds |
| `STATE` | Decay, refill, bands, tap history, settings |
| `UI` | DOM refs, rendering, naming, speech, effects |
| `EVENTS` | Input, lifecycle and the UI-only refresh ticker |
| `INIT` | Startup sequence |

## Running locally

Just open `index.html` — no server needed. `localStorage` works from `file://`
in Chrome, Edge and Firefox. To test on a phone on the same network:

```bash
python -m http.server 8000
```

## Docs

[`BRIEF.md`](BRIEF.md) is the full product brief, including the version log.

## Status

Prototype. Stretch ideas not built yet: real sprite art, haptics, a "while you
were away" summary, richer scene changes between moods.
