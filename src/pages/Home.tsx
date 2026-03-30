/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Link } from 'react-router-dom';
import { ArrowRight, Globe, ShieldCheck, Clock, Star, MapPin, Phone } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { motion } from 'motion/react';
import { siteConfig } from '../config/site';

export default function Home() {
  const destinations = [
    { id: 1, name: 'Destino Exclusivo', image: 'https://picsum.photos/seed/travel1/800/600', tag: 'Destaque' },
    { id: 2, name: 'Experiência Cultural', image: 'https://picsum.photos/seed/travel2/800/600', tag: 'Cultura' },
    { id: 3, name: 'Paraíso Tropical', image: 'https://picsum.photos/seed/travel3/800/600', tag: 'Lazer' },
  ];

  const benefits = [
    { icon: Globe, title: 'Destinos Selecionados', desc: 'Curadoria especializada dos melhores hotéis e experiências pelo mundo.' },
    { icon: ShieldCheck, title: 'Segurança e Confiança', desc: 'Sua viagem protegida com suporte dedicado e parceiros certificados.' },
    { icon: Clock, title: 'Atendimento Próximo', desc: 'Suporte humanizado para garantir que cada detalhe da sua viagem seja perfeito.' },
  ];

  return (
    <div className="space-y-24">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] md:min-h-screen flex items-center justify-center overflow-hidden bg-blue-950 pt-16 md:pt-20">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://picsum.photos/seed/travel/1920/1080?blur=2" 
            alt="Travel Hero" 
            className="w-full h-full object-cover opacity-30 scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-blue-950/90 via-blue-950/40 to-blue-950" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center space-y-8 md:space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="space-y-4 md:space-y-6"
          >
            <motion.span 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="inline-block px-4 py-1.5 md:px-6 md:py-2 bg-amber-500/10 text-amber-400 rounded-full text-[10px] md:text-xs font-black uppercase tracking-[0.2em] border border-amber-500/20 backdrop-blur-sm"
            >
              Sua Próxima Aventura Começa Aqui
            </motion.span>
            <h1 className="text-3xl md:text-8xl font-black text-white tracking-tighter leading-[1.1] md:leading-[0.9] drop-shadow-2xl">
              Explore o Mundo com <br className="hidden md:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">Exclusividade</span>
            </h1>
            <p className="text-sm md:text-2xl text-blue-100/60 max-w-3xl mx-auto font-medium leading-relaxed tracking-tight px-4 md:px-0">
              Atendimento personalizado para transformar seus sonhos de viagem em memórias inesquecíveis. Do Brasil para o mundo, cuidamos de cada detalhe.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center px-4 md:px-0"
          >
            <Link to="/orcamento" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto h-14 md:h-16 px-8 md:px-12 text-lg md:text-xl rounded-xl md:rounded-2xl shadow-2xl shadow-blue-600/40">
                Solicitar Orçamento <ArrowRight className="ml-2 w-5 h-5 md:w-6 md:h-6" />
              </Button>
            </Link>
            <Link to="/destinos" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 md:h-16 px-8 md:px-12 text-lg md:text-xl rounded-xl md:rounded-2xl border-white/20 text-white hover:bg-white/10 backdrop-blur-md">
                Ver Destinos
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-white/30 text-[10px] font-bold uppercase tracking-widest">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-amber-500 to-transparent" />
        </motion.div>
      </section>

      {/* Benefits Section */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((benefit, i) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
            >
              <Card className="h-full hover:shadow-xl transition-shadow border-none bg-white/50 backdrop-blur-sm">
                <div className="bg-blue-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
                  <benefit.icon className="text-blue-600 w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-blue-950 mb-3">{benefit.title}</h3>
                <p className="text-gray-600 leading-relaxed">{benefit.desc}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="bg-white py-24 px-6">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6">
            <div className="space-y-4">
              <h2 className="text-4xl font-bold text-blue-950 tracking-tight">Destinos em Destaque</h2>
              <p className="text-gray-500 max-w-xl">Selecionamos as melhores experiências para você viver momentos únicos nos lugares mais desejados do planeta.</p>
            </div>
            <Link to="/destinos">
              <Button variant="ghost" className="text-blue-600 font-semibold group">
                Ver todos os destinos <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {destinations.map((dest, i) => (
              <motion.div
                key={dest.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group cursor-pointer"
              >
                <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-lg">
                  <img 
                    src={dest.image} 
                    alt={dest.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-950/90 via-transparent to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-amber-500 text-white text-xs font-bold rounded-full uppercase tracking-wider">
                      {dest.tag}
                    </span>
                  </div>
                  <div className="absolute bottom-6 left-6 right-6 space-y-2">
                    <div className="flex items-center gap-1 text-amber-400">
                      <Star className="w-4 h-4 fill-current" />
                      <Star className="w-4 h-4 fill-current" />
                      <Star className="w-4 h-4 fill-current" />
                      <Star className="w-4 h-4 fill-current" />
                      <Star className="w-4 h-4 fill-current" />
                    </div>
                    <h4 className="text-2xl font-bold text-white">{dest.name}</h4>
                    <div className="flex justify-between items-center">
                      <p className="text-blue-100/80 text-sm">Consulte condições</p>
                      <Link to="/orcamento">
                        <div className="bg-white/20 backdrop-blur-md p-2 rounded-full hover:bg-white transition-colors group/btn">
                          <ArrowRight className="w-5 h-5 text-white group-hover/btn:text-blue-600" />
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="bg-blue-600 rounded-3xl md:rounded-[3rem] p-8 md:p-20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-white/5 -skew-x-12 translate-x-1/4" />
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 md:space-y-8 text-center md:text-left">
              <h2 className="text-2xl md:text-5xl font-bold text-white leading-tight">
                Sua próxima viagem <br className="hidden md:block"/>
                <span className="text-amber-400">começa com a gente.</span>
              </h2>
              <p className="text-blue-50 text-sm md:text-lg font-light leading-relaxed">
                Nossa equipe está preparada para desenhar cada detalhe da sua experiência. Fale conosco agora e receba um atendimento dedicado.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Button 
                  variant="secondary" 
                  size="lg"
                  className="w-full sm:w-auto"
                  onClick={() => window.open(`https://wa.me/${siteConfig.whatsapp}`, '_blank')}
                >
                  <Phone className="w-5 h-5 mr-2" />
                  Falar no WhatsApp
                </Button>
                <Link to="/orcamento" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full bg-white text-blue-600 hover:bg-blue-50">
                    Pedir Orçamento
                  </Button>
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
              <div className="space-y-3 md:space-y-4">
                <div className="bg-white/10 backdrop-blur-md p-4 md:p-6 rounded-2xl md:rounded-3xl border border-white/10 text-center md:text-left">
                  <p className="text-xl md:text-3xl font-bold text-white">Suporte</p>
                  <p className="text-blue-100 text-[10px] md:text-sm uppercase tracking-widest">Dedicado</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md p-4 md:p-6 rounded-2xl md:rounded-3xl border border-white/10 text-center md:text-left">
                  <p className="text-xl md:text-3xl font-bold text-white">Experiência</p>
                  <p className="text-blue-100 text-[10px] md:text-sm uppercase tracking-widest">Personalizada</p>
                </div>
              </div>
              <div className="space-y-3 md:space-y-4 md:mt-8">
                <div className="bg-white/10 backdrop-blur-md p-4 md:p-6 rounded-2xl md:rounded-3xl border border-white/10 text-center md:text-left">
                  <p className="text-xl md:text-3xl font-bold text-white">Confiança</p>
                  <p className="text-blue-100 text-[10px] md:text-sm uppercase tracking-widest">e Transparência</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md p-4 md:p-6 rounded-2xl md:rounded-3xl border border-white/10 text-center md:text-left">
                  <p className="text-xl md:text-3xl font-bold text-white">Qualidade</p>
                  <p className="text-blue-100 text-[10px] md:text-sm uppercase tracking-widest">Garantida</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials - Neutralized */}
      <section className="bg-gray-50 py-24 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4 px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-950 tracking-tight">Compromisso com a Excelência</h2>
            <p className="text-gray-500 text-sm md:text-base max-w-xl mx-auto">Trabalhamos para que cada cliente tenha uma experiência memorável e segura em todos os destinos.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i}>
                <Card className="relative pt-12">
                  <div className="absolute -top-6 left-6">
                    <div className="w-12 h-12 rounded-full overflow-hidden border-4 border-white shadow-lg bg-blue-100 flex items-center justify-center">
                      <Globe className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="flex gap-1 text-amber-500 mb-4">
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                  </div>
                  <p className="text-gray-600 italic mb-6 leading-relaxed">
                    "A equipa demonstrou grande profissionalismo e atenção aos detalhes, garantindo que tudo corresse como planeado."
                  </p>
                  <div>
                    <p className="font-bold text-blue-950">Cliente Verificado</p>
                    <p className="text-xs text-gray-400 uppercase tracking-widest">Feedback Recente</p>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
