/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, MapPin, ArrowRight, Star } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { motion } from 'motion/react';

const destinations = [
  { id: 1, name: 'Destino Internacional 1', image: 'https://picsum.photos/seed/dest1/800/600', category: 'Internacional', tag: 'Destaque' },
  { id: 2, name: 'Destino Internacional 2', image: 'https://picsum.photos/seed/dest2/800/600', category: 'Internacional', tag: 'Cultura' },
  { id: 3, name: 'Destino Nacional 1', image: 'https://picsum.photos/seed/dest3/800/600', category: 'Nacional', tag: 'Brasil' },
  { id: 4, name: 'Destino Internacional 3', image: 'https://picsum.photos/seed/dest4/800/600', category: 'Internacional', tag: 'Tecnologia' },
  { id: 5, name: 'Destino Nacional 2', image: 'https://picsum.photos/seed/dest5/800/600', category: 'Nacional', tag: 'Serra' },
  { id: 6, name: 'Destino Internacional 4', image: 'https://picsum.photos/seed/dest6/800/600', category: 'Internacional', tag: 'História' },
];

export default function Destinations() {
  const [filter, setFilter] = useState('Todos');
  const [search, setSearch] = useState('');

  const filteredDestinations = destinations.filter(dest => {
    const matchesFilter = filter === 'Todos' || dest.category === filter;
    const matchesSearch = dest.name.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="pt-32 pb-24 px-6 space-y-16">
      {/* Header */}
      <section className="max-w-7xl mx-auto text-center space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-blue-950 tracking-tight">Explore Nossos Destinos</h1>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">
            De praias paradisíacas a metrópoles vibrantes, encontre o destino perfeito para sua próxima jornada inesquecível.
          </p>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-center max-w-4xl mx-auto pt-8">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input 
              placeholder="Pesquisar destino..." 
              className="pl-12 h-12"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto no-scrollbar">
            {['Todos', 'Nacional', 'Internacional'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${
                  filter === cat 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDestinations.map((dest, i) => (
            <motion.div
              key={dest.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group"
            >
              <div className="bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img 
                    src={dest.image} 
                    alt={dest.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-blue-600 text-[10px] font-bold rounded-full uppercase tracking-wider shadow-sm">
                      {dest.category}
                    </span>
                    <span className="px-3 py-1 bg-amber-500 text-white text-[10px] font-bold rounded-full uppercase tracking-wider shadow-sm">
                      {dest.tag}
                    </span>
                  </div>
                </div>
                <div className="p-8 space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star className="w-3 h-3 fill-current" />
                      <Star className="w-3 h-3 fill-current" />
                      <Star className="w-3 h-3 fill-current" />
                      <Star className="w-3 h-3 fill-current" />
                      <Star className="w-3 h-3 fill-current" />
                    </div>
                    <h3 className="text-2xl font-bold text-blue-950 flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-blue-600" />
                      {dest.name}
                    </h3>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                    <div>
                      <p className="text-gray-400 text-xs uppercase tracking-widest font-bold">Categoria</p>
                      <p className="text-lg font-bold text-blue-600">{dest.category}</p>
                    </div>
                    <Link to="/orcamento">
                      <Button size="sm" className="rounded-full group/btn">
                        Solicitar Orçamento <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredDestinations.length === 0 && (
          <div className="text-center py-20 space-y-4">
            <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
              <Filter className="text-gray-400 w-8 h-8" />
            </div>
            <p className="text-gray-500 text-lg">Nenhum destino encontrado com esses filtros.</p>
            <Button variant="outline" onClick={() => { setFilter('Todos'); setSearch(''); }}>
              Limpar Filtros
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}
