/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Plane, Phone, ChevronRight } from 'lucide-react';
import { Button } from './ui/Button';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { siteConfig } from '../config/site';

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

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Início', href: '/' },
    { name: 'Destinos', href: '/destinos' },
    { name: 'Orçamento', href: '/orcamento' },
    { name: 'Acompanhar', href: '/acompanhar' },
    { name: 'Apoio', href: '/apoio' },
    { name: 'Área Cliente', href: '/cliente/login' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-4 md:px-6',
        isScrolled ? 'py-2 md:py-3' : 'py-4 md:py-6'
      )}
    >
      <div className={cn(
        "max-w-7xl mx-auto rounded-2xl md:rounded-[2rem] transition-all duration-500 flex items-center justify-between px-4 md:px-6 py-2 md:py-3",
        isScrolled ? "bg-white/90 backdrop-blur-xl shadow-2xl shadow-blue-900/10 border border-white/20" : "bg-transparent"
      )}>
        <Link to="/" className="flex items-center gap-2 md:gap-3 group shrink-0">
          <div className="bg-blue-600 p-1.5 md:p-2 rounded-lg md:rounded-xl group-hover:rotate-12 transition-transform shadow-lg shadow-blue-600/20">
            <Plane className="text-white w-4 h-4 md:w-5 md:h-5" />
          </div>
          <span className={cn(
            "text-base md:text-xl font-black tracking-tighter transition-colors whitespace-nowrap",
            isScrolled ? "text-blue-950" : "text-white"
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
                'text-sm font-bold transition-all hover:scale-105',
                isScrolled 
                  ? (isActive(link.href) ? 'text-blue-600' : 'text-blue-950/60 hover:text-blue-600')
                  : (isActive(link.href) ? 'text-amber-400' : 'text-white/70 hover:text-white')
              )}
            >
              {link.name}
            </Link>
          ))}
          
          <div className="flex items-center gap-3 border-l border-white/10 pl-8 ml-2">
            <Link 
              to="/admin/login" 
              className={cn(
                "text-[10px] font-bold uppercase tracking-widest transition-colors",
                isScrolled ? "text-blue-950/30 hover:text-blue-600" : "text-white/30 hover:text-white"
              )}
            >
              Admin
            </Link>
            <Button 
              variant={isScrolled ? "primary" : "secondary"} 
              size="sm"
              className="rounded-xl"
              onClick={() => window.open(`https://wa.me/${siteConfig.whatsapp}`, '_blank')}
            >
              <Phone className="w-4 h-4 mr-2" />
              WhatsApp
            </Button>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          className={cn(
            "md:hidden p-2 rounded-xl transition-colors",
            isScrolled ? "bg-blue-50 text-blue-900" : "bg-white/10 text-white"
          )}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="md:hidden absolute top-full left-6 right-6 mt-4 bg-white/90 backdrop-blur-2xl rounded-[2.5rem] p-8 shadow-2xl shadow-blue-900/20 border border-white/20 z-40 overflow-hidden"
          >
            <div className="flex flex-col gap-4">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link
                    to={link.href}
                    className={cn(
                      'text-2xl font-black py-3 flex items-center justify-between group',
                      isActive(link.href) ? 'text-blue-600' : 'text-blue-950/40'
                    )}
                  >
                    {link.name}
                    <ChevronRight className={cn(
                      "w-6 h-6 transition-transform group-hover:translate-x-1",
                      isActive(link.href) ? "opacity-100" : "opacity-0"
                    )} />
                  </Link>
                </motion.div>
              ))}
              <Button 
                className="w-full h-14 mt-6 rounded-2xl text-lg font-bold"
                onClick={() => window.open(`https://wa.me/${siteConfig.whatsapp}`, '_blank')}
              >
                <Phone className="w-5 h-5 mr-2" />
                WhatsApp Comercial
              </Button>
              <Link to="/cliente/login" className="w-full">
                <Button variant="outline" className="w-full h-14 rounded-2xl text-lg font-bold border-blue-100 text-blue-600">
                  Entrar na Área Cliente
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
