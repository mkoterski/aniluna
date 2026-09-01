/* ============================================================================
   smoke-checks.mjs - Aniluna smoke checks - v0.10
   ============================================================================
   Purpose    : The checks themselves, with no runner attached, so the command
                line and the browser page share one copy and cannot drift.
   Status     : DEVELOPMENT
   Author     : Matthias Koterski / Data & IT
   Date       : 2026-08-24
   Context    : Imported by smoke-test.mjs (node) and smoke-test.html (browser).
   Versioning : v0.x = development. Tracks itself, not the app.
   ----------------------------------------------------------------------------
   Nothing here touches the filesystem, the network or the page: the caller
   hands over the text of index.html and, if it has it, of README.md. That is
   what lets the same file run under node and on GitHub Pages.

   WHY THIS EXISTS
     v0.23 was pushed with Ambient.KINDS.star deleted by a bad edit. The file
     parsed, so the only check being run passed, and the app was dead on
     arrival: rateFor("star") threw, nudgeStar is called from render and
     applyTheme, and init calls both. A missing property is a runtime error,
     not a syntax error, so a parse can never catch it. B5 in the README was
     raised to P1 because of it.

   WHAT IT DOES NOT DO
     It does not render. Asserting on a real layout needs a real browser
     driving a real page, which is B2's job.
   ========================================================================== */

export const VERSION = "v0.11";

/* ==========================================================================
   A stub page, just enough for the modules to define themselves. Shared by
   both runners on purpose: in a browser the real document must not be handed
   over, or the app would attach itself to the test page and init would throw
   on the first element it cannot find.
   ========================================================================== */
function makeSandbox(seed) {
  const noop = () => {};
  const el = () => ({
    dataset: {},
    style: { setProperty: noop, removeProperty: noop },
    classList: { add: noop, remove: noop, contains: () => false, toggle: noop },
    setAttribute: noop, removeAttribute: noop, getAttribute: () => null,
    appendChild: noop, remove: noop, addEventListener: noop,
    querySelectorAll: () => [], querySelector: () => null,
    getBoundingClientRect: () => ({ left: 0, top: 0, width: 100, height: 100 }),
    getContext: () => ({
      setTransform: noop, clearRect: noop, drawImage: noop, save: noop,
      restore: noop, translate: noop, rotate: noop, fillText: noop,
      font: "", textAlign: "", textBaseline: ""
    }),
    clientHeight: 390, textContent: "", innerHTML: "", hidden: false,
    checked: false, value: "", maxLength: 0, placeholder: ""
  });
  const store = new Map(Object.entries(seed || {}));
  const sandbox = {
    console: { log: noop, warn: noop },
    performance: { now: () => 0 },
    requestAnimationFrame: noop,
    setTimeout: noop, clearTimeout: noop, setInterval: noop, clearInterval: noop,
    localStorage: {
      getItem: (k) => (store.has(k) ? store.get(k) : null),
      setItem: (k, v) => store.set(k, String(v)),
      removeItem: (k) => store.delete(k)
    },
    navigator: { vibrate: noop, userAgent: "smoke", maxTouchPoints: 0 },
    window: {
      matchMedia: () => ({ matches: false, addEventListener: noop }),
      addEventListener: noop, devicePixelRatio: 1, innerWidth: 424,
      innerHeight: 700, confirm: () => true
    },
    document: {
      addEventListener: noop, documentElement: el(), body: el(),
      getElementById: () => el(), querySelector: () => el(),
      querySelectorAll: () => [], createElement: () => el(),
      visibilityState: "visible", hidden: false, title: ""
    }
  };
  sandbox.window.localStorage = sandbox.localStorage;
  return sandbox;
}

/* ==========================================================================
   THE CHECKS
   ========================================================================== */
