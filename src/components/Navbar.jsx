import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Leaf, Menu, X, Globe } from 'lucide-react';

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
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-cream/95 backdrop-blur-md py-4' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="font-serif text-3xl text-primary font-normal tracking-tight flex items-center gap-1"><span className="font-semibold">Agri</span>smart</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-10">
            <div className="flex space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                   className={`text-xs font-semibold tracking-[0.15em] uppercase transition-colors hover:text-secondary ${location.pathname === link.path ? 'text-secondary' : 'text-text-muted'}`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
            
            <div className="flex items-center space-x-6">
              <button className="bg-primary hover:bg-opacity-90 text-white px-6 py-3 text-xs font-semibold tracking-widest uppercase transition-all duration-300">
                Get Started
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-primary"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-cream border-t border-primary/10 shadow-lg absolute w-full left-0 top-full">
          <div className="px-6 pt-4 pb-8 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block py-2 text-sm font-semibold tracking-widest uppercase ${location.pathname === link.path ? 'text-secondary' : 'text-primary'}`}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-6 border-t border-primary/10">
              <button className="w-full bg-primary text-white px-4 py-3 text-sm font-semibold tracking-widest uppercase shadow-md">
                Get Started
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
