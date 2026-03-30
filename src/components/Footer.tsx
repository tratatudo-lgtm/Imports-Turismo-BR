/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Link } from 'react-router-dom';
import { Plane, Phone, Mail, MapPin, Instagram, Facebook, Twitter } from 'lucide-react';
import { siteConfig } from '../config/site';

export const Footer = () => {
  return (
    <footer className="bg-blue-950 text-white pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16 border-b border-white/5 pb-20">
        <div className="space-y-8">
          <Link to="/" className="flex items-center gap-3">
            <div className="bg-blue-600 p-2.5 rounded-xl shadow-lg shadow-blue-600/20">
              <Plane className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-black tracking-tighter">
              Imports Turismo <span className="text-amber-500">BR</span>
            </span>
          </Link>
          <p className="text-blue-100/40 text-sm leading-relaxed font-medium">
            Sua agência de viagens premium com atendimento personalizado. Transformamos sonhos em experiências inesquecíveis pelo Brasil e pelo mundo.
          </p>
          <div className="flex gap-4">
            <a href={siteConfig.social.instagram} target="_blank" rel="noreferrer" className="p-3 bg-white/5 rounded-2xl hover:bg-blue-600 hover:scale-110 transition-all">
              <Instagram className="w-5 h-5" />
            </a>
            <a href={siteConfig.social.facebook} target="_blank" rel="noreferrer" className="p-3 bg-white/5 rounded-2xl hover:bg-blue-600 hover:scale-110 transition-all">
              <Facebook className="w-5 h-5" />
            </a>
            <a href={siteConfig.social.twitter} target="_blank" rel="noreferrer" className="p-3 bg-white/5 rounded-2xl hover:bg-blue-600 hover:scale-110 transition-all">
              <Twitter className="w-5 h-5" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="font-black text-lg mb-8 tracking-tight">Explorar</h4>
          <ul className="space-y-4 text-blue-100/40 text-sm font-bold">
            <li><Link to="/destinos" className="hover:text-amber-400 transition-colors">Destinos Populares</Link></li>
            <li><Link to="/orcamento" className="hover:text-amber-400 transition-colors">Solicitar Orçamento</Link></li>
            <li><Link to="/acompanhar" className="hover:text-amber-400 transition-colors">Acompanhar Pedido</Link></li>
            <li><Link to="/centro-apoio" className="hover:text-amber-400 transition-colors">Centro de Apoio</Link></li>
            <li><Link to="/admin/login" className="hover:text-amber-400 transition-colors">Área Restrita</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-black text-lg mb-8 tracking-tight">Institucional</h4>
          <ul className="space-y-4 text-blue-100/40 text-sm font-bold">
            <li><Link to="/termos" className="hover:text-amber-400 transition-colors">Termos de Uso</Link></li>
            <li><Link to="/privacidade" className="hover:text-amber-400 transition-colors">Política de Privacidade</Link></li>
            <li><Link to="/cookies" className="hover:text-amber-400 transition-colors">Política de Cookies</Link></li>
            <li><Link to="/contactos" className="hover:text-amber-400 transition-colors">Contactos</Link></li>
            <li><Link to="/centro-apoio" className="hover:text-amber-400 transition-colors">Suporte 24/7</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-black text-lg mb-8 tracking-tight">Contacto</h4>
          <ul className="space-y-6 text-blue-100/40 text-sm font-bold">
            <li className="flex items-start gap-4">
              <MapPin className="w-5 h-5 text-amber-500 shrink-0" />
              <span className="leading-relaxed">{siteConfig.address}</span>
            </li>
            <li className="flex items-center gap-4">
              <Phone className="w-5 h-5 text-amber-500 shrink-0" />
              <span>{siteConfig.whatsappFormatted}</span>
            </li>
            <li className="flex items-center gap-4">
              <Mail className="w-5 h-5 text-amber-500 shrink-0" />
              <span>{siteConfig.email}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-12 flex flex-col md:flex-row justify-between items-center gap-6 text-blue-100/20 text-[10px] font-black uppercase tracking-widest">
        <p>© 2026 Imports Turismo BR. Todos os direitos reservados.</p>
        <div className="flex gap-8">
          <Link to="/termos" className="hover:text-white transition-colors">Termos</Link>
          <Link to="/privacidade" className="hover:text-white transition-colors">Privacidade</Link>
          <Link to="/cookies" className="hover:text-white transition-colors">Cookies</Link>
        </div>
      </div>
    </footer>
  );
};
