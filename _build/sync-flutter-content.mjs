#!/usr/bin/env node
// Reads the Sigara Savar Flutter app's content (Dart const lists + ARB strings)
// and writes plain JSON into _build/content/<lang>/. Never writes to the Flutter project.
//
// Usage (from the website repo root):
//   node _build/sync-flutter-content.mjs ../Sigara_Savar/quitSmoke

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const flutterRoot = path.resolve(process.argv[2] || path.join(here, '../../Sigara_Savar/quitSmoke'));
const outRoot = path.join(here, 'content');
const sourceFile = path.join(outRoot, 'SOURCE.json');
const previousSource = fs.existsSync(sourceFile) ? JSON.parse(fs.readFileSync(sourceFile, 'utf8')) : {};
const SUPPORTED_LANGS = ['tr', 'en', 'de', 'es', 'fr'];
// Optional third argument limits a sync to one locale without touching the others.
const LANGS = process.argv[3] ? process.argv[3].split(',') : SUPPORTED_LANGS;
if (LANGS.some((lang) => !SUPPORTED_LANGS.includes(lang))) throw new Error('Unsupported content locale');

// ---------------------------------------------------------------------------
// Minimal parser for the subset of Dart used by const content lists:
// string literals (adjacent + concatenated), numbers, arithmetic, lists,
// constructor calls with named/positional args, identifiers, true/false/null.
// ---------------------------------------------------------------------------
class DartParser {
  constructor(src, pos) { this.src = src; this.pos = pos; }

  error(msg) {
    const line = this.src.slice(0, this.pos).split('\n').length;
    throw new Error(`${msg} (line ${line})`);
  }

  ws() {
    for (;;) {
      const rest = this.src.slice(this.pos, this.pos + 2);
      if (/\s/.test(this.src[this.pos] || '')) { this.pos++; continue; }
      if (rest === '//') { const nl = this.src.indexOf('\n', this.pos); this.pos = nl < 0 ? this.src.length : nl + 1; continue; }
      if (rest === '/*') { const end = this.src.indexOf('*/', this.pos + 2); this.pos = end < 0 ? this.src.length : end + 2; continue; }
      return;
    }
  }

  peek() { this.ws(); return this.src[this.pos]; }

  expect(ch) {
    if (this.peek() !== ch) this.error(`Expected "${ch}" but found "${this.src[this.pos]}"`);
    this.pos++;
  }

  expr() {
    let left = this.term();
    for (;;) {
      const op = this.peek();
      if (op !== '+' && op !== '-') return left;
      this.pos++;
      const right = this.term();
      if (typeof left === 'string' && typeof right === 'string' && op === '+') left = left + right;
      else if (typeof left === 'number' && typeof right === 'number') left = op === '+' ? left + right : left - right;
      else this.error('Unsupported operands');
    }
  }

  term() {
    let left = this.unary();
    for (;;) {
      const op = this.peek();
      if (op !== '*' && op !== '/') return left;
      this.pos++;
      const right = this.unary();
      left = op === '*' ? left * right : left / right;
    }
  }

  unary() {
    if (this.peek() === '-') { this.pos++; return -this.unary(); }
    return this.primary();
  }