export function runSmokeChecks({ source, changelog }) {
  const src = String(source).replace(/\r/g, "");
  const results = [];
  let app = null;

  const check = (name, fn) => {
    try {
      results.push({ ok: true, name, detail: fn() || "" });
    } catch (err) {
      results.push({ ok: false, name, detail: err.message });
    }
  };
  /* Needs the evaluated app. Reported as skipped rather than as a TypeError,
     so one broken evaluation does not bury its own message under a dozen
     confusing ones. */
  const behaviour = (name, fn) => check(name, () => {
    if (!app) throw new Error("skipped, the script did not evaluate");
    return fn();
  });
  const assert = (cond, message) => { if (!cond) throw new Error(message); };
  const eq = (actual, expected, what) => assert(
    actual === expected,
    `${what}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`
  );

  /* ---------------- static invariants ---------------- */

  check("the inline script is present and parses", () => {
    const m = src.match(/<script>([\s\S]*)<\/script>/);
    assert(m, "no inline script found");
    new Function(m[1]);
    return `${m[1].split("\n").length} lines`;
  });

  check("the version agrees in the header and the config", () => {
    const header = src.match(/index\.html - Aniluna Aqua Buddy - (v0\.\d+)/);
    const config = src.match(/version: "(v0\.\d+)"/);
    assert(header, "no version in the header block");
    assert(config, "no version in Config.app");
    eq(config[1], header[1], "Config.app.version against the header");
    return header[1];
  });

  check("the changelog's newest entry matches the code (NXW-VER-6)", () => {
    if (!changelog) return "skipped, no CHANGELOG.md supplied";
    const code = src.match(/version: "(v0\.\d+)"/)[1];
    const newest = String(changelog).match(/^(v0\.\d+)\s+\d{4}-\d{2}-\d{2}/m);
    assert(newest, "no changelog entry found in README.md");
    eq(newest[1], code, "newest changelog entry against Config.app.version");
    return `${code} in both`;
  });

  check("no em dashes anywhere (NXW-NAM-6)", () => {
    eq((src.match(/—/g) || []).length, 0, "em dash count");
    return "none";
  });

  const speciesKeys = () =>
    [...src.matchAll(/^    ([a-z]+): \{\n      name: "/gm)].map((m) => m[1]);

  check("every species has a sprite that declares itself", () => {
    const keys = speciesKeys();
    assert(keys.length >= 2, `expected at least two species, found ${keys.length}`);
    for (const key of keys) {
      assert(src.includes(`data-species="${key}"`),
        `species ${key} has no sprite carrying data-species="${key}"`);
    }
    return keys.join(", ");
  });

  check("every ambient rate has a kind to spawn, and the reverse", () => {
    const rates = [...src.matchAll(/^    ([a-z]+): \{ (?:day|any):/gm)].map((m) => m[1]);
    const kindsBlock = src.slice(src.indexOf("KINDS: {"), src.indexOf("  enabled() {"));
    const kinds = [...kindsBlock.matchAll(/^    ([a-z]+): \{$/gm)].map((m) => m[1]);
    assert(rates.length > 0, "no Config.ambient rates found");
    for (const r of rates) {
      assert(kinds.includes(r),
        `Config.ambient.${r} has no Ambient.KINDS entry. This is the v0.23 bug.`);
    }
    for (const k of kinds) {
      assert(rates.includes(k), `Ambient.KINDS.${k} has no rate in Config.ambient`);
    }
    return `${kinds.join(", ")} on both sides`;
  });

  const stringsBlock = () =>
    src.slice(src.indexOf("const Strings = {"), src.indexOf("/* ========= STORAGE"));

  check("every locale carries the same keys", () => {
    const block = stringsBlock();
    const locales = [...block.matchAll(/^  ([a-z]{2}): \{$/gm)].map((m) => m[1]);
    assert(locales.length >= 2, `expected at least two locales, found ${locales.length}`);
    const keysFor = (loc) => {
      const start = block.indexOf(`  ${loc}: {`);
      const end = block.indexOf("\n  },", start);
      return new Set([...block.slice(start, end).matchAll(/^    ([a-zA-Z]+):/gm)].map((m) => m[1]));
    };
    const first = keysFor(locales[0]);
    for (const loc of locales.slice(1)) {
      const mine = keysFor(loc);
      const missing = [...first].filter((k) => !mine.has(k));
      const extra = [...mine].filter((k) => !first.has(k));
      assert(!missing.length, `${loc} is missing ${missing.join(", ")}`);
      assert(!extra.length, `${loc} has ${extra.join(", ")} which ${locales[0]} does not`);
    }
    return `${locales.join(", ")}, ${first.size} keys each`;
  });

  check("every species has speech in every locale", () => {
    const keys = speciesKeys();
    const block = stringsBlock();
    const locales = [...block.matchAll(/^  ([a-z]{2}): \{$/gm)].map((m) => m[1]);
    for (const loc of locales) {
      const start = block.indexOf(`  ${loc}: {`);
      const chunk = block.slice(start, block.indexOf("\n  },", start));
      const speech = chunk.slice(chunk.indexOf("speech: {"));
      for (const sp of keys) {
        assert(speech.includes(`      ${sp}: {`), `${loc} has no speech for ${sp}`);
        assert(chunk.includes(`${sp}:`), `${loc} has no speciesWord for ${sp}`);
      }
    }
    return `${keys.length} species x ${locales.length} locales`;
  });

  /* ---------------- the pure logic ---------------- */

  /* Boot the app against a sandbox and hand back both, so a check can seed
     localStorage before startup reads it. */
  const boot = (seed) => {
    const sandbox = makeSandbox(seed);
    const names = Object.keys(sandbox);
    const exposed = ["Config", "Strings", "Storage", "Time", "Sky", "State",
                     "Ambient", "Haptics", "BANDS", "PICKABLE", "SECRET_SPECIES", "UI"];
    const code = src.match(/<script>([\s\S]*)<\/script>/)[1];
    const factory = new Function(...names, `${code}\n;return {${exposed.join(", ")}};`);
    return { app: factory(...names.map((n) => sandbox[n])), sandbox };
  };

  check("the modules define themselves without a page", () => {
    const booted = boot();
    app = booted.app;
    assert(app.Config && app.State && app.Ambient, "modules missing from the evaluated script");
    return `${Object.keys(app).length} modules reached`;
  });

  behaviour("mood bands land on the displayed percent", () => {
    const t = app.Config.thresholds;
    const cases = [[100, "hydrated"], [t.hydrated, "hydrated"], [74.6, "hydrated"],
                   [74.4, "okay"], [t.okay, "okay"], [44.4, "thirsty"],
                   [t.thirsty, "thirsty"], [19.4, "dehydrated"], [0, "dehydrated"]];
    for (const [value, want] of cases) eq(app.State.band(value), want, `band(${value})`);
    return `${cases.length} boundaries, 74.6 rounds up into hydrated`;
  });

  behaviour("slider values snap onto their step", () => {
    const { decayHours, refillAmount } = app.Config.limits;
    eq(app.State.clampStep(1.7, 2, decayHours), 1.5, "1.7 hours");
    eq(app.State.clampStep(9, 2, decayHours), decayHours.max, "9 hours clamps to max");
    eq(app.State.clampStep(0, 2, decayHours), decayHours.min, "0 clamps to min");
    eq(app.State.clampStep("", 2, decayHours), 2, "empty falls back");
    eq(app.State.clampStep(null, 2, decayHours), 2, "null falls back, not zero");
    eq(app.State.clampStep(63, 25, refillAmount), 75, "63 percent");
    return "half hours and quarter refills";
  });

  behaviour("names are trimmed, capped and never cut mid emoji", () => {
    eq(app.State.cleanName("   Frau   Blubb   "), "Frau Blubb", "padding and inner space");
    eq(app.State.cleanName("X".repeat(40)).length, app.Config.naming.maxLength, "cap");
    eq(app.State.cleanName(42), "", "a number is not a name");
    eq(app.State.cleanName("   "), "", "blank");
    const emoji = app.State.cleanName("X".repeat(23) + "\u{1FAE7}");
    assert(emoji.endsWith("\u{1FAE7}"), "the trailing emoji was cut in half");
    return "cap by code point holds";
  });

  behaviour("a junk save falls back instead of half loading", () => {
    const real = app.Storage.read;
    app.Storage.read = () => ({
      hydration: null, decayHours: "abc", refillAmount: -5, themeMode: "sideways",
      species: "griffin", names: { unicorn: 42, griffin: "ghost" }, locale: "xx",
      tapHistory: "nope", pickedSpecies: app.SECRET_SPECIES
    });
    app.State.data = null;
    app.State.load();
    const d = app.State.data;
    eq(d.hydration, app.Config.hydration.initial, "null hydration");
    eq(d.decayHours, app.Config.hydration.defaultDecayHours, "junk decay");
    eq(d.themeMode, "auto", "unknown theme mode");
    eq(d.species, app.Config.defaultSpecies, "unknown species");
    eq(JSON.stringify(d.names), "{}", "junk names");
    eq(d.locale, app.Config.defaultLocale, "unknown locale");
    eq(JSON.stringify(d.tapHistory), "[]", "junk tap history");
    assert(app.PICKABLE.includes(d.pickedSpecies),
      "pickedSpecies accepted a creature the settings cannot offer");
    app.Storage.read = real;
    return "every field guarded";
  });

  /* init() is wired to DOMContentLoaded, which the stub page never fires, so
     these two drive the adoption in the order init does: migrate, then load.
     That is the path itself rather than a re-implementation of it. */
  behaviour("a save under the legacy key is adopted, once", () => {
    const key = app.Config.legacyKeys[0];
    assert(typeof key === "string" && key.length, "no legacy key to test");
    const saved = JSON.stringify({ hydration: 42, todayCount: 3, decayHours: 1.5 });
    const { app: fresh, sandbox } = boot({ [key]: saved });

    eq(fresh.Storage.migrate(), key, "migrate names the key it adopted from");
    fresh.State.load();
    eq(sandbox.localStorage.getItem(key), null, "the legacy entry is cleared");
    const now = sandbox.localStorage.getItem(fresh.Config.storageKey);
    assert(now !== null, "nothing was written to the current key");
    eq(JSON.parse(now).hydration, 42, "the hydration came across");
    eq(fresh.State.data.todayCount, 3, "the loaded state carries the old count");
    eq(fresh.State.data.decayHours, 1.5, "and the old setting");
    /* Adoption is one-shot: a second call has nothing left to find. */
    eq(fresh.Storage.migrate(), null, "migrate is a no-op the second time");
    return `${key} adopted into ${fresh.Config.storageKey}`;
  });

  behaviour("a legacy save never overwrites the current one", () => {
    const key = app.Config.legacyKeys[0];
    const current = JSON.stringify({ hydration: 90, todayCount: 9 });
    const stale = JSON.stringify({ hydration: 10, todayCount: 1 });
    const { app: fresh, sandbox } = boot({
      [app.Config.storageKey]: current, [key]: stale
    });
    eq(fresh.Storage.migrate(), null, "migrate declines when the current key is populated");
    eq(JSON.parse(sandbox.localStorage.getItem(fresh.Config.storageKey)).todayCount, 9,
       "the current save survived");
    eq(sandbox.localStorage.getItem(key), stale, "and the legacy entry was left alone");
    return "migrate returns before the loop when the current key is populated";
  });

  behaviour("the day rollover resets today's count", () => {
    app.State.data = app.State.defaults();
    app.State.data.todayCount = 7;
    app.State.data.dayKey = "1999-01-01";
    app.State.rollDay(Date.now());
    eq(app.State.data.todayCount, 0, "count after a new day");
    eq(app.State.data.dayKey, app.Time.dayKey(Date.now()), "day key");
    return "a stale day key clears the count";
  });

  behaviour("the sun and the moon sit on their stated hours", () => {
    const { sun, moon } = app.Config.sky;
    eq(app.Sky.position(sun, sun.peak).progress, 0.5, "the sun at its peak hour");
    assert(app.Sky.position(sun, 20) === null, "the sun is still up at 20:00");
    assert(app.Sky.position(moon, 3) !== null,
      "the moon is absent at 03:00, so the wrap past midnight is broken");
    assert(app.Sky.position(moon, 12) === null, "the moon is up at noon");
    return `sun peaks at ${sun.peak}, moon wraps past midnight`;
  });

  behaviour("the night reward is gated on the sky, not the clock", () => {
    const star = app.Ambient.KINDS.star;
    assert(star, "there is no star kind at all. This is the v0.23 bug.");
    assert(typeof star.when === "function", "the star has no when() gate");
    app.UI.isRadiant = () => true;
    app.UI.effectiveTheme = () => "night";
    assert(app.Ambient.rateFor("star"), "no rate while radiant at night");
    app.UI.effectiveTheme = () => "day";
    assert(!app.Ambient.rateFor("star"), "the shooting star is allowed in daylight");
    app.UI.isRadiant = () => false;
    app.UI.effectiveTheme = () => "night";
    assert(!app.Ambient.rateFor("star"), "the shooting star is allowed below the reward threshold");
    return "night and radiant, both required";
  });

  behaviour("the secret creature is out of the picker but still reachable", () => {
    assert(app.SECRET_SPECIES, "no species is marked secret");
    assert(!app.PICKABLE.includes(app.SECRET_SPECIES),
      `${app.SECRET_SPECIES} is offered in the settings and is meant to be secret`);
    app.State.data = app.State.defaults();
    app.State.pickSpecies(app.PICKABLE[app.PICKABLE.length - 1]);
    const picked = app.State.data.species;
    eq(app.State.toggleSecret(), app.SECRET_SPECIES, "the switch reveals the secret creature");
    eq(app.State.toggleSecret(), picked, "the switch returns to what the settings picked");
    return `${app.PICKABLE.join(", ")} pickable, ${app.SECRET_SPECIES} hidden`;
  });

  behaviour("haptics stay quiet when they should", () => {
    const calls = [];
    const h = app.Haptics;
    h.enabled = true;
    h.available = () => true;
    h.reducedMotion = () => false;
    /* The sandbox navigator is not reachable from here, so the one place that
       touches the API is rebound and the guards are exercised as written. */
    const original = h.buzz;
    h.buzz = function (pattern) {
      if (this.suppressNext) { this.suppressNext = false; return; }
      if (!this.enabled || !this.available() || this.reducedMotion()) return;
      calls.push(JSON.stringify(pattern));
    };
    h.band(true);
    eq(calls.at(-1), JSON.stringify(app.Config.haptics.better), "improving");
    h.band(false);
    eq(calls.at(-1), JSON.stringify(app.Config.haptics.worse), "dropping");
    const before = calls.length;
    h.suppressNext = true;
    h.band(false);
    eq(calls.length, before, "a suppressed buzz still fired");
    assert(h.suppressNext === false, "the suppression was not consumed");
    h.reducedMotion = () => true;
    h.band(true);
    eq(calls.length, before, "reduced motion did not silence it");
    h.buzz = original;
    return "two signals, suppression consumed once, reduced motion wins";
  });

  const failed = results.filter((r) => !r.ok).length;
  return { results, failed, passed: results.length - failed };
}
