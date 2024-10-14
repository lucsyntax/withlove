// pages/checkout.js

export default function TermsOfUse() {
  return (
    <div className="min-h-screen text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-extrabold white mb-6">Termos de Uso</h1>
      <h3 className="text-lg mb-4">
        Última atualização: 07 de setembro de 2024
      </h3>

      <ol className="list-decimal text-left space-y-4 max-w-3xl">
        <li>
          <h4 className="font-bold">Aceitação dos Termos</h4>
          <p>
            Ao acessar e utilizar a nossa plataforma, você concorda em cumprir e
            ficar vinculado aos seguintes Termos de Uso. Caso não concorde com
            qualquer parte destes termos, você não deve utilizar a plataforma.
          </p>
        </li>

        <li>
          <h4 className="font-bold">Modificações nos Termos</h4>
          <p>
            Reservamo-nos o direito de modificar ou atualizar estes Termos de
            Uso a qualquer momento, sem aviso prévio. É sua responsabilidade
            revisar esta página periodicamente para verificar possíveis
            alterações.
          </p>
        </li>

        <li>
          <h4 className="font-bold">Uso da Plataforma</h4>
          <p>
            Você concorda em usar a plataforma apenas para os fins permitidos
            pela lei e de acordo com estes Termos. Qualquer uso indevido da
            plataforma pode resultar na suspensão ou encerramento de sua conta.
          </p>
        </li>

        <li>
          <h4 className="font-bold">Criação de Conta</h4>
          <p>
            Para acessar algumas funcionalidades da plataforma, você deve criar
            uma conta e fornecer informações verdadeiras e completas. É sua
            responsabilidade manter a confidencialidade das suas credenciais.
          </p>
        </li>

        <li>
          <h4 className="font-bold">Propriedade Intelectual</h4>
          <p>
            Todo o conteúdo disponível na plataforma é protegido por direitos
            autorais e outras leis de propriedade intelectual. Você não pode
            copiar, reproduzir ou distribuir qualquer conteúdo sem nossa
            permissão.
          </p>
        </li>

        <li>
          <h4 className="font-bold">Responsabilidade</h4>
          <p>
            Não nos responsabilizamos por qualquer dano ou perda decorrente do
            uso da plataforma, incluindo, mas não se limitando a, danos diretos,
            indiretos, incidentais ou consequenciais.
          </p>
        </li>

        <li>
          <h4 className="font-bold">Links para Sites de Terceiros</h4>
          <p>
            A plataforma pode conter links para sites de terceiros. Não temos
            controle sobre o conteúdo desses sites e não assumimos
            responsabilidade por eles.
          </p>
        </li>

        <li>
          <h4 className="font-bold">Segurança</h4>
          <p>
            Tomamos medidas para proteger a segurança das suas informações, mas
            não garantimos que nossos sistemas estejam livres de falhas ou
            ataques. Você deve tomar precauções para proteger suas informações.
          </p>
        </li>

        <li>
          <h4 className="font-bold">Política de Privacidade</h4>
          <p>
            Sua privacidade é importante para nós. Consulte nossa Política de
            Privacidade para entender como coletamos, usamos e protegemos suas
            informações pessoais.
          </p>
        </li>

        <li>
          <h4 className="font-bold">Legislação Aplicável</h4>
          <p>
            Estes Termos de Uso são regidos pela legislação vigente. Qualquer
            disputa relacionada a estes termos será resolvida de acordo com as
            leis aplicáveis.
          </p>
        </li>

        <li>
          <h4 className="font-bold">Contato</h4>
          <p>
            Se você tiver dúvidas ou preocupações sobre estes Termos de Uso,
            entre em contato conosco através dos meios fornecidos na plataforma.
          </p>
        </li>
      </ol>

      <div className="mt-8 max-w-2xl">
        <p>
          Além dos termos acima, ao utilizar a plataforma, você reconhece que
          compreende e aceita nossas políticas de privacidade e os direitos
          autorais associados ao conteúdo fornecido.
        </p>
      </div>
    </div>
  );
}
