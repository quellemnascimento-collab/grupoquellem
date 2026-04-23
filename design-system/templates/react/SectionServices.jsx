// Component: Section / Services — Quellnodigital
import React, { useEffect, useRef, useState } from 'react';

const tokens = {
  gradientCTA: 'linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)',
  gradientCard: 'linear-gradient(145deg, #1E1433 0%, #2D1F4A 100%)',
  neutral900: '#0F0A1E',
  neutral400: '#9CA3AF',
  primaryLight: '#A78BFA',
  glowPrimary: '0 0 40px rgba(124, 58, 237, 0.3)',
};

const SERVICES = [
  {
    id: 'traffic',
    icon: (
      <svg fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24" width="28" height="28" aria-hidden="true">
        <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
    iconColors: { bg: 'rgba(124, 58, 237, 0.15)', color: '#A78BFA' },
    title: 'Gestão de Tráfego Pago',
    description: 'Campanhas em Google e Meta Ads estruturadas para maximizar ROAS e reduzir CAC, com otimização semanal baseada em dados.',
    tags: ['Google Ads', 'Meta Ads', 'ROAS', 'CAC'],
  },
  {
    id: 'social',
    icon: (
      <svg fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24" width="28" height="28" aria-hidden="true">
        <path d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
      </svg>
    ),
    iconColors: { bg: 'rgba(6, 182, 212, 0.15)', color: '#06B6D4' },
    title: 'Mídias Sociais Estratégicas',
    description: 'Conteúdo que constrói autoridade, engaja e converte. Calendário editorial alinhado ao funil de vendas e ao buyer journey.',
    tags: ['Instagram', 'LinkedIn', 'Conteúdo', 'Autoridade'],
  },
  {
    id: 'automation',
    icon: (
      <svg fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24" width="28" height="28" aria-hidden="true">
        <path d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    iconColors: { bg: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B' },
    title: 'Automação e Inteligência Artificial',
    description: 'Chatbots, fluxos de nutrição, CRM automatizado e IA para qualificação de leads — escale sem aumentar equipe.',
    tags: ['IA', 'Chatbot', 'CRM', 'Automação'],
  },
  {
    id: 'comercial',
    icon: (
      <svg fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24" width="28" height="28" aria-hidden="true">
        <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    iconColors: { bg: 'rgba(16, 185, 129, 0.15)', color: '#10B981' },
    title: 'Estratégia Comercial',
    description: 'Pipeline de 6 etapas, playbook de vendas, scripts validados, treinamento de time e dashboards para previsibilidade de receita.',
    tags: ['Pipeline', 'Playbook', 'Scripts', 'KPIs'],
  },
  {
    id: 'data',
    icon: (
      <svg fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24" width="28" height="28" aria-hidden="true">
        <path d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /><path d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
      </svg>
    ),
    iconColors: { bg: 'rgba(124, 58, 237, 0.15)', color: '#A78BFA' },
    title: 'Inteligência de Dados',
    description: 'Dashboards em tempo real, análise de cohort, atribuição de canais e relatórios executivos para decisões baseadas em dados.',
    tags: ['Dashboard', 'Analytics', 'Atribuição', 'Reports'],
  },
  {
    id: 'branding',
    icon: (
      <svg fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24" width="28" height="28" aria-hidden="true">
        <path d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
      </svg>
    ),
    iconColors: { bg: 'rgba(6, 182, 212, 0.15)', color: '#06B6D4' },
    title: 'Branding Digital',
    description: 'Identidade visual consistente, posicionamento de marca e diferenciação competitiva para ser reconhecida e lembrada.',
    tags: ['Identidade', 'Posicionamento', 'Design', 'Marca'],
  },
];

function ServiceCard({ service, index }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setTimeout(() => setVisible(true), index * 80); obs.unobserve(el); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [index]);

  return (
    <article
      ref={ref}
      style={{
        background: tokens.gradientCard,
        border: `1px solid ${hovered ? 'rgba(124, 58, 237, 0.45)' : 'rgba(124, 58, 237, 0.15)'}`,
        borderRadius: '20px',
        padding: '36px 32px',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: hovered ? tokens.glowPrimary : 'none',
        transform: !visible ? 'translateY(24px)' : hovered ? 'translateY(-6px)' : 'translateY(0)',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.5s ease, transform 0.3s ease, border-color 0.3s, box-shadow 0.3s',
        cursor: 'default',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Icon */}
      <div style={{
        width: '56px', height: '56px', borderRadius: '14px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: '24px',
        background: service.iconColors.bg,
        color: service.iconColors.color,
      }}>
        {service.icon}
      </div>

      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '12px', color: '#FFFFFF' }}>
        {service.title}
      </h3>

      <p style={{ fontSize: '0.9rem', color: tokens.neutral400, lineHeight: 1.65, marginBottom: '24px' }}>
        {service.description}
      </p>

      {/* Tags */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '28px' }}>
        {service.tags.map((tag) => (
          <span key={tag} style={{
            fontSize: '0.72rem', fontWeight: 600,
            padding: '4px 10px', borderRadius: '9999px',
            background: 'rgba(124, 58, 237, 0.1)',
            border: '1px solid rgba(124, 58, 237, 0.2)',
            color: tokens.primaryLight,
          }}>
            {tag}
          </span>
        ))}
      </div>

      <a
        href="#contato"
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          fontSize: '0.875rem', fontWeight: 600, color: tokens.primaryLight,
          textDecoration: 'none',
          transition: 'gap 0.2s',
        }}
        onMouseEnter={e => { e.currentTarget.style.gap = '10px'; }}
        onMouseLeave={e => { e.currentTarget.style.gap = '6px'; }}
      >
        Saiba mais <span aria-hidden="true">→</span>
      </a>
    </article>
  );
}

