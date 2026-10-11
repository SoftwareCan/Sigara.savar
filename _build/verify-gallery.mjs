// Deterministic behavior checks for the dependency-free hero carousel.
import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const source = fs.readFileSync(new URL('../assets/js/gallery.js', import.meta.url), 'utf8');
function target(extra = {}) {
  const listeners = {};
  const attrs = new Map();
  const classes = new Set();
  return {
    ...extra, hidden: false,
    addEventListener(type, fn) { (listeners[type] ||= []).push(fn); },
    emit(type) { for (const fn of listeners[type] || []) fn(); },
    setAttribute(key, value) { attrs.set(key, value); },
    removeAttribute(key) { attrs.delete(key); },
    toggleAttribute(key, force) { if (force) attrs.set(key, ''); else attrs.delete(key); },
    getAttribute(key) { return attrs.get(key); },
    classList: { add(key) { classes.add(key); }, remove(key) { classes.delete(key); }, contains(key) { return classes.has(key); } },
    getBoundingClientRect() { return {}; },
  };
}
function setup(reduced = false) {
  const selectors = new Map();
  const select = (name) => selectors.get(name) || selectors.set(name, target()).get(name);
  const scenes = Array.from({ length: 5 }, () => {
    const images = Array.from({ length: 2 }, () => ({ loading: 'lazy', decode: () => Promise.resolve() }));
    const scene = target({ querySelectorAll: () => images, images });
    scene.hidden = true;
    return scene;
  });
  scenes[0].hidden = false;
  scenes[0].classList.add('is-active');
  const gallery = target({ dataset: { labels: JSON.stringify({ pause: 'Pause', play: 'Play', announcement: '{current}/{total}' }) }, querySelector: select, querySelectorAll: () => scenes });
  select('[data-gallery-toggle]').querySelector = select;
  const document = target({ querySelector: () => gallery });
  const motion = target({ matches: reduced });
  const timers = new Map();
  let timerId = 0;
  let intersection;
  vm.runInNewContext(source, {
    document, matchMedia: () => motion,
    window: { IntersectionObserver: true },
    IntersectionObserver: class { constructor(fn) { intersection = fn; } observe() {} },
    setTimeout(fn, ms) { timers.set(++timerId, { fn, ms }); return timerId; },
    clearTimeout(id) { timers.delete(id); },
  });
  const settle = async () => { for (let i = 0; i < 8; i += 1) await Promise.resolve(); };
  const run = async (ms) => {
    for (const [id, timer] of [...timers]) if (timer.ms === ms) { timers.delete(id); timer.fn(); }
    await settle();
  };
  return { scenes, gallery, document, select, motion, intersection: (visible) => intersection([{ isIntersecting: visible }]), run, settle, rotating: () => [...timers.values()].some((t) => t.ms === 4000) };
}

const normal = setup();
assert(normal.rotating());
await normal.run(4000);
assert(normal.scenes[1].classList.contains('is-active'));
await normal.run(950);
assert(normal.scenes[0].hidden);
normal.intersection(false);
assert(!normal.rotating());
normal.intersection(true);
assert(normal.rotating());
normal.document.hidden = true;
normal.document.emit('visibilitychange');
assert(!normal.rotating());
normal.document.hidden = false;
normal.document.emit('visibilitychange');
assert(normal.rotating());
normal.motion.matches = true;
normal.motion.emit('change');
assert(!normal.rotating());
normal.motion.matches = false;
normal.motion.emit('change');
assert(normal.rotating());
normal.scenes[2].images[0].decode = () => Promise.reject(new Error('Unavailable image'));
await normal.run(4000);
assert(normal.scenes[1].classList.contains('is-active'), 'Image failure must preserve current scene');
assert(normal.rotating(), 'A failed image retries on the next interval');
const reduced = setup(true);
assert(!reduced.rotating());
const loop = setup();
for (let i = 0; i < 5; i++) { await loop.run(4000); await loop.run(950); }
assert(loop.scenes[0].classList.contains('is-active'), 'Loop wraps to the first scene');
const pending = setup();
let decode;
pending.scenes[1].images[0].decode = () => new Promise((resolve) => { decode = resolve; });
await pending.run(4000);
pending.intersection(false);
decode();
await pending.settle();
assert(pending.scenes[0].classList.contains('is-active'), 'An offscreen gallery must not swap after a late decode');
assert(!pending.rotating());
const template = fs.readFileSync(new URL('templates/gallery.mjs', import.meta.url), 'utf8');
assert(!template.includes('<button'), 'No carousel controls should be rendered');
console.log('Gallery checks passed: 4-second autoplay, loop, reduced motion, visibility, failed images and pending-decode cancellation; no controls.');
