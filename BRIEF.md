# Ina Water Friend — Complete Build Brief for Claude Code

## Version log

### v0.6 — 2026-08-19
- Consolidated all concept, UX, architecture, timer, audio, animation, and maintainability guidance into one complete brief.
- Added requirement for a dedicated version log/change log in the brief.
- Added top-level config object requirement for easy character renaming.
- Added happy-state rainbow reward idea as a decorative state-specific effect.
- Added idle animation requirement across hydration states to make the character feel more alive.

### v0.5 — 2026-08-19
- Added explicit idle animation guidance with different behavior for hydrated, okay, thirsty, and dehydrated states.
- Added reduced-motion requirement for idle loops and decorative animation.

### v0.4 — 2026-08-19
- Added happy-state rainbow visual reward concept.
- Clarified that the rainbow should be decorative, subtle, and tied only to the happiest state.
- Added note that the character name is still a working title and should be configurable.

### v0.3 — 2026-08-19
- Added procedural sound effect requirements.
- Added five-taps-in-five-seconds blubber/gurgle easter egg.
- Clarified Web Audio unlock behavior for mobile browsers.

### v0.2 — 2026-08-19
- Added modular single-file architecture guidance.
- Added localStorage persistence and timestamp-driven hydration decay requirements.
- Added mobile browser background-timer behavior notes.

### v0.1 — 2026-08-19
- Defined the core concept: a cute single-screen hydration companion app with a unicorn character and thirst meter.
- Established the static hosting target: GitHub Pages or similar no-server hosting.

## Purpose

This document is the full implementation brief for Claude Code to build a small static hydration companion app as a single HTML file. The intended hosting model is GitHub Pages or any similar static host, which works well for simple HTML apps with no backend and client-side persistence via `localStorage`.[cite:13][cite:19]

The app is a cute, mobile-first browser companion centered on a unicorn character named **Ina** as a working title. The key inspiration is the emotional loop of Focus Friend, which is publicly described as a cozy, character-centered companion app, but the implementation here should remain much simpler and hydration-only.[cite:11][cite:12][cite:18]

## Product summary

Build a tiny one-screen hydration companion app that feels more like a handheld virtual pet than a productivity dashboard. The user logs drinking water, a thirst meter refills, the character visibly perks up, and the app responds with cute visual and sound feedback. Pixel-art or pixel-inspired presentation is preferred because it suits a playful habit interface and reads well on mobile screens.[cite:2][cite:8]

## Core product goals

- Make hydration logging feel cute, lightweight, and emotionally rewarding.
- Keep the MVP extremely simple and static-host friendly.
- Avoid backend infrastructure entirely.
- Make the app feel alive through character state, idle motion, and responsive feedback.
- Keep the code maintainable even though it is only one HTML file.

## Non-goals

The MVP should **not** become a full wellness dashboard, multi-screen mobile app, or account-based tracker.

Avoid adding:

- User accounts.
- Cloud sync.
- Social features.
- Complex statistics pages.
- Achievements or shop systems.
- Multiple routes or navigation-heavy architecture.

## Hard constraints

- Single `index.html` file only.
- Inline CSS and JavaScript.
- No server-side code.
- No framework required.
- Must run entirely in the browser.
- Must be mobile-first.
- Must persist state locally.
- Must survive browser suspension/closure through timestamp recalculation rather than a real background timer.[cite:19][cite:21][cite:27]

## Character naming configuration

The character name should be easy to change. It must not be hardcoded throughout the code.

### Requirement

Use a top-level config object for naming, such as:

```js
const Config = {
  character: {
    name: "Ina"
  },
  hydration: {
    max: 100,
    defaultDecayHours: 4,
    defaultRefillAmount: 25
  }
};
```

### Naming usage

Read the configured name into:

- The page title.
- Main heading.
- Speech bubble text where appropriate.
- `aria-label` values.
- Status/helper text that references the character.

This makes working-title changes easy during iteration.

## Core user loop

The basic loop should be:

