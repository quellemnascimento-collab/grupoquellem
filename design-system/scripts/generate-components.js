#!/usr/bin/env node
/**
 * Claude-powered component generator.
 * Reads design tokens + component spec → generates HTML and React components.
 *
 * Usage:
 *   ANTHROPIC_API_KEY=sk-... node generate-components.js
 *   ANTHROPIC_API_KEY=sk-... node generate-components.js --component hero
 *   ANTHROPIC_API_KEY=sk-... node generate-components.js --format react
 *
 * Flags:
 *   --component  hero|button|card-testimonial|section-services|all  (default: all)
 *   --format     html|react|both                                     (default: both)
 *   --tokens     tokens.json|tokens-figma.json                       (default: tokens.json)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Anthropic from '@anthropic-ai/sdk';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const args = process.argv.slice(2);
const getFlag = (flag, def) => {
  const i = args.indexOf(flag);
  return i !== -1 ? args[i + 1] : def;
};

const TARGET_COMPONENT = getFlag('--component', 'all');
const FORMAT = getFlag('--format', 'both');
const TOKENS_FILE = getFlag('--tokens', 'tokens.json');

const TOKENS_PATH = path.join(__dirname, '..', 'tokens', TOKENS_FILE);
const HTML_DIR = path.join(__dirname, '..', 'templates', 'html');
const REACT_DIR = path.join(__dirname, '..', 'templates', 'react');

if (!process.env.ANTHROPIC_API_KEY) {
  console.error('Error: ANTHROPIC_API_KEY environment variable is required.');
  process.exit(1);
}

const client = new Anthropic();

const COMPONENT_SPECS = {
  hero: {
    name: 'Hero / Primary',
    file: 'hero',
    description: `
      Landing page hero section for Quellnodigital digital marketing agency.
      - Full-viewport height (100vh) dark section with gradient background
      - Large headline: "Não vendemos marketing. Construímos máquina de aquisição e crescimento."
      - Subheadline explaining the service ecosystem (marketing + comercial + IA + estratégia)
      - Two CTAs: primary "Quero crescer previsível" (gradient button) and secondary "Ver cases" (ghost button)
      - Floating badge: "Agência #1 em crescimento previsível para PMEs"
      - Animated decorative elements (glowing circles / grid pattern)
      - Social proof strip: logos or stat counters (ex: "+120 PMEs atendidas", "R$40M gerado")
      - Mobile-responsive with hamburger nav
    `,
  },
  button: {
    name: 'Button / CTA',
    file: 'button',
    description: `
      Complete button component system for Quellnodigital.
      Variants:
        - Primary: gradient (purple → cyan), white text, hover glow effect
        - Secondary: outline with gradient border, transparent background
        - Ghost: text only with underline animation
        - Danger: red for destructive actions
      Sizes: sm, md (default), lg, xl
      States: default, hover, focus (accessible ring), active (scale), disabled (opacity)
      With optional leading/trailing icons using SVG
      Loading state with spinner animation
    `,
  },
  'card-testimonial': {
    name: 'Card / Testimonial',
    file: 'card-testimonial',
    description: `
      Testimonial card component for the social proof section.
      - Dark card with subtle gradient border (purple glow on hover)
      - Quote icon (large, decorative)
      - Testimonial text (3-5 lines)
      - Author: avatar (circle), name, company, role
      - Star rating (5 stars, filled in yellow/amber)
      - Result badge: ex "ROAS 4.8x" or "CPL -67%" in accent color
      - Horizontal scroll carousel for mobile (3 cards visible on desktop)
      - Cards for: 3 fictional Quellem clients (PME owners)
    `,
  },
  'section-services': {
    name: 'Section / Services',
    file: 'section-services',
    description: `
      Services / solutions section for Quellnodigital.
      Services offered:
        1. Gestão de Tráfego — Google + Meta Ads, ROAS, CAC
        2. Mídias Sociais — conteúdo estratégico, engajamento, autoridade
        3. Automação e IA — chatbots, CRM, fluxos de nutrição
        4. Estratégia Comercial — pipeline, scripts, playbook de vendas
        5. Inteligência de Dados — dashboards, KPIs, decisões baseadas em dados
        6. Branding Digital — identidade visual, posicionamento, diferenciação
      Layout: 3-column grid (desktop), 2-col (tablet), 1-col (mobile)
      Each card: icon (SVG), title, description (2 lines), "Saiba mais" link
      Section header: eyebrow text + headline + subhead
      CTA at bottom: "Ver todos os serviços"
    `,
  },
};

async function generateComponent(spec, tokens, format) {
  const tokensContext = JSON.stringify(
    {
      colors: tokens.color,
      typography: {
        fontFamily: tokens.typography?.fontFamily,
        fontSize: tokens.typography?.fontSize,
        fontWeight: tokens.typography?.fontWeight,
      },
      spacing: tokens.spacing,
      borderRadius: tokens.borderRadius,
      shadow: tokens.shadow,
      animation: tokens.animation,
    },
    null,
    2
  );

  const systemPrompt = `You are an expert frontend developer specializing in high-conversion landing pages for Brazilian digital marketing agencies.

You produce production-ready, pixel-perfect components that are:
- Visually stunning with modern dark UI aesthetic
- Fully responsive (mobile-first)
- Accessible (WCAG AA: focus states, aria labels, semantic HTML)
- Performance-optimized (no external dependencies beyond what's specified)
- Written in clean, well-structured code

Brand context:
- Company: Quellnodigital / Grupo Quellem
- Founded by: Márcia Quellem Nascimento, Serra/ES, Brazil
- Positioning: "Não vendemos marketing. Construímos máquina de aquisição e crescimento."
- Target: PMEs faturando R$30k–R$300k/mês
- Tone: Professional, confident, data-driven, results-focused

Design system tokens are provided as JSON. Use them via CSS custom properties (--color-brand-primary, etc.) for consistency.

All text content should be in Brazilian Portuguese.`;

  const userPrompt = `Generate the "${spec.name}" component.

Component specification:
${spec.description}

Design tokens (reference these values):
${tokensContext}

${
  format === 'html' || format === 'both'
    ? `Deliver a complete, self-contained HTML file that:
- Includes all CSS in a <style> tag using CSS custom properties mapped from the design tokens
- Includes all JavaScript in a <script> tag (vanilla JS only)
- Uses semantic HTML5 elements
- Has no external dependencies except Google Fonts (Inter)
- Looks production-ready in a browser
- File should start with: <!-- Component: ${spec.name} -->

`
    : ''
}${
  format === 'react' || format === 'both'
    ? `${format === 'both' ? 'Also deliver' : 'Deliver'} a React component (.jsx) that:
- Uses CSS modules or styled-components pattern (inline styles for portability)
- Exports a default function component
- Includes TypeScript-compatible prop types as JSDoc comments
- Imports React at the top
- Is compatible with React 18+
- File should start with: // Component: ${spec.name}

`
    : ''
}Respond with ${format === 'both' ? 'two clearly separated code blocks: first the HTML file, then the React component' : 'one code block'}.
Mark each block with its type: \`\`\`html or \`\`\`jsx`;

  console.log(`\nGenerating ${spec.name}...`);

  const stream = await client.messages.stream({
    model: 'claude-opus-4-7',
    max_tokens: 8000,
    thinking: { type: 'adaptive' },
    system: systemPrompt,
    messages: [{ role: 'user', content: userPrompt }],
  });

  const response = await stream.finalMessage();
  return response.content
    .filter((b) => b.type === 'text')
    .map((b) => b.text)
    .join('');
}

function extractCodeBlocks(text) {
  const htmlMatch = text.match(/```html\n([\s\S]*?)```/);
  const jsxMatch = text.match(/```jsx\n([\s\S]*?)```/);
  return {
    html: htmlMatch?.[1]?.trim() || null,
    jsx: jsxMatch?.[1]?.trim() || null,
  };
}

function componentToReactName(file) {
  return file
    .split('-')
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join('');
}

async function main() {
  if (!fs.existsSync(TOKENS_PATH)) {
    console.error(`Tokens file not found: ${TOKENS_PATH}`);
    console.error('Run build-tokens.js first.');
    process.exit(1);
  }

  const tokens = JSON.parse(fs.readFileSync(TOKENS_PATH, 'utf8'));
  fs.mkdirSync(HTML_DIR, { recursive: true });
  fs.mkdirSync(REACT_DIR, { recursive: true });

  const toGenerate =
    TARGET_COMPONENT === 'all'
      ? Object.values(COMPONENT_SPECS)
      : [COMPONENT_SPECS[TARGET_COMPONENT]].filter(Boolean);

  if (toGenerate.length === 0) {
    console.error(`Unknown component: ${TARGET_COMPONENT}`);
    console.error(`Available: ${Object.keys(COMPONENT_SPECS).join(', ')}, all`);
    process.exit(1);
  }

  const results = [];

  for (const spec of toGenerate) {
    try {
      const generated = await generateComponent(spec, tokens, FORMAT);
      const { html, jsx } = extractCodeBlocks(generated);
      const reactName = componentToReactName(spec.file);

      if ((FORMAT === 'html' || FORMAT === 'both') && html) {
        const htmlPath = path.join(HTML_DIR, `${spec.file}.html`);
        fs.writeFileSync(htmlPath, html);
        console.log(`  HTML: templates/html/${spec.file}.html`);
      }

      if ((FORMAT === 'react' || FORMAT === 'both') && jsx) {
        const jsxPath = path.join(REACT_DIR, `${reactName}.jsx`);
        fs.writeFileSync(jsxPath, jsx);
        console.log(`  React: templates/react/${reactName}.jsx`);
      }

      results.push({ spec: spec.name, success: true });
    } catch (err) {
      console.error(`  Error generating ${spec.name}:`, err.message);
      results.push({ spec: spec.name, success: false, error: err.message });
    }
  }

  console.log('\nSummary:');
  for (const r of results) {
    console.log(`  ${r.success ? '✓' : '✗'} ${r.spec}${r.error ? ': ' + r.error : ''}`);
  }
}

main();
