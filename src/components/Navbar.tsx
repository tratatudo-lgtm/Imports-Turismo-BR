/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Plane, Phone } from 'lucide-react';
import { Button } from './ui/Button';
import { cn } from '../lib/utils';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Início', href: '/' },
    { name: 'Destinos', href: '/destinos' },
    { name: 'Orçamento', href: '/orcamento' },
    { name: 'Acompanhar', href: '/acompanhar' },
    { name: 'Apoio', href: '/apoio' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4',
        isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-3' : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-blue-600 p-2 rounded-lg group-hover:rotate-12 transition-transform">
            <Plane className="text-white w-6 h-6" />
          </div>
          <span className={cn(
            "text-xl font-bold tracking-tight",
            isScrolled ? "text-blue-900" : "text-white"
          )}>
            Imports Turismo <span className="text-amber-500">BR</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className={cn(
                'text-sm font-medium transition-colors hover:text-amber-500',
                isScrolled 
                  ? (isActive(link.href) ? 'text-blue-600' : 'text-gray-600')
                  : (isActive(link.href) ? 'text-amber-400' : 'text-white')
              )}
            >
              {link.name}
            </Link>
          ))}
          <Button 
            variant={isScrolled ? "primary" : "secondary"} 
            size="sm"
            onClick={() => window.open('https://wa.me/5511999999999', '_blank')}
          >
            <Phone className="w-4 h-4 mr-2" />
            WhatsApp
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className={cn("md:hidden p-2", isScrolled ? "text-gray-900" : "text-white")}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-100 p-6 shadow-xl animate-in slide-in-from-top duration-300">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  'text-lg font-medium py-2 border-b border-gray-50',
                  isActive(link.href) ? 'text-blue-600' : 'text-gray-600'
                )}
              >
                {link.name}
              </Link>
            ))}
            <Button 
              className="w-full mt-4"
              onClick={() => window.open('https://wa.me/5511999999999', '_blank')}
            >
              <Phone className="w-4 h-4 mr-2" />
              WhatsApp Comercial
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};
