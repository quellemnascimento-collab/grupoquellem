#!/usr/bin/env node
/**
 * Transform tokens.json → CSS custom properties + Tailwind config.
 * Usage: node build-tokens.js [--input tokens-figma.json]
 *
 * Outputs:
 *   ../output/tokens.css        — CSS :root variables
 *   ../output/tailwind.config.js — Tailwind theme extension
 *   ../output/tokens.esm.js     — ESM constants for JS/React
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const args = process.argv.slice(2);
const inputFlag = args.indexOf('--input');
const inputFile = inputFlag !== -1 ? args[inputFlag + 1] : 'tokens.json';

const TOKENS_PATH = path.join(__dirname, '..', 'tokens', inputFile);
const OUTPUT_DIR = path.join(__dirname, '..', 'output');

if (!fs.existsSync(TOKENS_PATH)) {
  console.error(`Token file not found: ${TOKENS_PATH}`);
  console.error('Run fetch-tokens.js first, or use the bundled tokens.json.');
  process.exit(1);
}

fs.mkdirSync(OUTPUT_DIR, { recursive: true });

const raw = JSON.parse(fs.readFileSync(TOKENS_PATH, 'utf8'));

// --- Flatten token tree to { 'color-brand-primary': '#7C3AED', ... } ---
function flatten(obj, prefix = '') {
  const result = {};
  for (const [key, val] of Object.entries(obj)) {
    if (key.startsWith('$') || key === 'metadata') continue;
    const fullKey = prefix ? `${prefix}-${key}` : key;
    if (val && typeof val === 'object' && '$value' in val) {
      result[fullKey] = val.$value;
    } else if (val && typeof val === 'object') {
      Object.assign(result, flatten(val, fullKey));
    }
  }
  return result;
}

const flat = flatten(raw);

// --- CSS Custom Properties ---
function buildCSS(flat) {
  const vars = Object.entries(flat)
    .map(([k, v]) => `  --${k}: ${v};`)
    .join('\n');

  return `/* Quellnodigital Design Tokens — auto-generated, do not edit */
/* Source: ${inputFile} | Generated: ${new Date().toISOString()} */

:root {
${vars}
}

/* Utility classes */
.bg-brand-primary { background-color: var(--color-brand-primary); }
.bg-brand-secondary { background-color: var(--color-brand-secondary); }
.bg-gradient-hero { background: var(--color-gradient-hero); }
.bg-gradient-cta { background: var(--color-gradient-cta); }
.text-brand-primary { color: var(--color-brand-primary); }
.text-brand-secondary { color: var(--color-brand-secondary); }
.shadow-glow-primary { box-shadow: var(--shadow-glow-primary); }
.shadow-glow-secondary { box-shadow: var(--shadow-glow-secondary); }
`;
}

// --- Tailwind Config ---
function buildTailwind(flat) {
  const pick = (prefix) =>
    Object.fromEntries(
      Object.entries(flat)
        .filter(([k]) => k.startsWith(prefix))
        .map(([k, v]) => [k.replace(`${prefix}-`, ''), v])
    );

  const colors = {};
  const colorEntries = Object.entries(flat).filter(([k]) => k.startsWith('color-'));
  for (const [k, v] of colorEntries) {
    const parts = k.replace('color-', '').split('-');
    let cur = colors;
    for (let i = 0; i < parts.length - 1; i++) {
      cur[parts[i]] = cur[parts[i]] || {};
      cur = cur[parts[i]];
    }
    cur[parts[parts.length - 1]] = v;
  }

  const spacing = pick('spacing');
  const borderRadius = pick('borderRadius');
  const fontSize = Object.fromEntries(
    Object.entries(flat)
      .filter(([k]) => k.startsWith('typography-fontSize-'))
      .map(([k, v]) => [k.replace('typography-fontSize-', ''), v])
  );
  const fontFamily = Object.fromEntries(
    Object.entries(flat)
      .filter(([k]) => k.startsWith('typography-fontFamily-'))
      .map(([k, v]) => [k.replace('typography-fontFamily-', ''), [v]])
  );
  const boxShadow = pick('shadow');

  const config = {
    theme: {
      extend: {
        colors,
        spacing,
        borderRadius,
        fontSize,
        fontFamily,
        boxShadow,
        transitionDuration: {
          fast: flat['animation-duration-fast'] || '150ms',
          normal: flat['animation-duration-normal'] || '300ms',
          slow: flat['animation-duration-slow'] || '500ms',
        },
        screens: Object.fromEntries(
          Object.entries(flat)
            .filter(([k]) => k.startsWith('breakpoint-'))
            .map(([k, v]) => [k.replace('breakpoint-', ''), v])
        ),
      },
    },
  };

  return `// Quellnodigital Tailwind Config — auto-generated, do not edit
// Source: ${inputFile} | Generated: ${new Date().toISOString()}

/** @type {import('tailwindcss').Config} */
export default {
  content: ['../templates/**/*.{html,jsx,tsx}', '../../src/**/*.{js,jsx,ts,tsx}'],
  theme: ${JSON.stringify(config.theme, null, 4)},
  plugins: [],
};
`;
}

// --- ESM constants ---
function buildESM(flat) {
  const lines = Object.entries(flat)
    .map(([k, v]) => {
      const name = k
        .split('-')
        .map((p, i) => (i === 0 ? p : p.charAt(0).toUpperCase() + p.slice(1)))
        .join('');
      return `export const ${name} = ${JSON.stringify(v)};`;
    })
    .join('\n');

  return `// Quellnodigital Design Tokens (ESM) — auto-generated, do not edit
// Source: ${inputFile} | Generated: ${new Date().toISOString()}

${lines}

export const tokens = ${JSON.stringify(flat, null, 2)};
export default tokens;
`;
}

// Write outputs
const css = buildCSS(flat);
const tailwind = buildTailwind(flat);
const esm = buildESM(flat);

fs.writeFileSync(path.join(OUTPUT_DIR, 'tokens.css'), css);
fs.writeFileSync(path.join(OUTPUT_DIR, 'tailwind.config.js'), tailwind);
fs.writeFileSync(path.join(OUTPUT_DIR, 'tokens.esm.js'), esm);

console.log('Build complete:');
console.log(`  output/tokens.css          — ${Object.keys(flat).length} CSS custom properties`);
console.log(`  output/tailwind.config.js  — Tailwind theme extension`);
console.log(`  output/tokens.esm.js       — ESM constants`);
