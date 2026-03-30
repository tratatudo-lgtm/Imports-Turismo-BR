/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Link } from 'react-router-dom';
import { Plane, Phone, Mail, MapPin, Instagram, Facebook, Twitter } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-blue-950 text-white pt-20 pb-10 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-white/10 pb-16">
        <div className="space-y-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Plane className="text-white w-6 h-6" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              Imports Turismo <span className="text-amber-500">BR</span>
            </span>
          </Link>
          <p className="text-blue-100/60 text-sm leading-relaxed">
            Sua agência de viagens premium com atendimento personalizado. Transformamos sonhos em experiências inesquecíveis pelo Brasil e pelo mundo.
          </p>
          <div className="flex gap-4">
            <a href="#" className="p-2 bg-white/5 rounded-full hover:bg-blue-600 transition-colors">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="#" className="p-2 bg-white/5 rounded-full hover:bg-blue-600 transition-colors">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="#" className="p-2 bg-white/5 rounded-full hover:bg-blue-600 transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="font-bold text-lg mb-6">Links Rápidos</h4>
          <ul className="space-y-4 text-blue-100/60 text-sm">
            <li><Link to="/destinos" className="hover:text-amber-400 transition-colors">Destinos Populares</Link></li>
            <li><Link to="/orcamento" className="hover:text-amber-400 transition-colors">Solicitar Orçamento</Link></li>
            <li><Link to="/acompanhar" className="hover:text-amber-400 transition-colors">Acompanhar Pedido</Link></li>
            <li><Link to="/apoio" className="hover:text-amber-400 transition-colors">Central de Apoio</Link></li>
            <li><Link to="/admin/login" className="hover:text-amber-400 transition-colors">Área Restrita</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-lg mb-6">Serviços</h4>
          <ul className="space-y-4 text-blue-100/60 text-sm">
            <li><Link to="/reservas" className="hover:text-amber-400 transition-colors">Reservas de Hotéis</Link></li>
            <li><Link to="/reservas" className="hover:text-amber-400 transition-colors">Passagens Aéreas</Link></li>
            <li><Link to="/orcamento" className="hover:text-amber-400 transition-colors">Pacotes Completos</Link></li>
            <li><Link to="/apoio" className="hover:text-amber-400 transition-colors">Seguro Viagem</Link></li>
            <li><Link to="/apoio" className="hover:text-amber-400 transition-colors">Aluguel de Carros</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-lg mb-6">Contacto</h4>
          <ul className="space-y-4 text-blue-100/60 text-sm">
            <li className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-amber-500 shrink-0" />
              <span>Av. Paulista, 1000 - São Paulo, SP<br/>Brasil</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-amber-500 shrink-0" />
              <span>+55 (11) 99999-9999</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-amber-500 shrink-0" />
              <span>contato@importsturismo.com.br</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-10 flex flex-col md:flex-row justify-between items-center gap-4 text-blue-100/40 text-xs">
        <p>© 2026 Imports Turismo BR. Todos os direitos reservados.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-white">Termos de Uso</a>
          <a href="#" className="hover:text-white">Privacidade</a>
          <a href="#" className="hover:text-white">Cookies</a>
        </div>
      </div>
    </footer>
  );
};
