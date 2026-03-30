/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';

export default function Privacy() {
  return (
    <div className="pt-32 pb-24 px-6">
      <div className="max-w-4xl mx-auto space-y-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <h1 className="text-4xl md:text-5xl font-black text-blue-950 tracking-tighter">Política de Privacidade</h1>
          <p className="text-gray-500">Última atualização: 30 de Março de 2026</p>
        </motion.div>

        <div className="prose prose-blue max-w-none text-gray-600 space-y-8">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-blue-900">1. Recolha de Informações</h2>
            <p>
              Recolhemos informações pessoais quando o utilizador solicita um orçamento, faz uma reserva ou entra em contacto connosco. Estas informações podem incluir nome, endereço de e-mail, número de telefone e detalhes da viagem.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-blue-900">2. Utilização das Informações</h2>
            <p>
              As informações recolhidas são utilizadas para processar as suas reservas, fornecer orçamentos personalizados, melhorar os nossos serviços e comunicar novidades ou ofertas especiais (se autorizado).
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-blue-900">3. Partilha de Dados</h2>
            <p>
              Partilhamos as suas informações apenas com os fornecedores necessários para a realização da sua viagem (companhias aéreas, hotéis, seguradoras, etc.). Não vendemos nem alugamos os seus dados pessoais a terceiros.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-blue-900">4. Segurança dos Dados</h2>
            <p>
              Implementamos medidas de segurança técnicas e organizacionais para proteger as suas informações pessoais contra acesso não autorizado, perda ou alteração.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-blue-900">5. Direitos do Utilizador</h2>
            <p>
              O utilizador tem o direito de aceder, corrigir ou solicitar a eliminação das suas informações pessoais a qualquer momento. Para exercer estes direitos, entre em contacto connosco através dos canais oficiais.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
