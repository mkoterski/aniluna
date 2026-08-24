# Aniluna Aqua Buddy - v0.27

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
  app: { version: "v0.27", status: "DEVELOPMENT" },
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
follow. Both creature names are working titles and each is a single string.

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
v0.27  2026-08-24  Landed F8. A third creature, the panda Wan Wan, chosen from
                   the settings, with the dinosaur moved behind the secret
                   switch and its tooltip removed.

                   The panda is drawn to the same contract as the other two, so
                   the shared group class names and the four mood-band token
                   blocks drive it with no new animation code: an 18 wide head
                   on a 12 wide body, big round ears, large stepped eye patches,
                   blush at the edge of the cheeks. Its markings are charcoal
                   rather than black, because the feMorphology outline floods
                   with --ink and a black creature would lose its edges. Token
                   sets for all three themes, including a plum-warmed glitter
                   set so it belongs to that palette rather than sitting on it.

                   The dinosaur was redrawn in the same pass, from a second
                   reference: 4x4 eyes with two highlights each, the largest of
                   the three, a wide pale muzzle with nostrils and teeth, orange
                   blush from the existing spike token rather than a new colour,
                   rounder head plates, and a thick tail curling upward instead
                   of the thin taper it had. Its head is now 18 wide like the
                   others, which is most of why it used to look less cute than
                   the unicorn beside it.

                   Two decisions from the requester shape the switching. The
                   settings offer the unicorn and the panda; the dinosaur is
                   reachable only through the almost hidden switch in the
                   footer, marked by `secret: true` in Config.species so nothing
                   else in the code needs to know which creature that is. The
                   switch is a detour rather than a cycle: State.pickedSpecies
                   remembers what the settings chose and pressing the switch
                   again returns there, so it cannot strand anyone on a creature
                   the settings do not offer. While the dinosaur is out, neither
                   picker option is marked, which is the honest answer.

                   The switch also loses its tooltip: a hover label reading
                   "Geheimer Schalter" is not a secret. It keeps its ARIA name,
                   because a focusable button needs one, so the trade is that
                   the secret is kept from a mouse rather than from everyone.

                   Fixed while porting the sprite work, both found by looking at
                   the result rather than at the code. Hiding a sprite with
                   el.hidden = true does nothing: hidden is a property of
                   HTMLElement and these are SVG elements, so the assignment
                   sets a harmless expando, no attribute lands, and the
                   unselected creature renders behind the chosen one, showing as
                   a stray horn and mane behind the panda. And the creature
                   radios report aria-checked while the language buttons report
                   aria-pressed, so the selected-style rule had to answer to
                   both; keyed on the first alone, the chosen creature had no
                   highlight at all.

                   Also replaced the visibility CSS. Pairing selectors needed
                   one rule per ordered pair, two for two species and six for
                   three, and CSS cannot compare two attribute values, so each
                   sprite now carries data-species and applySpecies sets the
                   attribute the single rule keys off.

