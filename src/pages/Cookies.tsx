/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';

export default function Cookies() {
  return (
    <div className="pt-32 pb-24 px-6">
      <div className="max-w-4xl mx-auto space-y-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <h1 className="text-4xl md:text-5xl font-black text-blue-950 tracking-tighter">Política de Cookies</h1>
          <p className="text-gray-500">Última atualização: 30 de Março de 2026</p>
        </motion.div>

        <div className="prose prose-blue max-w-none text-gray-600 space-y-8">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-blue-900">1. O que são Cookies?</h2>
            <p>
              Cookies são pequenos ficheiros de texto que são armazenados no seu computador ou dispositivo móvel quando visita um website. Eles ajudam o website a reconhecer o seu dispositivo e a lembrar as suas preferências.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-blue-900">2. Como Utilizamos os Cookies</h2>
            <p>
              Utilizamos cookies para melhorar a sua experiência de navegação, analisar o tráfego do website e personalizar o conteúdo que lhe é apresentado.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-blue-900">3. Tipos de Cookies que Utilizamos</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Cookies Necessários:</strong> Essenciais para o funcionamento básico do website.</li>
              <li><strong>Cookies de Desempenho:</strong> Recolhem informações sobre como os visitantes utilizam o website.</li>
              <li><strong>Cookies de Funcionalidade:</strong> Permitem que o website se lembre das suas escolhas (como o idioma).</li>
              <li><strong>Cookies de Publicidade:</strong> Utilizados para apresentar anúncios relevantes para si.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-blue-900">4. Gestão de Cookies</h2>
            <p>
              Pode controlar e/ou eliminar cookies conforme desejar através das definições do seu navegador. No entanto, se desativar os cookies, algumas partes do website podem não funcionar corretamente.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
