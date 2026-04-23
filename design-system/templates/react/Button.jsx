// Component: Button / CTA — Quellnodigital
import React, { useRef } from 'react';

const BASE = {
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
  border: 'none', cursor: 'pointer',
  fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
  fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap',
  position: 'relative', overflow: 'hidden',
  transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s ease, opacity 0.2s ease',
  outline: 'none',
};

const SIZES = {
  sm:  { padding: '8px 18px',  fontSize: '0.8rem',   borderRadius: '9999px' },
  md:  { padding: '12px 28px', fontSize: '0.9rem',   borderRadius: '9999px' },
  lg:  { padding: '16px 36px', fontSize: '1rem',     borderRadius: '9999px' },
  xl:  { padding: '20px 48px', fontSize: '1.125rem', borderRadius: '9999px' },
};

const VARIANTS = {
  primary: {
    background: 'linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)',
    color: '#FFFFFF',
    border: 'none',
  },
  secondary: {
    background: 'transparent',
    color: '#FFFFFF',
    border: '1.5px solid rgba(124, 58, 237, 0.5)',
  },
  ghost: {
    background: 'transparent',
    color: '#A78BFA',
    border: 'none',
    padding: undefined,
  },
  danger: {
    background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
    color: '#FFFFFF',
    border: 'none',
  },
};

const HOVER = {
  primary: { transform: 'translateY(-2px) scale(1.02)', boxShadow: '0 0 40px rgba(124, 58, 237, 0.4)' },
  secondary: { borderColor: '#7C3AED', background: 'rgba(124, 58, 237, 0.1)', transform: 'translateY(-1px)' },
  ghost: {},
  danger: { transform: 'translateY(-1px)', boxShadow: '0 0 30px rgba(239, 68, 68, 0.4)' },
};

function Spinner() {
  return (
    <span
      style={{
        width: '16px', height: '16px', borderRadius: '50%',
        border: '2px solid rgba(255,255,255,0.3)',
        borderTopColor: '#FFFFFF',
        animation: 'quellem-spin 0.6s linear infinite',
        display: 'inline-block',
      }}
      aria-hidden="true"
    >
      <style>{`@keyframes quellem-spin { to { transform: rotate(360deg); } }`}</style>
    </span>
  );
}

/**
 * Quellnodigital button / CTA component.
 *
 * @param {Object} props
 * @param {'primary'|'secondary'|'ghost'|'danger'} [props.variant='primary']
 * @param {'sm'|'md'|'lg'|'xl'} [props.size='md']
 * @param {boolean} [props.loading=false]
 * @param {boolean} [props.disabled=false]
 * @param {React.ReactNode} [props.leadingIcon]
 * @param {React.ReactNode} [props.trailingIcon]
 * @param {string} [props.href] - Renders as <a> when provided
 * @param {string} [props.type='button']
 * @param {React.ReactNode} props.children
 * @param {React.CSSProperties} [props.style]
 */
export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  leadingIcon,
  trailingIcon,
  href,
  type = 'button',
  children,
  style,
  onClick,
  ...rest
}) {
  const ref = useRef(null);

  const isDisabled = disabled || loading;

  const computedStyle = {
    ...BASE,
    ...SIZES[size],
    ...VARIANTS[variant],
    ...(isDisabled ? { opacity: 0.4, cursor: 'not-allowed', pointerEvents: 'none' } : {}),
    ...style,
  };

  const hoverHandlers = isDisabled
    ? {}
    : {
        onMouseEnter: (e) => {
          const h = HOVER[variant];
          if (h.transform) e.currentTarget.style.transform = h.transform;
          if (h.boxShadow) e.currentTarget.style.boxShadow = h.boxShadow;
          if (h.borderColor) e.currentTarget.style.borderColor = h.borderColor;
          if (h.background && variant === 'secondary') e.currentTarget.style.background = h.background;
        },
        onMouseLeave: (e) => {
          e.currentTarget.style.transform = '';
          e.currentTarget.style.boxShadow = '';
          if (variant === 'secondary') {
            e.currentTarget.style.borderColor = 'rgba(124, 58, 237, 0.5)';
            e.currentTarget.style.background = 'transparent';
          }
        },
        onMouseDown: (e) => { e.currentTarget.style.transform = 'scale(0.97)'; },
        onMouseUp: (e) => {
          e.currentTarget.style.transform = HOVER[variant]?.transform || '';
        },
      };

  const content = (
    <>
      {loading && <Spinner />}
      {!loading && leadingIcon}
      {children}
      {!loading && trailingIcon}
    </>
  );

  if (href) {
    return (
      <a
        ref={ref}
        href={isDisabled ? undefined : href}
        style={computedStyle}
        aria-disabled={isDisabled}
        {...hoverHandlers}
        {...rest}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      ref={ref}
      type={type}
      disabled={isDisabled}
      style={computedStyle}
      onClick={onClick}
      {...hoverHandlers}
      {...rest}
    >
      {content}
    </button>
  );
}

// Named export shortcuts
export const PrimaryButton = (props) => <Button variant="primary" {...props} />;
export const SecondaryButton = (props) => <Button variant="secondary" {...props} />;
export const GhostButton = (props) => <Button variant="ghost" {...props} />;
export const DangerButton = (props) => <Button variant="danger" {...props} />;