1. Time passes.
2. Ina’s thirst meter drops.
3. Ina becomes more droopy and less vibrant.
4. The user taps “I drank water”.
5. The meter refills.
6. Ina perks up visually and may play a cute sound.

This follows the emotional companion pattern seen in publicly described cozy character apps while staying much smaller in scope.[cite:11][cite:12][cite:18]

## Required features

### Core interface

- One-screen hydration companion UI.
- Character scene with Ina centered.
- Thirst meter with visible percentage.
- Main drink button.
- Drinks-today stat.
- Last-drink relative time stat.
- Reset button.
- Compact settings area.
- Theme toggle.
- Sound toggle.

### Core logic

- Hydration decay over time.
- Refill on drink action.
- Daily count rollover.
- Persistence in `localStorage`.
- Timestamp-based recalculation after tab suspension or browser closure.[cite:19][cite:21][cite:27]

### Character states

Use exactly four main hydration states for the MVP:

- Hydrated
- Okay
- Thirsty
- Dehydrated

This keeps the logic and visual art manageable while still creating strong emotional feedback.[cite:2][cite:8]

### Settings

Include at least:

- Decay hours
- Refill amount percent
- Sound on/off
- Gurgle easter egg on/off
- Theme toggle

## Visual direction

The app should feel like a tiny browser pet or handheld toy, not a data tool. Pixel-art or pixel-inspired UI is preferred. For an MVP, CSS-based chunky shapes are acceptable before replacing them with custom sprites, because validating the emotional loop first is more important than perfect art in the first iteration.[cite:2][cite:8]

### Layout structure

Recommended structure:

- Top bar with title and toggles.
- Main scene card with background, Ina, and optional decorative effects.
- Meter block underneath the scene.
- Stats block.
- Action buttons.
- Compact settings section.
- Optional note or prototype info section.

This keeps the main interaction obvious and aligns with lightweight mobile habit UI patterns.[cite:1][cite:3]

## Mood and state design

### Hydrated

- Bright colors.
- Upright, happy posture.
- Sparkles visible.
- Rainbow may appear as a reward decoration.
- Speech tone is cheerful.

### Okay

- Calm and comfortable.
- Slightly less energetic.
- Reduced sparkle intensity.
- Gentle breathing or tail motion.

### Thirsty

- Mild droop.
- More muted saturation.
- Reduced idle energy.
- Speech asks for water gently.

### Dehydrated

- Very subdued.
- Stronger droop or lower posture.
- Almost no sparkle.
- Very slow idle movement.
- Sadder but still soft speech tone.

## Idle animation requirement

Idle animation must be part of the MVP to make the character feel alive. Subtle, looped motion is enough: gentle bobbing, breathing, blinking, tail swish, ear twitch, and sparkle twinkle can carry a lot of personality without making the interface noisy. Accessibility guidance for modern web motion strongly supports offering reduced or simplified motion when users request it.[cite:43][cite:45][cite:50]

### State-specific idle animation

| State | Idle behavior |
|---|---|
| Hydrated | Slightly bouncier bob, lively tail swish, brighter sparkles |
| Okay | Calm breathing, mild tail motion, occasional blink |
| Thirsty | Slower bob, weaker sparkle, visible droop |
| Dehydrated | Very slow breathing, minimal movement, almost no sparkle |

### Implementation guidance

- Base animation system should be reusable.
- State classes should tune amplitude, speed, opacity, and posture.
- Prefer `transform` and `opacity` changes over layout-affecting animation.
- Keep movement subtle because this is a persistent companion UI on mobile.[cite:45][cite:50]

### Reduced motion

Idle and decorative animation must respect `prefers-reduced-motion`. This media feature is designed to detect system-level requests to minimize non-essential motion and is broadly supported in modern browsers.[cite:43][cite:55][cite:57]

Example fallback:

```css
@media (prefers-reduced-motion: reduce) {
  .ina,
  .ina * {
    animation: none !important;
    transition: none !important;
  }
}
```

## Happy-state rainbow

A fully happy or fully hydrated Ina may show a rainbow as a decorative reward effect. This is a good emotional cue because it marks the happiest state clearly without changing the core mechanics. Decorative motion should still be minimized or removed for reduced-motion users.[cite:43][cite:45][cite:62]