v0.26  2026-08-24  Daylight stars are a moment now, not a state. They rode
                   data-radiant, which is the meter at 95 or above, so a lit
                   sky kept a starfield in it for the whole of that band, about
                   six minutes at the default decay rate. The requester asked
                   for the moment the meter reaches 100 instead, so a drink
                   that tops it right out earns Config.ui.dayStarsMs of stars,
                   4.5 seconds, and the rest of the daytime sky is left to the
                   wind and the birds, which are what the random ambient
                   animations are for.

                   A timer rather than a tighter threshold, because the meter
                   starts falling the instant it is full: gating on exactly 100
                   would have tied the length of the celebration to the decay
                   rate, giving about 7 seconds at the 2 hour default and 2 at
                   the fastest setting. Only a drink triggers it. Reset also
                   fills the meter but is housekeeping rather than an
                   achievement, so it stays quiet.

                   Night is untouched: stars always, and brighter still when
                   the meter earns it. Glitter keeps no starfield at all, and
                   the rule that used to force that to zero is gone with the
                   one it was cancelling, since nothing raises the starfield in
                   glitter any more.

                   Verified in the browser: at 97 percent in daylight the sky
                   is empty where it used to be starry, a drink to 100 brings
                   the field to 0.85 and the timer takes it away, night still
                   reads 0.9 and 1, and glitter stays at 0.

                   Also rewrote BRIEF.md, on the requester's call, from a
                   pre-build spec into a brief describing the app as it stands.
                   Its implementation order, acceptance criteria and closing
                   instruction to the implementer are gone as spent, along with
                   citation markers pointing at sources this repository never
                   carried; the working title, the thirst-meter wording and the
                   em dashes are gone too. It now documents the second
                   creature, editable names, three languages, four themes, the
                   sun and moon arc, the ambient wind and gulls, both meter
                   rewards and haptics, and it points here for the changelog,
                   the roadmap and the known issues rather than restating them.
                   Its own version log continues at v0.7, which tracks the
                   document and not the app.

                   Fixed a comment that had stopped being true: the themeMode
                   field in State.defaults() still listed three values after
                   glitter became the fourth in v0.22.

v0.25  2026-08-24  Landed F4, haptics, on mood changes and nowhere else, with a
                   settings switch that is on by default.

                   Two signals and no more, which is a measurement rather than
                   a taste: on the Android device tested in
                   .work/haptics-lab.html a motor cannot tell 12 ms from 22 ms
                   and cannot resolve a three-beat rhythm, so a subtle pattern
                   language would have been decoration in the code and nothing
                   on the thumb. The mood improving is a 30 ms tick, the mood
                   dropping is a 180 ms buzz, far enough apart that any motor
                   renders the difference. Both live in Config.haptics.

                   Nothing here is the only feedback for anything, because it
                   can be silently off: Do Not Disturb silences vibration
                   outright while navigator.vibrate still returns true, iOS
                   Safari has no Vibration API at all, and desktop Chrome
                   accepts every call with no motor to honour it. Every buzz
                   doubles something the mood line and the sprite already say.

                   Four things it deliberately does not do. It does not buzz on
                   the drink tap, so the improvement tick is not doubled by a
                   tap tick a moment earlier; that is one config entry if it is
                   wanted. It does not buzz on the first render after a load,
                   because a fresh page has no previous band and arriving to a
                   buzz is startling rather than informative. It does not buzz
                   on return from a hidden tab, the same caution the audio
                   already takes on arrival, using a one-shot suppression that
                   is consumed even when haptics are off so it cannot leak into
                   the next change. And it does nothing under
                   prefers-reduced-motion, or while the page is not visible.

                   The settings row hides itself where navigator.vibrate does
                   not exist, so iOS is not shown a switch that can never do
                   anything. Switching it on buzzes once as confirmation, which
                   is the only way to tell a working feature from a Do Not
                   Disturb that is swallowing it.

                   The speech and the buzz are now separate: the mood line
                   keeps its speech lock, which stops sentences fighting over
                   the bubble, and the buzz has none, because a nudge is not
                   competing for anything.

                   Verified by loading the app and driving it rather than by
                   parsing it, which is the lesson of v0.24: init completes,
                   a drop across a band boundary sends [180], a rise sends
                   [30], a change inside one band sends nothing, the toggle
                   silences it and its own switch-on confirms, the arrival
                   suppression fires once and the next change still buzzes, and
                   reduced motion overrides all of it. The only thing that
                   blocked a buzz in testing was the page being hidden, which
                   is the guard working.

