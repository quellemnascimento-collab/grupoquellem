// Component: Card / Testimonial — Quellnodigital
import React, { useRef, useEffect, useState } from 'react';

const tokens = {
  gradientCTA: 'linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)',
  gradientCard: 'linear-gradient(145deg, #1E1433 0%, #2D1F4A 100%)',
  neutral900: '#0F0A1E',
  neutral400: '#9CA3AF',
  neutral300: '#D1D5DB',
  primaryLight: '#A78BFA',
  accent: '#F59E0B',
  glowPrimary: '0 0 40px rgba(124, 58, 237, 0.3)',
};

const DEFAULT_TESTIMONIALS = [
  {
    id: 1,
    quote: 'Em 3 meses, o custo por lead caiu 67% e o ROAS das campanhas foi de 1.8x para 4.6x. A Quellem não entregou tráfego — entregou sistema.',
    result: 'ROAS 4.6x • CPL -67%',
    stars: 5,
    author: { name: 'Carlos Andrade', role: 'CEO', company: 'Andrade Esquadrias', city: 'Vitória/ES', initials: 'C' },
  },
  {
    id: 2,
    quote: 'A Quellnodigital estruturou nosso CRM, treinou o time comercial e dobrou nossa taxa de conversão. Hoje temos previsibilidade de faturamento.',
    result: 'Conversão 2× • MRR +R$48k',
    stars: 5,
    author: { name: 'Juliana Ferreira', role: 'Diretora', company: 'Clínica Viva Bem', city: 'Serra/ES', initials: 'J' },
  },
  {
    id: 3,
    quote: 'Contratei achando que era mais uma agência de post. Em 60 dias o funil comercial estava funcionando sozinho — leads qualificados entrando e sendo convertidos automaticamente.',
    result: 'Funil automatizado • Churn 0%',
    stars: 5,
    author: { name: 'Rafael Costa', role: 'Sócio', company: 'TechFix Soluções', city: 'Cariacica/ES', initials: 'R' },
  },
  {
    id: 4,
    quote: 'Antes éramos invisíveis. Hoje somos referência no ES em estética automotiva. Em 90 dias já recebíamos clientes de outras cidades.',
    result: 'Autoridade digital • +200% alcance',
    stars: 5,
    author: { name: 'André Menezes', role: 'Fundador', company: 'AMG Estética Automotiva', city: 'ES', initials: 'A' },
  },
];

function Stars({ count = 5 }) {
  return (
    <div style={{ display: 'flex', gap: '4px', marginBottom: '16px' }} aria-label={`${count} de 5 estrelas`}>
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} style={{ color: tokens.accent, fontSize: '1rem' }} aria-hidden="true">★</span>
      ))}
    </div>
  );
}

function Card({ testimonial, style }) {
  const [hovered, setHovered] = useState(false);

  return (
    <article
      style={{
        flexShrink: 0,
        width: '360px',
        background: tokens.gradientCard,
        border: `1px solid ${hovered ? 'rgba(124, 58, 237, 0.5)' : 'rgba(124, 58, 237, 0.2)'}`,
        borderRadius: '24px',
        padding: '36px',
        position: 'relative',
        overflow: 'hidden',
        transition: 'border-color 0.3s, box-shadow 0.3s, transform 0.3s',
        boxShadow: hovered ? tokens.glowPrimary : 'none',
        transform: hovered ? 'translateY(-4px)' : 'none',
        cursor: 'default',
        ...style,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Decorative quote */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute', top: '16px', left: '28px',
          fontSize: '5rem', lineHeight: 1,
          color: 'rgba(124, 58, 237, 0.2)',
          fontFamily: 'Georgia, serif',
          userSelect: 'none',
        }}
      >"</div>

      <Stars count={testimonial.stars} />

      <p style={{
        fontSize: '0.95rem', lineHeight: 1.7,
        color: tokens.neutral300,
        marginBottom: '24px',
        fontStyle: 'italic',
        position: 'relative', zIndex: 1,
      }}>
        "{testimonial.quote}"
      </p>

      {/* Result badge */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        background: 'rgba(245, 158, 11, 0.1)',
        border: '1px solid rgba(245, 158, 11, 0.3)',
        color: tokens.accent,
        fontSize: '0.72rem', fontWeight: 700,
        letterSpacing: '0.05em', textTransform: 'uppercase',
        padding: '6px 14px', borderRadius: '9999px',
        marginBottom: '28px',
      }}>
        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: tokens.accent }} aria-hidden="true" />
        {testimonial.result}
      </div>

      {/* Author */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{
          width: '48px', height: '48px', borderRadius: '50%',
          background: tokens.gradientCTA,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.2rem', fontWeight: 700, flexShrink: 0,
          border: '2px solid rgba(124, 58, 237, 0.3)',
          color: '#FFFFFF',
        }} aria-hidden="true">
          {testimonial.author.initials}
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{testimonial.author.name}</div>
          <div style={{ fontSize: '0.8rem', color: tokens.neutral400, marginTop: '2px' }}>
            {testimonial.author.role} · {testimonial.author.company} · {testimonial.author.city}
          </div>
        </div>
      </div>
    </article>
  );
}

