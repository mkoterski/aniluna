# Architecture

How the one file is put together, how to change it without hunting, and where
the working material lives. The product intent is in [`BRIEF.md`](BRIEF.md);
what is broken and what is planned is in [`ROADMAP.md`](ROADMAP.md).

## Renaming the character

Everything user-facing reads from one config object near the top of the script:

```js
const Config = {
  app: { version: "v0.32", status: "DEVELOPMENT" },
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
| `CONFIG` | Version, constants, defaults, thresholds, slider limits, storage key, theme list, glitter tuning, scenery counts, copy |
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
node test/smoke-test.mjs
```

Twenty checks, no dependencies, exits non-zero on any failure. It exists
because v0.23 shipped an app that did not start: the file parsed, which was the
only thing being checked, and a missing object property is a runtime error
rather than a syntax one. It checks the invariants that hold a single file
together, then evaluates the pure logic against a stub page. It does not
render, which is B2's job: the checks that need a real device are written out
in [`DEVICE-TESTS.md`](DEVICE-TESTS.md), and `v1.0` waits on a recorded run of
them.

The same checks run in a browser at [`test/smoke-test.html`](../test/smoke-test.html), which
is what makes them work on GitHub Pages where nothing can run node. Both
runners import [`test/smoke-checks.mjs`](../test/smoke-checks.mjs), so there is one copy of
the checks and no drift. The page needs a served origin: from `file://` the
fetch is refused, so serve the folder or open the published copy.

```bash
python -m http.server 8791
```

### Labs

`labs/` holds the labs that need a URL. They are tracked and published, so a
question about how something looks can be answered on the device it will be
looked at on. They are not the app and nothing in them ships until it is ported
into `index.html` by hand, which is why each one carries a drift warning in its
header: a lab is a copy of the app at a moment, and it does not follow.

- [`labs/scenery.html`](../labs/scenery.html) holds eight candidate background
  additions, built rather than described, in a free-toggle sandbox and six
  fixed combinations. Its argument is the split between drifters, which fit
  `Ambient.KINDS` as a config entry and a markup function, and fixtures, which
  need somewhere to live that is not the spawner. Published at
  <https://mkoterski.github.io/aniluna/labs/scenery.html>.

### Local working directory

`.work/` is a gitignored scratch folder: throwaway copies of `index.html`,
notes, screenshots, exported `localStorage` blobs used to reproduce a bug.
Nothing in it is tracked or published, and deleting the whole folder is always
safe. It is not in the repository, so create it after a fresh clone:

```bash
mkdir -p .work
```

Anything worth keeping moves out into `docs/`, or into `index.html`.

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