v0.24  2026-08-24  Fixed: v0.23 did not start at all. Ambient.KINDS lost its
                   star entry, so Ambient.rateFor("star") read `.when` off
                   undefined and threw. nudgeStar() is called from both
                   UI.render() and UI.applyTheme(), init() calls each of them,
                   and the throw took init with it: no title, no meter, no
                   mood line, no theme pill, no ambient timers. The app was
                   dead on arrival for the whole of v0.23, on every platform.

                   Root cause, and it is not the code: the v0.23 gull work
                   replaced a region of index.html by slicing from a comment
                   down to the next "\n    },\n    wind: {". A kind closes
                   with a four-space brace and so does the one before it, so
                   that marker matched the closing brace of the star entry
                   rather than the bird entry, and the replacement swallowed
                   everything between. The animation lab's own header warns
                   about exactly this, from the same mistake made twice while
                   syncing that file, and I made it a third time on the app.

                   Why it shipped: the only check run after that edit was
                   `new Function(script)`, which proves the file parses.
                   A missing object property is a runtime error, not a syntax
                   error, so it passed cleanly. The lab was loaded and looked
                   right, which is what made it feel verified, but the lab has
                   its own copy of KINDS and never touches this one. Loading
                   index.html itself would have shown a blank shell instantly.

                   Verified now by loading the app and checking that init
                   finishes rather than that the file parses: title, meter,
                   mood line, the four-button theme pill, the settings labels,
                   the ambient timers and the glitter canvas context are all
                   present, and no console errors. Deleting KINDS.star again
                   reproduces the three throws, and restoring it clears them,
                   so the mechanism is confirmed rather than assumed.

v0.23  2026-08-24  Redrew the wind and the gulls from frames pulled out of the
                   two videos the requester supplied, and added two labs to
                   .work/. Three attempts went into this, and only the frames
                   settled it: reading a style from memory produced a stroked
                   curl and then a bundle of tapered ribbons, and neither was
                   what the footage shows.

                   Wind, from 0:37 to 0:47 of the reference clip: one thin
                   trail, not a bundle. A hairline travels along its own path,
                   sweeping in and curling into an open loop at the head, with
                   a few specks alongside. What moves is a dash window walking
                   the path, so the curve draws itself rather than being slid
                   across the screen. Two paths share the geometry, a short
                   bright core and a longer faint tail, which is how a stroke
                   that cannot taper still carries a comet's weight.

                   Fixed in that work, found by pinning the dash at measured
                   offsets rather than by watching it: the visible dash covers
                   path positions -offset to -offset+length, so walking the
                   whole path needs the offset to run from +length down to
                   -100. The first version ran 100 to -46, which parked the
                   dash off the front at the start and stopped it at position
                   61, so the loop at the head of the path was never drawn at
                   all and every gust came out as the straight sweep only.

                   Gulls, from the first three seconds of the Link's Awakening
                   clip: a distant gull is a stepped pixel mark of a few
                   blocks, they fly as a loose flock rather than singly, and
                   the flap is a frame swap rather than a rotation. Three
                   poses, wings raised a wide four-row bowl, mid a shallow vee,
                   wings lowered a narrow peak. The span changes with the beat
                   as well as the height, which is what the earlier attempts
                   missed: at a fixed span a bird only ever reads as a dash
                   bending. A flock is three to five gulls, each at its own
                   scale for depth and its own phase so they do not beat in
                   unison, and it crosses at a slant on new glide keyframes
                   instead of sliding along one line.

                   Both are judged in .work/anim-lab.html, new here: it spawns
                   any of the three ambient animations on demand, in day, night
                   or glitter, at 0.1x to 2x speed, frozen mid-flight, with
                   band guides and a running count. Waiting between 42 and 84
                   seconds for a night gust is no way to judge one, and a 1.2
                   second streak cannot be judged at full speed at all. Every
                   animation in it is a copy of the real one here, which its
                   header warns about, and the copies were verified identical
                   to this file line for line. The header also records that
                   slicing those blocks out by brace matching does not work: a
                   kind closes with a four-space brace and KINDS with a
                   two-space one, so a script grabbed the wrong one, merged two
                   kinds and broke the file. Twice.

                   Also new, .work/haptics-lab.html for F4: it reports what the
                   device and browser actually support, offers one candidate
                   pattern per app event, takes a hand-typed pattern, respects
                   reduced motion behind a toggle, and says in its header that
                   navigator.vibrate returning true means the call was accepted
                   and not that anything buzzed. Neither lab is judgeable on a
                   desktop, which is the point of both being on the phone.

