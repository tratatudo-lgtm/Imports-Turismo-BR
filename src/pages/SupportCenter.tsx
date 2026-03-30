/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Search, HelpCircle, BookOpen, MessageSquare, Phone, Mail, ChevronRight } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Link } from 'react-router-dom';

export default function SupportCenter() {
  const categories = [
    { icon: HelpCircle, title: 'Perguntas Frequentes', desc: 'Respostas rápidas para as dúvidas mais comuns sobre reservas e destinos.' },
    { icon: BookOpen, title: 'Guia de Viagem', desc: 'Dicas essenciais para preparar a sua próxima aventura com segurança.' },
    { icon: MessageSquare, title: 'Chat ao Vivo', desc: 'Fale com um dos nossos consultores em tempo real para ajuda imediata.' },
  ];

  const faqs = [
    { q: 'Como posso solicitar um orçamento?', a: 'Pode solicitar um orçamento diretamente através da nossa página de Orçamento ou via WhatsApp.' },
    { q: 'Quais são os métodos de pagamento aceites?', a: 'Aceitamos transferências bancárias, cartões de crédito e outros métodos seguros de pagamento online.' },
    { q: 'Como posso acompanhar o estado da minha reserva?', a: 'Utilize o seu código de acompanhamento na página "Acompanhar Pedido" para ver o estado em tempo real.' },
    { q: 'O que fazer em caso de emergência durante a viagem?', a: 'Temos uma linha de suporte 24/7 disponível para todos os nossos clientes em viagem.' },
  ];

  return (
    <div className="pt-32 pb-24 px-6">
      <div className="max-w-7xl mx-auto space-y-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-8"
        >
          <h1 className="text-4xl md:text-7xl font-black text-blue-950 tracking-tighter">Centro de Apoio</h1>
          <p className="text-gray-500 max-w-2xl mx-auto text-xl">Como podemos ajudar hoje? Encontre respostas rápidas ou entre em contacto com a nossa equipa.</p>
          
          <div className="max-w-2xl mx-auto relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-blue-950/40 w-6 h-6 group-focus-within:text-blue-600 transition-colors" />
            <input 
              type="text" 
              placeholder="Pesquisar ajuda..." 
              className="w-full h-16 pl-16 pr-6 bg-white border-none rounded-3xl shadow-2xl shadow-blue-900/10 focus:ring-2 focus:ring-blue-600 focus:outline-none transition-all text-lg"
            />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="h-full hover:shadow-2xl transition-all hover:-translate-y-2 border-none bg-white p-10 space-y-6 group">
                <div className="bg-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                  <cat.icon className="text-blue-600 w-8 h-8 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-2xl font-bold text-blue-950">{cat.title}</h3>
                <p className="text-gray-600 leading-relaxed">{cat.desc}</p>
                <Button variant="ghost" className="p-0 text-blue-600 font-bold hover:bg-transparent group/btn">
                  Saber mais <ChevronRight className="ml-2 w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div className="space-y-12">
            <h2 className="text-4xl font-black text-blue-950 tracking-tighter">Dúvidas Frequentes</h2>
            <div className="space-y-6">
              {faqs.map((faq, i) => (
                <motion.div
                  key={faq.q}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white rounded-3xl p-8 shadow-lg shadow-blue-900/5 border border-gray-50"
                >
                  <h4 className="text-lg font-bold text-blue-950 mb-3">{faq.q}</h4>
                  <p className="text-gray-600 leading-relaxed">{faq.a}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="bg-blue-600 rounded-[3rem] p-12 md:p-16 text-white space-y-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-white/5 -skew-x-12 translate-x-1/4" />
            <div className="relative z-10 space-y-8">
              <h2 className="text-4xl font-bold tracking-tighter leading-tight">Ainda precisa de ajuda?</h2>
              <p className="text-blue-50 text-lg leading-relaxed">A nossa equipa de suporte está disponível para resolver qualquer questão relacionada com a sua viagem.</p>
              
              <div className="space-y-6">
                <div className="flex items-center gap-6 bg-white/10 p-6 rounded-3xl border border-white/10 backdrop-blur-md">
                  <Phone className="w-8 h-8 text-amber-400" />
                  <div>
                    <p className="text-sm text-blue-100 uppercase font-bold tracking-widest">Ligue-nos</p>
                    <p className="text-xl font-bold">+351 999 999 999</p>
                  </div>
                </div>
                <div className="flex items-center gap-6 bg-white/10 p-6 rounded-3xl border border-white/10 backdrop-blur-md">
                  <Mail className="w-8 h-8 text-amber-400" />
                  <div>
                    <p className="text-sm text-blue-100 uppercase font-bold tracking-widest">E-mail</p>
                    <p className="text-xl font-bold">suporte@importsturismo.com</p>
                  </div>
                </div>
              </div>

              <Link to="/contactos">
                <Button variant="secondary" size="lg" className="w-full h-16 text-xl font-bold rounded-2xl mt-4">
                  Abrir Ticket de Suporte
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
