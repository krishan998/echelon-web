import React from 'react';
import { ArrowRight, Menu, X } from 'lucide-react';
import heroDashboard from '@/assets/hero-dashboard.jpg';
import logoFresh from '@/assets/logo_fresh.jpg';
import { ContainerScroll } from '@/components/ui/container-scroll-animation';
import { isValidEmail, submitWebsiteLandingPageEmail } from '@/utils/urlUtils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'ghost' | 'dark';
  size?: 'default' | 'sm' | 'lg';
  children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'default', size = 'default', className = '', children, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:pointer-events-none disabled:opacity-50';

    const variants = {
      default: 'bg-[#F0EDE8] text-[#0A0A0A] hover:bg-white',
      secondary: 'border border-[#222222] text-[#8A8580] hover:text-[#F0EDE8] hover:border-[#444444]',
      ghost: 'text-[#8A8580] hover:text-[#F0EDE8]',
      dark: 'border border-[#222222] bg-[#1f1f23] text-[#F0EDE8] hover:bg-[#2a2a2f]',
    };

    const sizes = {
      default: 'h-10 px-4 py-2 text-[11px]',
      sm: 'h-9 px-4 text-[11px]',
      lg: 'h-11 px-6 text-[11px]',
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

const NAV_ITEMS = [
  { href: '#integrations', label: 'Integrations' },
  { href: '#why-nexbit', label: 'Why Nexbit' },
  { href: '#overview', label: 'Overview' },
];

const teaserNavTextStyle = {
  fontFamily: "'Clash Grotesk', sans-serif",
  textTransform: 'none' as const,
};

const SaaSTemplateNavigation = React.memo(() => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <header className="fixed top-0 w-full z-50 border-b border-[#1A1A1A] bg-[#0A0A0A]/92 backdrop-blur-md">
      <nav className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <a href="#page-root" className="inline-flex items-center gap-3 text-[#F0EDE8]">
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded border border-[#222222] bg-[#111111]">
              <img
                src={logoFresh}
                alt="Nexbit logo"
                className="h-full w-full object-cover"
                loading="eager"
              />
            </div>
            <div className="leading-none">
              <div
                className="text-[1.55rem] tracking-tight text-[#8A8580]"
                style={{ fontFamily: "'Clash Grotesk', sans-serif" }}
              >
                Nexbit
              </div>
            </div>
          </a>

          <div className="hidden md:flex items-center justify-center gap-8 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-[15px] font-medium tracking-[0.04em] text-[#8A8580] transition-colors hover:text-[#F0EDE8]"
                style={teaserNavTextStyle}
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <a
              href="#integrations"
              className="inline-flex items-center justify-center rounded px-4 py-2 text-[15px] font-medium tracking-[0.04em] text-[#8A8580] transition-colors hover:text-[#F0EDE8]"
              style={teaserNavTextStyle}
            >
              Explore
            </a>
            <a
              href="https://cal.com/shubh.r/discuss"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                type="button"
                variant="default"
                size="sm"
                className="text-[15px] tracking-[0.04em]"
                style={teaserNavTextStyle}
              >
                Book a demo
              </Button>
            </a>
          </div>

          <button
            type="button"
            className="md:hidden text-[#F0EDE8]"
            onClick={() => setMobileMenuOpen((open) => !open)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0A0A0A]/95 backdrop-blur-md border-t border-[#1A1A1A] animate-[slideDown_0.3s_ease-out]">
          <div className="px-6 py-4 flex flex-col gap-4">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="py-2 text-[15px] font-medium tracking-[0.04em] text-[#8A8580] transition-colors hover:text-[#F0EDE8]"
                style={teaserNavTextStyle}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <div className="flex flex-col gap-2 pt-4 border-t border-[#1A1A1A]">
              <a
                href="#integrations"
                className="inline-flex items-center justify-center rounded px-4 py-2 text-[15px] font-medium tracking-[0.04em] text-[#8A8580] transition-colors hover:text-[#F0EDE8]"
                style={teaserNavTextStyle}
                onClick={() => setMobileMenuOpen(false)}
              >
                Explore
              </a>
              <a
                href="https://cal.com/shubh.r/discuss"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Button
                  type="button"
                  variant="default"
                  size="sm"
                  className="w-full text-[15px] tracking-[0.04em]"
                  style={teaserNavTextStyle}
                >
                  Book a demo
                </Button>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
});

SaaSTemplateNavigation.displayName = 'SaaSTemplateNavigation';

const SaaSTemplateHero = React.memo(() => {
  const [email, setEmail] = React.useState('');
  const [emailError, setEmailError] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [isEmailFocused, setIsEmailFocused] = React.useState(false);

  const handleWaitlistSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEmailError('');

    if (!email.trim()) {
      setEmailError('Please enter your email address');
      return;
    }

    if (!isValidEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    submitWebsiteLandingPageEmail(email);
    setIsSubmitted(true);
    setIsSubmitting(false);

    window.setTimeout(() => {
      setIsSubmitted(false);
      setEmail('');
    }, 3000);
  };

  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-start bg-[#0e0e12] px-6 pb-16 pt-28 md:pt-32"
      style={{ animation: 'fadeIn 0.32s cubic-bezier(0.16, 1, 0.3, 1) both' }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600&display=swap');

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      <ContainerScroll
        titleComponent={
          <div className="mx-auto flex w-full flex-col items-center text-center pt-20 md:pt-0">
            <aside className="mb-6 inline-flex max-w-full flex-wrap items-center justify-center gap-2 rounded border border-[#222222] bg-[#111111] px-3 py-2">
              <span
                className="text-[15px] text-center whitespace-nowrap font-medium tracking-[0.04em] text-[#555050]"
                style={teaserNavTextStyle}
              >
                AI CMO stack is live.
              </span>
              <a
                href="#integrations"
                className="flex items-center gap-1 whitespace-nowrap text-[15px] font-medium tracking-[0.04em] text-[#9d7958] transition-colors hover:text-[#b6916f]"
                style={teaserNavTextStyle}
                aria-label="Jump to integrations"
              >
                See integrations
                <ArrowRight size={12} />
              </a>
            </aside>

            <h1
              className="mb-5 max-w-5xl px-2 text-center text-[2.9rem] leading-[0.94] md:text-[4.5rem] lg:text-[5.6rem]"
              style={{
                fontFamily: "'Clash Grotesk', sans-serif",
                color: '#F0EDE8',
                letterSpacing: '-0.03em',
              }}
            >
              Give your idea
              <br />
              the <span style={{ color: '#8A8580'}}>Marketing</span> it deserves
            </h1>

            <p
              className="mb-4 md:mb-10 max-w-3xl px-4 text-center text-[14px] leading-relaxed md:text-[15px]"
              style={{ color: '#8A8580', fontFamily: "'Inter', sans-serif" }}
            >
              Stop babysitting your ad spend and start letting AI handle the hard part.
            </p>

            <form
              onSubmit={handleWaitlistSubmit}
              className="mb-2 md:mb-8 flex w-full max-w-[320px] items-stretch px-4"
            >
              <div className="relative min-w-0 flex-[1_1_220px]">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailError('');
                  }}
                  onFocus={() => setIsEmailFocused(true)}
                  onBlur={() => setIsEmailFocused(false)}
                  placeholder={emailError ? '' : isEmailFocused ? 'Enter your email' : 'Join waitlist'}
                  className={`h-[48px] w-full min-w-0 rounded-l-[24px] rounded-r-none border border-r-0 border-[#222222] bg-[#111111] px-4 text-[13px] text-[#F0EDE8] placeholder:text-[#555050] focus:outline-none focus:ring-1 focus:ring-[#444444] ${emailError ? 'pb-4' : ''}`}
                  style={{ fontFamily: "'Inter', sans-serif" }}
                  disabled={isSubmitting || isSubmitted}
                  aria-label="Email address"
                />
                {emailError && (
                  <span
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[11px] leading-none text-[#8A8580]"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {emailError}
                  </span>
                )}
              </div>
              <Button
                type="submit"
                variant="dark"
                size="lg"
                className="h-[48px] w-[68px] min-w-[68px] shrink-0 rounded-r-[24px] rounded-l-none border-l-0 px-2 shadow-none"
                aria-label="Join waitlist"
                disabled={isSubmitting || isSubmitted}
              >
                {isSubmitted ? (
                  'Joined'
                ) : isSubmitting ? (
                  '...'
                ) : (
                  <svg
                    className="h-7 w-7"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.4}
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </Button>
            </form>

            {!emailError && isSubmitted && (
              <p
                className="mb-8 text-center text-[12px]"
                style={{
                  color: '#8A8580',
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                You're on the list. We'll be in touch soon.
              </p>
            )}
          </div>
        }
      >
        <div className="relative z-10 overflow-hidden rounded-xl">
          <img
            src={heroDashboard}
            alt="Nexbit dashboard preview"
            className="h-full w-full object-cover"
            loading="eager"
          />
        </div>
      </ContainerScroll>
    </section>
  );
});

SaaSTemplateHero.displayName = 'SaaSTemplateHero';

export function SaaSTemplateHeroSection() {
  return (
    <section className="relative bg-[#0e0e12] text-[#F0EDE8]">
      <SaaSTemplateNavigation />
      <SaaSTemplateHero />
    </section>
  );
}

export default function Component() {
  return (
    <main className="min-h-screen bg-[#0e0e12] text-[#F0EDE8]">
      <SaaSTemplateNavigation />
      <SaaSTemplateHero />
    </main>
  );
}