### Rainbow behavior

- Only show rainbow in the happiest state, or briefly when entering it.
- Keep the rainbow subtle and soft.
- Use it as a reward detail, not as always-on background decoration.
- Remove or simplify it under reduced-motion settings.[cite:60][cite:61][cite:62]

## Persistence model

Use `localStorage` with a single serialized state object. This is a common and appropriate no-server persistence model for static HTML apps.[cite:16][cite:19]

### Suggested state shape

```js
{
  hydration: 100,
  lastUpdateAt: 1724100000000,
  lastDrinkAt: 1724100000000,
  todayCount: 0,
  dayKey: "2026-08-19",
  decayHours: 4,
  refillAmount: 25,
  soundOn: true,
  easterEggOn: true,
  theme: "day",
  tapHistory: []
}
```

## Timer and background behavior

### Important rule

Do **not** rely on `setInterval()` as the source of truth for hydration decay. Browsers commonly throttle or pause timers in inactive tabs, and mobile browsers may suspend or kill pages entirely. Page lifecycle behavior on mobile also makes unload-style assumptions unreliable.[cite:21][cite:27][cite:28]

### Correct implementation

Use timestamps:

- Store `lastUpdateAt`.
- When the page becomes visible, calculate elapsed time from `Date.now()`.
- Convert elapsed time to hydration loss.
- Update `lastUpdateAt`.
- Re-render and persist state.[cite:21][cite:27][cite:28]

### Visible refresh

A light interval may still be used while the page is visible to keep relative time labels fresh, but that interval is only for UI refresh. It must not be treated as the true state engine.[cite:21][cite:28]

### Lifecycle hooks

Use:

- `visibilitychange`
- `pagehide`

The Page Visibility API is the more reliable lifecycle signal for modern mobile scenarios than assuming `beforeunload` or similar events will always fire.[cite:22][cite:25][cite:27]

## Sound design

The app should use procedural sound effects generated with the Web Audio API rather than requiring external audio files. Web Audio is well suited to lightweight in-browser synthesized sound design.[cite:31][cite:39]

### Required sounds

- Happy “yippie” sound.
- Sad “oh” sound.
- Brief cute drinking/sipping sounds.
- Blubber/gurgle easter egg sound.

### Mobile audio constraints

Mobile browsers generally require a user gesture before audio can begin. The audio context should therefore be created or resumed on the first tap or button interaction, not on page load.[cite:32][cite:36][cite:40]

### Audio behavior guidance

- Drink button normally plays sip sounds.
- If a drink action improves Ina into a better mood band, optionally play the happy yippie.
- If Ina becomes dehydrated after time away, prefer visual feedback first; avoid aggressive autoplay sound on load.
- Keep sounds cute and brief, never harsh or loud.[cite:33][cite:36][cite:39]

## Rapid-tap easter egg

Add a hidden event: if the player taps the drink action five times within five seconds, trigger a cute blubber/gurgle sound.

### Behavior

- Track recent drink tap timestamps.
- Keep only taps inside the rolling five-second window.
- Trigger when five taps are present.
- Clear tap history after trigger.
- Optionally show playful speech text such as “blub blub blub! heehee 💦”.

### Example logic

```js
state.tapHistory = state.tapHistory.filter(ts => now - ts <= 5000);
state.tapHistory.push(now);
const burstTriggered = state.tapHistory.length >= 5;
if (burstTriggered) state.tapHistory = [];
```

## Maintainable code structure

Even though the deliverable is one file, the code must be organized modularly. This will make future edits easier and reduce prompt drift during iterative development.[cite:31][cite:39]

### Required internal structure

```js
/* ========= CONFIG ========= */
/* ========= STORAGE ========= */
/* ========= TIME ========= */
/* ========= AUDIO ========= */
/* ========= STATE ========= */
/* ========= UI ========= */
/* ========= EVENTS ========= */
/* ========= INIT ========= */
```

### Module responsibilities

