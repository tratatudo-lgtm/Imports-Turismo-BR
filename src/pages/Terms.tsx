/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';

export default function Terms() {
  return (
    <div className="pt-32 pb-24 px-6">
      <div className="max-w-4xl mx-auto space-y-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <h1 className="text-4xl md:text-5xl font-black text-blue-950 tracking-tighter">Termos de Uso</h1>
          <p className="text-gray-500">Última atualização: 30 de Março de 2026</p>
        </motion.div>

        <div className="prose prose-blue max-w-none text-gray-600 space-y-8">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-blue-900">1. Aceitação dos Termos</h2>
            <p>
              Ao aceder e utilizar o website da Imports Turismo BR, o utilizador concorda em cumprir e estar vinculado aos seguintes termos e condições de uso. Se não concordar com qualquer parte destes termos, não deverá utilizar os nossos serviços.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-blue-900">2. Descrição dos Serviços</h2>
            <p>
              A Imports Turismo BR atua como intermediária na prestação de serviços turísticos, incluindo mas não se limitando a reservas de hotéis, passagens aéreas, pacotes de viagem e consultoria personalizada.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-blue-900">3. Responsabilidades do Utilizador</h2>
            <p>
              O utilizador é responsável por fornecer informações precisas e completas em todos os formulários de reserva e contacto. É também responsabilidade do utilizador garantir que possui toda a documentação necessária para a viagem (passaportes, vistos, certificados de vacinação, etc.).
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-blue-900">4. Pagamentos e Cancelamentos</h2>
            <p>
              As condições de pagamento e as políticas de cancelamento variam de acordo com o fornecedor do serviço (companhias aéreas, hotéis, etc.). Estas condições serão detalhadas no momento da reserva.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-blue-900">5. Propriedade Intelectual</h2>
            <p>
              Todo o conteúdo deste website, incluindo textos, gráficos, logótipos e imagens, é propriedade da Imports Turismo BR ou dos seus licenciadores e está protegido pelas leis de direitos de autor.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