v0.22  2026-08-24  Landed F12, glitter mode, from the prototype in
                   `.work/glitter-mode/`.

                   Glitter is a theme and not a switch, which is the finding
                   that shaped the work: themeMode takes a fourth value and the
                   top bar button plus the two settings checkboxes are replaced
                   by one segmented pill, auto / day / night / glitter, built as
                   a radiogroup with a roving tabindex because a switch would
                   have to lie about two of the four. Icons are decorative, the
                   accessible name carries the meaning, and both come from the
                   same UI.label() call as the tooltips, so a locale change
                   moves all three together. A status line announces the choice
                   for screen readers.

                   The theme itself is one `:root[data-theme="glitter"]` token
                   block. The prototype's palette moved across but its token
                   names could not, because the demo host used its own
                   vocabulary, so the block is written in this app's names and
                   covers the creature palette as well as the page.

                   Two integration points the prototype could not have known
                   about. The typeface is now a `--font-app` token so a theme
                   can change it, and glitter's rounded stack keeps the CJK
                   faces after the Latin ones, because the app ships
                   Traditional Chinese copy and Comic Sans has no glyphs for
                   it. And glitter is a lit sky, so the new UI.skyTheme() maps
                   it to day: it keeps the sun and the rainbow, and leaves the
                   moon, the starfield and the shooting star to the dark.
                   Without that every sky gate would have missed, since each
                   asks for "day" or "night" by name, and glitter would have
                   had an empty sky and no reward.

                   The engine is ported as it was measured: GlitCaps for live
                   pointer and motion queries, GlitSprites for the sprite cache
                   that took a 90-particle burst from 0.958 ms to 0.155 ms a
                   frame, GlitEngine for one canvas, one rAF loop that stops
                   itself when the last particle dies. Tuning sits in
                   Config.glitter rather than in the engine body (NXW-NAM-4).
                   Left behind deliberately: the prototype's own storage and
                   theme-mode machinery, which would have been a second theme
                   system arguing with this one.

                   The trail needs a pointer, so it is gated on (pointer: fine)
                   and (hover: hover) in JS as well as in CSS, since CSS alone
                   would hide the result of the work rather than skip it. On a
                   touch screen the theme applies and the trail says why it is
                   absent. Under reduced motion nothing spawns and the sheen
                   holds still, but the palette, the typeface and the ribbons
                   stay: the mode is still observable, it just does not move.
                   Leaving glitter clears the canvas, and a hidden tab clears
                   it too so nothing is mid-flight on return, where the canvas
                   is also re-sized in case a suspended page missed a resize.

                   Verified by driving the page: the pill is a radiogroup of
                   four localised radios with one tab stop, arrow keys walk it,
                   entering glitter swaps palette, typeface, sheen and ribbons
                   and enables the engine, a burst makes particles and the cap
                   holds at 90, simulated pointer travel spawns a trail,
                   leaving glitter clears every particle and re-enables the
                   night reward, and spawning under an inert theme is a no-op.
                   Seven sprites are prewarmed from eight glyph slots, which
                   matches the prototype. Confirmed by eye afterwards in all
                   three themes, which is also where v0.21's shooting star was
                   first seen in flight rather than measured.

                   Fixed after looking at it: the selected button borrowed the
                   prototype's near-white thumb, which on the night palette
                   resolved to --panel sitting on --meter-bg with almost no
                   contrast, so the selection was there and invisible. It now
                   uses --accent on --accent-ink, the same idiom the language
                   buttons already use for "this one is chosen".

