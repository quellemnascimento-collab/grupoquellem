// Component: Hero / Primary — Quellnodigital
import React, { useEffect, useRef } from 'react';

const tokens = {
  gradientCTA: 'linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)',
  gradientHero: 'linear-gradient(135deg, #0F0A1E 0%, #2D1F4A 50%, #1E1433 100%)',
  glowPrimary: '0 0 40px rgba(124, 58, 237, 0.4)',
  neutral400: '#9CA3AF',
  neutral300: '#D1D5DB',
  primaryLight: '#A78BFA',
};

const styles = {
  root: {
    minHeight: '100vh',
    background: tokens.gradientHero,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '120px 40px 80px',
    position: 'relative',
    overflow: 'hidden',
    fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
    color: '#FFFFFF',
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    background: 'rgba(124, 58, 237, 0.15)',
    border: '1px solid rgba(124, 58, 237, 0.3)',
    borderRadius: '9999px',
    padding: '8px 20px',
    fontSize: '0.75rem',
    fontWeight: 600,
    color: tokens.primaryLight,
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    marginBottom: '32px',
  },
  badgeDot: {
    width: '6px', height: '6px', borderRadius: '50%',
    background: tokens.primaryLight,
  },
  headline: {
    fontSize: 'clamp(2rem, 5vw, 4rem)',
    fontWeight: 800,
    lineHeight: 1.15,
    letterSpacing: '-0.03em',
    marginBottom: '24px',
    textAlign: 'center',
  },
  headlineGradient: {
    background: tokens.gradientCTA,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  sub: {
    fontSize: 'clamp(1rem, 2vw, 1.2rem)',
    color: tokens.neutral400,
    lineHeight: 1.65,
    maxWidth: '680px',
    textAlign: 'center',
    marginBottom: '48px',
  },
  ctas: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '16px',
    flexWrap: 'wrap',
    marginBottom: '64px',
  },
  btnPrimary: {
    background: tokens.gradientCTA,
    color: '#FFFFFF',
    padding: '16px 36px',
    border: 'none',
    borderRadius: '9999px',
    fontSize: '1rem',
    fontWeight: 700,
    cursor: 'pointer',
    textDecoration: 'none',
    display: 'inline-block',
    fontFamily: 'inherit',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  btnSecondary: {
    background: 'transparent',
    color: '#FFFFFF',
    padding: '15px 36px',
    border: '1px solid rgba(124, 58, 237, 0.4)',
    borderRadius: '9999px',
    fontSize: '1rem',
    fontWeight: 600,
    cursor: 'pointer',
    textDecoration: 'none',
    display: 'inline-block',
    fontFamily: 'inherit',
    transition: 'border-color 0.2s, background 0.2s',
  },
  stats: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '48px',
    flexWrap: 'wrap',
  },
  stat: { textAlign: 'center' },
  statNumber: {
    fontSize: '2rem',
    fontWeight: 800,
    background: tokens.gradientCTA,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  statLabel: {
    fontSize: '0.78rem',
    color: tokens.neutral400,
    fontWeight: 500,
    marginTop: '4px',
  },
  statDivider: {
    width: '1px', height: '48px',
    background: 'rgba(124, 58, 237, 0.2)',
  },
};

/**
 * Hero section for Quellnodigital landing page.
 *
 * @param {Object} props
 * @param {string} [props.headline] - Main headline text (first line)
 * @param {string} [props.headlineAccent] - Gradient-highlighted part of headline
 * @param {string} [props.sub] - Supporting paragraph text
 * @param {string} [props.primaryCTA] - Primary button label
 * @param {string} [props.secondaryCTA] - Secondary button label
 * @param {string} [props.primaryHref] - Primary button href
 * @param {string} [props.secondaryHref] - Secondary button href
 * @param {Array<{number: string, label: string}>} [props.stats] - Social proof stats
 */
export default function Hero({
  headline = 'Não vendemos marketing.',
  headlineAccent = 'máquina de aquisição',
  sub = 'Integramos marketing, comercial, IA e estratégia de negócio para entregar crescimento previsível às PMEs que merecem jogar no mesmo nível dos grandes.',
  primaryCTA = 'Quero crescer previsível →',
  secondaryCTA = 'Ver resultados reais',
  primaryHref = '#contato',
  secondaryHref = '#cases',
  stats = [
    { number: '+120', label: 'PMEs atendidas' },
    { number: 'R$40M+', label: 'Receita gerada' },
    { number: '4.8x', label: 'ROAS médio' },
    { number: '-67%', label: 'Redução no CPL' },
  ],
}) {
  const primaryRef = useRef(null);
  const secondaryRef = useRef(null);

  useEffect(() => {
    const btn = primaryRef.current;
    if (!btn) return;
    const onEnter = () => { btn.style.transform = 'translateY(-2px) scale(1.02)'; btn.style.boxShadow = tokens.glowPrimary; };
    const onLeave = () => { btn.style.transform = ''; btn.style.boxShadow = ''; };
    btn.addEventListener('mouseenter', onEnter);
    btn.addEventListener('mouseleave', onLeave);
    return () => { btn.removeEventListener('mouseenter', onEnter); btn.removeEventListener('mouseleave', onLeave); };
  }, []);

  return (
    <section style={styles.root} aria-label="Hero">
      {/* Decorative grid */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'linear-gradient(rgba(124,58,237,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.05) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '900px', width: '100%', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* Badge */}
        <div style={styles.badge}>
          <span style={styles.badgeDot} aria-hidden="true" />
          Agência #1 em crescimento previsível para PMEs
        </div>

        {/* Headline */}
        <h1 style={styles.headline}>
          {headline}<br />
          Construímos <span style={styles.headlineGradient}>{headlineAccent}</span><br />
          e crescimento.
        </h1>

        <p style={styles.sub}>{sub}</p>

        {/* CTAs */}
        <div style={styles.ctas}>
          <a ref={primaryRef} href={primaryHref} style={styles.btnPrimary}>
            {primaryCTA}
          </a>
          <a
            ref={secondaryRef}
            href={secondaryHref}
            style={styles.btnSecondary}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#7C3AED'; e.currentTarget.style.background = 'rgba(124,58,237,0.08)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(124,58,237,0.4)'; e.currentTarget.style.background = 'transparent'; }}
          >
            {secondaryCTA}
          </a>
        </div>

        {/* Stats */}
        <div style={styles.stats}>
          {stats.map((s, i) => (
            <React.Fragment key={s.label}>
              {i > 0 && <div style={styles.statDivider} aria-hidden="true" />}
              <div style={styles.stat}>
                <div style={styles.statNumber}>{s.number}</div>
                <div style={styles.statLabel}>{s.label}</div>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