/**
 * Testimonial carousel section for Quellnodigital.
 *
 * @param {Object} props
 * @param {string} [props.eyebrow]
 * @param {string} [props.headline]
 * @param {string} [props.sub]
 * @param {Array} [props.testimonials] - Override default testimonials
 */
export default function CardTestimonial({
  eyebrow = 'Resultados reais',
  headline = 'O que nossos clientes dizem',
  sub = 'PMEs que pararam de improvisar e passaram a crescer com previsibilidade.',
  testimonials = DEFAULT_TESTIMONIALS,
}) {
  const carouselRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef(0);
  const scrollStart = useRef(0);

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    const onScroll = () => {
      const idx = Math.round(el.scrollLeft / (360 + 24));
      setActiveIndex(Math.max(0, Math.min(idx, testimonials.length - 1)));
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [testimonials.length]);

  const scrollToCard = (i) => {
    const el = carouselRef.current;
    if (!el) return;
    el.scrollTo({ left: i * (360 + 24), behavior: 'smooth' });
  };

  const gradientText = {
    background: tokens.gradientCTA,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  };

  return (
    <section
      style={{
        padding: '100px 40px',
        background: tokens.neutral900,
        fontFamily: "'Inter', sans-serif",
        color: '#FFFFFF',
        overflow: 'hidden',
      }}
      aria-label="Depoimentos de clientes"
    >
      {/* Header */}
      <p style={{ textAlign: 'center', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: tokens.primaryLight, marginBottom: '16px' }}>
        {eyebrow}
      </p>
      <h2 style={{ textAlign: 'center', fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', fontWeight: 800, lineHeight: 1.2, letterSpacing: '-0.02em', marginBottom: '16px' }}>
        {headline}
      </h2>
      <p style={{ textAlign: 'center', color: tokens.neutral400, fontSize: '1rem', lineHeight: 1.65, maxWidth: '560px', margin: '0 auto 64px' }}>
        {sub}
      </p>

      {/* Carousel */}
      <div
        ref={carouselRef}
        role="list"
        style={{
          display: 'flex', gap: '24px',
          overflowX: 'auto', scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch',
          paddingBottom: '16px',
          cursor: isDragging ? 'grabbing' : 'grab',
          scrollbarWidth: 'thin',
          scrollbarColor: '#7C3AED rgba(124,58,237,0.1)',
        }}
        onMouseDown={(e) => { setIsDragging(true); dragStart.current = e.pageX; scrollStart.current = carouselRef.current.scrollLeft; }}
        onMouseLeave={() => setIsDragging(false)}
        onMouseUp={() => setIsDragging(false)}
        onMouseMove={(e) => { if (!isDragging) return; e.preventDefault(); carouselRef.current.scrollLeft = scrollStart.current - (e.pageX - dragStart.current); }}
      >
        {testimonials.map((t, i) => (
          <div key={t.id} role="listitem" style={{ scrollSnapAlign: 'start', flexShrink: 0 }}>
            <Card testimonial={t} />
          </div>
        ))}
      </div>

      {/* Dots */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '32px' }} role="tablist" aria-label="Navegar depoimentos">
        {testimonials.map((_, i) => (
          <button
            key={i}
            role="tab"
            aria-selected={i === activeIndex}
            aria-label={`Depoimento ${i + 1}`}
            onClick={() => scrollToCard(i)}
            style={{
              width: i === activeIndex ? '24px' : '8px',
              height: '8px',
              borderRadius: '9999px',
              background: i === activeIndex ? '#7C3AED' : 'rgba(124, 58, 237, 0.3)',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              padding: 0,
            }}
          />
        ))}
      </div>
    </section>
  );
}
