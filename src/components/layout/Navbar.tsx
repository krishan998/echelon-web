import React, { useState, useEffect } from 'react';
import logo from '../../assets/logo.png';
import { Link, useLocation } from 'react-router-dom';
import Menu from 'lucide-react/dist/esm/icons/menu';
import X from 'lucide-react/dist/esm/icons/x';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  const navItems: { to: string; label: string }[] = [];

  return (
    <nav className={`fixed top-0 w-full z-[100] transition-all duration-300 ${scrolled ? 'py-2' : 'py-4'}`}>
      <div className={`
        container mx-auto px-6 
        ${scrolled ? 'bg-white/90' : 'bg-white/50'} 
        backdrop-blur-xl rounded-2xl border border-gray-200/20 
        shadow-[0_8px_30px_rgb(0,0,0,0.04)] 
        transition-all duration-300
      `} 
      style={{ maxWidth: '1152px' }}>
        <div className="flex justify-between items-center h-14">
          <div className="flex items-center">
            <Link to="/" className="flex items-center group relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-violet-100 to-blue-100 rounded-full blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-500" />
              <img 
                src={logo} 
                alt="Nexbit Logo" 
                className="h-8 w-8 md:h-8 md:w-8 h-7 w-7 relative group-hover:scale-105 group-hover:rotate-3 transition-all duration-300" 
              />
              <span className="ml-3 text-2xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-800 to-gray-600 relative" 
                style={{ 
                  fontFamily: '\'Clash Grotesk\', \'Nohemi\', \'Montserrat\', sans-serif',
                  letterSpacing: '-0.01em',
                }}>
                Nexbit
              </span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-1 bg-gray-50/50 p-1 rounded-xl border border-gray-100/50" style={{ fontFamily: 'rubrik, sans-serif' }}>
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  className={`
                    relative px-4 py-1.5 rounded-lg text-[15px] font-medium
                    transition-all duration-300 
                    ${isActive(item.to) ? 
                      'text-gray-900 bg-white shadow-sm' : 
                      'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                    }
                  `}
                >
                  {item.label}
                  {isActive(item.to) && (
                    <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-violet-500/10 to-blue-500/10 animate-pulse" />
                  )}
                </Link>
              ))}
            </div>
            <div className="relative group">
              <div className="absolute -inset-2 bg-gradient-to-r from-green-100/50 to-emerald-100/50 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <img 
                src="/images/soc.jpg" 
                alt="SOC 2 Type II Compliant" 
                className="h-9 w-auto object-contain relative hover:scale-105 transition-all duration-300" 
              />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className={`
              md:hidden p-1.5 rounded-xl
              transition-all duration-300
              ${isMenuOpen ? 
                'bg-gray-100 text-gray-900 rotate-90' : 
                'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
              }
            `}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className={`
        md:hidden fixed inset-x-0 top-[5.5rem] transition-all duration-300 px-4
        ${isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}
      `}>
        <div className="container mx-auto" style={{ maxWidth: '1152px' }}>
          <div className="flex flex-col bg-white/95 backdrop-blur-xl rounded-xl shadow-lg border border-gray-200/20 overflow-hidden divide-y divide-gray-100/50" style={{ fontFamily: 'rubrik, sans-serif' }}>
            {navItems.map((item) => (
              <Link 
                key={item.label}
                to={item.to} 
                className={`
                  relative py-3 px-4 flex items-center
                  ${isActive(item.to) ? 
                    'bg-gray-50/80 text-gray-900' : 
                    'text-gray-600 hover:bg-gray-50/50 hover:text-gray-900 active:bg-gray-100/50'
                  }
                  transition-all duration-200 text-[14px] font-medium
                `}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
                {isActive(item.to) && (
                  <>
                    <span className="absolute inset-y-0 left-0 w-0.5 bg-gradient-to-b from-violet-500 to-blue-500" />
                    <span className="ml-auto text-violet-500">
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                        <path d="M3.33337 8H12.6667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M8 3.33331L12.6667 7.99998L8 12.6666" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                  </>
                )}
              </Link>
            ))}
            <div className="flex justify-center py-3 px-4">
              <div className="relative group">
                <div className="absolute -inset-2 bg-gradient-to-r from-green-100/40 to-emerald-100/40 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <img 
                  src="/images/soc.jpg" 
                  alt="SOC 2 Type II Compliant" 
                  className="h-7 w-auto object-contain relative group-hover:scale-105 transition-transform duration-300" 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
