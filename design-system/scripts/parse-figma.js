#!/usr/bin/env node
/**
 * Parse a saved Figma API response (figma.json) and extract component data.
 * Usage:
 *   node parse-figma.js                          # reads figma.json in cwd
 *   node parse-figma.js --input path/figma.json  # custom input path
 *   node parse-figma.js --depth 3                # max traversal depth (default: 3)
 *
 * To get figma.json:
 *   curl -H "X-Figma-Token: YOUR_TOKEN" \
 *     https://api.figma.com/v1/files/FILE_KEY > figma.json
 *
 * Outputs:
 *   clean.json   — top-level frames/components with name, type, children
 *   styles.json  — extracted color, text, fill values from nodes
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const args = process.argv.slice(2);
const getFlag = (flag, def) => { const i = args.indexOf(flag); return i !== -1 ? args[i + 1] : def; };

const INPUT_PATH = path.resolve(getFlag('--input', 'figma.json'));
const MAX_DEPTH = parseInt(getFlag('--depth', '3'), 10);
const OUTPUT_DIR = path.resolve(getFlag('--out', '.'));

if (!fs.existsSync(INPUT_PATH)) {
  console.error(`File not found: ${INPUT_PATH}`);
  console.error('Save Figma API response first:');
  console.error('  curl -H "X-Figma-Token: YOUR_TOKEN" https://api.figma.com/v1/files/FILE_KEY > figma.json');
  process.exit(1);
}

const figmaData = JSON.parse(fs.readFileSync(INPUT_PATH, 'utf8'));

// ─── Helpers ─────────────────────────────────────────────────────────────────

function rgbToHex({ r, g, b }) {
  const h = (v) => Math.round(v * 255).toString(16).padStart(2, '0');
  return `#${h(r)}${h(g)}${h(b)}`.toUpperCase();
}

function extractFills(node) {
  const fills = [];
  for (const fill of node.fills || []) {
    if (!fill.visible === false) {
      if (fill.type === 'SOLID') {
        fills.push({ type: 'solid', hex: rgbToHex(fill.color), opacity: fill.opacity ?? 1 });
      } else if (fill.type === 'GRADIENT_LINEAR') {
        fills.push({
          type: 'gradient-linear',
          stops: fill.gradientStops.map((s) => ({ hex: rgbToHex(s.color), position: s.position })),
        });
      }
    }
  }
  return fills;
}

function extractTextStyle(node) {
  if (node.type !== 'TEXT' || !node.style) return null;
  const s = node.style;
  return {
    fontFamily: s.fontFamily,
    fontSize: s.fontSize,
    fontWeight: s.fontWeight,
    lineHeightPx: s.lineHeightPx,
    letterSpacing: s.letterSpacing,
    textAlignHorizontal: s.textAlignHorizontal,
    characters: node.characters,
  };
}

function pruneNode(node, depth = 0) {
  const base = {
    id: node.id,
    name: node.name,
    type: node.type,
  };

  if (node.absoluteBoundingBox) {
    const { x, y, width, height } = node.absoluteBoundingBox;
    base.bounds = { x, y, width, height };
  }

  const fills = extractFills(node);
  if (fills.length) base.fills = fills;

  const textStyle = extractTextStyle(node);
  if (textStyle) base.textStyle = textStyle;

  if (node.cornerRadius) base.cornerRadius = node.cornerRadius;
  if (node.opacity !== undefined && node.opacity !== 1) base.opacity = node.opacity;
  if (node.visible === false) base.hidden = true;

  if (depth < MAX_DEPTH && node.children?.length) {
    base.children = node.children.map((child) => pruneNode(child, depth + 1));
  } else if (node.children?.length) {
    base.childCount = node.children.length;
  }

  return base;
}

// ─── Extract all colors from the document ───────────────────────────────────

function extractAllColors(node, colors = new Map(), path = '') {
  const fills = extractFills(node);
  for (const fill of fills) {
    if (fill.type === 'solid') {
      const key = fill.hex;
      if (!colors.has(key)) colors.set(key, []);
      colors.get(key).push(`${path}/${node.name}`);
    }
  }
  for (const child of node.children || []) {
    extractAllColors(child, colors, `${path}/${node.name}`);
  }
  return colors;
}

// ─── Main ────────────────────────────────────────────────────────────────────

const document = figmaData.document;

// Extract top-level components (canvas pages → frames)
const cleanComponents = [];
for (const page of document.children || []) {
  const pageEntry = { page: page.name, frames: [] };
  for (const frame of page.children || []) {
    pageEntry.frames.push(pruneNode(frame, 0));
  }
  cleanComponents.push(pageEntry);
}

// Extract all unique colors
const allColors = extractAllColors(document);
const colorsArray = Array.from(allColors.entries())
  .sort((a, b) => b[1].length - a[1].length)
  .map(([hex, usages]) => ({ hex, usageCount: usages.length, usages: usages.slice(0, 5) }));

// Extract local styles metadata
const styles = {};
for (const [id, style] of Object.entries(figmaData.styles || {})) {
  styles[id] = {
    name: style.name,
    styleType: style.styleType,
    description: style.description,
  };
}

// Write outputs
const cleanPath = path.join(OUTPUT_DIR, 'clean.json');
const stylesPath = path.join(OUTPUT_DIR, 'styles-extracted.json');

fs.writeFileSync(cleanPath, JSON.stringify(cleanComponents, null, 2));
fs.writeFileSync(stylesPath, JSON.stringify({ colors: colorsArray, styles }, null, 2));

const frameCount = cleanComponents.reduce((acc, p) => acc + p.frames.length, 0);
console.log(`Parsed: ${INPUT_PATH}`);
console.log(`  Pages:  ${cleanComponents.length}`);
console.log(`  Frames: ${frameCount}`);
console.log(`  Colors: ${allColors.size} unique`);
console.log(`  Styles: ${Object.keys(styles).length} published`);
console.log(`\nOutputs:`);
console.log(`  ${cleanPath}`);
console.log(`  ${stylesPath}`);