| Module | Responsibility |
|---|---|
| Config | Constants, defaults, storage key, character name |
| Storage | Save/load JSON state |
| Time | Relative time helpers, day key logic |
| Audio | Context setup, unlock logic, procedural sounds |
| State | Decay, refill, thresholds, toggles, tap history |
| UI | DOM references, rendering, text, scene state, status updates |
| Events | Input handlers, visibility handlers, refresh interval |
| Init | Startup sequence |

## Suggested thresholds

Use these hydration bands:

- `>= 75`: hydrated
- `>= 45`: okay
- `>= 20`: thirsty
- `< 20`: dehydrated

These bands give clear readable transitions without overcomplicating the mood model.

## Suggested layout and styling constraints

- Max width around 420–430 px for comfortable mobile framing.
- Large primary drink button.
- Minimum touch targets around 44x44 px.
- Soft pastel palette with strong readable contrast.
- Rounded, toy-like panels.
- Pixel-art or pixel-inspired details.
- Fast first paint and minimal complexity.[cite:1][cite:3]

## UX writing guidance

### Tone

Use kind, playful, non-judgmental copy.

Good examples:

- “I feel sparkly and happy ✨”
- “A little sip later would be lovely 💧”
- “I’m a bit droopy... water soon?”
- “oh... I really need some water”

Avoid:

- Shame-based copy.
- Alarmist health copy.
- Productivity-speak.
- Dense explanatory text.

## Interaction rules

### Drink action

On tap:

1. Unlock audio if needed.
2. Sync elapsed-time decay.
3. Increase hydration by refill amount.
4. Update last drink timestamp.
5. Increment today count.
6. Process rapid-tap easter egg.
7. Re-render UI.
8. Play sip or gurgle event.
9. Optionally play yippie on a mood improvement.

### Reset action

- Refill hydration to 100.
- Reset today count.
- Reset tap history.
- Update timestamps.
- Re-render UI.

## Accessibility requirements

- Respect `prefers-reduced-motion` for idle and decorative animations.[cite:43][cite:45]
- Avoid autoplay sound on load due to user comfort and mobile browser policy.[cite:32][cite:36]
- Keep controls finger-friendly.
- Use labels and `aria-label`s where needed.
- Preserve readable contrast and clear status communication.

## Suggested implementation order

1. Build the base one-screen HTML structure.
2. Add config-driven character naming.
3. Implement modular JS sections.
4. Add storage and timestamp decay.
5. Add render logic and state classes.
6. Add sound engine and mobile-safe unlock.
7. Add idle animations and reduced-motion fallback.
8. Add happy rainbow reward.
9. Add rapid-tap gurgle easter egg.
10. Polish UI and copy.

## Acceptance criteria for Claude Code

The implementation is successful when all of the following are true:

- The app is a single `index.html` file.
- It runs with no backend.
- It is hostable directly on GitHub Pages.[cite:13][cite:19]
- Hydration decays correctly after closing and reopening the browser because timestamps are recalculated.[cite:21][cite:27]
- The character has four clearly readable mood states.
- Idle animation differs by state.
- Reduced-motion users are respected.[cite:43][cite:45]
- The character name can be changed from a config object.
- Sound effects work after user interaction.
- The five-taps easter egg works.
- The happy state can display a rainbow.
- The code is clearly separated into modular sections.
- Settings and state persist locally.

## Stretch goals

Only after the MVP is working:

- Replace CSS character shapes with real pixel sprite states.
- Add tiny haptics on supported devices.
- Add a brief “while you were away” return note.
- Improve environmental scene changes between moods.
- Add optional reminder experiments.

## Final instruction to Claude Code

Build a charming, mobile-first, single-file static web app that feels like a tiny hydration companion pet rather than a tracker dashboard. Keep the code modular, the interaction loop emotionally rewarding, and the implementation robust for mobile browser suspension by relying on timestamps and local persistence instead of pretending background timers exist. Use sound, idle animation, and a happy-state rainbow as delight features, while respecting reduced-motion and mobile browser audio constraints.[cite:21][cite:27][cite:31][cite:43]
