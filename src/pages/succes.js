import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Stripe from "stripe";
import logo from "../../public/images/logo-quadrado.svg";
import Image from "next/image";

const SuccessPage = () => {
  const router = useRouter();
  const { session_id } = router.query;
  const [session, setSession] = useState(null);

  useEffect(() => {
    if (session_id) {
      // Faça uma chamada para sua API para buscar os dados da sessão
      fetch(`/api/stripe-session?session_id=${session_id}`)
        .then((res) => res.json())
        .then((data) => setSession(data))
        .catch((err) => console.error(err));
    }
  }, [session_id]);

  if (!session) return <div>Loading...</div>;

  return (
    <div className="flex flex-col justify-center aligm-center">
      <h1 className="text-white">Pagamento concluido</h1>
      <p className="text-white">
        Obrigado pela sua compra, enviamos um email para:{" "}
        {session.customer_email}.
      </p>
      <Image src={logo} width={250} height={250} />

      {/* Exibir outras informações se necessário */}
    </div>
  );
};

export default SuccessPage;
