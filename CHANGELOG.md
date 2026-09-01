# Changelog

Newest first. Every version gets an entry and no number is reused or skipped
(NXW-VER-2, NXW-VER-5, NXW-VER-7). Entries say what changed and why, and a fix
names its root cause (NXW-VER-8), in a few lines. The reasoning that led to a
change belongs in the comment beside the code and in the commit message, not
here: this file is scanned to find out when something shipped.

The version string appears in three places and the smoke test checks that they
agree: the `index.html` header block, `Config.app.version`, and the newest
entry below (NXW-VER-6).

```
v0.32  2026-09-01  Scenery: clouds, hills, grass, flowers, and fireflies after
                   dark. Fixtures rather than ambient kinds, because they must
                   not spawn or expire: they are the thing the drifters cross.
                   Built once at startup from `Config.scenery`, so a meadow is
                   stable while you look at it and different next visit.
                   Flowers open and close with the mood, on `--bloom`.
                   The mood wash moved from z-index 1 to 2, so it now dulls the
                   ambient life and the rainbow as well; both sat level with it
                   and, being later in the document, had escaped it.

v0.31  2026-09-01  Fixed B11: the gulls were registered on their top edge, so
                   the body travelled from row 3 to row 0 across the flap while
                   the wingtips barely moved. The bird lurched instead of
                   beating. All three poses now sit on the body row.
                   F7: the mood reaches the world, not just the creature. A
                   grey wash over the scene under the character, and ambient
                   life that thins as the mood drops.
                   B5: the legacy-key adoption is covered, 20 checks. What is
                   left of B5 was always B2's, so B5 is closed.

v0.30  2026-08-25  Fixed: the horn was cut off during the idle bob. An outer
                   svg is overflow:hidden, the horn ends on the artboard's top
                   row and the outline filter spends the one row above it, so
                   any animation that lifted the sprite clipped it. `.pet` is
                   overflow:visible now and the scene clips instead. Measured
                   past the edge: 1.15 units bob, 1.92 hop, 2.35 wobble, 9.54
                   morph.

v0.29  2026-08-25  Fixed: the bump on the unicorn's head was the mane. It
                   started a row above the head's widest row and its inner
                   strip squared off the rounded corner the right side keeps,
                   so the head was square on one side and round on the other.
                   Six manes judged side by side in .work/, tucked won.

v0.28  2026-08-25  A gear on the settings summary and a circular arrow on
                   reset, both ahead of the label the way the drink button
                   already wore its drop. The gear is an aria-hidden span, not
                   part of the string, because the summary has no aria-label to
                   hide an emoji behind. Reset also stopped reading as
                   disabled: --text on a --text-soft border, where it had been
                   the faintest thing on the panel.

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