  primary() {
    const ch = this.peek();
    if (ch === '[') return this.list();
    if (ch === '(') { this.pos++; const v = this.expr(); this.expect(')'); return v; }
    if (ch === "'" || ch === '"' || (ch === 'r' && /['"]/.test(this.src[this.pos + 1]))) return this.strings();
    if (/[0-9]/.test(ch)) return this.number();
    if (/[A-Za-z_$]/.test(ch)) return this.identOrCall();
    this.error(`Unexpected character "${ch}"`);
  }

  number() {
    const m = /^(0x[0-9a-fA-F]+|\d+(?:\.\d+)?)/.exec(this.src.slice(this.pos));
    this.pos += m[0].length;
    return Number(m[0]);
  }

  strings() {
    let out = '';
    while (this.peek() === "'" || this.peek() === '"' || (this.src[this.pos] === 'r' && /['"]/.test(this.src[this.pos + 1]))) {
      out += this.string();
    }
    return out;
  }

  string() {
    let raw = false;
    if (this.src[this.pos] === 'r') { raw = true; this.pos++; }
    const q = this.src[this.pos];
    const triple = this.src.slice(this.pos, this.pos + 3) === q.repeat(3);
    const delim = triple ? q.repeat(3) : q;
    this.pos += delim.length;
    let out = '';
    for (;;) {
      if (this.pos >= this.src.length) this.error('Unterminated string');
      if (this.src.startsWith(delim, this.pos)) { this.pos += delim.length; return out; }
      const c = this.src[this.pos];
      if (!raw && c === '\\') {
        const n = this.src[this.pos + 1];
        const simple = { n: '\n', t: '\t', r: '\r', '\\': '\\', "'": "'", '"': '"', $: '$', b: '\b', f: '\f', v: '\v' };
        if (n in simple) { out += simple[n]; this.pos += 2; continue; }
        if (n === 'u') {
          if (this.src[this.pos + 2] === '{') {
            const end = this.src.indexOf('}', this.pos);
            out += String.fromCodePoint(parseInt(this.src.slice(this.pos + 3, end), 16));
            this.pos = end + 1;
          } else {
            out += String.fromCharCode(parseInt(this.src.slice(this.pos + 2, this.pos + 6), 16));
            this.pos += 6;
          }
          continue;
        }
        if (n === 'x') { out += String.fromCharCode(parseInt(this.src.slice(this.pos + 2, this.pos + 4), 16)); this.pos += 4; continue; }
        out += n; this.pos += 2; continue;
      }
      if (!raw && c === '$') this.error('String interpolation is not supported in content files');
      if (!triple && c === '\n') this.error('Newline in single-line string');
      out += c; this.pos++;
    }
  }

  list() {
    this.expect('[');
    const items = [];
    while (this.peek() !== ']') {
      items.push(this.expr());
      if (this.peek() === ',') this.pos++;
    }
    this.pos++;
    return items;
  }

  identOrCall() {
    const m = /^[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*/.exec(this.src.slice(this.pos));
    this.pos += m[0].length;
    const name = m[0];
    if (name === 'true') return true;
    if (name === 'false') return false;
    if (name === 'null') return null;
    if (name === 'const' || name === 'final') return this.primary();
    if (this.peek() === '<') { // generic type args, e.g. const <String>[...]
      const end = this.src.indexOf('>', this.pos);
      this.pos = end + 1;
      if (this.peek() === '[') return this.list();
    }
    if (this.peek() !== '(') return { $ref: name };
    this.pos++;
    const named = {};
    const positional = [];
    while (this.peek() !== ')') {
      const save = this.pos;
      const key = /^([A-Za-z_$][\w$]*)\s*:(?!:)/.exec(this.src.slice(this.pos));
      if (key) { this.pos += key[0].length; named[key[1]] = this.expr(); }
      else { this.pos = save; positional.push(this.expr()); }
      if (this.peek() === ',') this.pos++;
    }
    this.pos++;
    return { $type: name, ...named, $args: positional };
  }
}

function parseConstLists(file) {
  const src = fs.readFileSync(file, 'utf8');
  const decl = /(?:static\s+)?const\s+List<\w+>\s+(\w+)\s*=\s*(?=\[)/g;
  const out = {};
  let m;
  while ((m = decl.exec(src))) {
    const parser = new DartParser(src, decl.lastIndex);
    out[m[1]] = parser.list();
    decl.lastIndex = parser.pos;
  }
  return out;
}

function resolveRefs(value, scope) {
  if (Array.isArray(value)) return value.map((v) => resolveRefs(v, scope));
  if (value && typeof value === 'object') {
    if (value.$ref && scope[value.$ref]) return resolveRefs(scope[value.$ref], scope);
    const out = {};
    for (const [k, v] of Object.entries(value)) out[k] = resolveRefs(v, scope);
    return out;
  }
  return value;
}

const pick = (obj, keys) => Object.fromEntries(keys.filter((k) => obj[k] !== undefined).map((k) => [k, obj[k]]));

// ---------------------------------------------------------------------------
const src = (rel) => path.join(flutterRoot, rel);

function knowledge(lang) {
  const suffix = { tr: '', en: '_en', es: '_es', de: '_de', fr: '_fr' }[lang];
  const name = { tr: 'kKnowledgeCenterSections', en: 'kKnowledgeCenterSectionsEn', es: 'kKnowledgeCenterSectionsEs', de: 'kKnowledgeCenterSectionsDe', fr: 'kKnowledgeCenterSectionsFr' }[lang];
  const scope = parseConstLists(src(`lib/features/explore/system_posts/data/knowledge_center_content${suffix}.dart`));
  const sections = resolveRefs(scope[name], scope);
  return sections.map((s) => ({
    id: s.id,
    order: s.order,
    title: s.title,
    description: s.description,
    articles: s.articles.map((a) => ({
      ...pick(a, ['id', 'sectionId', 'order', 'title', 'summary', 'estimatedReadMinutes', 'icon', 'intro', 'tags']),
      contentSections: (a.contentSections || []).map((c) => ({
        title: c.title,
        body: c.body ?? null,
        items: c.items || [],
        numbered: Boolean(c.numbered),
      })),
      keyTakeaways: a.keyTakeaways || [],
    })),
  }));
}

function health(lang) {
  const scope = parseConstLists(src('lib/features/health/presentation/data/health_goals_l10n.dart'));
  const name = `kHealthGoals${lang[0].toUpperCase()}${lang[1]}`;
  return scope[name].map((g) => pick(g, ['duration', 'targetMinutes', 'summary', 'detail', 'motivation']));
}

function breathing(lang) {
  const scope = parseConstLists(src('lib/features/games/presentation/data/breathing_exercise_l10n.dart'));
  const name = `kBreathingTechniques${lang[0].toUpperCase()}${lang[1]}`;
  return scope[name].map((t) => pick(t, ['id', 'name', 'inhaleSeconds', 'holdSeconds', 'exhaleSeconds', 'benefit', 'area', 'description']));
}

// Mirrors JourneyMapMilestone.requiresPremium (level >= 3): premium guide text stays in the app.
function journey(lang) {
  const file = lang === 'tr' ? 'lib/features/progress/domain/growth_insights.dart' : 'lib/features/progress/domain/growth_insights_l10n.dart';
  const scope = parseConstLists(src(file));
  const name = lang === 'tr' ? 'journeyMapMilestones' : `kJourneyMapMilestones${lang[0].toUpperCase()}${lang[1]}`;
  return scope[name].map((s) => {
    const base = pick(s, ['level', 'title', 'dayLabel', 'minDays']);
    if (s.level >= 3) return { ...base, requiresPremium: true };
    return { ...base, requiresPremium: false, ...pick(s, ['developments', 'attentionPoints', 'traps']) };
  });
}

function appStrings(lang) {
  const arb = JSON.parse(fs.readFileSync(src(`lib/l10n/app_${lang}.arb`), 'utf8'));
  const keys = Object.keys(arb).filter((k) => !k.startsWith('@') && (
    k.startsWith('crisisGuardian') || /^communityRules(Purpose|Respect|Safety|Health|Moderation)(Title|Description)$/.test(k) ||
    k === 'communityRulesTitle' || k === 'communityRulesDisclaimer'));
  return Object.fromEntries(keys.sort().map((k) => [k, arb[k]]));
}

function flutterRevision() {
  try {
    return execFileSync('git', ['-c', `safe.directory=${path.resolve(flutterRoot, '..').replaceAll('\\', '/')}`, '-C', flutterRoot, 'rev-parse', '--short', 'HEAD'], { encoding: 'utf8' }).trim();
  } catch {
    return null;
  }
}

function write(lang, name, data) {
  const dir = path.join(outRoot, lang);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, `${name}.json`), JSON.stringify(data, null, 2) + '\n');
}

if (!fs.existsSync(src('pubspec.yaml'))) {
  console.error(`Flutter project not found at ${flutterRoot}`);
  process.exit(1);
}

const summary = {};
for (const lang of LANGS) {
  const kc = knowledge(lang);
  write(lang, 'knowledge', kc);
  write(lang, 'health', health(lang));
  write(lang, 'breathing', breathing(lang));
  write(lang, 'journey', journey(lang));
  write(lang, 'app-strings', appStrings(lang));
  summary[lang] = { sections: kc.length, articles: kc.reduce((n, s) => n + s.articles.length, 0) };
}

const revision = flutterRevision();
const syncDate = new Date().toISOString().slice(0, 10);
fs.writeFileSync(sourceFile, JSON.stringify({
  project: 'Sigara_Savar/quitSmoke',
  revision,
  syncedAt: syncDate,
  localeSyncedAt: {
    ...Object.fromEntries(SUPPORTED_LANGS.filter((lang) => fs.existsSync(path.join(outRoot, lang))).map((lang) => [lang, previousSource.localeSyncedAt?.[lang] || previousSource.syncedAt || syncDate])),
    ...Object.fromEntries(LANGS.map((lang) => [lang, syncDate])),
  },
  localeRevisions: {
    ...Object.fromEntries(SUPPORTED_LANGS.filter((lang) => fs.existsSync(path.join(outRoot, lang))).map((lang) => [lang, previousSource.localeRevisions?.[lang] || previousSource.revision || null])),
    ...Object.fromEntries(LANGS.map((lang) => [lang, revision])),
  },
  files: [
    'lib/features/explore/system_posts/data/knowledge_center_content*.dart',
    'lib/features/health/presentation/data/health_goals_l10n.dart',
    'lib/features/games/presentation/data/breathing_exercise_l10n.dart',
    'lib/features/progress/domain/growth_insights.dart, growth_insights_l10n.dart',
    'lib/l10n/app_{tr,en,de,es,fr}.arb',
  ],
}, null, 2) + '\n');

console.log('Synced content:', JSON.stringify(summary));
