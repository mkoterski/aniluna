# Aniluna Aqua Buddy - Device test matrix

This is B2. Promotion to `v1.0` needs a confirmed successful run of this matrix
(NXW-VER-4), so the matrix is the gate and this file is where a run is recorded.

Written against app **v0.31**. `node smoke-test.mjs` checks the pure logic
against a stub page and asserts nothing about a rendered one, which is why this
exists: layout, contrast, touch targets, audio unlock, haptics and real
suspension are only observable on a device.

Run against a served origin rather than `file://`, because the smoke page
fetches its checks and a browser refuses that from a file URL.

```bash
python -m http.server 8791
```

## Platforms

`R` is required before `v1.0`. `N` is worth doing and does not block.

| ID | Gate | Platform | Why it is on the list |
|---|---|---|---|
| P1 | R | iOS Safari, current major, real hardware | The audio unlock, the silent switch and the absent `navigator.vibrate` all behave differently here than anywhere else, and none of it reproduces in a simulator |
| P2 | R | Android Chrome, current major, real hardware | The only place haptics actually fire, and the second of the two mobile layouts |
| P3 | R | Desktop Chrome or Edge | The browser everything was built in, so it is the control rather than a discovery |
| P4 | N | Desktop Firefox | A different audio and `Intl` implementation |
| P5 | N | Desktop Safari, macOS | Shares the iOS engine, so it catches WebKit issues without a phone in hand |
| P6 | N | Android Firefox or Samsung Internet | Breadth only |

A tablet adds nothing the phone and the desktop do not already cover: the
layout has no third breakpoint.

## Checks

Every check names what to do and what counts as a pass. A check that cannot run
on a platform is `n/a` rather than a failure: no haptics on iOS is expected, and
D14 is the check for that.

### Startup and persistence

| ID | Check | How | Pass when |
|---|---|---|---|
| D1 | Cold start | Clear the site data, open the page | The meter reads 75%, the creature renders, no console error |
| D2 | The app starts at all | Watch the console through the first render | The startup banner names `v0.31` and nothing throws. This is the class of failure that shipped in v0.23 |
| D3 | A drink persists | Drink, force-quit the browser, reopen | The meter and the daily count survive, and the last-drink line reads as a moment ago |
| D4 | Settings persist | Change decay, refill, sound, easter egg, theme, language and a name, reopen | All seven come back as set |
| D5 | Legacy save adopted | Write a save under `ina-water-friend/v1`, clear `aniluna/v1`, reload | The old save is adopted and rewritten under the current key. This is the `Storage.migrate()` path the smoke test does not exercise (B5) |
| D6 | Storage blocked | Open in private mode, or block storage for the origin | The app runs, warns to the console and keeps nothing. It must not fail to start |

### Time, suspension and the day boundary

| ID | Check | How | Pass when |
|---|---|---|---|
| D7 | Real suspension across a day boundary | Drink several times before midnight, leave the tab open and the device idle overnight, open it the next day | `todayCount` has rolled over, hydration has decayed by the elapsed time rather than by the time the tab spent in the foreground, and the sky matches the new hour |
| D8 | Short background return | Background the app for ten minutes, return | Decay matches the wall clock and the meter settles to the new value rather than passing through an inconsistent state |
| D9 | Auto theme re-resolves at dusk | Leave the page open across 19:00 with the theme on auto, or move the device clock across it | The scene flips to night without a reload |

### Audio

| ID | Check | How | Pass when |
|---|---|---|---|
| D10 | No autoplay | Load the page and touch nothing | Silence, and no console warning about a blocked context |
| D11 | Unlock on the first gesture | Drink once | The sip plays on that first tap, not on the second |
| D12 | Unlock survives backgrounding (P1) | Drink, background the app for a minute, return, drink again | Sound still plays. iOS suspends the audio context on background, and this is the check that catches a context that is never resumed |
| D13 | Silent switch (P1) | Set the hardware silent switch on, drink | Whatever happens is consistent and nothing else breaks. Record the actual behaviour: a Web Audio context on iOS may or may not sound depending on the session category, and the app must not depend on either answer |

### Haptics

| ID | Check | How | Pass when |
|---|---|---|---|
| D14 | Hidden where unsupported | Open the settings on iOS Safari | The haptics control is absent rather than shown and inert |
| D15 | Fires on a mood change (P2) | Let the meter fall across a band boundary, then drink back across it | A 180 ms buzz on the drop, a 30 ms tick on the improvement, and nothing on drinks that stay inside a band |
| D16 | Off in one tap | Turn haptics off, cross a boundary both ways | Nothing buzzes, and the setting survives a reload |
| D17 | Silent under reduced motion | Turn the system reduced-motion setting on, cross a boundary | No vibration |