/**
 * Services grid section for Quellnodigital.
 *
 * @param {Object} props
 * @param {string} [props.eyebrow]
 * @param {string} [props.headline]
 * @param {string} [props.sub]
 * @param {string} [props.ctaLabel]
 * @param {string} [props.ctaHref]
 * @param {Array} [props.services] - Override default services
 */
export default function SectionServices({
  eyebrow = 'O que entregamos',
  headline = 'Ecossistema completo de crescimento previsível',
  sub = 'Não trabalhamos com peças soltas. Integramos cada frente para que marketing, comercial, dados e IA funcionem como um único motor de crescimento.',
  ctaLabel = 'Quero um diagnóstico gratuito',
  ctaHref = '#contato',
  services = SERVICES,
}) {
  const [ctaHovered, setCtaHovered] = useState(false);

  return (
    <section
      style={{
        padding: '100px 40px',
        background: tokens.neutral900,
        fontFamily: "'Inter', sans-serif",
        color: '#FFFFFF',
      }}
      aria-labelledby="services-headline"
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <p style={{ textAlign: 'center', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: tokens.primaryLight, marginBottom: '16px' }}>
          {eyebrow}
        </p>
        <h2
          id="services-headline"
          style={{ textAlign: 'center', fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', fontWeight: 800, lineHeight: 1.2, letterSpacing: '-0.02em', marginBottom: '16px' }}
        >
          {headline.split('crescimento previsível').map((part, i) =>
            i === 0 ? (
              <React.Fragment key={i}>
                {part}
                <span style={{ background: tokens.gradientCTA, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  crescimento previsível
                </span>
              </React.Fragment>
            ) : <React.Fragment key={i}>{part}</React.Fragment>
          )}
        </h2>
        <p style={{ textAlign: 'center', color: tokens.neutral400, fontSize: '1rem', lineHeight: 1.65, maxWidth: '600px', margin: '0 auto 64px' }}>
          {sub}
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px',
          marginBottom: '64px',
        }}>
          {services.map((service, i) => (
            <ServiceCard key={service.id} service={service} index={i} />
          ))}
        </div>

        <div style={{ textAlign: 'center' }}>
          <a
            href={ctaHref}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '10px',
              background: tokens.gradientCTA, color: '#FFFFFF',
              padding: '16px 40px', border: 'none', borderRadius: '9999px',
              fontFamily: 'inherit', fontSize: '1rem', fontWeight: 700,
              textDecoration: 'none',
              transition: 'transform 0.2s, box-shadow 0.2s',
              transform: ctaHovered ? 'translateY(-2px)' : 'none',
              boxShadow: ctaHovered ? '0 0 40px rgba(124, 58, 237, 0.4)' : 'none',
            }}
            onMouseEnter={() => setCtaHovered(true)}
            onMouseLeave={() => setCtaHovered(false)}
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            {ctaLabel}
          </a>
        </div>
      </div>
    </section>
  );
}
