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
    { name: 'Home', path: '/' },
    { name: 'Crop Doctor', path: '/crop-doctor' },
    { name: 'Weather', path: '/weather' },
    { name: 'Market', path: '/market' },
    { name: 'Soil Health', path: '/soil' },
    { name: 'Schemes', path: '/schemes' },
  ];

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-md py-3' : 'bg-white py-4'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Leaf className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-darkGreen tracking-tight">AgriSmart</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex space-x-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-sm font-medium transition-colors hover:text-primary ${location.pathname === link.path ? 'text-primary border-b-2 border-primary' : 'text-gray-600'}`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
            
            <div className="flex items-center space-x-4 border-l pl-4 border-gray-200">
              <div className="flex items-center text-gray-600 text-sm hover:text-primary cursor-pointer transition-colors">
                <Globe className="h-4 w-4 mr-1" />
                <span>English</span>
              </div>
              <button className="bg-primary hover:bg-darkGreen text-white px-6 py-2 rounded-full font-medium transition-all duration-300 shadow-md hover:shadow-lg">
                Get Started Free
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-600 hover:text-primary"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg absolute w-full left-0 top-full">
          <div className="px-4 pt-2 pb-6 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-md font-medium ${location.pathname === link.path ? 'text-primary bg-green-50' : 'text-gray-700 hover:text-primary hover:bg-green-50'}`}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-4 border-t border-gray-100 flex flex-col space-y-4">
              <div className="flex items-center px-3 text-gray-700">
                <Globe className="h-5 w-5 mr-2" /> Language: English
              </div>
              <button className="w-full bg-primary text-white px-4 py-2 rounded-full font-medium shadow-md">
                Get Started Free
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
