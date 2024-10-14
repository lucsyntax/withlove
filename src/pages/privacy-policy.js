// pages/privacy-policy.js

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-extrabold text-white mb-6">
        Política de Privacidade
      </h1>
      <h3 className="text-lg mb-4">
        Última atualização: 07 de setembro de 2024
      </h3>

      <ol className="list-decimal text-left space-y-4 max-w-3xl">
        <li>
          <h4 className="font-bold">Informações que Coletamos</h4>
          <p>
            Coletamos informações pessoais identificáveis quando você se
            registra na nossa plataforma, faz uma compra ou interage com nossos
            serviços. Essas informações podem incluir seu nome, e-mail, endereço
            e dados de pagamento.
          </p>
        </li>

        <li>
          <h4 className="font-bold">Uso das Informações</h4>
          <p>
            Utilizamos suas informações para processar transações, melhorar
            nossos serviços, e enviar comunicações relevantes. Também podemos
            usar suas informações para fins analíticos e para personalizar sua
            experiência na plataforma.
          </p>
        </li>

        <li>
          <h4 className="font-bold">Compartilhamento de Informações</h4>
          <p>
            Não compartilhamos suas informações pessoais com terceiros, exceto
            quando necessário para cumprir a lei, processar pagamentos ou
            realizar serviços em nosso nome, sempre sob acordos de
            confidencialidade.
          </p>
        </li>

        <li>
          <h4 className="font-bold">Segurança das Informações</h4>
          <p>
            Implementamos medidas de segurança para proteger suas informações
            contra acesso não autorizado, alteração, divulgação ou destruição.
            No entanto, nenhuma transmissão de dados pela internet é 100%
            segura.
          </p>
        </li>

        <li>
          <h4 className="font-bold">Cookies e Tecnologias Semelhantes</h4>
          <p>
            Utilizamos cookies e outras tecnologias de rastreamento para
            melhorar sua experiência na plataforma, personalizar conteúdo e
            analisar o tráfego. Você pode desativar os cookies através das
            configurações do seu navegador.
          </p>
        </li>

        <li>
          <h4 className="font-bold">Seus Direitos</h4>
          <p>
            Você tem o direito de acessar, corrigir ou excluir suas informações
            pessoais. Para exercer esses direitos, entre em contato conosco
            através dos canais fornecidos na plataforma.
          </p>
        </li>

        <li>
          <h4 className="font-bold">Alterações na Política de Privacidade</h4>
          <p>
            Podemos atualizar esta Política de Privacidade periodicamente.
            Recomendamos que você revise esta página regularmente para se manter
            informado sobre como estamos protegendo suas informações.
          </p>
        </li>

        <li>
          <h4 className="font-bold">Links para Sites de Terceiros</h4>
          <p>
            Nossa plataforma pode conter links para outros sites que não são
            operados por nós. Não temos controle sobre esses sites e não nos
            responsabilizamos por suas políticas de privacidade.
          </p>
        </li>

        <li>
          <h4 className="font-bold">Consentimento</h4>
          <p>
            Ao usar nossa plataforma, você concorda com a coleta, uso e
            compartilhamento de suas informações pessoais de acordo com esta
            Política de Privacidade.
          </p>
        </li>

        <li>
          <h4 className="font-bold">Contato</h4>
          <p>
            Se você tiver dúvidas ou preocupações sobre esta Política de
            Privacidade, entre em contato conosco através dos meios fornecidos
            na plataforma.
          </p>
        </li>

        <li>
          <h4 className="font-bold">Legislação Aplicável</h4>
          <p>
            Esta Política de Privacidade é regida pelas leis vigentes no país
            onde nossa empresa está localizada. Qualquer disputa será resolvida
            de acordo com essas leis.
          </p>
        </li>
      </ol>

      <div className="mt-8 max-w-2xl">
        <p>
          Ao usar nossa plataforma, você concorda com os termos desta Política
          de Privacidade. Estamos comprometidos em proteger suas informações e
          garantir sua privacidade.
        </p>
      </div>
    </div>
  );
}
