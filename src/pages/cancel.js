import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { db, storage } from "../pages/api/firebase"; // Certifique-se de que está importando corretamente
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { ref, listAll, deleteObject } from "firebase/storage";
import Image from "next/image";
import logo from "../../public/images/logo-quadrado.svg";

const CancelPage = () => {
  const router = useRouter();
  const { session_id, uniqueHash } = router.query; // Pega o uniqueHash da URL
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  if (error) return <p>{error}</p>;

  return (
    <div className="flex flex-col justify-center aligm-center">
      <h1 className="text-white">Pagamento cancelado</h1>
      <p className="text-white">
        Seu pagamento foi cancelado. Se quiser, pode tentar novamente.
      </p>
      <button
        onClick={() => router.push("/")}
        className="bg-pink-500 text-white px-4 py-2 rounded-lg"
      >
        Tentar novamente
      </button>
      <Image src={logo} width={250} height={250} />
    </div>
  );
};

export default CancelPage;
