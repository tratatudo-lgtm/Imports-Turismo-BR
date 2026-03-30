/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Globe, MessageCircle } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { siteConfig } from '../config/site';

export default function Contacts() {
  const contactInfo = [
    { icon: Phone, title: 'Telefone', value: siteConfig.whatsappFormatted, href: `tel:${siteConfig.whatsapp}` },
    { icon: Mail, title: 'E-mail', value: siteConfig.email, href: `mailto:${siteConfig.email}` },
    { icon: MessageCircle, title: 'WhatsApp', value: 'Fale Connosco Agora', href: `https://wa.me/${siteConfig.whatsapp}` },
    { icon: MapPin, title: 'Localização', value: siteConfig.address, href: '#' },
  ];

  return (
    <div className="pt-32 pb-24 px-6">
      <div className="max-w-7xl mx-auto space-y-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-4xl md:text-6xl font-black text-blue-950 tracking-tighter">Contactos</h1>
          <p className="text-gray-500 max-w-2xl mx-auto">Estamos aqui para ajudar a planear a sua próxima viagem. Entre em contacto connosco através de qualquer um dos canais abaixo.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {contactInfo.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <a href={item.href} target={item.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
                <Card className="h-full hover:shadow-2xl transition-all hover:-translate-y-2 border-none bg-white p-8 text-center space-y-4 group">
                  <div className="bg-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto group-hover:bg-blue-600 transition-colors">
                    <item.icon className="text-blue-600 w-8 h-8 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-xl font-bold text-blue-950">{item.title}</h3>
                  <p className="text-gray-600 font-medium">{item.value}</p>
                </Card>
              </a>
            </motion.div>
          ))}
        </div>

        <div className="bg-blue-950 rounded-[2rem] md:rounded-[3rem] p-8 md:p-20 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-white/5 -skew-x-12 translate-x-1/4" />
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 md:space-y-8 text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tighter leading-tight">Envie-nos uma mensagem direta</h2>
              <p className="text-blue-100/60 text-base md:text-lg leading-relaxed">Se preferir, preencha o formulário e a nossa equipa entrará em contacto consigo o mais brevemente possível.</p>
              <div className="space-y-4 flex flex-col items-center md:items-start">
                <div className="flex items-center gap-4 text-white/80">
                  <Globe className="w-5 h-5 md:w-6 md:h-6 text-amber-500" />
                  <span className="text-sm md:text-base">Atendimento em Português e Inglês</span>
                </div>
                <div className="flex items-center gap-4 text-white/80">
                  <Phone className="w-5 h-5 md:w-6 md:h-6 text-amber-500" />
                  <span className="text-sm md:text-base">Suporte 24/7 para clientes em viagem</span>
                </div>
              </div>
            </div>
            
            <Card className="p-5 md:p-8 space-y-4 md:space-y-6 bg-white/10 backdrop-blur-xl border-white/10">
              <div className="space-y-3 md:space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                  <input type="text" placeholder="Nome" className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-amber-500 w-full text-sm" />
                  <input type="email" placeholder="E-mail" className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-amber-500 w-full text-sm" />
                </div>
                <input type="text" placeholder="Assunto" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm" />
                <textarea placeholder="Mensagem" rows={4} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none text-sm" />
                <Button className="w-full h-12 md:h-14 text-base md:text-lg font-bold rounded-xl">Enviar Mensagem</Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