### Motion and accessibility

| ID | Check | How | Pass when |
|---|---|---|---|
| D18 | Reduced motion off | System setting off | Idle animation, ambient life, gulls, wind and glitter particles all run |
| D19 | Reduced motion on | System setting on, reload | Idle motion, ambient life and glitter particles stop. The glitter palette and typeface stay. The night reward still reads, because the starfield lifts to full brightness rather than relying on the streak |
| D20 | Touch targets | Measure the drink button, the theme pill segments, the language buttons, the info button and the secret `*` | Every one is at least 44 px on its short side |
| D21 | Screen reader pass | VoiceOver on P1, TalkBack on P2 | Each control is named once and not twice, every icon-only button carries a localised name, the meter reports its value and its mood, and the theme pill behaves as a radiogroup with a single tab stop |
| D22 | Keyboard only (P3 to P5) | Tab through the whole page | Every control is reachable, focus is visible, the theme pill takes one tab stop with the arrow keys inside it, and the tooltips appear on focus as well as on hover |
| D23 | Contrast | Read the status text, the meter label and the stats in day, night and glitter | Legible in all three. Glitter is the one at risk, being pale on pale |

### Layout

| ID | Check | How | Pass when |
|---|---|---|---|
| D24 | Portrait phone | P1 and P2 at their default zoom | Nothing clips, nothing scrolls sideways, the scene keeps its proportions and the settings panel fits |
| D25 | Landscape phone | Rotate | The same, or a deliberate and acceptable degradation. Record which |
| D26 | Address bar drift | Scroll so the mobile address bar collapses, then expands | The scene neither jumps nor leaves a gap. The usual `100vh` trap |
| D27 | Large system text | Raise the system font size to its largest setting | The layout holds and no copy overflows its container |

### Themes, scene and rewards

| ID | Check | How | Pass when |
|---|---|---|---|
| D28 | Four theme values | Step through auto, day, night and glitter | Each renders, each survives a reload, and auto resolves against the clock |
| D29 | Sun and moon | Look at the sky at morning, midday, dusk and midnight | One east-to-west arc each, the sun peaking at 12:00, the moon rising after dusk and peaking at midnight, and neither visible in the wrong theme. B9 was exactly this |
| D30 | Daytime reward | Fill the meter to 100% in daylight | Warm gold stars for a few seconds, then the rainbow for as long as the meter reads 95% or above |
| D31 | Night reward | Fill the meter after dark | A shooting star every 8 to 17 seconds and the starfield at full brightness |
| D32 | Glitter pointer trail | Open glitter mode on a phone and on a desktop | The trail runs with a mouse. On touch it says there is no pointer rather than failing silently |

### Copy, creatures and the easter egg

| ID | Check | How | Pass when |
|---|---|---|---|
| D33 | Three languages | Switch between German, Traditional Chinese and English | Every string follows, the glitter strings included, and the relative times read naturally in each |
| D34 | CJK typeface | Read the Traditional Chinese copy on each platform | The CJK face resolves rather than falling back to a substitute with the wrong metrics |
| D35 | Three creatures | Pick the unicorn and the panda in the settings, then find the `*` | The dinosaur appears through the switch only, pressing it again returns to the settings choice, and the title, speech, favicon and voice all follow the creature |
| D36 | Renaming | Rename a creature, then clear the field | The name flows into the title, the speech, the stats and every ARIA label, and clearing restores the built-in one |
| D37 | Easter egg | Five drink taps within five seconds | The blubber plays, and it does not fire on ordinary drinking |
| D38 | Smoke page in a browser | Open `smoke-test.html` from the served origin on each platform | Every check passes there too, which is what covers the platforms where node cannot run |

## Recording a run

Copy this block per platform, fill it in, keep the completed blocks under
[Runs](#runs). A run counts as a pass only when every `R` platform is filled in
with no failure left open.

```
Platform : P2, Android Chrome 1xx, Pixel 7a, Android 15
Tester   : name
Date     : YYYY-MM-DD
App      : v0.31, served from <origin>

D1  pass
D2  pass
...
D14 n/a   (haptics exist here, D14 is a P1 check)

Failures : one line each, with the README defect ID it was filed as
Verdict  : pass | pass with defects | fail
```

A failure becomes a numbered defect in the README under Known issues, using the
next free ID in the shared series, and this file records which one it became.

## Runs

None yet. `v0.31` was verified in one desktop browser only, so the matrix is
written but unrun, which is what keeps B2 open.
