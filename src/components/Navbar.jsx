import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Crop Doctor', path: '/crop-doctor' },
    { name: 'Weather', path: '/weather' },
    { name: 'Market', path: '/market' },
    { name: 'Soil', path: '/soil' },
    { name: 'Schemes', path: '/schemes' },
  ];

  return (
    <nav
      style={{ backgroundColor: '#2B4530' }}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b border-white/10 ${isScrolled ? 'shadow-sm py-4' : 'py-6'}`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span
              style={{ fontFamily: '"Playfair Display", serif', color: '#fff', fontSize: '1.75rem', fontWeight: 600, letterSpacing: '-0.01em' }}
            >
              Agri<span style={{ color: '#C87A3F' }}>smart</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-10">
            <div className="flex gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    color: location.pathname === link.path ? '#C87A3F' : 'rgba(255,255,255,0.75)',
                    transition: 'color 0.2s',
                    textDecoration: 'none',
                  }}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <button
              style={{
                backgroundColor: '#2B4530',
                color: '#fff',
                padding: '0.6rem 1.5rem',
                fontSize: '0.7rem',
                fontWeight: 600,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Get Started
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{ color: '#fff', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div style={{ backgroundColor: '#2B4530', borderTop: '1px solid rgba(255,255,255,0.1)' }} className="md:hidden absolute w-full left-0 top-full shadow-lg">
          <div className="px-6 pt-4 pb-8 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  display: 'block',
                  padding: '0.5rem 0',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: location.pathname === link.path ? '#C87A3F' : 'rgba(255,255,255,0.85)',
                  textDecoration: 'none',
                }}
              >
                {link.name}
              </Link>
            ))}
            <div style={{ paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              <button
                style={{
                  width: '100%',
                  backgroundColor: '#2B4530',
                  color: '#fff',
                  padding: '0.75rem',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
