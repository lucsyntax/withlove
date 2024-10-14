import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { db } from "../pages/api/firebase";
import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
  query,
  where,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../pages/api/firebase";
import { loadStripe } from "@stripe/stripe-js";

export default function CoupleForm({ setPreviewData }) {
  const [plan, setPlan] = useState("premium");
  const maxPhotos = plan === "premium" ? 7 : 3;
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const router = useRouter();
  const [coupleName, setCoupleName] = useState("");
  const [relationshipDate, setRelationshipDate] = useState("");
  const [datePart, setDatePart] = useState("");
  const [timePart, setTimePart] = useState("");
  const [customMessage, setCustomMessage] = useState("");
  const [photos, setPhotos] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [showModal, setShowModal] = useState(false); // Controla o modal
  const [userEmail, setUserEmail] = useState(""); // Email do usuário
  const [coupon, setCoupon] = useState(""); // Armazenar o cupom inserido
  const [discount, setDiscount] = useState(0); // Armazenar o valor de desconto
  const [isCouponValid, setIsCouponValid] = useState(false); // Verificar validade do cupom
  const [loadingCoupon, setLoadingCoupon] = useState(false);

  const originalPrice = plan === "premium" ? 29.99 : 24.99;
  const finalPrice = originalPrice - originalPrice * (discount / 100);

  const verifyCoupon = async () => {
    if (!coupon) return;
    setLoadingCoupon(true);

    try {
      const q = query(collection(db, "coupons"), where("code", "==", coupon));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const couponDoc = querySnapshot.docs[0];
        const couponData = couponDoc.data();
        console.log("Cupom encontrado:", couponData);

        // Verifique se o cupom está ativo e não expirou
        if (couponData.active && new Date() < couponData.expiryDate.toDate()) {
          setDiscount(couponData.discount); // Aplicar o desconto do cupom
          setIsCouponValid(true);
        } else {
          setDiscount(0);
          setIsCouponValid(false);
        }
      } else {
        console.log("Cupom não encontrado.");
        setDiscount(0);
        setIsCouponValid(false);
      }
    } catch (error) {
      console.error("Erro ao verificar cupom:", error);
      setIsCouponValid(false);
    } finally {
      setLoadingCoupon(false);
    }
  };

  // Função para gerar um hash único
  const generateUniqueHash = () => {
    return Math.random().toString(36).substr(2, 9);
  };

  // Função para atualizar o preview a cada mudança
  useEffect(() => {
    setPreviewData({
      coupleName,
      relationshipDate,
      datePart,
      customMessage,
      imageUrls: imagePreviews,
    });
  }, [
    coupleName,
    relationshipDate,
    customMessage,
    imagePreviews,
    setPreviewData,
    datePart,
  ]);

  const handleDateChange = (date) => {
    setDatePart(date);
    combineDateTime(date, timePart);
  };

  const handleTimeChange = (time) => {
    setTimePart(time);
    combineDateTime(datePart, time);
  };

  const combineDateTime = (date, time) => {
    if (date) {
      const combined = time ? `${date}T${time}:00` : `${date}T00:00:00`;
      setRelationshipDate(combined);
    }
  };

  const handlePhotoUpload = (event) => {
    const selectedFiles = event.target.files;

    if (selectedFiles.length > maxPhotos) {
      alert(`Você pode enviar no máximo ${maxPhotos} fotos.`);
    } else {
      const photoArray = Array.from(selectedFiles);
      const previewUrls = photoArray.map((file) => URL.createObjectURL(file));
      setPhotos(photoArray);
      setImagePreviews(previewUrls); // Atualiza previews das imagens
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!photos.length || !relationshipDate || !customMessage || !coupleName) {
      alert("Preencha todos os campos para criar o site.");
      return;
    }

    // Exibe o modal antes de prosseguir para o checkout
    setShowModal(true);
  };

  const handleEmailSubmit = async () => {
    if (!userEmail) {
      alert("Por favor, insira um email válido.");
      return;
    }

    try {
      // Salva o email no Firebase
      // await addDoc(collection(db, "emails"), {
      //   email: userEmail,
      //   payment: false,
      // });

      const uniqueHash = generateUniqueHash();

      await addDoc(collection(db, "emails"), {
        email: userEmail,
        payment: false,
        uniqueHash: uniqueHash,
      });

      // Formatar o nome do casal: minúsculas e substituir espaços por hífens
      const formattedCoupleName = coupleName.replace(/\s+/g, "-").toLowerCase();

      const uploadedPhotos = await Promise.all(
        photos.map((photo) => uploadPhoto(photo, uniqueHash))
      );

      await addDoc(collection(db, "couples"), {
        coupleName: formattedCoupleName, // Salva no Firebase o nome formatado
        relationshipDate,
        customMessage,
        photos: uploadedPhotos,
        datePart,
        plan,
        uniqueHash,
        youtubeUrl,
        payment: false,
        createdAt: serverTimestamp(),
      });

      await handleCheckout(uniqueHash, formattedCoupleName, userEmail);
    } catch (e) {
      console.error("Erro ao salvar os dados: ", e);
      alert("Erro ao salvar os dados, tente novamente.");
    }
  };

  const uploadPhoto = async (file, uniqueHash) => {
    try {
      const storageRef = ref(storage, `${uniqueHash}/${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      return await getDownloadURL(snapshot.ref);
    } catch (error) {
      console.error("Erro ao fazer upload da foto:", error);
      throw new Error("Falha no upload da foto.");
    }
  };

  const handleCheckout = async (uniqueHash, formattedCoupleName, userEmail) => {
    try {
      const response = await fetch("/api/checkout_sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uniqueHash,
          plan,
          formattedCoupleName,
          userEmail,
          items: [
            {
              title: "Site Casal",
              quantity: 1,
              unit_price: finalPrice,
            },
          ],
        }),
      });

      const { init_point } = await response.json();
      window.location.href = init_point; // Redirecionando ao Mercado Pago
    } catch (error) {
      console.error("Erro ao iniciar o checkout:", error);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        {/* Campos do formulário */}
        <div className="mb-6">
          <label className="block font-semibold mb-2" htmlFor="coupleName">
            Nome do casal:
          </label>
          <input
            id="coupleName"
            type="text"
            value={coupleName}
            onChange={(e) => setCoupleName(e.target.value)} // Atualiza em tempo real
            placeholder="Digite o nome do casal, exemplo: João e Maria"
            className="w-full border border-pink-500 rounded-lg py-3 px-4 bg-black opacity-90 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
        </div>

        {/* Restante dos campos (data, mensagem, fotos) */}
        <div className="mb-6">
          <label
            className="block font-semibold mb-2"
            htmlFor="relationshipStart"
          >
            Início do relacionamento:
          </label>
          <div className="flex space-x-4">
            <input
              id="relationshipStartDate"
              type="date"
              className="w-full border border-pink-500 rounded-lg py-3 px-4 bg-black opacity-90 focus:outline-none focus:ring-2 focus:ring-pink-500"
              value={datePart}
              onChange={(e) => handleDateChange(e.target.value)}
            />
            <input
              id="relationshipStartTime"
              type="time"
              className="w-full border border-pink-500 rounded-lg py-3 px-4 bg-black opacity-90 focus:outline-none focus:ring-2 focus:ring-pink-500"
              value={timePart}
              onChange={(e) => handleTimeChange(e.target.value)}
            />
          </div>
        </div>

        {/* Restante dos campos e botão de envio */}
        <div className="mb-6">
          <label className="block font-semibold mb-2" htmlFor="message">
            Escreva sua linda mensagem aqui:
          </label>
          <textarea
            id="message"
            rows="4"
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)} // Atualiza em tempo real
            placeholder="Capriche na mensagem!"
            className="w-full border border-pink-500 rounded-lg py-3 px-4 bg-black opacity-90 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
          ></textarea>
        </div>

        {/* Seletor de plano com estilo de cards */}
        <div className="mb-4">
          <label className="block font-semibold mb-2 text-xs">
            Escolha o plano:
          </label>
          <div className="flex justify-between border-2 p-1 border-pink-500 rounded-lg overflow-hidden">
            <label
              className={`cursor-pointer flex-1 rounded-md text-center text-black py-1 px-2 ${
                plan === "basic" ? "bg-white" : "bg-none text-white"
              }`}
            >
              <input
                type="radio"
                name="plan"
                value="basic"
                checked={plan === "basic"}
                onChange={(e) => setPlan(e.target.value)}
                className="hidden"
              />
              <div>
                <p className="text-xs">1 ano, 3 fotos e sem música - R$24,99</p>
              </div>
            </label>

            <label
              className={`cursor-pointer flex-1 rounded-md text-black text-center py-1 px-2 ${
                plan === "premium" ? "bg-white" : "bg-none text-white"
              }`}
            >
              <input
                type="radio"
                name="plan"
                value="premium"
                checked={plan === "premium"}
                onChange={(e) => setPlan(e.target.value)}
                className="hidden"
              />
              <div>
                <p className="text-xs">
                  Para sempre, 7 fotos e com música - R$29,99
                </p>
              </div>
            </label>
          </div>
        </div>

        {plan === "premium" && (
          <div className="mb-6">
            <label className="block font-semibold mb-2" htmlFor="youtubeUrl">
              URL da música no YouTube (opcional):
            </label>
            <input
              id="youtubeUrl"
              type="url"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=exemplo"
              className="w-full border border-pink-500 rounded-lg py-3 px-4 bg-black opacity-90 text-white"
            />
          </div>
        )}

        {/* Upload de fotos */}
        <div className="relative w-full">
          <label
            htmlFor="photoUpload"
            className="cursor-pointer flex justify-center items-center border-2 border-pink-700 rounded-lg py-4 px-6 bg-black opacity-90 text-white text-lg font-semibold mb-2"
          >
            Escolher fotos do casal (Máximo {maxPhotos})
          </label>
          <input
            id="photoUpload"
            type="file"
            multiple
            accept="image/*"
            onChange={handlePhotoUpload}
            className="hidden"
          />
        </div>

        <div className="mb-4">
          <label className="block font-semibold mb-2">Cupom de desconto:</label>
          <div className="flex">
            <input
              type="text"
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
              placeholder="Digite o cupom de desconto"
              className="w-full border border-pink-500 rounded-lg py-2 px-4 text-black"
            />
            <button
              type="button"
              onClick={verifyCoupon}
              className={`ml-2 bg-pink-500 text-white px-4 py-2 rounded-lg ${
                loadingCoupon
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-pink-600"
              }`}
              disabled={loadingCoupon}
            >
              {loadingCoupon ? (
                <span>Verificando...</span>
              ) : (
                <span>Aplicar</span>
              )}
            </button>
          </div>
          {isCouponValid ? (
            <p className="text-green-500">
              Cupom aplicado! Valor com desconto: R${finalPrice.toFixed(2)}
            </p>
          ) : coupon && !loadingCoupon ? (
            <p className="text-red-500">Cupom inválido ou expirado.</p>
          ) : null}
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-pink-500 to-red-400 text-white text-2xl font-bold py-3 px-4 rounded-lg hover:bg-gradient-to-l focus:outline-none focus:ring-4 focus:ring-pink-300"
        >
          Criar nosso site
        </button>
      </form>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg text-black">
            <h2 className="text-2xl font-bold mb-4 text-black">
              Insira seu e-mail para continuar
            </h2>
            <input
              type="email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded-lg mb-4"
              placeholder="Digite seu email"
            />
            <button
              onClick={handleEmailSubmit}
              className="bg-pink-500 text-white px-4 py-2 rounded-lg"
            >
              Enviar e continuar para o checkout
            </button>
          </div>
        </div>
      )}
    </>
  );
}