v0.21  2026-08-24  The reward after dark is a shooting star rather than a
                   rainbow, and the threshold gating both is renamed.

                   A rainbow needs a lit sky to read as one, so the arc is now
                   gated on the resolved day theme and the night sky gets a
                   streak instead: a new `star` kind in AMBIENT, crossing high
                   above the character on its own diagonal keyframes, tail
                   behind a bright head, in the same `--star` tokens as the
                   starfield. Direction varies per appearance as it does for
                   birds and gusts, and the bob is now scoped to those two,
                   because a streak that wobbles reads as a bug.

                   Unlike the other kinds the star is gated on app state, not
                   the clock, so rateFor() grew an optional when() per kind and
                   an `any` rate for kinds whose frequency does not follow the
                   time of day. The star's when() asks for the resolved theme,
                   so it obeys the same rule as the sun and moon since v0.19: a
                   night override at noon gets the night reward and no rainbow.
                   Entering the rewarded state nudges the timer with a short
                   first delay, because the idle re-check is a minute out while
                   the reward window is about six minutes.

                   Config.thresholds.rainbow is now .reward: the value gates
                   two rewards, so a name promising one had become half-true.
                   It stays at 95 against the displayed percent, confirmed over
                   a literal 100. Thresholds are not persisted, so no save is
                   affected and no migration is needed.

                   Fixed before it shipped: the drop was a translateY
                   percentage, which resolves against the element's own height
                   of about 30 px rather than the scene's. Measured at a paused
                   animation offset, the streak fell 13 px across a 424 px
                   crossing, near enough to flat. It now converts to pixels
                   against the ambient layer at spawn, 26 to 46 percent of the
                   scene, and a host with no layout leaves the keyframe default
                   standing rather than computing a flat zero.

                   Under prefers-reduced-motion no star may cross, so the
                   static half carries the reward alone: at night a full meter
                   lifts the whole starfield to full opacity.

v0.20  2026-08-24  Landed F11 and F13. F11: a Name field renames the creature
                   on screen, one override per species key in State.data.names,
                   resolved against the built-in name by the new UI.name(), so
                   the title, speech, stats, banner and every ARIA label follow
                   from one call. Entries are trimmed and capped at
                   Config.naming.maxLength of 24 by code point, so a name
                   ending in an emoji cannot be cut in half, and clearing the
                   field deletes the override, which is what restores the
                   built-in name. Commit is on blur or Enter, not per
                   keystroke. F13: the four emoji-only buttons name themselves
                   on hover and on keyboard focus, with UI.label() writing the
                   accessible name and the tooltip from one string so the two
                   cannot drift, as a pseudo-element so a screen reader still
                   hears one name. Touch is not covered: these buttons act on
                   the first tap.

v0.19  2026-08-24  Fixed B9: the sun and the moon are gated on the resolved
                   theme, not on the clock alone. Root cause: applySky() read
                   Time.hourOfDay() and nothing else, while the stars followed
                   [data-theme="night"] in CSS, so an override moved the stars
                   and left the sun behind. Forcing night before the moon rises
                   leaves an empty sky, by decision. Automatic mode unchanged.

v0.18  2026-08-24  Trimmed the German settings footer to "Aniluna wohnt nur in
                   diesem Browser." An unprompted promise invites the doubt it
                   means to settle, and the first sentence already carries the
                   point. English and Chinese keep theirs, where the phrasing
                   lands as warmth rather than protest. Docs: condensed the
                   changelog, split defects into Known issues and left work
                   never started in Roadmap under one shared ID series, added
                   B6 to B10, and closed B1 as won't-fix after correcting a
                   description that overstated it.

────────────────────────────────────────────────────────────────────────────
Archive: superseded development iterations (NXW-VER-7).

v0.17  2026-08-20  Rewrote the copy in every language as native writing rather
                   than translation. Chinese moved to Taiwanese Traditional,
                   zh-TW in both the Intl tag and the document language,
                   because bare "zh" does not tell a browser which glyphs to
                   pick. German leans on diminutives, and its meter label went
                   from Flüssigkeit to Hydration. Gusts now roam the whole
                   sky, smaller and fainter.

