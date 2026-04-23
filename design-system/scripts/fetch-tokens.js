#!/usr/bin/env node
/**
 * Fetch design tokens directly from Figma REST API.
 * Usage: FIGMA_TOKEN=xxx FILE_KEY=yyy node fetch-tokens.js
 *
 * Extracts: local styles (color, text, effect) → tokens.json format
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const FIGMA_TOKEN = process.env.FIGMA_TOKEN;
const FILE_KEY = process.env.FILE_KEY;
const OUTPUT_PATH = path.join(__dirname, '..', 'tokens', 'tokens-figma.json');

if (!FIGMA_TOKEN || !FILE_KEY) {
  console.error('Usage: FIGMA_TOKEN=<token> FILE_KEY=<key> node fetch-tokens.js');
  console.error('Get your token at: https://www.figma.com/settings (Personal access tokens)');
  console.error('Get FILE_KEY from the Figma URL: figma.com/file/FILE_KEY/...');
  process.exit(1);
}

async function figmaGet(endpoint) {
  const res = await fetch(`https://api.figma.com/v1${endpoint}`, {
    headers: { 'X-Figma-Token': FIGMA_TOKEN },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Figma API ${res.status}: ${body}`);
  }
  return res.json();
}

function rgbToHex({ r, g, b }) {
  const toHex = (v) => Math.round(v * 255).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[\/\\]/g, '-')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .trim();
}

async function fetchFileStyles() {
  console.log(`Fetching styles from Figma file: ${FILE_KEY}`);
  const fileData = await figmaGet(`/files/${FILE_KEY}`);

  const styleIds = Object.keys(fileData.styles || {});
  if (styleIds.length === 0) {
    console.warn('No published styles found in this file.');
    console.warn('Make sure your Figma file has published Local Styles.');
    return { color: {}, typography: {}, shadow: {} };
  }

  console.log(`Found ${styleIds.length} styles. Fetching node details...`);

  // Fetch node details for all style IDs
  const nodesRes = await figmaGet(`/files/${FILE_KEY}/nodes?ids=${styleIds.join(',')}`);
  const nodes = nodesRes.nodes || {};

  const tokens = { color: {}, typography: {}, shadow: {} };

  for (const [nodeId, nodeData] of Object.entries(nodes)) {
    const styleMeta = fileData.styles[nodeId];
    if (!styleMeta) continue;

    const node = nodeData.document;
    const tokenKey = slugify(styleMeta.name);

    if (styleMeta.styleType === 'FILL') {
      const fill = node.fills?.[0];
      if (fill?.type === 'SOLID' && fill.color) {
        tokens.color[tokenKey] = {
          $value: rgbToHex(fill.color),
          $type: 'color',
          $description: styleMeta.description || '',
          figmaNodeId: nodeId,
        };
      } else if (fill?.type === 'GRADIENT_LINEAR') {
        const stops = fill.gradientStops
          .map((s) => `${rgbToHex(s.color)} ${Math.round(s.position * 100)}%`)
          .join(', ');
        const angle = Math.round(
          (Math.atan2(
            fill.gradientHandlePositions[1].y - fill.gradientHandlePositions[0].y,
            fill.gradientHandlePositions[1].x - fill.gradientHandlePositions[0].x
          ) * 180) / Math.PI + 90
        );
        tokens.color[tokenKey] = {
          $value: `linear-gradient(${angle}deg, ${stops})`,
          $type: 'color',
          $description: styleMeta.description || '',
          figmaNodeId: nodeId,
        };
      }
    } else if (styleMeta.styleType === 'TEXT') {
      const style = node.style || {};
      tokens.typography[tokenKey] = {
        $value: {
          fontFamily: style.fontFamily,
          fontSize: `${style.fontSize}px`,
          fontWeight: style.fontWeight,
          lineHeight: style.lineHeightPx
            ? `${style.lineHeightPx}px`
            : style.lineHeightPercentFontSize
            ? `${style.lineHeightPercentFontSize}%`
            : 'normal',
          letterSpacing: style.letterSpacing ? `${style.letterSpacing}px` : '0',
        },
        $type: 'typography',
        $description: styleMeta.description || '',
        figmaNodeId: nodeId,
      };
    } else if (styleMeta.styleType === 'EFFECT') {
      const effects = node.effects || [];
      const shadows = effects
        .filter((e) => e.type === 'DROP_SHADOW')
        .map((e) => {
          const { x, y, radius, spread = 0, color } = e;
          const hex = rgbToHex(color);
          const alpha = Math.round((color.a ?? 1) * 100) / 100;
          return `${x}px ${y}px ${radius}px ${spread}px rgba(${parseInt(hex.slice(1, 3), 16)}, ${parseInt(hex.slice(3, 5), 16)}, ${parseInt(hex.slice(5, 7), 16)}, ${alpha})`;
        })
        .join(', ');
      if (shadows) {
        tokens.shadow[tokenKey] = {
          $value: shadows,
          $type: 'shadow',
          $description: styleMeta.description || '',
          figmaNodeId: nodeId,
        };
      }
    }
  }

  return tokens;
}

async function main() {
  try {
    const figmaTokens = await fetchFileStyles();
    const colorCount = Object.keys(figmaTokens.color).length;
    const typographyCount = Object.keys(figmaTokens.typography).length;
    const shadowCount = Object.keys(figmaTokens.shadow).length;

    // Merge with existing base tokens (Figma overrides base)
    const baseTokensPath = path.join(__dirname, '..', 'tokens', 'tokens.json');
    let merged = {};
    if (fs.existsSync(baseTokensPath)) {
      const base = JSON.parse(fs.readFileSync(baseTokensPath, 'utf8'));
      merged = {
        ...base,
        color: { ...base.color, figma: figmaTokens.color },
        typography: { ...base.typography, figma: figmaTokens.typography },
        shadow: { ...base.shadow, ...figmaTokens.shadow },
        '$figma-source': {
          fileKey: FILE_KEY,
          fetchedAt: new Date().toISOString(),
        },
      };
    } else {
      merged = {
        '$figma-source': { fileKey: FILE_KEY, fetchedAt: new Date().toISOString() },
        ...figmaTokens,
      };
    }

    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(merged, null, 2));
    console.log(`\nTokens saved to: ${OUTPUT_PATH}`);
    console.log(`  Colors:     ${colorCount}`);
    console.log(`  Typography: ${typographyCount}`);
    console.log(`  Shadows:    ${shadowCount}`);
  } catch (err) {
    console.error('Error fetching tokens:', err.message);
    process.exit(1);
  }
}

main();
