# Roadmap and known issues

One ID series covers both lists. `B` ids are defects and hardening, `F` ids are
features. An item keeps its id when it moves between the lists, and a retired
id is never reused, so a changelog entry can quote one years later and still
mean the same thing.

## Known issues

Defects present in `v0.33`, as opposed to work never started, which is under
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
- The device test matrix is written but unrun (B2), so `v0.33` is a prototype in
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
| F3 | P2 | "While you were away" note | **Built in the v2 prototype, not yet in the app.** One line in the creature's voice after a gap of `Config.recovery.awayHours`, dismissed by the close button or by the next drink. It names what the world did while nobody was watching, which only became possible in v0.32: the flowers close. Lands in the app when v2 merges. |
| F5 | P2 | Real sprite art | Brief stretch goal. The creatures are SVG rects outlined by a single `feMorphology` filter. Per-state sprites would replace the shapes, not the animation system, because both species already share the `.pet-*` group classes. |
| F6 | P2 | Undo the last drink | **Built in the v2 prototype, not yet in the app.** One step of history held in memory rather than in the save, because an undo that survives a reload would be a second account of what happened. Carries `dayKey` so a step cannot be applied across a rollover, and a reset spends it. Lands in the app when v2 merges. |
| F9 | P3 | Reminder experiments | Brief stretch goal, and the one that fights the constraints: without a service worker there is no notification once the tab is closed, and a service worker means a second file, which breaks the single-file promise. Parked until someone decides which of the two matters more. |
| F10 | P3 | Prune `Config.legacyKeys` | **Not yet, and the date is the reason.** The key was renamed in v0.14 on 2026-08-20, so a save under `ina-water-friend/v1` is twelve days old at most, and anyone who opened the app before that and has not been back still holds one. Pruning now would silently drop their creature's name and settings. The cost of keeping it is one string in an array, read once at startup, against losing someone's state: keep it until `v1.0` has been public for a year, then prune. Covered by two smoke checks since v0.31, so pruning it will be a visible change rather than a quiet one. |

### Settled

Decided rather than built, kept here so the IDs are not reused and the decision
is not rediscovered as an open question.

| ID | Settled | Decision |
|---|---|---|
| F1 | 2026-08-25 | `Aniluna` is the final name of the product and of the repository, not a working title. `Config.storageKey` is already `aniluna/v1`, so nothing in the code moves. The creature names beside it stay as they are, and F11 lets an owner overwrite any of them anyway. |
| F2 | 2026-08-25 | Taiwanese native speakers have read the Traditional Chinese copy, including the v0.22 Glitzermodus strings and the two trail notices. The register was confirmed rather than corrected. |
| F7 | 2026-09-01 | Landed in v0.31 as a wash rather than as new scenery: one neutral grey layer over the whole scene, sitting under the character, plus ambient life that thins as the mood drops. Two tokens per band and no new markup, which is why a P3 stretch goal was cheap enough to do. |
| B5 | 2026-09-01 | Closed in v0.31. The legacy-key adoption has two checks: a save under the old key is adopted once and the entry cleared, and a legacy save never overwrites a current one. The stub could not reach that path because `init()` is wired to `DOMContentLoaded`, which never fires there, so the checks drive `migrate()` and `load()` in the order init does. The other gap B5 named, asserting on a rendered page, is B2's by definition, so there is nothing left under this ID. |
| F14 | 2026-08-25 | The German copy, the diminutives and the Glitzermodus strings included, is written and checked by a native German speaker. Raised and closed on the same day, because F2 covered only the Traditional Chinese side and the German one deserved saying out loud rather than leaving implied. All three locales have now been read by someone who speaks them. |

### Hardening and testing

Defects already in the app are not here, they are under
[Known issues](#known-issues). This one is work that has never been done.

| ID | Pri | Item | Notes |
|---|---|---|---|
| B2 | P1 | Run the device test matrix before `v1.0` | The matrix was written on 2026-08-25 and lives in [`DEVICE-TESTS.md`](DEVICE-TESTS.md): 38 checks across six platforms, three of which are required. It covers what B2 always asked for, the iOS Safari audio unlock after backgrounding and with the silent switch on, Android Chrome, a real suspension across a day boundary to prove the `todayCount` rollover, and both `prefers-reduced-motion` settings, plus the layout, contrast, touch-target and screen-reader checks a script cannot make. Writing it was the easy half. B2 stays open until a run is recorded, because NXW-VER-4 gates `v1.0` on a confirmed successful test run, not on a plan for one. |