v0.16  2026-08-20  Renamed the product to Aqua Buddy, a brand name that stays
                   in English. Added a sun and a moon on one east-to-west arc,
                   interpolated in two halves so an off-centre peak still lands
                   on its stated hour, riding the same ticker as the automatic
                   theme. Added rare ambient life in a new AMBIENT module:
                   birds by day, gusts more often at night, each crossing once
                   and removing itself, with the rate re-checked when a timer
                   fires so dusk changes the rhythm without a restart and
                   nothing is scheduled while hidden or under reduced motion.
                   Softened the rainbow to 0.45 opacity above the sky layer.

v0.15  2026-08-20  Added a secret species switch, three languages, a clock
                   driven theme, an info button and a gentler first run. Name,
                   copy, favicon and voice all follow from Config.species, and
                   both sprites share group class names so one animation system
                   drives either. German, English and Chinese live in a new
                   STRINGS section, with Intl.RelativeTimeFormat and
                   toLocaleString rather than hand-written strings, and the
                   sprite classes went from .ina-* to .pet-*. themeMode (auto,
                   day, night) replaced the theme boolean and re-resolves on
                   the ticker and on return to the tab, adopting older saves as
                   an explicit choice. Stars show at night, and in daylight
                   only at the reward level, tinted warm gold. First run starts
                   at 75 so a new user has something to fix.

v0.14  2026-08-20  Renamed the storage key to aniluna/v1, with
                   Config.legacyKeys and Storage.migrate() adopting a save
                   under an old key exactly once and never overwriting data
                   already at the current one.
                   Fixed: mood bands were compared against the raw hydration
                   float while the meter showed the rounded percent, so a meter
                   reading 75% could sit in the okay band at 74.997.
                   State.band() now rounds first.

v0.13  2026-08-20  Renamed the meter label from "Thirst meter" to "Hydration":
                   the bar fills when you drink, so thirst inverted the
                   meaning. Root cause: the label was taken from the brief
                   while the state, the mood copy and the ARIA name all said
                   hydration. Narrowed the reward to 95 and above, gated on the
                   displayed percent, replacing four per-band opacity tokens
                   with a single data-radiant attribute.

v0.12  2026-08-20  Added a favicon: the unicorn emoji in an inline SVG data
                   URI, after a hand-drawn 16x16 pixel head did not read as a
                   unicorn at that size. 189 characters instead of 1163, and
                   still a single file. Renamed the repository to aniluna.

v0.11  2026-08-20  Renamed the character to Aniluna, every mention coming from
                   config. Cut the default full-to-empty time from 4 hours to 2
                   so the mood states are reachable in one sitting. Replaced
                   both settings number inputs with sliders, with clamping that
                   snaps onto the step rather than rounding to whole numbers,
                   and bounds and tick labels generated from Config.limits.
                   Fixed: a null or empty field in a save became 0 rather than
                   the default, because Number(null) is 0 and passed the
                   Number.isFinite guard. Coercion now goes through State.num.

v0.10  2026-08-19  Initial version. Single-file static app: timestamp driven
                   hydration decay, four mood bands with per-state idle
                   animation, a pixel unicorn drawn as SVG rects and outlined
                   by one feMorphology filter, a happy-state rainbow,
                   procedural Web Audio unlocked on first gesture, the
                   five-taps gurgle easter egg, day and night themes, and
                   localStorage persistence that survives tab suspension and
                   browser kills.
