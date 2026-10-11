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
  return { scenes, gallery, document, select, motion, intersection: (visible) => intersection([{ isIntersecting: visible }]), run, settle, rotating: () => [...timers.values()].some((t) => t.ms === 6500) };
}

const normal = setup();
assert(normal.rotating());
await normal.run(6500);
assert(normal.scenes[1].classList.contains('is-active'));
await normal.run(950);
assert(normal.scenes[0].hidden);
normal.gallery.emit('mouseenter');
assert(!normal.rotating());
normal.gallery.emit('mouseleave');
assert(normal.rotating());
normal.gallery.emit('focusin');
normal.gallery.emit('mouseleave');
assert(!normal.rotating(), 'Keyboard focus must stop rotation until explicitly started');
normal.select('[data-gallery-toggle]').emit('click');
assert(normal.rotating());
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
normal.select('[data-gallery-next]').emit('click');
await normal.settle();
assert(!normal.rotating());
assert.equal(normal.select('[data-gallery-status]').textContent, '3/5');
normal.scenes[3].images[0].decode = () => Promise.reject(new Error('Unavailable image'));
normal.select('[data-gallery-next]').emit('click');
await normal.settle();
assert(normal.scenes[2].classList.contains('is-active'), 'A failed image must keep the current scene');

const pointer = setup();
pointer.select('[data-gallery-toggle]').emit('pointerdown');
pointer.gallery.emit('focusin');
pointer.select('[data-gallery-toggle]').emit('click');
assert(!pointer.rotating(), 'Clicking Pause must not restart after the focus event');
assert.equal(pointer.select('[data-gallery-toggle]').getAttribute('aria-label'), 'Play');
assert.equal(pointer.select('[data-pause-icon]').getAttribute('hidden'), '');

const reduced = setup(true);
assert(!reduced.rotating());
reduced.select('[data-gallery-next]').emit('click');
await reduced.settle();
await reduced.run(0);
assert(reduced.scenes[1].classList.contains('is-active'));
assert(reduced.scenes[0].hidden);
assert(!reduced.rotating());

console.log('Gallery checks passed: autoplay, manual navigation, hover/focus, reduced motion, visibility, image failure and pointer pause.');