```

## Known issues

Defects present in `v0.27`, as opposed to work never started, which is under
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
  not been read by a native speaker (F2), so `v0.27` is a prototype in the
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
| F1 | P1 | Confirm or replace the working titles | `Aniluna` and `Anirex` are both still working titles. One string each in `Config.species`, so the rename is cheap in code, but it is also the product name, the repo name and the storage key. Decide before `v1.0`. F11 softened this: an owner who dislikes the name can now overwrite it, so what is left to settle is the product and repository name rather than what the pet is called. |
| F2 | P1 | Native-speaker pass on the Traditional Chinese copy | It is written as native copy rather than translation and the register is deliberately soft, but no Taiwanese speaker has read it yet. The German diminutives deserve a second pair of eyes too, less urgently, and v0.22 added Glitzermodus, its two trail notices and the Traditional Chinese 閃閃模式, none of which a native speaker has read. |
| F3 | P2 | "While you were away" note | Brief stretch goal. After a long gap, one line about what happened instead of silently presenting a drooping pet. The data already exists: `lastDrinkAt`, and the points `State.sync()` returns. |
| F5 | P2 | Real sprite art | Brief stretch goal. The creatures are SVG rects outlined by a single `feMorphology` filter. Per-state sprites would replace the shapes, not the animation system, because both species already share the `.pet-*` group classes. |
| F6 | P2 | Undo the last drink | A mis-tap can currently only be corrected with a full reset, which also clears the daily count. Keeping the previous `hydration` and `lastDrinkAt` for one step would cover it. |
| F7 | P3 | Richer scene changes between moods | Brief stretch goal. The sky already carries sun, moon, stars and ambient life, but the mood bands change the character rather than the world around it. |
| F9 | P3 | Reminder experiments | Brief stretch goal, and the one that fights the constraints: without a service worker there is no notification once the tab is closed, and a service worker means a second file, which breaks the single-file promise. Parked until someone decides which of the two matters more. |
| F10 | P3 | Prune `Config.legacyKeys` | Drop `ina-water-friend/v1` once no browser can plausibly still hold a save under it. Harmless until then, so this is bookkeeping rather than work. |

### Hardening and testing

Defects already in the app are not here, they are under
[Known issues](#known-issues). These two are work that has never been done.

| ID | Pri | Item | Notes |
|---|---|---|---|
| B2 | P1 | Device test matrix before `v1.0` | Promotion to `v1.0` needs a confirmed successful test run (NXW-VER-4). At minimum: iOS Safari audio unlock after backgrounding and with the silent switch on, Android Chrome, a real suspension across a day boundary to prove the `todayCount` rollover, and both `prefers-reduced-motion` settings. |
| B5 | P1 | No test harness, and no smoke test | Band boundaries, `clampStep` snapping, the legacy-key migration and the day rollover have each been verified by hand, once, at the version that touched them. They are pure functions and would fit a small harness. The single-file rule constrains the shipped app, not a test file sitting next to it. Raised to P1 by v0.23, which shipped an app that did not start: the cheapest missing check is not a unit test but a smoke test that loads `index.html` and asserts `init()` finished, since parsing the file proves nothing about a runtime error. |

## Docs

[`BRIEF.md`](BRIEF.md) is the product brief: what the app is, who it is for,
how it is meant to feel, and the rules it holds itself to. Rewritten at v0.26
to describe the app as built, so it no longer reads as a spec addressed to an
implementer who has not started yet. It keeps its own version log, which tracks
the document rather than the app.

The split between the two is deliberate. The brief states the intent, this file
states the state: the changelog, the roadmap, the known issues, the code map
and how to run it all live here. Where they disagree, this file describes what
exists and the brief describes what was wanted, and the gap is worth a look.

## Status

Prototype, `v0.27`, DEVELOPMENT. The loop works end to end and the app is
usable. What it gets wrong today is listed under
[Known issues](#known-issues); what has never been started is under
[Roadmap](#roadmap), where the stretch goals from `BRIEF.md` live too, so
there is no third list to keep in sync. One ID series covers both, so an item
keeps its ID when it moves from one to the other.

Promotion to `v1.0` is gated on B2, the device test matrix. No P1 defect is
open.
